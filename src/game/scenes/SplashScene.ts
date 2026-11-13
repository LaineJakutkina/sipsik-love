import { Container, Graphics } from "pixi.js";
import { buildArt } from "../art/buildArt";
import { group } from "../art/shapes";
import { composeCharacter, type CharacterLook } from "../character/compose";
import { DESIGN_HEIGHT, DESIGN_WIDTH, GROUND } from "../character/geometry";
import { ITEM_ART } from "../character/items";
import { Scene, type Viewport } from "../engine/Scene";
import { BRAND } from "../theme";

/** How long the truck takes to cross the screen */
const DRIVE_MS = 2600;
/** Mice running behind the truck: distance behind it and hop phase */
const MICE = [
  { gap: 0.12, phase: 0 },
  { gap: 0.3, phase: 140 },
  { gap: 0.46, phase: 70 },
] as const;
const MOUSE_FOOT: readonly [number, number] = [50, 208];
const HOP_MS = 220;
const BUMP_MS = 180;
const DUST_EVERY_MS = 70;
const DUST_LIFE_MS = 520;
const DASH = 26;

interface Puff {
  g: Graphics;
  born: number;
}

/**
 * Intro: the cat drives its truck across the screen with a few mice chasing it.
 * Plays once and calls `onDone`; the Vue side may end it earlier on tap.
 */
export class SplashScene extends Scene {
  private readonly road = new Graphics();
  private readonly dust = new Container();
  private readonly rig: Container;
  private readonly mice: Container[];
  private readonly puffs: Puff[] = [];
  private readonly onDone: () => void;
  private scale = 1;
  private groundY = 0;
  private lastPuff = 0;
  private finished = false;

  constructor(look: CharacterLook, onDone: () => void) {
    super();
    this.onDone = onDone;
    const worn = { ...look.worn, bike: false, skate: false, truck: true };
    this.rig = buildArt(composeCharacter({ ...look, mood: "happy", worn }));
    this.mice = MICE.map(() => {
      const mouse = ITEM_ART.mouse?.();
      const node = buildArt(group(mouse ? [mouse] : []));
      node.pivot.set(...MOUSE_FOOT);
      return node;
    });
    this.addChild(this.road, this.dust, ...this.mice, this.rig);
  }

  protected override onResize({ width, height }: Viewport) {
    this.scale = Math.min((width * 0.62) / DESIGN_WIDTH, (height * 0.82) / DESIGN_HEIGHT);
    this.groundY = height * 0.86;
    this.rig.scale.set(this.scale);
    this.rig.pivot.set(0, GROUND[1]);
    for (const m of this.mice) m.scale.set(this.scale * 1.15);
  }

  protected override onUpdate() {
    const { width } = this.viewport;
    const rigW = DESIGN_WIDTH * this.scale;
    const trail = width * 0.5;
    const p = Math.min(1, this.time / DRIVE_MS);
    const x = -rigW + p * (width + rigW + trail);

    const bump = Math.abs(Math.sin(this.time / BUMP_MS)) * 2 * this.scale;
    this.rig.position.set(x, this.groundY - bump);
    this.mice.forEach((m, i) => {
      const { gap, phase } = MICE[i] ?? MICE[0];
      const hop = Math.abs(Math.sin((this.time + phase) / HOP_MS)) * 14 * this.scale;
      m.position.set(x - width * gap, this.groundY - hop);
      m.angle = Math.sin((this.time + phase) / HOP_MS) * 6;
    });

    this.drawRoad(width);
    this.updateDust(x + 14 * this.scale);

    if (p >= 1 && !this.finished) {
      this.finished = true;
      this.onDone();
    }
  }

  /** Dashed road that scrolls the other way, so the truck feels fast */
  private drawRoad(width: number) {
    const y = this.groundY + 4;
    const shift = (this.time * 0.35) % (DASH * 2);
    this.road.clear();
    for (let dx = -shift; dx < width; dx += DASH * 2) {
      this.road.rect(dx, y, DASH, 3).fill({ color: BRAND.paper, alpha: 0.25 });
    }
  }

  private updateDust(backX: number) {
    if (this.time - this.lastPuff > DUST_EVERY_MS) {
      this.lastPuff = this.time;
      const g = new Graphics()
        .circle(0, 0, 7 * this.scale)
        .fill({ color: BRAND.paper, alpha: 0.5 });
      g.position.set(backX, this.groundY - 6 * this.scale);
      this.dust.addChild(g);
      this.puffs.push({ g, born: this.time });
    }
    for (let i = this.puffs.length - 1; i >= 0; i--) {
      const puff = this.puffs[i];
      if (!puff) continue;
      const age = (this.time - puff.born) / DUST_LIFE_MS;
      if (age >= 1) {
        puff.g.destroy();
        this.puffs.splice(i, 1);
        continue;
      }
      puff.g.scale.set(1 + age * 1.6);
      puff.g.alpha = 1 - age;
      puff.g.y -= 0.3;
    }
  }
}
