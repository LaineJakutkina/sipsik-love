import { Application } from "pixi.js";
import { SceneManager } from "./SceneManager";

/**
 * Pixi application bound to a DOM element. One stage = one WebGL context, so the
 * UI keeps a single live stage and swaps scenes inside it.
 */
export class GameStage {
  readonly app = new Application();
  scenes!: SceneManager;
  private destroyed = false;

  async mount(host: HTMLElement): Promise<boolean> {
    await this.app.init({
      resizeTo: host,
      backgroundAlpha: 0,
      antialias: true,
      autoDensity: true,
      resolution: Math.min(window.devicePixelRatio || 1, 3),
      preference: "webgl",
    });
    // The owner may have unmounted while WebGL was initialising
    if (this.destroyed) {
      this.app.destroy(true);
      return false;
    }
    host.appendChild(this.app.canvas);
    this.scenes = new SceneManager(this.app);
    return true;
  }

  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (!this.scenes) return;
    this.scenes.destroy();
    this.app.destroy(true, { children: true });
  }
}
