/**
 * Declarative vector art.
 *
 * Game art is described as plain data (a tree of shapes in SVG-like coordinates)
 * and turned into Pixi display objects by `buildArt`. Keeping art as data makes it
 * easy to compose characters from parts, reuse pieces for thumbnails and later
 * swap individual parts for sprites without touching the scene code.
 */

export type LineCap = "butt" | "round" | "square";
export type LineJoin = "miter" | "round" | "bevel";

export interface Paint {
  fill?: string | null;
  /** Fill-only opacity, like SVG `fill-opacity` */
  fillAlpha?: number;
  stroke?: string | null;
  width?: number;
  cap?: LineCap;
  join?: LineJoin;
  /** Whole-shape opacity, like SVG `opacity` */
  alpha?: number;
}

/** SVG-style transform applied as: translate(x y) rotate(deg around pivot) scale(sx sy) */
export interface Transform {
  x?: number;
  y?: number;
  rotation?: number;
  pivotX?: number;
  pivotY?: number;
  scaleX?: number;
  scaleY?: number;
}

export interface PathShape extends Paint {
  kind: "path";
  d: string;
}
export interface CircleShape extends Paint {
  kind: "circle";
  cx: number;
  cy: number;
  r: number;
}
export interface EllipseShape extends Paint {
  kind: "ellipse";
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}
export interface RectShape extends Paint {
  kind: "rect";
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
}
export interface TextShape {
  kind: "text";
  x: number;
  /** Baseline, as in SVG */
  y: number;
  text: string;
  size: number;
  color: string;
  anchor?: "start" | "middle";
  letterSpacing?: number;
  transform?: Transform;
}
export interface GroupShape {
  kind: "group";
  children: Shape[];
  /** Paint inherited by children that don't override it */
  style?: Paint;
  transform?: Transform;
  /** Clip children by this closed path */
  clip?: string;
  alpha?: number;
  /** Name for looking the node up after build (animations) */
  label?: string;
}

export type PrimitiveShape = PathShape | CircleShape | EllipseShape | RectShape;
export type Shape = PrimitiveShape | TextShape | GroupShape;
/** Falsy entries are skipped, so parts can be written as `cond && shape` */
export type ArtNode = Shape | null | undefined | false | "";

/* ---------- terse constructors used by the art modules ---------- */

export const path = (d: string, paint: Paint = {}): PathShape => ({ kind: "path", d, ...paint });

export const circle = (cx: number, cy: number, r: number, paint: Paint = {}): CircleShape => ({
  kind: "circle",
  cx,
  cy,
  r,
  ...paint,
});

export const ellipse = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  paint: Paint = {},
): EllipseShape => ({ kind: "ellipse", cx, cy, rx, ry, ...paint });

export const rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  paint: Paint & { r?: number } = {},
): RectShape => ({ kind: "rect", x, y, w, h, ...paint });

export const text = (
  x: number,
  y: number,
  value: string,
  size: number,
  color: string,
  opts: Pick<TextShape, "anchor" | "letterSpacing" | "transform"> = {},
): TextShape => ({ kind: "text", x, y, text: value, size, color, ...opts });

export const group = (
  children: ArtNode[],
  opts: Omit<GroupShape, "kind" | "children"> = {},
): GroupShape => ({
  kind: "group",
  children: children.filter((c): c is Shape => !!c),
  ...opts,
});

/* ---------- transform helpers ---------- */

export const translate = (x: number, y: number, scale = 1): Transform => ({
  x,
  y,
  scaleX: scale,
  scaleY: scale,
});

/** SVG `rotate(deg cx cy)` */
export const rotateAbout = (deg: number, cx: number, cy: number): Transform => ({
  x: cx,
  y: cy,
  pivotX: cx,
  pivotY: cy,
  rotation: deg,
});

/** Mirror horizontally across the vertical line x = axis */
export const mirrorX = (axis: number): Transform => ({ x: axis * 2, scaleX: -1, scaleY: 1 });

/* ---------- path helpers ---------- */

/**
 * Pixi has no native dashed strokes, so a dashed quadratic curve is emitted as
 * separate short polylines. Combine with `cap: "round"` for a bead-chain look.
 */
export function dashedQuad(
  [x0, y0]: [number, number],
  [cx, cy]: [number, number],
  [x1, y1]: [number, number],
  [dash, gap]: [number, number],
): string {
  const at = (t: number): [number, number] => {
    const u = 1 - t;
    return [u * u * x0 + 2 * u * t * cx + t * t * x1, u * u * y0 + 2 * u * t * cy + t * t * y1];
  };
  const steps = 200;
  const pts: [number, number][] = [];
  const lens: number[] = [0];
  for (let i = 0; i <= steps; i++) {
    pts.push(at(i / steps));
    if (i) {
      const [ax, ay] = pts[i - 1]!;
      const [bx, by] = pts[i]!;
      lens.push(lens[i - 1]! + Math.hypot(bx - ax, by - ay));
    }
  }
  const total = lens[steps]!;
  let d = "";
  for (let start = 0; start < total; start += dash + gap) {
    const end = Math.min(total, start + dash);
    const seg = pts.filter((_, i) => lens[i]! >= start && lens[i]! <= end);
    if (seg.length < 2) continue;
    d += seg.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(2)} ${y.toFixed(2)}`).join("");
  }
  return d;
}
