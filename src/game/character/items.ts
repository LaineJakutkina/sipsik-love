import type { ItemId } from "@/domain/items";
import {
  circle,
  dashedQuad,
  ellipse,
  group,
  path,
  rect,
  rotateAbout,
  text,
  translate,
  type ArtNode,
  type Paint,
} from "../art/shapes";

const NAVY = "#1f1d38";
const WHITE = "#ffffff";
/** Common outline style for most accessories */
const outlined = (width = 2.5): Paint => ({ stroke: NAVY, width, join: "round" });
const noStroke: Paint = { stroke: null };

const TRUCK = group(
  [
    rect(8, 44, 222, 132, { fill: WHITE, r: 10 }),
    path("M8 146h222v14H8z", { fill: "#f8a878" }),
    path("M230 84h34q22 0 28 26v66h-62z", { fill: "#f8a878" }),
    path("M240 94h24q12 0 16 18h-40z", { fill: WHITE }),
    path("M240 128h12", { width: 3 }),
    rect(286, 150, 10, 10, { fill: "#f2c94c", r: 2 }),
    rect(8, 176, 288, 8, { fill: NAVY }),
    ...[38, 74, 258].map((x) => circle(x, 188, 15, { fill: NAVY })),
    ...[38, 74, 258].map((x) => circle(x, 188, 5, { fill: WHITE, ...noStroke })),
  ],
  { style: outlined(3) },
);

const MOUSE = group([
  path("M44 200q-14 4-20-8", { stroke: NAVY, width: 2.5, cap: "round" }),
  ellipse(60, 198, 17, 10, { fill: "#c9c7d6", stroke: NAVY, width: 2.5 }),
  circle(70, 187, 6.5, { fill: "#c9c7d6", stroke: NAVY, width: 2.5 }),
  circle(70, 187, 2.6, { fill: "#f8a878" }),
  circle(72, 196, 2, { fill: NAVY }),
  circle(77.5, 200, 2.2, { fill: "#f8a878" }),
]);

const PANAMA = group(
  [
    ellipse(150, 54, 64, 12, { fill: "#f8a878" }),
    path("M113 54Q115 16 150 14Q185 16 187 54Z", { fill: "#fde5d4" }),
    path("M114 41Q150 49 186 41L187 52Q150 58 113 52Z", { fill: NAVY }),
    text(150, 53.5, "abibas", 9.5, WHITE, { anchor: "middle", letterSpacing: 0.3 }),
  ],
  { style: outlined() },
);

const CHAIN = group([
  // SVG used stroke-dasharray="5 3" with round caps; Pixi has no dashes so dashes are real segments
  path(dashedQuad([102, 122], [150, 152], [198, 122], [5, 3]), {
    stroke: "#e5b52f",
    width: 6.5,
    cap: "round",
  }),
  circle(150, 139, 9, { fill: "#f2c94c", stroke: "#a87c0e", width: 2 }),
  path("M147 135h6l-6 8h6", { stroke: "#a87c0e", width: 1.6 }),
]);

const BAG = group(
  [
    path("M98 104L196 182", { stroke: "#8a5a2e", width: 4.5, cap: "round" }),
    rect(186, 174, 38, 27, { fill: "#8a5a2e", r: 7 }),
    path("M186 183h38"),
    circle(205, 183, 3, { fill: "#f2c94c" }),
  ],
  { style: outlined() },
);

const CIG = group([
  path("M157 119L186 126", { stroke: WHITE, width: 6, cap: "round" }),
  path("M157 119l7 1.8", { stroke: "#f8a878", width: 6 }),
  path("M186 126l5 1.3", { stroke: "#e5662f", width: 6, cap: "round" }),
  path("M195 119q6-8 0-14q-6-6 2-14", { stroke: "#8b89a1", width: 2.2, cap: "round" }),
]);

