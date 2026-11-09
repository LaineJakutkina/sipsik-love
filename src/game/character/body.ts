import type { CoatId } from "@/domain/coats";
import {
  circle,
  ellipse,
  group,
  mirrorX,
  path,
  rotateAbout,
  type ArtNode,
  type Paint,
} from "../art/shapes";
import { STRANDS, silhouetteOf } from "./geometry";
import type { Palette, PatternId } from "./palettes";

const solid = (colour: string): Paint => ({
  fill: colour,
  stroke: colour,
  width: 3,
  join: "round",
});

/** Ellipse rotated around its own centre, like SVG `transform="rotate(a cx cy)"` */
const tiltedEllipse = (cx: number, cy: number, rx: number, ry: number, deg: number, paint: Paint) =>
  group([ellipse(cx, cy, rx, ry, paint)], { transform: rotateAbout(deg, cx, cy) });

const CAT_EAR_L = "M100 74L109 34L137 56Z";
const CAT_EAR_R = "M200 74L191 34L163 56Z";
const INNER_EARS = "M110 62L113 44L128 56ZM190 62L187 44L172 56Z";

function earsArt(p: Palette, coat: CoatId): ArtNode[] {
  const outer = p.earFill ?? p.fur;
  switch (coat) {
    case "frog":
      return [122, 178].map((x) =>
        circle(x, 62, 24, { fill: p.fur, stroke: p.outline, width: 2.5 }),
      );
    case "penguin":
    case "dog":
      return [];
    case "panda":
      return [circle(104, 54, 19, { fill: "#1b1b1f" }), circle(196, 54, 19, { fill: "#1b1b1f" })];
    case "cow":
      return [
        path("M118 46q-6-18 4-24q2 12 8 20zM182 46q6-18-4-24q-2 12-8 20z", {
          fill: "#efe2c4",
          stroke: "#c9b48a",
          width: 2,
        }),
        ...[
          [80, -24],
          [220, 24],
        ].flatMap(([x = 0, deg = 0]) => [
          tiltedEllipse(x, 80, 22, 10, deg, { fill: "#fbfaf7", stroke: "#d9d4c8", width: 2.5 }),
          tiltedEllipse(x, 80, 13, 5, deg, { fill: p.ear }),
        ]),
      ];
    case "fox":
      return [
        path("M226 190C292 186 300 112 262 84C250 120 246 156 222 168Z", {
          fill: p.fur,
          stroke: "#c9672a",
          width: 2.5,
          join: "round",
        }),
        path("M262 84C276 96 284 112 285 128C272 120 262 108 256 96Z", { fill: "#fff6ea" }),
        path("M96 76L98 14L140 52ZM204 76L202 14L160 52Z", solid(outer)),
        path("M98 14L106 34L112 26ZM202 14L194 34L188 26Z", { fill: "#3a2a22" }),
        path("M106 62L108 34L130 54ZM194 62L192 34L170 54Z", { fill: p.ear }),
      ];
    case "calico":
      return [
        path(CAT_EAR_L, solid("#d9844a")),
        path(CAT_EAR_R, solid("#1d1b26")),
        path(INNER_EARS, { fill: p.ear }),
      ];
    default:
      return [path(CAT_EAR_L + CAT_EAR_R, solid(outer)), path(INNER_EARS, { fill: p.ear })];
  }
}

const TABBY_SIDE = "M58 112q16 5 26 0M56 132q18 5 30 0M58 152q16 5 28 0M64 172q14 4 24 0";

