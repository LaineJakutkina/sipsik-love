import { watchDebounced } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DEFAULT_LIMITS, DEFAULT_TAP_CAP } from "@/domain/catalog";
import { isMood, type MoodId } from "@/domain/moods";
import type { AppState, CoupleState, SpaceMode } from "@/domain/types";
import { call, errorMessage } from "@/services/api/client";
import type { PayloadOf, StateAction } from "@/services/api/contract";
import { notify } from "@/services/notify";
import { storage } from "@/services/storage";
import { telegram } from "@/services/telegram";
import { config } from "@/shared/config";
import { useTapsStore } from "./taps";

export type SessionStatus = "loading" | "notg" | "error" | "ready";

/**
 * The last state from the server, kept on this device per Telegram account, so a
 * repeat visit opens instantly while the fresh state loads in the background.
 */
const cacheKey = () => (telegram.userId ? `sipsik.state.${telegram.userId}` : null);
function readCache(): AppState | null {
  const key = cacheKey();
  const raw = key ? storage.get(key) : null;
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as AppState;
    return s?.me && s.couple ? s : null;
  } catch {
    return null;
  }
}
function writeCache(s: AppState | null) {
  const key = cacheKey();
  if (!key) return;
  if (s?.couple) storage.set(key, JSON.stringify(s));
  else storage.remove(key);
}

/**
 * The couple's shared state from the server and the two ways to change it:
 * - `act`: blocking, waits for the server (create couple, photos, settings)
 * - `mutate`: optimistic, updates the screen now and syncs in the background
 */
