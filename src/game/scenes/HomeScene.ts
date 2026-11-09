import { Container, type Ticker } from "pixi.js";
import { CharacterView } from "../character/CharacterView";
import type { CharacterLook } from "../character/compose";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../character/geometry";
import { Scene, type Viewport } from "../engine/Scene";
import { floatText } from "../ui/floatText";
import { SpeechBubble } from "../ui/SpeechBubble";

const BUBBLE_TOP = 10;

/** The cat at home: idles, reacts to taps and can say something */
export class HomeScene extends Scene {
  private readonly character = new CharacterView(this.tweens);
  private readonly overlay = new Container();
  private bubble: SpeechBubble | null = null;
  private message: string | null = null;

  constructor(look: CharacterLook) {
    super();
    this.character.setLook(look);
    this.addChild(this.character, this.overlay);
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

  /** Visual reaction to a pet: squash plus a floating «+1» or heart */
  boop(label = Math.random() < 0.2 ? "💜" : "+1") {
    this.character.boop();
    const { width, height } = this.viewport;
    const x = width * (0.2 + Math.random() * 0.6);
    const y = height * (0.2 + Math.random() * 0.25);
    this.overlay.addChild(floatText(this.tweens, label, x, y));
  }

  protected override onUpdate(_ticker: Ticker) {
    this.character.animate(this.time);
  }

  protected override onResize({ width, height }: Viewport) {
    const scale = Math.min(width / DESIGN_WIDTH, height / DESIGN_HEIGHT);
    this.character.scale.set(scale);
    this.character.position.set(
      (width - DESIGN_WIDTH * scale) / 2,
      (height - DESIGN_HEIGHT * scale) / 2,
    );
    this.layoutBubble();
  }

  private layoutBubble() {
    this.bubble?.place(this.viewport.width / 2, BUBBLE_TOP);
  }
}
