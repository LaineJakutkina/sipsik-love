import { computed, onScopeDispose, ref } from "vue";
import { t, type MessageKey } from "@/domain/i18n";

export type BreathPhaseId = "in" | "hold" | "out";

interface BreathPhase {
  id: BreathPhaseId;
  label: MessageKey;
  seconds: number;
}

/** 4 s in, 4 s hold, 6 s out — the circle grows, stays big, then shrinks */
const PHASES: readonly BreathPhase[] = [
  { id: "in", label: "care.breath.in", seconds: 4 },
  { id: "hold", label: "care.breath.hold", seconds: 4 },
  { id: "out", label: "care.breath.out", seconds: 6 },
];

/** Guided breathing loop ticking once a second until the owning scope is disposed */
export function useBreathing() {
  const current = ref<BreathPhase>(PHASES[0]!);
  const phase = computed(() => current.value.id);
  const label = computed(() => t(current.value.label));
  const left = ref(0);
  let i = 0;
  let remaining = 0;

  function step() {
    if (remaining <= 0) {
      const p = PHASES[i % PHASES.length]!;
      current.value = p;
      remaining = p.seconds;
      i++;
    }
    left.value = remaining;
    remaining--;
  }

  step();
  const timer = setInterval(step, 1000);
  onScopeDispose(() => clearInterval(timer));

  return { phase, label, left };
}
