import { onScopeDispose, ref } from "vue";

export type BreathPhaseId = "in" | "hold" | "out";

interface BreathPhase {
  id: BreathPhaseId;
  label: string;
  seconds: number;
}

/** 4 s in, 4 s hold, 6 s out — the circle grows, stays big, then shrinks */
const PHASES: readonly BreathPhase[] = [
  { id: "in", label: "Вдох", seconds: 4 },
  { id: "hold", label: "Задержи дыхание", seconds: 4 },
  { id: "out", label: "Выдох", seconds: 6 },
];

/** Guided breathing loop ticking once a second until the owning scope is disposed */
export function useBreathing() {
  const phase = ref<BreathPhaseId>("in");
  const label = ref("Вдох");
  const left = ref(0);
  let i = 0;
  let remaining = 0;

  function step() {
    if (remaining <= 0) {
      const p = PHASES[i % PHASES.length]!;
      phase.value = p.id;
      label.value = p.label;
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
