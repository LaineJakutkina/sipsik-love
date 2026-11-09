import { defineStore } from "pinia";
import { ref } from "vue";
import { telegram } from "@/services/telegram";

/**
 * “Куда идём” roulette: the slot flips through place names, slowing down,
 * then lands on a random place different from the previous pick.
 */
export const useRouletteStore = defineStore("roulette", () => {
  const result = ref<string | null>(null);
  const spinning = ref(false);
  /** Name currently shown in the slot while spinning */
  const display = ref("");
  let timer: ReturnType<typeof setTimeout> | undefined;
  let final = "";

  function finish(withHaptic: boolean) {
    clearTimeout(timer);
    timer = undefined;
    spinning.value = false;
    result.value = final;
    if (withHaptic) telegram.haptic("heavy");
  }

  function spin(names: string[]) {
    if (spinning.value || names.length < 2) return;
    spinning.value = true;
    const pick = () => names[Math.floor(Math.random() * names.length)] ?? "";
    const allSame = names.every((n) => n === names[0]);
    do final = pick();
    while (!allSame && final === result.value);
    result.value = null;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let delay = 50;
    let elapsed = 0;
    let i = Math.floor(Math.random() * names.length);
    const tick = () => {
      i = (i + 1) % names.length;
      display.value = names[i] ?? "";
      elapsed += delay;
      delay *= 1.12;
      telegram.haptic("light");
      if (elapsed < 1900 && !reduce) timer = setTimeout(tick, delay);
      else finish(true);
    };
    tick();
  }

  /** Land immediately and silently (the slot left the screen) */
  function settle() {
    if (spinning.value) finish(false);
  }

  return { result, spinning, display, spin, settle };
});
