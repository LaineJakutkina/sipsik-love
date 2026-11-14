import { Application } from "pixi.js";
import { SceneManager } from "./SceneManager";

/** How long a stage may outlive its owner while a leave transition still shows it */
const RELEASE_TIMEOUT_MS = 1000;

/**
 * Pixi application bound to a DOM element. One stage = one WebGL context, so the
 * UI keeps a single live stage and swaps scenes inside it.
 */
export class GameStage {
  readonly app = new Application();
  scenes!: SceneManager;
  private host: HTMLElement | null = null;
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
    this.host = host;
    this.scenes = new SceneManager(this.app);
    return true;
  }

  /**
   * Vue unmounts a component as its leave transition starts, while its element is
   * still fading on screen; freeing WebGL right away would blank the canvas mid-fade.
   * So the stage keeps drawing until its element has left the page (or a safety
   * timeout passes).
   */
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    if (!this.scenes) return;
    const until = performance.now() + RELEASE_TIMEOUT_MS;
    const release = () => {
      if (this.host?.isConnected && performance.now() < until) {
        requestAnimationFrame(release);
        return;
      }
      this.scenes.destroy();
      this.app.destroy(true, { children: true });
    };
    release();
  }
}
