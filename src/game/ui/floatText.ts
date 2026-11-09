import { Text } from "pixi.js";
import { Ease } from "../engine/easing";
import type { Tweens } from "../engine/tweens";
import { BRAND, FONT_FAMILY } from "../theme";

const RISE = 46;
const DURATION = 700;

/** «+1» that floats up and fades out, then destroys itself */
export function floatText(tweens: Tweens, message: string, x: number, y: number): Text {
  const t = new Text({
    text: message,
    style: {
      fontFamily: FONT_FAMILY,
      fontWeight: "800",
      fontSize: 17,
      fill: BRAND.peach,
      stroke: { color: BRAND.navy, width: 1 },
    },
    resolution: Math.max(2, window.devicePixelRatio || 1),
  });
  t.anchor.set(0.5, 0);
  t.position.set(x, y);
  void tweens
    .run({
      duration: DURATION,
      easing: Ease.easeOut,
      update: (k) => {
        if (t.destroyed) return;
        t.y = y - RISE * k;
        t.alpha = 1 - k;
      },
    })
    .then(() => t.destroyed || t.destroy());
  return t;
}
