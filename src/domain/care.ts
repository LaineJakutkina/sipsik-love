import { formatList, formatLocale, t } from "./i18n";
import { translatedList } from "./translatedList";

/** Support signals («нужна поддержка») and the careful-talk helper (NVC) */

export interface SosKind {
  id: string;
  emoji: string;
  text: string;
  /** Feminine wording, when it differs */
  textF?: string;
}

export const SOS_KINDS: readonly SosKind[] = [
  {
    id: "hug",
    emoji: "🫂",
    get text() {
      return t("domain.care.sos.hug");
    },
  },
  {
    id: "listen",
    emoji: "👂",
    get text() {
      return t("domain.care.sos.listen");
    },
  },
  {
    id: "space",
    emoji: "🌙",
    get text() {
      return t("domain.care.sos.space");
    },
    get textF() {
      return t("domain.care.sos.spaceF");
    },
  },
  {
    id: "calm",
    emoji: "🕊",
    get text() {
      return t("domain.care.sos.calm");
    },
  },
  {
    id: "care",
    emoji: "🍵",
    get text() {
      return t("domain.care.sos.care");
    },
  },
];

const FEELING_IDS = [
  "hurt",
  "anxiety",
  "sadness",
  "tiredness",
  "irritation",
  "loneliness",
  "confusion",
  "disappointment",
  "jealousy",
  "helplessness",
] as const;

/** Worded to follow «я чувствую …» */
export const FEELINGS = translatedList(
  FEELING_IDS.map((id) => `domain.care.feelings.${id}` as const),
);

const NEED_IDS = [
  "attention",
  "support",
  "respect",
  "predictability",
  "rest",
  "closeness",
  "honesty",
  "help",
  "freedom",
  "care",
] as const;

export const NEEDS = translatedList(NEED_IDS.map((id) => `domain.care.needs.${id}` as const));

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Generalisations that turn a request into blame */
export const BLAME = {
  test(text: string): boolean {
    const words = t("domain.care.blame")
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    return words.length > 0 && new RegExp(`(${words.map(escapeRegExp).join("|")})`, "i").test(text);
  },
};

export interface TalkDraft {
  fact: string;
  feelings: readonly string[];
  needs: readonly string[];
  ask: string;
}

const lowerFirst = (s: string) =>
  s ? s.charAt(0).toLocaleLowerCase(formatLocale()) + s.slice(1) : s;
const trimEnd = (s: string) => s.trim().replace(/[.!]+$/, "");

/** Assemble the four NVC steps into one message */
export function buildTalkMessage(d: TalkDraft): string {
  const fact = trimEnd(d.fact);
  const ask = trimEnd(d.ask);
  const feelings = formatList(d.feelings);
  const parts: string[] = [];
  if (fact && d.feelings.length)
    parts.push(t("domain.care.talk.factFeelings", { fact: lowerFirst(fact), feelings }));
  else if (fact) parts.push(t("domain.care.talk.fact", { fact: lowerFirst(fact) }));
  else if (d.feelings.length) parts.push(t("domain.care.talk.feelings", { feelings }));
  if (d.needs.length) parts.push(t("domain.care.talk.needs", { needs: formatList(d.needs) }));
  if (ask) parts.push(t("domain.care.talk.ask", { ask: lowerFirst(ask) }));
  return parts.join(" ");
}

const THANKS_COUPLE_IDS = ["nearby", "dinner", "chores", "support", "laugh"] as const;

export const THANKS_CHIPS_COUPLE = translatedList(
  THANKS_COUPLE_IDS.map((id) => `domain.care.thanks.couple.${id}` as const),
);

const THANKS_SOLO_IDS = ["breakfast", "sun", "friend", "rest", "win"] as const;

export const THANKS_CHIPS_SOLO = translatedList(
  THANKS_SOLO_IDS.map((id) => `domain.care.thanks.solo.${id}` as const),
);