/** Accessories drawn on top of the cat (everything except clothes) */
export const ITEM_ART: Partial<Record<ItemId, () => ArtNode>> = {
  panama: () => PANAMA,
  cap: () =>
    group(
      [
        path("M182 44l34-14 6 12-34 12z", { fill: "#b8352a" }),
        path("M106 64Q106 24 150 22Q194 24 194 64Q150 54 106 64Z", { fill: "#d94f3d" }),
        path("M150 22v40", { stroke: "#b8352a" }),
        circle(150, 22, 4, { fill: "#b8352a" }),
      ],
      { style: outlined() },
    ),
  bandana: () =>
    group([
      group(
        [
          path("M102 68Q104 28 150 26Q196 28 198 68Q150 58 102 68Z", { fill: "#c0392b" }),
          path("M196 60l22-10-6 18zM196 62l18 14-20-2z", { fill: "#c0392b" }),
        ],
        { style: outlined() },
      ),
      ...[
        [124, 44],
        [150, 38],
        [176, 44],
        [136, 58],
        [164, 58],
        [112, 58],
        [188, 58],
      ].map(([x = 0, y = 0]) => circle(x, y, 2.6, { fill: WHITE })),
    ]),
  ushanka: () =>
    group([
      group(
        [
          path("M94 66L92 104Q104 110 114 100L116 66Z", { fill: "#b9946a" }),
          path("M206 66L208 104Q196 110 186 100L184 66Z", { fill: "#b9946a" }),
          path("M104 62Q104 18 150 16Q196 18 196 62Z", { fill: "#5a3d28" }),
          path("M96 58Q150 44 204 58L204 74Q150 62 96 74Z", { fill: "#c9a27c" }),
        ],
        { style: outlined() },
      ),
      path("M150 50l3 7h7l-5.5 4.5 2 7-6.5-4-6.5 4 2-7-5.5-4.5h7z", {
        fill: "#e0322b",
        stroke: "#f2c94c",
        width: 1.5,
      }),
    ]),
  helmet: () =>
    group([
      group(
        [
          ellipse(150, 62, 66, 10, { fill: "#e6b422" }),
          path("M106 62Q106 18 150 16Q194 18 194 62Z", { fill: "#f2c230" }),
          path("M142 18h16v42h-16z", { fill: "#e6b422" }),
        ],
        { style: outlined() },
      ),
      path("M114 44q8-14 20-20", { stroke: "#fff6c2", width: 4, cap: "round" }),
    ]),
  glasses: () =>
    group([
      path("M102 86Q104 82 110 82H140Q146 82 146 88L144 98Q142 104 134 104H112Q104 104 102 96Z", {
        fill: "#111018",
      }),
      path("M198 86Q196 82 190 82H160Q154 82 154 88L156 98Q158 104 166 104H188Q196 104 198 96Z", {
        fill: "#111018",
      }),
      path("M146 88Q150 85 154 88", { stroke: "#111018", width: 3 }),
      path("M102 86L82 80M198 86L218 80", { stroke: "#111018", width: 3, cap: "round" }),
      path("M112 87l10 0M166 87l10 0", {
        stroke: "#7cf0a8",
        width: 2.5,
        cap: "round",
        alpha: 0.85,
      }),
    ]),
  chain: () => CHAIN,
  bag: () => BAG,
  cig: () => CIG,
  seeds: () =>
    group([
      group(
        [
          path("M196 148L230 140L236 184Q218 192 202 186Z", { fill: "#d8b27a" }),
          path("M196 148L230 140", { width: 3 }),
        ],
        { style: outlined() },
      ),
      text(203, 168, "СЕМКИ", 7.5, "#7a4d1a", { transform: rotateAbout(-12, 214, 166) }),
      ...[
        [210, 150],
        [220, 147],
        [214, 153],
      ].map(([x = 0, y = 0]) => ellipse(x, y, 2.4, 3.6, { fill: "#2a2230" })),
    ]),
  coffee: () =>
    group([
      group(
        [
          path("M202 136h28l-4 46h-20z", { fill: WHITE }),
          path("M203 152h26l-1.5 16h-23z", { fill: "#a0673a" }),
          path("M199 130h34v7h-34z", { fill: "#3a2a22" }),
        ],
        { style: outlined() },
      ),
      path("M210 124q4-6 0-12M222 124q4-6 0-12", { stroke: "#8b89a1", width: 2, cap: "round" }),
    ]),
  lemonade: () =>
    group([
      group(
        [
          path("M208 112h12v10q8 6 8 20v38q0 4-4 4h-20q-4 0-4-4v-38q0-14 8-20z", {
            fill: "#e8a33a",
            fillAlpha: 0.85,
          }),
          rect(206, 106, 16, 7, { fill: "#b9b7c4", r: 1.5 }),
          rect(202, 148, 24, 20, { fill: "#f6e2c4", r: 3 }),
        ],
        { style: outlined() },
      ),
      text(214, 161, "БУРАТИНО", 5.6, "#c0392b", { anchor: "middle" }),
    ]),
  mic: () =>
    group([
      group(
        [
          path("M214 182L196 134", { stroke: "#2a2230", width: 9, cap: "round" }),
          circle(192, 124, 13, { fill: "#b9b7c4" }),
        ],
        { style: outlined() },
      ),
      path("M184 118h16M182 124h20M184 130h16M192 112v24", { stroke: "#7d7a90", width: 1.5 }),
    ]),
  tablet: () =>
    group(
      [
        rect(196, 126, 44, 60, { fill: "#2a2230", stroke: NAVY, width: 2.5, r: 6 }),
        rect(200, 131, 36, 50, { fill: "#bfe2f5", r: 2 }),
        path("M204 129l38 6-2 48-38-6z", { fill: WHITE, stroke: WHITE, width: 1, alpha: 0.35 }),
        path("M206 140h14M206 148h22M206 156h10", { stroke: NAVY, width: 2.5, cap: "round" }),
        path("M226 166l4 -6 4 6", { stroke: "#e5533d", width: 2.5 }),
      ],
      { transform: rotateAbout(-10, 218, 156) },
    ),
  mouse: () => MOUSE,
  truck: () => TRUCK,
  skate: () =>
    group(
      [
        path("M78 204h144q10 0 10 6t-10 6H78q-10 0-10-6t10-6z", { fill: "#f8a878" }),
        circle(100, 216, 5, { fill: WHITE }),
        circle(200, 216, 5, { fill: WHITE }),
      ],
      { style: outlined() },
    ),
  bike: () =>
    group(
      [
        circle(48, 172, 36, { stroke: "#2a2230", width: 5 }),
        circle(252, 172, 36, { stroke: "#2a2230", width: 5 }),
        circle(48, 172, 4, { fill: "#9b4a2a" }),
        circle(252, 172, 4, { fill: "#9b4a2a" }),
        path("M48 172L120 120L230 120L252 172M120 120L150 176L230 120M150 176L48 172", {
          stroke: "#9b4a2a",
        }),
        path("M230 120L236 92L258 86M236 92L218 88", { stroke: "#5a5866" }),
      ],
      { style: { stroke: "#6b2f1e", width: 3.5, cap: "round", join: "round" } },
    ),
};

