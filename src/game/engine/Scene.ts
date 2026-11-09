import { Container, type Ticker } from "pixi.js";
import { Tweens } from "./tweens";

export interface Viewport {
  width: number;
  height: number;
}

/**
 * A screen of the game. Subclasses build their display tree in `onEnter`,
 * animate in `onUpdate` and lay out in `onResize`.
 */
export abstract class Scene extends Container {
  protected readonly tweens = new Tweens();
  protected viewport: Viewport = { width: 0, height: 0 };
  /** Milliseconds since the scene became active */
  protected time = 0;

  /** Called once when the scene is shown */
  onEnter(): void | Promise<void> {}
  /** Called once before the scene is removed */
  onExit(): void {}
  protected onUpdate(_ticker: Ticker): void {}
  protected onResize(_viewport: Viewport): void {}

  /** @internal driven by SceneManager */
  tick(ticker: Ticker) {
    this.time += ticker.deltaMS;
    this.tweens.update(ticker);
    this.onUpdate(ticker);
  }

  /** @internal driven by SceneManager */
  resize(viewport: Viewport) {
    this.viewport = viewport;
    this.onResize(viewport);
  }

  override destroy() {
    this.tweens.clear();
    super.destroy({ children: true });
  }
}
