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

/** Ladder from ordinary to the coolest. */
export const ITEMS: readonly Item[] = [
  { id: "panama", name: "Панама abibas", at: 20, slot: "head" },
  { id: "seeds", name: "Семечки", at: 50, slot: "paw" },
  { id: "coffee", name: "Кофе с собой", at: 100, slot: "paw" },
  { id: "chain", name: "Золотая цепь", at: 200, slot: "neck" },
  { id: "bandana", name: "Бандана", at: 300, slot: "head" },
  { id: "cap", name: "Кепка назад", at: 500, slot: "head" },
  { id: "lemonade", name: "Лимонад «Буратино»", at: 800, slot: "paw" },
  { id: "stripes", name: "Тельняшка", at: 1200, slot: "body" },
  { id: "glasses", name: "Очки «Матрица»", at: 1600, slot: "eyes" },
  { id: "cig", name: "Сигарета", at: 2000, slot: "mouth" },
  { id: "tracksuit", name: "Спортивка abibas", at: 2600, slot: "body" },
  { id: "mic", name: "Микрофон", at: 3200, slot: "paw" },
  { id: "bag", name: "Барсетка", at: 4000, slot: "bag" },
  { id: "ushanka", name: "Ушанка", at: 5000, slot: "head" },
  { id: "hawaii", name: "Гавайская рубашка", at: 6000, slot: "body" },
  { id: "helmet", name: "Строительная каска", at: 7000, slot: "head" },
  { id: "tablet", name: "Планшет", at: 8400, slot: "paw" },
  { id: "mouse", name: "Мышь", at: 10000, slot: "pet" },
  { id: "skate", name: "Скейтборд", at: 12000, slot: "ride" },
  { id: "puffer", name: "Пуховик-дутик", at: 14000, slot: "body" },
  { id: "bike", name: "Велосипед «Урал»", at: 16000, slot: "ride" },
  { id: "truck", name: "Фура", at: 20000, slot: "ride" },
  { id: "suit", name: "Костюм с бабочкой", at: 25000, slot: "body" },
  { id: "kitten", name: "Котёнок для Сипсика", at: 30000, slot: "pet" },
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