/** Clothes are drawn over the fur and clipped by the silhouette */
export const CLOTHES: Partial<Record<ItemId, () => ArtNode[]>> = {
  stripes: () => [
    rect(40, 132, 220, 90, { fill: WHITE }),
    ...[140, 154, 168, 182, 196, 210].map((y) => rect(40, y, 220, 7, { fill: "#2b4a8a" })),
    path("M118 132q32 14 64 0", { stroke: WHITE, width: 6 }),
  ],
  tracksuit: () => [
    rect(40, 130, 220, 92, { fill: "#22264a" }),
    path("M150 134v80", { stroke: "#c9c7d6", width: 2.5 }),
    circle(150, 140, 3, { fill: "#c9c7d6" }),
    path("M70 136l-6 74M80 136l-6 74M90 136l-6 74M230 136l6 74M220 136l6 74M210 136l6 74", {
      stroke: WHITE,
      width: 4,
      cap: "round",
    }),
    path("M118 131q32 12 64 0", { stroke: "#3a3f72", width: 7 }),
    text(172, 160, "abibas", 8, WHITE),
  ],
  hawaii: () => [
    rect(40, 130, 220, 92, { fill: "#1ea7a0" }),
    ...[
      [80, 150],
      [120, 178],
      [178, 150],
      [214, 182],
      [150, 204],
      [96, 200],
      [200, 140],
    ].map(([x = 0, y = 0]) =>
      group(
        [
          circle(0, 0, 9, { fill: "#f8a878" }),
          circle(8, -5, 9, { fill: "#f2c94c", alpha: 0.9 }),
          circle(0, 0, 3.5, { fill: WHITE }),
        ],
        { transform: translate(x, y) },
      ),
    ),
    path("M114 130l36 22 36-22", { stroke: WHITE, width: 5, join: "round" }),
    path("M150 152v62", { stroke: "#14857f", width: 2 }),
    circle(150, 166, 2.5, { fill: WHITE }),
    circle(150, 186, 2.5, { fill: WHITE }),
  ],
  suit: () => [
    rect(40, 130, 220, 92, { fill: "#2e3140" }),
    path("M124 130l26 56 26-56z", { fill: WHITE }),
    path("M124 130l14 40 12 -24zM176 130l-14 40 -12 -24z", { fill: "#3c4054" }),
    circle(150, 176, 2.6, { fill: WHITE }),
    circle(150, 192, 2.6, { fill: WHITE }),
    path("M136 138l14 7 14-7v14l-14-7-14 7z", { fill: "#c0392b" }),
    circle(150, 145, 3, { fill: "#962d22" }),
    path("M200 156h18", { stroke: WHITE, width: 3, cap: "round" }),
  ],
};

