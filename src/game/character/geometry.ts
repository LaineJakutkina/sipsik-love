/**
 * Character geometry in its own 300×215 design space.
 * The body is a fluffy ball centred at (150, 126); feet rest on y≈208.
 */

export const DESIGN_WIDTH = 300;
export const DESIGN_HEIGHT = 215;
/** Point the body squashes and breathes around */
export const GROUND: readonly [number, number] = [150, 208];

/** Deterministic Park–Miller generator so the fur looks the same on every render */
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
}

/** Wavy outline: an ellipse whose edge bulges in `n` random tufts */
function furOutline(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  n: number,
  amp: number,
  seed: number,
): string {
  const r = rng(seed);
  const at = (a: number): [number, number] => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];
  let d = "";
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = ((i + 1) / n) * Math.PI * 2;
    const am = (a0 + a1) / 2 + (r() - 0.5) * 0.04;
    const k = 1 + amp * (0.5 + r() * 0.9);
    const [x0, y0] = at(a0);
    const [x1, y1] = at(a1);
    if (!i) d += `M${x0.toFixed(1)} ${y0.toFixed(1)}`;
    d += `Q${(cx + Math.cos(am) * rx * k).toFixed(1)} ${(cy + Math.sin(am) * ry * k).toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return `${d}Z`;
}

/** Short curved hair strokes scattered over the lower body */
function furStrands(): string {
  const r = rng(11);
  let d = "";
  for (let i = 0; i < 30; i++) {
    const a = r() * Math.PI * 2;
    const rr = 0.3 + r() * 0.62;
    const x = 150 + Math.cos(a) * 86 * rr;
    const y = 152 + Math.sin(a) * 50 * rr;
    const dx = Math.cos(a) * 9;
    const dy = Math.sin(a) * 6 + 5;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}q${(dx / 2).toFixed(1)} ${(dy / 2 + 2).toFixed(1)} ${dx.toFixed(1)} ${dy.toFixed(1)}`;
  }
  return d;
}

export const FUR = furOutline(150, 126, 92, 82, 64, 0.075, 7);
export const STRANDS = furStrands();
export const SMOOTH = "M60 128a90 80 0 1 0 180 0a90 80 0 1 0 -180 0Z";

export const silhouetteOf = (smooth?: boolean) => (smooth ? SMOOTH : FUR);
