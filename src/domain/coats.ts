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
  "beaver",
  "anon",
  "vampire",
  "tuxedo",
  "cream",
  "choco",
  "lavender",
  "joker",
  "carer",
  "scholar",
] as const;
export type CoatId = (typeof COAT_IDS)[number];

export const DEFAULT_COAT: CoatId = "black";

/** What a talking cat says when tapped: jokes, support or facts */
export type TalkKind = "jokes" | "care" | "facts";

/** Local knowledge about a coat (the server sends price/name, we know the art) */
export interface CoatMeta {
  name: string;
  /** Not a cat at all: frog, dog, fox… */
  animal: boolean;
  /** A talking cat: pops up a phrase on the 1st tap and every 50th after */
  talks?: TalkKind;
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
  beaver: { name: "Бобёр", animal: true },
  anon: { name: "Анонимус", animal: true },
  vampire: { name: "Вампир", animal: true },
  tuxedo: { name: "Смокинг", animal: false },
  cream: { name: "Кремовый", animal: false },
  choco: { name: "Шоколадный", animal: false },
  lavender: { name: "Лавандовый", animal: false },
  joker: { name: "Кот-анекдот", animal: false, talks: "jokes" },
  carer: { name: "Кот-поддержка", animal: false, talks: "care" },
  scholar: { name: "Кот-учёный", animal: false, talks: "facts" },
};

export const isCoatId = (v: unknown): v is CoatId => COAT_IDS.includes(v as CoatId);

export const coatOrDefault = (v: unknown): CoatId => (isCoatId(v) ? v : DEFAULT_COAT);

export interface CoatOffer {
  id: string;
  name: string;
  price: number;
  kind?: "cat" | "animal";
}

/** The talking cats are sold as their own group */
export const talkOf = (id: unknown): TalkKind | undefined =>
  isCoatId(id) ? COAT_META[id].talks : undefined;

export const isTalkingOffer = (c: CoatOffer): boolean => !!talkOf(c.id);

export const isAnimalOffer = (c: CoatOffer): boolean =>
  !isTalkingOffer(c) && (c.kind ? c.kind === "animal" : isCoatId(c.id) && COAT_META[c.id].animal);
