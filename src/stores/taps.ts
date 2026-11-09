import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { ITEM_BY_ID, isItemId } from "@/domain/items";
import { call, errorMessage } from "@/services/api/client";
import { notify } from "@/services/notify";
import { telegram } from "@/services/telegram";
import { useSessionStore } from "./session";

const DEBOUNCE_MS = 900;
const BURST = 250;
const MAX_PER_REQUEST = 300;
const RETRY_MS = 300;

/** Taps on the cat: counted instantly, sent to the server in batches */
export const useTapsStore = defineStore("taps", () => {
  const pending = ref(0);
  const inFlight = ref(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  const hasPending = computed(() => pending.value > 0 || inFlight.value);

  function schedule(ms: number) {
    clearTimeout(timer);
    timer = setTimeout(() => void flush(), ms);
  }

  function tap() {
    const couple = useSessionStore().state?.couple;
    if (!couple) return;
    pending.value++;
    couple.clicks++;
    couple.taps_today = (couple.taps_today || 0) + 1;
    schedule(pending.value >= BURST ? 0 : DEBOUNCE_MS);
  }

  async function flush(keepalive = false) {
    clearTimeout(timer);
    if (!pending.value || inFlight.value) return;
    const session = useSessionStore();
    const n = Math.min(pending.value, MAX_PER_REQUEST);
    pending.value -= n;
    inFlight.value = true;
    try {
      const res = await call("tap", { n }, { keepalive });
      const couple = session.state?.couple;
      if (!couple) return;
      if (res.capped) {
        pending.value = 0;
        couple.clicks = res.clicks;
        couple.taps_today = res.today;
      } else {
        couple.clicks = res.clicks + pending.value;
        couple.taps_today = (res.today || 0) + pending.value;
      }
      couple.worn = res.worn;
      const names = (res.unlocked ?? []).filter(isItemId).map((id) => ITEM_BY_ID[id].name);
      if (names.length) notify(`${session.petName} получил: ${names.join(", ")}!`, "heavy");
    } catch (e) {
      const couple = session.state?.couple;
      if (couple) {
        couple.clicks -= n;
        couple.taps_today = Math.max(0, (couple.taps_today || 0) - n);
      }
      notify(errorMessage(e));
    } finally {
      inFlight.value = false;
      if (pending.value) schedule(RETRY_MS);
    }
  }

  /** Pet the cat: counts a tap and returns how the cat reacted */
  function pet(): "tired" | "got-tired" | "cheered" | "boop" {
    const session = useSessionStore();
    if (session.tired) {
      telegram.haptic("error");
      return "tired";
    }
    tap();
    telegram.haptic("light");
    if (session.tired) {
      notify(`${session.petName} устал. Тапы продолжатся завтра 😴`, "medium");
      return "got-tired";
    }
    if (session.sad) {
      session.cheered = true;
      notify(`${session.petName} снова счастлив 💜`);
      return "cheered";
    }
    return "boop";
  }

  return { pending, inFlight, hasPending, flush, pet };
});
