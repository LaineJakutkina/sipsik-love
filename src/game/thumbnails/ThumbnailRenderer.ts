import { autoDetectRenderer, Container, Rectangle, type Renderer } from "pixi.js";
import { buildArt } from "../art/buildArt";
import type { ArtFrame } from "../character/compose";

/**
 * Renders static art (portraits, item icons) to image URLs with one shared
 * offscreen WebGL renderer, so lists of icons don't each need a canvas/context.
 */
class ThumbnailRenderer {
  private renderer: Promise<Renderer> | null = null;
  private cache = new Map<string, Promise<string>>();
  private ready = new Map<string, string>();
  private queue: Promise<unknown> = Promise.resolve();

  private getRenderer() {
    this.renderer ??= (async () => {
      // Art text uses Montserrat: make sure it's ready before rasterising
      await Promise.allSettled([document.fonts.load('800 16px "Montserrat"')]);
      return autoDetectRenderer({
        width: 1,
        height: 1,
        backgroundAlpha: 0,
        antialias: true,
        preference: "webgl",
      });
    })();
    return this.renderer;
  }

  /**
   * @param key   stable identity of the art (cache key)
   * @param width display width in CSS px; the image is rendered for the device pixel ratio
   */
  render(key: string, frame: () => ArtFrame, width: number): Promise<string> {
    const cacheKey = this.cacheKey(key, width);
    let url = this.cache.get(cacheKey);
    if (!url) {
      // Renders are serialised: they share one renderer and its state
      url = this.queue.then(() => this.draw(frame(), this.px(width)));
      this.queue = url.catch(() => undefined);
      this.cache.set(cacheKey, url);
      void url.then((done) => this.ready.set(cacheKey, done)).catch(() => undefined);
    }
    return url;
  }

  /** The image URL if this art was already drawn, so it can show in the very first frame */
  peek(key: string, width: number): string | undefined {
    return this.ready.get(this.cacheKey(key, width));
  }

  private px(width: number) {
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    return Math.ceil(width * dpr);
  }

  private cacheKey(key: string, width: number) {
    return `${key}@${this.px(width)}`;
  }

  private async draw({ art, viewBox }: ArtFrame, px: number): Promise<string> {
    const renderer = await this.getRenderer();
    const [x = 0, y = 0, w = 1, h = 1] = viewBox.split(/[\s,]+/).map(Number);
    const root = new Container();
    root.addChild(buildArt(art));
    try {
      return await renderer.extract.base64({
        target: root,
        frame: new Rectangle(x, y, w, h),
        resolution: px / w,
        antialias: true,
      });
    } finally {
      root.destroy({ children: true });
    }
  }
}

export const thumbnails = new ThumbnailRenderer();
