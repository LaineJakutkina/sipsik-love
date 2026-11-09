import {
  CanvasTextMetrics,
  Container,
  Graphics,
  GraphicsPath,
  Text,
  TextStyle,
  type ContainerChild,
} from "pixi.js";
import { FONT_FAMILY } from "../theme";
import type { GroupShape, Paint, PrimitiveShape, Shape, TextShape, Transform } from "./shapes";

/** Text is rasterised, so render it at a high resolution to stay crisp when scaled up */
const TEXT_RESOLUTION = 6;

const pathCache = new Map<string, GraphicsPath>();
function toPath(d: string): GraphicsPath {
  let p = pathCache.get(d);
  if (!p) {
    p = new GraphicsPath(d);
    pathCache.set(d, p);
  }
  return p;
}

function applyTransform(node: Container, t?: Transform) {
  if (!t) return;
  node.position.set(t.x ?? 0, t.y ?? 0);
  node.pivot.set(t.pivotX ?? 0, t.pivotY ?? 0);
  node.scale.set(t.scaleX ?? 1, t.scaleY ?? 1);
  node.angle = t.rotation ?? 0;
}

function merge(inherited: Paint, own: Paint): Paint {
  const out: Paint = { ...inherited };
  for (const [k, v] of Object.entries(own)) {
    if (v !== undefined) (out as Record<string, unknown>)[k] = v;
  }
  return out;
}

function drawPrimitive(g: Graphics, shape: PrimitiveShape, inherited: Paint) {
  const p = merge(inherited, shape);
  g.beginPath();
  switch (shape.kind) {
    case "path":
      g.path(toPath(shape.d));
      break;
    case "circle":
      g.circle(shape.cx, shape.cy, shape.r);
      break;
    case "ellipse":
      g.ellipse(shape.cx, shape.cy, shape.rx, shape.ry);
      break;
    case "rect":
      if (shape.r) g.roundRect(shape.x, shape.y, shape.w, shape.h, shape.r);
      else g.rect(shape.x, shape.y, shape.w, shape.h);
      break;
  }
  const alpha = p.alpha ?? 1;
  if (p.fill) g.fill({ color: p.fill, alpha: alpha * (p.fillAlpha ?? 1) });
  if (p.stroke && (p.width ?? 1) > 0) {
    g.stroke({
      color: p.stroke,
      width: p.width ?? 1,
      cap: p.cap ?? "butt",
      join: p.join ?? "miter",
      miterLimit: 4,
      alpha,
    });
  }
}

const metricsCache = new Map<string, number>();
function ascentOf(style: TextStyle): number {
  const font = style._fontString;
  let a = metricsCache.get(font);
  if (a === undefined) {
    a = CanvasTextMetrics.measureFont(font).ascent;
    metricsCache.set(font, a);
  }
  return a;
}

function buildText(shape: TextShape): Container {
  const style = new TextStyle({
    fontFamily: FONT_FAMILY,
    fontWeight: "800",
    fontSize: shape.size,
    fill: shape.color,
    letterSpacing: shape.letterSpacing ?? 0,
  });
  const t = new Text({ text: shape.text, style, resolution: TEXT_RESOLUTION });
  t.anchor.x = shape.anchor === "middle" ? 0.5 : 0;
  t.position.set(shape.x, shape.y - ascentOf(style));
  if (!shape.transform) return t;
  const wrap = new Container();
  applyTransform(wrap, shape.transform);
  wrap.addChild(t);
  return wrap;
}

function buildGroup(shape: GroupShape, inherited: Paint): Container {
  const node = new Container();
  if (shape.label) node.label = shape.label;
  applyTransform(node, shape.transform);
  if (shape.alpha !== undefined) node.alpha = shape.alpha;
  const style = shape.style ? merge(inherited, shape.style) : inherited;

  // Consecutive primitives share one Graphics: fewer display objects, same z-order
  let run: Graphics | null = null;
  const add = (child: ContainerChild) => {
    run = null;
    node.addChild(child);
  };
  for (const child of shape.children) {
    if (child.kind === "group") add(buildGroup(child, style));
    else if (child.kind === "text") add(buildText(child));
    else {
      if (!run) {
        run = new Graphics();
        node.addChild(run);
      }
      drawPrimitive(run, child, style);
    }
  }

  if (shape.clip) {
    const mask = new Graphics().path(toPath(shape.clip)).fill(0xffffff);
    node.addChild(mask);
    node.mask = mask;
  }
  return node;
}

/** Turn an art tree into a Pixi display tree */
export function buildArt(shape: Shape): Container {
  if (shape.kind === "group") return buildGroup(shape, {});
  if (shape.kind === "text") return buildText(shape);
  const g = new Graphics();
  drawPrimitive(g, shape, {});
  return g;
}