/** The puffer jacket puffs out past the cat, so it is not clipped */
export const PUFFER = group(
  [
    path("M52 140Q50 214 150 214Q250 214 248 140Q246 124 230 128L70 128Q54 124 52 140Z", {
      fill: "#e5533d",
    }),
    path("M54 160Q150 172 246 160M56 182Q150 196 244 182"),
    path("M150 130V212", { stroke: "#7a2a1e" }),
    path("M102 124Q150 140 198 124Q200 112 186 112Q150 122 114 112Q100 112 102 124Z", {
      fill: "#f06a52",
    }),
  ],
  { style: { stroke: "#a33a2a", width: 2.5 }, transform: translate(0, 7) },
);

/** Where the paw holds an item in the right paw */
export const HOLD: Partial<Record<ItemId, [number, number]>> = {
  seeds: [214, 182],
  coffee: [214, 170],
  lemonade: [214, 176],
  mic: [212, 170],
  tablet: [204, 176],
};

/** Crop (viewBox `x y w h`) for item thumbnails */
export const ITEM_VIEWBOX: Record<ItemId, string> = {
  panama: "82 8 136 60",
  cap: "100 14 126 56",
  bandana: "96 22 128 60",
  ushanka: "88 10 124 104",
  helmet: "80 10 140 64",
  glasses: "78 76 144 34",
  chain: "96 116 108 36",
  bag: "182 168 48 38",
  cig: "152 90 52 42",
  seeds: "190 134 52 62",
  coffee: "194 106 44 84",
  lemonade: "196 102 36 88",
  mic: "176 106 50 84",
  tablet: "190 118 58 74",
  mouse: "20 178 64 32",
  truck: "0 40 300 166",
  skate: "64 198 172 26",
  bike: "6 80 290 132",
  stripes: "50 110 200 110",
  tracksuit: "50 110 200 110",
  hawaii: "50 110 200 110",
  suit: "50 110 200 110",
  puffer: "46 106 208 112",
  kitten: "20 160 80 60",
};

export const isClothes = (id: ItemId) => id === "puffer" || id in CLOTHES;
