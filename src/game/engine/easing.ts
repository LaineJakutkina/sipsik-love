/** Easing functions matching their CSS counterparts closely enough for UI motion */
export type Easing = (t: number) => number;

const cubicBezier = (x1: number, y1: number, x2: number, y2: number): Easing => {
  const bx = (t: number) => 3 * x1 * t * (1 - t) ** 2 + 3 * x2 * t * t * (1 - t) + t ** 3;
  const by = (t: number) => 3 * y1 * t * (1 - t) ** 2 + 3 * y2 * t * t * (1 - t) + t ** 3;
  return (x) => {
    if (x <= 0 || x >= 1) return x;
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 20; i++) {
      const mid = (lo + hi) / 2;
      if (bx(mid) < x) lo = mid;
      else hi = mid;
    }
    return by((lo + hi) / 2);
  };
};

export const Ease = {
  linear: ((t) => t) as Easing,
  ease: cubicBezier(0.25, 0.1, 0.25, 1),
  easeOut: cubicBezier(0, 0, 0.58, 1),
  easeInOut: cubicBezier(0.42, 0, 0.58, 1),
} as const;

/** `[offset 0..1, value]` stops, like CSS @keyframes */
export type Keyframes = readonly (readonly [offset: number, value: number])[];

/**
 * Sample keyframes at progress `t`. `easing` applies per segment, as CSS
 * `animation-timing-function` does.
 */
export function sample(frames: Keyframes, t: number, easing: Easing = Ease.ease): number {
  const first = frames[0]!;
  if (t <= first[0]) return first[1];
  for (let i = 1; i < frames.length; i++) {
    const [o1, v1] = frames[i]!;
    if (t <= o1) {
      const [o0, v0] = frames[i - 1]!;
      const k = o1 === o0 ? 1 : easing((t - o0) / (o1 - o0));
      return v0 + (v1 - v0) * k;
    }
  }
  return frames.at(-1)![1];
}
