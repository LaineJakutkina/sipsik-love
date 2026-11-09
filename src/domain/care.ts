/** Support signals («нужна поддержка») and the careful-talk helper (NVC) */

export interface SosKind {
  id: string;
  emoji: string;
  text: string;
  /** Feminine wording, when it differs */
  textF?: string;
}

export const SOS_KINDS: readonly SosKind[] = [
  { id: "hug", emoji: "🫂", text: "Обними без лишних вопросов" },
  { id: "listen", emoji: "👂", text: "Выслушай меня" },
  {
    id: "space",
    emoji: "🌙",
    text: "Мне нужно немного побыть одному",
    textF: "Мне нужно немного побыть одной",
  },
  { id: "calm", emoji: "🕊", text: "Мы поссорились, давай остынем и помиримся" },
  { id: "care", emoji: "🍵", text: "Позаботься обо мне" },
];

export const FEELINGS = [
  "обиду",
  "тревогу",
  "грусть",
  "усталость",
  "раздражение",
  "одиночество",
  "растерянность",
  "разочарование",
  "ревность",
  "бессилие",
] as const;

export const NEEDS = [
  "внимание",
  "поддержка",
  "уважение",
  "предсказуемость",
  "отдых",
  "близость",
  "честность",
  "помощь",
  "свобода",
  "забота",
] as const;

/** Generalisations that turn a request into blame */
export const BLAME = /(всегда|никогда|опять|вечно|специально|как обычно|постоянно)/i;

export interface TalkDraft {
  fact: string;
  feelings: readonly string[];
  needs: readonly string[];
  ask: string;
}

const lowerFirst = (s: string) => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);
const joinRu = (a: readonly string[]) =>
  a.length > 1 ? `${a.slice(0, -1).join(", ")} и ${a.at(-1)}` : (a[0] ?? "");
const trimEnd = (s: string) => s.trim().replace(/[.!]+$/, "");

/** Assemble the four NVC steps into one message */
export function buildTalkMessage(d: TalkDraft): string {
  const fact = trimEnd(d.fact);
  const ask = trimEnd(d.ask);
  const parts: string[] = [];
  if (fact) {
    parts.push(
      `Когда ${lowerFirst(fact)}${d.feelings.length ? `, я чувствую ${joinRu(d.feelings)}` : ""}.`,
    );
  } else if (d.feelings.length) parts.push(`Я чувствую ${joinRu(d.feelings)}.`);
  if (d.needs.length) parts.push(`Для меня важно: ${joinRu(d.needs)}.`);
  if (ask) parts.push(`Моя просьба: ${lowerFirst(ask)}.`);
  return parts.join(" ");
}

export const THANKS_CHIPS_COUPLE = [
  "что был рядом",
  "за вкусный ужин",
  "что помог по дому",
  "за поддержку",
  "что рассмешил",
] as const;

export const THANKS_CHIPS_SOLO = [
  "вкусный завтрак",
  "солнце",
  "встречу с другом",
  "отдых",
  "маленькую победу",
] as const;
