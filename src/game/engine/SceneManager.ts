import type { Application, Ticker } from "pixi.js";
import type { Scene } from "./Scene";

/** Owns the active scene and swaps it for another one */
export class SceneManager {
  private readonly app: Application;
  private active: Scene | null = null;
  private readonly onTick = (ticker: Ticker) => this.active?.tick(ticker);
  private readonly onResize = () => this.active?.resize(this.viewport);

  constructor(app: Application) {
    this.app = app;
    app.ticker.add(this.onTick);
    app.renderer.on("resize", this.onResize);
  }

  get current() {
    return this.active;
  }

  private get viewport() {
    return { width: this.app.screen.width, height: this.app.screen.height };
  }

  async show<S extends Scene>(scene: S): Promise<S> {
    const previous = this.active;
    if (previous) {
      previous.onExit();
      this.app.stage.removeChild(previous);
      previous.destroy();
    }
    this.active = scene;
    this.app.stage.addChild(scene);
    scene.resize(this.viewport);
    await scene.onEnter();
    return scene;
  }

  destroy() {
    this.app.ticker.remove(this.onTick);
    this.app.renderer.off("resize", this.onResize);
    this.active?.onExit();
    this.active?.destroy();
    this.active = null;
  }
}
