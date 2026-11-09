import type { MoodId } from "@/domain/moods";
import { circle, ellipse, group, path, text, type ArtNode, type Paint } from "../art/shapes";
import type { Palette } from "./palettes";

const WHITE = "#ffffff";
const line = (stroke: string, width: number, extra: Paint = {}): Paint => ({
  stroke,
  width,
  cap: "round",
  ...extra,
});

const FACES: Record<MoodId, (p: Palette) => ArtNode[]> = {
  happy: (p) => [
    ellipse(110, 108, 9, 5, { fill: "#f8a878", alpha: 0.75 }),
    ellipse(190, 108, 9, 5, { fill: "#f8a878", alpha: 0.75 }),
    path("M112 96q14-16 28 0M160 96q14-16 28 0", line(p.arc, 5.5)),
    path("M143 116q3.5 5 7 0q3.5 5 7 0", line(p.mouth, 2.2)),
  ],
  neutral: (p) => [
    circle(126, 92, 16, { fill: p.eye }),
    circle(174, 92, 16, { fill: p.eye }),
    circle(126, 93, 10, { fill: p.pupil }),
    circle(174, 93, 10, { fill: p.pupil }),
    circle(130, 88.5, 3, { fill: WHITE }),
    circle(177.5, 89, 2.6, { fill: WHITE }),
    path("M144 116q3 3 6 0q3 3 6 0", line(p.mouth, 2)),
  ],
  tired: (p) => [
    path("M110 91a16 16 0 0 0 32 0zM158 91a16 16 0 0 0 32 0z", { fill: p.eye }),
    circle(126, 96, 5, { fill: p.pupil }),
    circle(174, 96, 5, { fill: p.pupil }),
    path("M107 91h38M155 91h38", line(p.pupil, 3.5, { alpha: 0.8 })),
    ellipse(150, 119, 3.5, 2.8, { stroke: p.mouth, width: 2 }),
    text(210, 40, "z", 15, "#8b89a1"),
    text(222, 26, "z", 11, "#8b89a1"),
  ],
  angry: (p) => [
    circle(126, 94, 14, { fill: p.eye }),
    circle(174, 94, 14, { fill: p.eye }),
    circle(128, 95, 8, { fill: p.pupil }),
    circle(172, 95, 8, { fill: p.pupil }),
    path("M106 70l28 10M194 70l-28 10", line(p.arc, 4.5)),
    path("M141 121q9-8 18 0", line(p.mouth, 2.4)),
  ],
  tears: (p) => [
    circle(126, 91, 17, { fill: p.eye }),
    circle(174, 91, 17, { fill: p.eye }),
    circle(126, 92, 12, { fill: p.pupil }),
    circle(174, 92, 12, { fill: p.pupil }),
    circle(130, 87, 3.4, { fill: WHITE }),
    circle(178, 87, 3.4, { fill: WHITE }),
    path("M113 106q-6 10 0 13q6-3 0-13zM187 106q-6 10 0 13q6-3 0-13z", { fill: "#7cc7f2" }),
    path("M141 121q9-7 18 0", line(p.mouth, 2.4)),
  ],
};

export const faceArt = (mood: MoodId, p: Palette) => group(FACES[mood](p), { label: "face" });

export function noseArt(p: Palette): ArtNode {
  switch (p.nose) {
    case "none":
      return null;
    case "frog":
      return group([
        circle(145, 108, 1.8, { fill: "#2d4a22" }),
        circle(155, 108, 1.8, { fill: "#2d4a22" }),
      ]);
    case "beak":
      return path("M138 103h24l-12 15z", {
        fill: "#f2a33a",
        stroke: "#c97a1a",
        width: 1.5,
        join: "round",
      });
    case "big":
      return group([
        ellipse(150, 107, 9, 6.5, { fill: "#2a1a10" }),
        ellipse(147, 105, 3, 1.8, { fill: "#6b4a3a" }),
      ]);
    case "beaver":
      return group([
        ellipse(150, 106, 8, 5.5, { fill: "#2a1a10" }),
        path("M143 121h6v10q0 2-2 2h-2q-2 0-2-2zM151 121h6v10q0 2-2 2h-2q-2 0-2-2z", {
          fill: "#fffaf0",
          stroke: "#b08a5a",
          width: 1.2,
        }),
      ]);
    case "vamp":
      return group([
        path("M145 106h10l-5 5.5z", { fill: "#9a6a8a" }),
        path("M142.5 119l2.5 8l2.5-8zM152.5 119l2.5 8l2.5-8z", {
          fill: "#ffffff",
          stroke: "#3a1626",
          width: 0.8,
          join: "round",
        }),
      ]);
    default:
      return path("M145 106h10l-5 5.5z", { fill: p.nose });
  }
}

/** Eyelids are collapsed (scaleY 0) and closed by the blink animation */
const lid = (label: string, cx: number, colour: string) =>
  group([ellipse(0, 0, 19, 19, { fill: colour })], {
    label,
    transform: { x: cx, y: 92, scaleY: 0 },
  });

export const lidsArt = (p: Palette) =>
  group([lid("lid-l", 126, p.lid), lid("lid-r", 174, p.lid)], { label: "lids" });

export const whiskersArt = (p: Palette): ArtNode =>
  p.whisk &&
  path("M120 108L58 99M120 112L60 114M180 108L242 99M180 112L240 114", line(p.whisk, 1.3));
