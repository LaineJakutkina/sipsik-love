import { Container, Graphics, Text } from "pixi.js";
import { Ease, sample, type Keyframes } from "../engine/easing";
import type { Tweens } from "../engine/tweens";
import { BRAND, FONT_FAMILY } from "../theme";

const PAD_X = 12;
const PAD_Y = 7;
const RADIUS = 16;
const BORDER = 2;
/** Half-diagonal of the 12px square rotated 45° that forms the tail */
const TAIL = 6 * Math.SQRT2;
/** Tail centre below the box, from CSS `bottom: -8px` on a 12px square */
const TAIL_DROP = 2;

const WIGGLE_MS = 400;
const WIGGLE_SHIFT: Keyframes = [
  [0, 0],
  [0.25, -0.02],
  [0.75, 0.02],
  [1, 0],
];
const WIGGLE_TURN: Keyframes = [
  [0, 0],
  [0.25, -3],
  [0.75, 3],
  [1, 0],
];

/** Comic speech bubble with a tail pointing down at the speaker; origin is top-centre */
export class SpeechBubble extends Container {
  private readonly box = new Graphics();
  private readonly caption: Text;
  private readonly boxWidth: number;
  private readonly tweens: Tweens;
  private anchorX = 0;
  private wiggling = false;

  constructor(message: string, tweens: Tweens) {
    super();
    this.tweens = tweens;
    this.caption = new Text({
      text: message,
      style: { fontFamily: FONT_FAMILY, fontWeight: "800", fontSize: 13, fill: BRAND.navy },
      resolution: Math.max(2, window.devicePixelRatio || 1),
    });
    this.caption.anchor.set(0.5, 0);
    this.caption.position.set(0, PAD_Y);

    const w = Math.ceil(this.caption.width) + PAD_X * 2;
    const h = Math.ceil(this.caption.height) + PAD_Y * 2;
    this.boxWidth = w;
    const ty = h + TAIL_DROP;
    this.box
      // Drop shadow: 0 4px rgba(31,29,56,.12)
      .roundRect(-w / 2, 4, w, h, RADIUS)
      .fill({ color: BRAND.navy, alpha: 0.12 })
      .roundRect(-w / 2, 0, w, h, RADIUS)
      .fill(BRAND.paper)
      .stroke({ color: BRAND.navy, width: BORDER, alignment: 1 })
      .poly([0, ty - TAIL, TAIL, ty, 0, ty + TAIL, -TAIL, ty])
      .fill(BRAND.paper)
      .moveTo(TAIL, ty)
      .lineTo(0, ty + TAIL)
      .lineTo(-TAIL, ty)
      .stroke({ color: BRAND.navy, width: BORDER });
    this.addChild(this.box, this.caption);
  }

  /** Place the bubble's top-centre */
  place(x: number, y: number) {
    this.anchorX = x;
    this.position.set(x, y);
  }

  wiggle() {
    if (this.wiggling) return;
    this.wiggling = true;
    void this.tweens
      .run({
        duration: WIGGLE_MS,
        update: (_, raw) => {
          if (this.destroyed) return;
          this.x = this.anchorX + sample(WIGGLE_SHIFT, raw, Ease.easeInOut) * this.boxWidth;
          this.angle = sample(WIGGLE_TURN, raw, Ease.easeInOut);
        },
      })
      .then(() => {
        this.wiggling = false;
      });
  }
}
