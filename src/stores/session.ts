import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { DEFAULT_LIMITS, DEFAULT_TAP_CAP } from "@/domain/catalog";
import { isMood, type MoodId } from "@/domain/moods";
import type { AppState, CoupleState } from "@/domain/types";
import { call, errorMessage } from "@/services/api/client";
import type { PayloadOf, StateAction } from "@/services/api/contract";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { useTapsStore } from "./taps";

export type SessionStatus = "loading" | "notg" | "error" | "ready";

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

  /* ---------- getters ---------- */

  const hasCouple = computed(() => !!state.value?.couple);
  /**
   * State inside the app (after onboarding). Only read it from screens rendered
   * when `hasCouple` is true.
   */
  const app = computed(() => state.value as CoupleState);
  const solo = computed(() => !!(state.value?.couple?.solo && !state.value.partner));
  const meName = computed(() => state.value?.me.name ?? "");
  const partnerName = computed(() => state.value?.partner?.name ?? "Партнёр");
  const petName = computed(() => state.value?.couple?.pet_name || "Сипсик");
  const limits = computed(() => state.value?.limits ?? DEFAULT_LIMITS);
  const tapCap = computed(() => state.value?.couple?.tap_cap || DEFAULT_TAP_CAP);
  const tired = computed(() => (state.value?.couple?.taps_today ?? 0) >= tapCap.value);
  const sad = computed(() => missed.value >= 2 && !cheered.value);
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
    status.value = "loading";
    telegram.setup();
    const join = new URLSearchParams(location.search).get("join") ?? "";
    try {
      const s = await call("me", { code: join });
      state.value = s;
      missed.value = s.missed ?? 0;
      status.value = "ready";
      if (s.joinError) notify(s.joinError);
      else if (join && s.couple && s.partner) {
        notify("Вы теперь пара!");
        telegram.requestWriteAccess();
      }
    } catch (e) {
      error.value = errorMessage(e);
      status.value = "error";
    }
  }

  return {
    status,
    error,
    state,
    busy,
    missed,
    cheered,
    hasCouple,
    app,
    solo,
    meName,
    partnerName,
    petName,
    limits,
    tapCap,
    tired,
    sad,
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