const PATTERNS: Record<PatternId, (p: Palette) => ArtNode[]> = {
  tabby: (p) => {
    const s = p.stripe ?? p.strand;
    const side = path(TABBY_SIDE, { stroke: s, width: 6, cap: "round" });
    return [
      path("M138 50v15M150 47v18M162 50v15", { stroke: s, width: 5, cap: "round" }),
      side,
      group([side], { transform: mirrorX(150) }),
      p.chest && ellipse(150, 166, 34, 36, { fill: p.chest }),
      p.chest && ellipse(150, 118, 22, 13, { fill: p.chest }),
    ];
  },
  calico: () => [
    ellipse(96, 80, 44, 36, { fill: "#d9844a" }),
    ellipse(208, 76, 40, 32, { fill: "#1d1b26" }),
    ellipse(204, 178, 38, 30, { fill: "#d9844a" }),
    ellipse(80, 168, 28, 26, { fill: "#1d1b26" }),
  ],
  siamese: () => [
    ellipse(150, 100, 56, 42, { fill: "#4a3328", alpha: 0.35 }),
    ellipse(150, 101, 48, 35, { fill: "#4a3328" }),
  ],
  frog: () => [
    ellipse(150, 166, 60, 42, { fill: "#cfe8a8" }),
    ...[
      [96, 120],
      [206, 128],
      [110, 150],
      [192, 96],
    ].map(([x = 0, y = 0]) => circle(x, y, 5, { fill: "#5fa64e" })),
  ],
  dog: (p) => [
    ellipse(150, 168, 34, 34, { fill: "#f1d9b8" }),
    ellipse(150, 116, 30, 19, { fill: "#f1d9b8" }),
    tiltedEllipse(94, 92, 17, 36, 18, { fill: p.ear }),
    tiltedEllipse(206, 92, 17, 36, -18, { fill: p.ear }),
  ],
  fox: () => [
    path("M96 108Q150 150 204 108Q196 140 150 142Q104 140 96 108Z", { fill: "#fff6ea" }),
    ellipse(150, 178, 30, 32, { fill: "#fff6ea" }),
  ],
  panda: () => [
    tiltedEllipse(124, 95, 25, 19, -25, { fill: "#1b1b1f" }),
    tiltedEllipse(176, 95, 25, 19, 25, { fill: "#1b1b1f" }),
    path("M40 150Q150 132 260 150V230H40Z", { fill: "#1b1b1f" }),
    ellipse(150, 186, 46, 34, { fill: "#f7f5f0" }),
  ],
  cow: () => [
    ellipse(92, 150, 28, 21, { fill: "#2a2630" }),
    ellipse(210, 72, 26, 19, { fill: "#2a2630" }),
    ellipse(196, 178, 22, 16, { fill: "#2a2630" }),
    ellipse(104, 64, 14, 11, { fill: "#2a2630" }),
    ellipse(150, 120, 32, 19, { fill: "#f6b8c2" }),
    ellipse(139, 116, 4, 5, { fill: "#b0566a" }),
    ellipse(161, 116, 4, 5, { fill: "#b0566a" }),
  ],
  penguin: () => [
    ellipse(150, 160, 60, 58, { fill: "#ffffff" }),
    circle(126, 98, 30, { fill: "#ffffff" }),
    circle(174, 98, 30, { fill: "#ffffff" }),
    ellipse(108, 114, 8, 4.5, { fill: "#f8a8b8" }),
    ellipse(192, 114, 8, 4.5, { fill: "#f8a8b8" }),
  ],
  tuxedo: () => [
    ellipse(150, 170, 30, 40, { fill: "#ffffff" }),
    ellipse(150, 116, 24, 15, { fill: "#ffffff" }),
    path("M150 104l-10 14h20z", { fill: "#ffffff" }),
  ],
};

/** Ears, furry silhouette, coat pattern (clipped to the silhouette) and belly line */
export function catBodyArt(p: Palette, coat: CoatId) {
  const shape = silhouetteOf(p.smooth);
  return group([
    ...earsArt(p, coat),
    path(shape, { fill: p.fur, stroke: p.outline, width: 2.5 }),
    !p.smooth && path(STRANDS, { stroke: p.strand, width: 1.6, cap: "round" }),
    p.pat && group(PATTERNS[p.pat](p), { clip: shape }),
    !p.noBelly && path("M116 128Q150 146 184 128", { stroke: p.belly, width: 3, cap: "round" }),
  ]);
}

/** Paint for paws: outlined when the coat has an outline or contrasting paws */
export const pawPaint = (p: Palette): Paint => ({
  fill: p.paws ?? p.fur,
  ...(p.outline || p.paws ? { stroke: p.outline ?? p.fur, width: 2 } : {}),
});

export const feetArt = (p: Palette, paint: Paint = pawPaint(p)) =>
  group([ellipse(128, 204, 17, 7, paint), ellipse(172, 204, 17, 7, paint)]);
