import { t } from "./i18n";

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

const coat = (id: CoatId, animal: boolean, talks?: TalkKind): CoatMeta => ({
  get name() {
    return t(`domain.coats.names.${id}`);
  },
  animal,
  talks,
});

export const COAT_META: Record<CoatId, CoatMeta> = {
  black: coat("black", false),
  ginger: coat("ginger", false),
  grey: coat("grey", false),
  calico: coat("calico", false),
  siamese: coat("siamese", false),
  frog: coat("frog", true),
  dog: coat("dog", true),
  fox: coat("fox", true),
  panda: coat("panda", true),
  cow: coat("cow", true),
  penguin: coat("penguin", true),
  beaver: coat("beaver", true),
  anon: coat("anon", true),
  vampire: coat("vampire", true),
  tuxedo: coat("tuxedo", false),
  cream: coat("cream", false),
  choco: coat("choco", false),
  lavender: coat("lavender", false),
  joker: coat("joker", false, "jokes"),
  carer: coat("carer", false, "care"),
  scholar: coat("scholar", false, "facts"),
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
