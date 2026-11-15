import type { TalkKind } from "./coats";
import { t } from "./i18n";
import { translatedList } from "./translatedList";

/** A talking cat speaks on the 1st tap and then on every 50th: 1, 50, 100, 150… */
export const TALK_EVERY = 50;

export const shouldTalk = (tapNumber: number): boolean =>
  tapNumber === 1 || (tapNumber > 0 && tapNumber % TALK_EVERY === 0);

export const TALK_TITLE: Record<TalkKind, string> = {
  get jokes() {
    return t("domain.catPhrases.title.jokes");
  },
  get care() {
    return t("domain.catPhrases.title.care");
  },
  get facts() {
    return t("domain.catPhrases.title.facts");
  },
};

export const TALK_ICON: Record<TalkKind, string> = {
  jokes: "😹",
  care: "🫂",
  facts: "🔬",
};

/** What each talking cat does, for the shop */
export const TALK_ABOUT: Record<TalkKind, string> = {
  get jokes() {
    return t("domain.catPhrases.about.jokes");
  },
  get care() {
    return t("domain.catPhrases.about.care");
  },
  get facts() {
    return t("domain.catPhrases.about.facts");
  },
};

/** Each talking cat knows 25 phrases: keys `j01`…`j25`, `c01`…, `f01`… */
const NUMS = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
  "25",
] as const;

export const PHRASES: Record<TalkKind, readonly string[]> = {
  jokes: translatedList(NUMS.map((n) => `domain.catPhrases.jokes.j${n}` as const)),
  care: translatedList(NUMS.map((n) => `domain.catPhrases.care.c${n}` as const)),
  facts: translatedList(NUMS.map((n) => `domain.catPhrases.facts.f${n}` as const)),
};

/** A random phrase that isn't the one just shown */
export function pickPhrase(kind: TalkKind, last: string | null, random = Math.random): string {
  const list = PHRASES[kind];
  const pool = list.length > 1 ? list.filter((p) => p !== last) : list;
  return pool[Math.floor(random() * pool.length)] ?? list[0] ?? "";
}
