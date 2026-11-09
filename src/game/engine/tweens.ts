import type { Ticker } from "pixi.js";
import { Ease, type Easing } from "./easing";

export interface TweenOptions {
  duration: number;
  easing?: Easing;
  /** Receives eased progress 0..1 */
  update: (k: number, raw: number) => void;
}

/** One-shot animations driven by a scene's update loop */
export class Tweens {
  private active = new Set<{ elapsed: number; opts: TweenOptions; done: () => void }>();

  /** Start a tween; resolves when it finishes or is cancelled */
  run(opts: TweenOptions): Promise<void> {
    return new Promise((done) => {
      this.active.add({ elapsed: 0, opts, done });
      opts.update(0, 0);
    });
  }

  update(ticker: Pick<Ticker, "deltaMS">) {
    for (const t of this.active) {
      t.elapsed += ticker.deltaMS;
      const raw = Math.min(1, t.elapsed / t.opts.duration);
      t.opts.update((t.opts.easing ?? Ease.linear)(raw), raw);
      if (raw >= 1) {
        this.active.delete(t);
        t.done();
      }
    }
  }

  clear() {
    for (const t of this.active) t.done();
    this.active.clear();
  }
}
