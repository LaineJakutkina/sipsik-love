import { Container, Graphics, type Ticker } from "pixi.js";
import { CharacterView } from "../character/CharacterView";
import type { CharacterLook } from "../character/compose";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../character/geometry";
import { Scene, type Viewport } from "../engine/Scene";
import { BRAND } from "../theme";
import { floatText } from "../ui/floatText";
import { SpeechBubble } from "../ui/SpeechBubble";

const BUBBLE_TOP = 10;

/** Soft peach glow behind the cat: faint when idle, flashes on every tap */
const GLOW_RINGS = 5;
const GLOW_RING_ALPHA = 0.1;
const GLOW_IDLE = 0.3;
const GLOW_FADE_MS = 450;

/** Taps closer than this keep the combo going */
const COMBO_GAP_MS = 450;
const COMBO_EVERY = 10;
const FLOAT_SIZE = 17;
const FLOAT_SIZE_MAX = 27;
const BIG_SIZE = 26;
const BURST = ["💜", "🧡", "✨"] as const;
const BURST_COUNT = 12;

/** The cat at home: idles, reacts to taps and can say something */
export class HomeScene extends Scene {
  private readonly glow = new Graphics();
  private readonly character = new CharacterView(this.tweens);
  private readonly overlay = new Container();
  private bubble: SpeechBubble | null = null;
  private message: string | null = null;
  /** 1 right after a tap, decays to 0 */
  private heat = 0;
  private combo = 0;
  private lastBoop = -Infinity;

  constructor(look: CharacterLook) {
    super();
    this.character.setLook(look);
    this.glow.alpha = GLOW_IDLE;
    this.addChild(this.glow, this.character, this.overlay);
  }

  setLook(look: CharacterLook) {
    this.character.setLook(look);
  }

  /** Show (or hide with `null`) a speech bubble above the cat */
  say(message: string | null) {
    if (message === this.message) return;
    this.message = message;
    this.bubble?.destroy({ children: true });
    this.bubble = message ? new SpeechBubble(message, this.tweens) : null;
    if (this.bubble) this.overlay.addChild(this.bubble);
    this.layoutBubble();
  }

  /** Nudge the bubble, e.g. when tapped while tired */
  shakeBubble() {
    this.bubble?.wiggle();
  }

  /**
   * Visual reaction to a pet: squash, glow flash and a floating «+1» or heart.
   * Quick taps build a combo: the «+1» grows and every tenth shows «×N».
   */
  boop() {
    this.combo = this.time - this.lastBoop < COMBO_GAP_MS ? this.combo + 1 : 1;
    this.lastBoop = this.time;
    this.heat = 1;
    this.character.boop();
    const { width, height } = this.viewport;
    const x = width * (0.2 + Math.random() * 0.6);
    const y = height * (0.2 + Math.random() * 0.25);
    const size = Math.min(FLOAT_SIZE_MAX, FLOAT_SIZE + Math.floor(this.combo / 5) * 2);
    const label = Math.random() < 0.2 ? "💜" : "+1";
    this.overlay.addChild(floatText(this.tweens, label, x, y, size));
    if (this.combo % COMBO_EVERY === 0) {
      this.overlay.addChild(
        floatText(this.tweens, `×${this.combo}`, width / 2, height * 0.12, BIG_SIZE),
      );
    }
  }

  /** Burst of hearts with a big label, for round tap counts */
  celebrate(label: string) {
    this.heat = 1;
    const { width, height } = this.viewport;
    for (let i = 0; i < BURST_COUNT; i++) {
      const x = width * (0.08 + Math.random() * 0.84);
      const y = height * (0.2 + Math.random() * 0.5);
      this.overlay.addChild(floatText(this.tweens, BURST[i % BURST.length] ?? "💜", x, y, 20));
    }
    this.overlay.addChild(floatText(this.tweens, label, width / 2, height * 0.3, BIG_SIZE + 6));
  }

  protected override onUpdate(ticker: Ticker) {
    this.character.animate(this.time);
    if (this.heat > 0) this.heat = Math.max(0, this.heat - ticker.deltaMS / GLOW_FADE_MS);
    this.glow.alpha = GLOW_IDLE + (1 - GLOW_IDLE) * this.heat;
  }

  protected override onResize({ width, height }: Viewport) {
    const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
    this.character.scale.set(scale);
    this.character.position.set(
      (width - DESIGN_WIDTH * scale) / 2,
      (height - DESIGN_HEIGHT * scale) / 2,
    );
    this.drawGlow(width, height);
    this.layoutBubble();
  }

  /** Concentric translucent circles read as one soft radial gradient */
  private drawGlow(width: number, height: number) {
    const radius = Math.min(width, height) * 0.62;
    this.glow.clear();
    for (let i = 0; i < GLOW_RINGS; i++) {
      this.glow
        .circle(width / 2, height * 0.56, radius * (1 - i / (GLOW_RINGS + 1)))
        .fill({ color: BRAND.peach, alpha: GLOW_RING_ALPHA });
    }
  }

  private layoutBubble() {
    this.bubble?.place(this.viewport.width / 2, BUBBLE_TOP);
  }
}