export const useSessionStore = defineStore("session", () => {
  const status = ref<SessionStatus>("loading");
  const error = ref("");
  const state = ref<AppState | null>(null);
  /** A blocking action is running */
  const busy = ref(false);
  const pendingOps = ref(0);
  let queue: Promise<unknown> = Promise.resolve();

  /** Days the user skipped before this visit; the cat is sad after 2+ */
  const missed = ref(0);
  const cheered = ref(false);
  /** The screen shows the cached state; the fresh one is still on its way */
  const stale = ref(false);

  /* ---------- getters ---------- */

  const hasCouple = computed(() => !!state.value?.couple);
  /**
   * State inside the app (after onboarding). Only read it from screens rendered
   * when `hasCouple` is true.
   */
  const app = computed(() => state.value as CoupleState);
  const solo = computed(() => !!(state.value?.couple?.solo && !state.value.partner));
  /** pair, friends, or solo («Только я и Сипсик») */
  const mode = computed<SpaceMode | "solo">(() =>
    solo.value ? "solo" : state.value?.couple?.mode === "friends" ? "friends" : "pair",
  );
  const friends = computed(() => mode.value === "friends");
  const isPair = computed(() => mode.value === "pair");
  /** The other person as a word, in the cases the texts need */
  const other = computed(() =>
    friends.value
      ? { nom: "друг", gen: "друга", dat: "другу" }
      : { nom: "партнёр", gen: "партнёра", dat: "партнёру" },
  );
  const togetherMessage = computed(() => (friends.value ? "Вы теперь вместе!" : "Вы теперь пара!"));
  const meName = computed(() => state.value?.me.name ?? "");
  const partnerName = computed(
    () => state.value?.partner?.name ?? (friends.value ? "Друг" : "Партнёр"),
  );
  const petName = computed(() => state.value?.couple?.pet_name || "Сипсик");
  const limits = computed(() => state.value?.limits ?? DEFAULT_LIMITS);
  const tapCap = computed(() => state.value?.couple?.tap_cap || DEFAULT_TAP_CAP);
  const tired = computed(() => (state.value?.couple?.taps_today ?? 0) >= tapCap.value);
  /** Came back after 2+ days and hasn't petted the cat yet */
  const away = computed(() => missed.value >= 2 && !cheered.value);
  /** The cat looks sad about the gap; never in solo, where it would only make you feel guilty */
  const sad = computed(() => away.value && !solo.value);
  /** Solo: a warm «welcome back» instead of a sad cat */
  const welcomeBack = computed(() => away.value && solo.value);
  const myMood = computed<MoodId | null>(() => {
    const m = state.value?.moods.me;
    return isMood(m) ? m : null;
  });
  /** What the cat's face shows */
  const catMood = computed<MoodId>(() =>
    sad.value ? "tears" : tired.value ? "tired" : (myMood.value ?? "happy"),
  );

  /** Pick wording by the user's grammatical gender: (masculine, feminine, unknown) */
  function gendered(m: string, f: string, n: string) {
    const g = state.value?.me.gender;
    return g === "m" ? m : g === "f" ? f : n;
  }

  /* ---------- sync ---------- */

  function isSyncing() {
    const taps = useTapsStore();
    return busy.value || pendingOps.value > 0 || taps.hasPending;
  }

  async function act<A extends StateAction>(
    action: A,
    payload: PayloadOf<A>,
    okMessage?: string,
  ): Promise<boolean> {
    if (busy.value) return false;
    busy.value = true;
    try {
      await queue;
      state.value = (await call(action, payload as never)) as AppState;
      if (okMessage) notify(okMessage);
      return true;
    } catch (e) {
      notify(errorMessage(e), "error");
      return false;
    } finally {
      busy.value = false;
    }
  }

  function mutate<A extends StateAction>(
    action: A,
    payload: PayloadOf<A>,
    apply?: (s: CoupleState) => void,
    okMessage?: string,
  ) {
    if (apply && state.value) {
      try {
        apply(state.value as CoupleState);
      } catch (e) {
        console.warn("optimistic update failed", action, e);
      }
    }
    if (okMessage) notify(okMessage);
    pendingOps.value++;
    queue = queue.then(async () => {
      try {
        const next = (await call(action, payload as never)) as AppState;
        // Only the last queued op may replace state, or optimistic edits would flicker
        if (pendingOps.value === 1 && next?.me) state.value = next;
      } catch (e) {
        notify(errorMessage(e), "error");
        if (pendingOps.value === 1) {
          try {
            state.value = await call("state");
          } catch {
            // keep what we have
          }
        }
      } finally {
        pendingOps.value--;
      }
    });
  }

  async function refresh() {
    if (status.value !== "ready" || isSyncing()) return;
    try {
      const next = await call("state");
      if (isSyncing()) return;
      state.value = next;
    } catch {
      // offline: keep the current state
    }
  }

  /** Cheap check for changes by the partner: compare the couple's revision */
  async function ping() {
    const couple = state.value?.couple;
    if (document.visibilityState !== "visible" || status.value !== "ready" || !couple) return;
    if (isSyncing()) return;
    try {
      const { rev } = await call("ping");
      if (rev !== couple.rev) await refresh();
    } catch {
      // ignore
    }
  }

  async function boot() {
    if (!telegram.available) {
      status.value = "notg";
      return;
    }
    telegram.setup();
    const join = new URLSearchParams(location.search).get("join") ?? "";
    // A join link must reach the server first: it can change which couple we are in
    const cached = config.demo || join ? null : readCache();
    if (cached) {
      state.value = cached;
      stale.value = true;
      status.value = "ready";
    } else status.value = "loading";
    try {
      const s = await call("me", { code: join });
      // Something the user did meanwhile will bring its own fresh state
      if (!isSyncing()) state.value = s;
      stale.value = false;
      missed.value = s.missed ?? 0;
      status.value = "ready";
      if (s.joinError) notify(s.joinError);
      else if (join && s.couple && s.partner) {
        notify(togetherMessage.value);
        telegram.requestWriteAccess();
      }
    } catch (e) {
      if (cached) {
        notify("Нет связи. Показываем то, что было в прошлый раз");
        return;
      }
      error.value = errorMessage(e);
      status.value = "error";
    }
  }

  if (!config.demo) {
    watchDebounced(
      state,
      (s) => {
        if (!stale.value && status.value === "ready") writeCache(s);
      },
      { deep: true, debounce: 1000 },
    );
  }

  return {
    status,
    stale,
    error,
    state,
    busy,
    missed,
    cheered,
    hasCouple,
    app,
    solo,
    mode,
    friends,
    isPair,
    other,
    togetherMessage,
    meName,
    partnerName,
    petName,
    limits,
    tapCap,
    tired,
    sad,
    welcomeBack,
    myMood,
    catMood,
    gendered,
    act,
    mutate,
    refresh,
    ping,
    boot,
  };
});
