import { Container } from "pixi.js";
import { buildArt } from "../art/buildArt";
import { Ease, sample, type Keyframes } from "../engine/easing";
import type { Tweens } from "../engine/tweens";
import { composeCharacter, PART, type CharacterLook } from "./compose";

const BREATHE_MS = 3600;
const BREATHE_X: Keyframes = [
  [0, 1],
  [0.5, 1.018],
  [1, 1],
];
const BREATHE_Y: Keyframes = [
  [0, 1],
  [0.5, 0.984],
  [1, 1],
];

const BLINK_MS = 5400;
const BLINK_DELAY_R = 30;
const BLINK: Keyframes = [
  [0, 0],
  [0.91, 0],
  [0.94, 1],
  [0.97, 0.1],
  [1, 0],
];

const BOOP_MS = 200;
const BOOP_X: Keyframes = [
  [0, 1],
  [0.4, 1.05],
  [1, 1],
];
const BOOP_Y: Keyframes = [
  [0, 1],
  [0.4, 0.93],
  [1, 1],
];

const lookKey = (l: CharacterLook) =>
  JSON.stringify([l.mood, l.coat, l.clicks ?? null, Object.entries(l.worn).filter(([, v]) => v)]);

/** The animated cat: idle breathing and blinking, plus a squash on tap */
export class CharacterView extends Container {
  private art: Container | null = null;
  private key = "";
  private parts: Partial<Record<keyof typeof PART, Container | null>> = {};

  private readonly tweens: Tweens;

  constructor(tweens: Tweens) {
    super();
    this.tweens = tweens;
  }

  setLook(look: CharacterLook) {
    const key = lookKey(look);
    if (key === this.key) return;
    this.key = key;
    this.art?.destroy({ children: true });
    this.art = buildArt(composeCharacter(look));
    this.addChild(this.art);
    for (const k of Object.keys(PART) as (keyof typeof PART)[]) {
      this.parts[k] = this.art.getChildByLabel(PART[k], true);
    }
  }

  /** Idle animation at scene time `t` (ms) */
  animate(t: number) {
    const { breath, lidL, lidR } = this.parts;
    if (breath) {
      const k = (t % BREATHE_MS) / BREATHE_MS;
      breath.scale.set(sample(BREATHE_X, k, Ease.easeInOut), sample(BREATHE_Y, k, Ease.easeInOut));
    }
    if (lidL) lidL.scale.y = sample(BLINK, (t % BLINK_MS) / BLINK_MS);
    if (lidR) {
      const tr = Math.max(0, t - BLINK_DELAY_R);
      lidR.scale.y = sample(BLINK, (tr % BLINK_MS) / BLINK_MS);
    }
  }

  /** Quick squash, as if the cat was booped */
  boop() {
    const body = this.parts.body;
    if (!body) return;
    void this.tweens.run({
      duration: BOOP_MS,
      update: (_, raw) =>
        body.destroyed ||
        body.scale.set(sample(BOOP_X, raw, Ease.easeOut), sample(BOOP_Y, raw, Ease.easeOut)),
    });
  }
}
