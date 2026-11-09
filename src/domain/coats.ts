export const COAT_IDS = [
  "black",
  "ginger",
  "grey",
  "calico",
  "siamese",
  "frog",
  "dog",
  "fox",
  "panda",
  "cow",
  "penguin",
  "tuxedo",
] as const;
export type CoatId = (typeof COAT_IDS)[number];

export const DEFAULT_COAT: CoatId = "black";

/** Local knowledge about a coat (the server sends price/name, we know the art) */
export interface CoatMeta {
  name: string;
  /** Not a cat at all: frog, dog, fox… */
  animal: boolean;
}

export const COAT_META: Record<CoatId, CoatMeta> = {
  black: { name: "Чёрный", animal: false },
  ginger: { name: "Рыжий", animal: false },
  grey: { name: "Серый", animal: false },
  calico: { name: "Трёхцветный", animal: false },
  siamese: { name: "Сиамский", animal: false },
  frog: { name: "Жаба", animal: true },
  dog: { name: "Собака", animal: true },
  fox: { name: "Лиса", animal: true },
  panda: { name: "Панда", animal: true },
  cow: { name: "Коровка", animal: true },
  penguin: { name: "Пингвин", animal: true },
  tuxedo: { name: "Смокинг", animal: false },
};

export const isCoatId = (v: unknown): v is CoatId => COAT_IDS.includes(v as CoatId);

export const coatOrDefault = (v: unknown): CoatId => (isCoatId(v) ? v : DEFAULT_COAT);

export interface CoatOffer {
  id: string;
  name: string;
  price: number;
  kind?: "cat" | "animal";
}

export const isAnimalOffer = (c: CoatOffer): boolean =>
  c.kind ? c.kind === "animal" : isCoatId(c.id) && COAT_META[c.id].animal;
