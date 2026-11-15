import { t } from "./i18n";

export type ItemSlot = "head" | "paw" | "neck" | "body" | "eyes" | "mouth" | "bag" | "pet" | "ride";

export const ITEM_IDS = [
  "panama",
  "seeds",
  "coffee",
  "chain",
  "bandana",
  "cap",
  "lemonade",
  "stripes",
  "glasses",
  "cig",
  "tracksuit",
  "mic",
  "bag",
  "ushanka",
  "hawaii",
  "helmet",
  "tablet",
  "mouse",
  "skate",
  "puffer",
  "bike",
  "truck",
  "suit",
  "kitten",
] as const;
export type ItemId = (typeof ITEM_IDS)[number];

export interface Item {
  id: ItemId;
  name: string;
  /** Total taps needed to unlock */
  at: number;
  /** Only one item per slot can be worn */
  slot: ItemSlot;
}

const item = (id: ItemId, at: number, slot: ItemSlot): Item => ({
  id,
  get name() {
    return t(`domain.items.names.${id}`);
  },
  at,
  slot,
});

/** Ladder from ordinary to the coolest. */
export const ITEMS: readonly Item[] = [
  item("panama", 20, "head"),
  item("seeds", 50, "paw"),
  item("coffee", 100, "paw"),
  item("chain", 200, "neck"),
  item("bandana", 300, "head"),
  item("cap", 500, "head"),
  item("lemonade", 800, "paw"),
  item("stripes", 1200, "body"),
  item("glasses", 1600, "eyes"),
  item("cig", 2000, "mouth"),
  item("tracksuit", 2600, "body"),
  item("mic", 3200, "paw"),
  item("bag", 4000, "bag"),
  item("ushanka", 5000, "head"),
  item("hawaii", 6000, "body"),
  item("helmet", 7000, "head"),
  item("tablet", 8400, "paw"),
  item("mouse", 10000, "pet"),
  item("skate", 12000, "ride"),
  item("puffer", 14000, "body"),
  item("bike", 16000, "ride"),
  item("truck", 20000, "ride"),
  item("suit", 25000, "body"),
  item("kitten", 30000, "pet"),
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i])) as Record<ItemId, Item>;

export const isItemId = (v: string): v is ItemId => v in ITEM_BY_ID;

export type Worn = Partial<Record<string, boolean>>;

/** Items worn in a slot that are actually earned (thresholds may have grown since) */
export function wornIn(worn: Worn, slot: ItemSlot, clicks = Infinity): ItemId[] {
  return ITEMS.filter((i) => i.slot === slot && worn[i.id] && clicks >= i.at).map((i) => i.id);
}

/** Toggle an item, taking off everything else in the same slot when putting it on */
export function applyWear(worn: Worn, id: ItemId, on: boolean): void {
  const slot = ITEM_BY_ID[id].slot;
  if (on) for (const x of ITEMS) if (x.slot === slot) worn[x.id] = false;
  worn[id] = on;
}

export interface ItemProgress {
  next: Item | undefined;
  /** 0..100 towards the next item */
  percent: number;
  left: number;
}

export function itemProgress(clicks: number): ItemProgress {
  const next = ITEMS.find((i) => clicks < i.at);
  const prev = ITEMS.findLast((i) => clicks >= i.at);
  const base = prev?.at ?? 0;
  return {
    next,
    percent: next ? Math.min(100, ((clicks - base) / (next.at - base)) * 100) : 100,
    left: next ? next.at - clicks : 0,
  };
}

/** Unlocked items plus a peek at the next two locked ones (or everything) */
export function visibleItems(clicks: number, all: boolean): Item[] {
  if (all) return [...ITEMS];
  const firstLocked = ITEMS.findIndex((x) => clicks < x.at);
  return ITEMS.filter((it, i) => clicks >= it.at || firstLocked + 2 >= i);
}
