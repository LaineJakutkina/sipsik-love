import type source from "@/__localization__/source_lang.json";

/**
 * Translation port of the app. Pure TS: the vue-i18n instance plugs itself in with
 * `setLocalizer` (see `shared/locale`), so domain, stores and components all share one
 * typed `t`. Keys are checked against `source_lang.json` at type-check time.
 */

type Paths<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Paths<T[K], `${P}${K}.`>;
}[keyof T & string];

export type MessageKey = Paths<typeof source>;

/** Prefixes `p` with `p.m`, `p.f` and `p.n` keys: wording for a masculine, feminine or unknown gender */
export type GenderedKey = {
  [K in MessageKey]: K extends `${infer P}.m`
    ? `${P}.f` extends MessageKey
      ? `${P}.n` extends MessageKey
        ? P
        : never
      : never
    : never;
}[MessageKey];

export type MessageParams = Record<string, string | number>;

export interface Localizer {
  t(key: string, params?: MessageParams): string;
  tn(key: string, count: number, params?: MessageParams): string;
  /** BCP 47 tag of the language the texts are shown in */
  locale(): string;
}

let localizer: Localizer = {
  t: (key) => key,
  tn: (key) => key,
  locale: () => "ru-RU",
};

export function setLocalizer(next: Localizer) {
  localizer = next;
}

export const t = (key: MessageKey, params?: MessageParams): string => localizer.t(key, params);

/** Wording by grammatical gender: `key.m`, `key.f`, or `key.n` when the gender is unknown */
export const tg = (key: GenderedKey, gender: string | null | undefined, params?: MessageParams) =>
  localizer.t(`${key}.${gender === "m" || gender === "f" ? gender : "n"}`, params);

/**
 * Plural message: forms are separated by `|` in the order of CLDR categories the
 * language has (zero, one, two, few, many, other), e.g. «{n} день | {n} дня | {n} дней».
 * `{n}` is the formatted count.
 */
export const tn = (key: MessageKey, count: number, params?: MessageParams): string =>
  localizer.tn(key, count, params);

/** Locale for `Intl` formatting; reactive inside Vue renders and computeds */
export const formatLocale = (): string => localizer.locale();

export const formatNumber = (n: number): string => n.toLocaleString(formatLocale());

/** «a, b и c» / «a, b, and c» */
export const formatList = (items: readonly string[]): string =>
  new Intl.ListFormat(formatLocale(), { type: "conjunction" }).format(items);

/** Upper-case the first letter, as for a title or a sentence start */
export const capitalize = (s: string): string =>
  s ? s.charAt(0).toLocaleUpperCase(formatLocale()) + s.slice(1) : s;
