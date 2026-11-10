import { useTimeoutFn } from "@vueuse/core";
import { computed, ref, watch } from "vue";
import { pickPhrase, shouldTalk } from "@/domain/catPhrases";
import { talkOf } from "@/domain/coats";
import { storage } from "@/services/storage";
import { useSessionStore } from "@/stores/session";

const SHOW_MS = 8000;
const countKey = (coat: string) => `sipsik-talk-${coat}`;

/**
 * Talking cats (Кот-анекдот, Кот-поддержка, Кот-учёный) pop up a phrase on the 1st tap
 * and on every 50th after it. Taps are counted per coat on this device.
 */
export function useTalkingCat() {
  const session = useSessionStore();
  const coat = computed(() => session.app.couple.coat || "");
  const kind = computed(() => talkOf(coat.value));
  const phrase = ref<string | null>(null);

  const { start, stop } = useTimeoutFn(
    () => {
      phrase.value = null;
    },
    SHOW_MS,
    { immediate: false },
  );

  function hide() {
    stop();
    phrase.value = null;
  }

  /** Call after every counted tap */
  function onTap() {
    const k = kind.value;
    if (!k) return;
    const key = countKey(coat.value);
    const n = (Number(storage.get(key)) || 0) + 1;
    storage.set(key, String(n));
    if (!shouldTalk(n)) return;
    phrase.value = pickPhrase(k, phrase.value);
    start();
  }

  watch(coat, hide);

  return { kind, phrase, onTap, hide };
}
