import type { I18nOptions } from "vue-i18n";
import source from "@/__localization__/source_lang.json";
import { capitalize } from "@/domain/i18n";

/**
 * Every `src/__localization__/<lang>_<REGION>.json` (e.g. `en_US.json`, `ru_RU.json`) is a
 * translation of `source_lang.json`, picked up automatically and loaded on demand.
 * `source_lang.json` itself is the Russian source: always bundled, the last fallback.
 */
export type Dictionary = NonNullable<I18nOptions["messages"]>[string];

export const SOURCE_LOCALE = "source";
/** Language `source_lang.json` is written in */
const SOURCE_TAG = "ru-RU";
/** A language without its own file falls back to this one */
const FALLBACK_LANGUAGE = "en";

export interface LocaleInfo {
  /** vue-i18n locale id: BCP 47 tag of the file, or `source` */
  id: string;
  /** Tag for `Intl` formatting */
  tag: string;
  language: string;
  region: string | undefined;
  load: () => Promise<Dictionary>;
}

const files = import.meta.glob<Dictionary>(
  ["@/__localization__/*.json", "!@/__localization__/source_lang.json"],
  { import: "default" },
);

function fromFile(path: string, load: () => Promise<Dictionary>): LocaleInfo | null {
  const name =
    path
      .split("/")
      .pop()
      ?.replace(/\.json$/, "") ?? "";
  try {
    const [tag] = Intl.getCanonicalLocales(name.replaceAll("_", "-"));
    if (!tag) return null;
    const max = new Intl.Locale(tag).maximize();
    return { id: tag, tag, language: max.language, region: max.region, load };
  } catch {
    return null;
  }
}

const translations = Object.entries(files)
  .map(([path, load]) => fromFile(path, load))
  .filter((l): l is LocaleInfo => !!l)
  .sort((a, b) => a.id.localeCompare(b.id));

const sourceLocale = new Intl.Locale(SOURCE_TAG).maximize();
const sourceInfo: LocaleInfo = {
  id: SOURCE_LOCALE,
  tag: SOURCE_TAG,
  language: sourceLocale.language,
  region: sourceLocale.region,
  load: () => Promise.resolve(source),
};

export const SOURCE_MESSAGES: Dictionary = source;

/**
 * Languages to choose from. The source is listed only while its language has no
 * translation file of its own (then that file is the one to show).
 */
export const LOCALES: readonly LocaleInfo[] = translations.some(
  (l) => l.language === sourceInfo.language,
)
  ? translations
  : [...translations, sourceInfo];

/** Every locale messages can come from, the source included */
export const KNOWN_LOCALES: readonly LocaleInfo[] = [...translations, sourceInfo];

export const localeInfo = (id: string): LocaleInfo | undefined =>
  id === SOURCE_LOCALE ? sourceInfo : translations.find((l) => l.id === id);

export const isLocaleId = (id: string): boolean => !!localeInfo(id);

export const tagOf = (id: string): string => localeInfo(id)?.tag ?? SOURCE_TAG;

/** Best locale for a language tag such as Telegram's `en`, `pt-br` or `ru` (the source counts as Russian) */
function match(requested: string): LocaleInfo | undefined {
  let wanted: Intl.Locale;
  try {
    wanted = new Intl.Locale(requested.replaceAll("_", "-")).maximize();
  } catch {
    return undefined;
  }
  const same = LOCALES.filter((l) => l.language === wanted.language);
  const defaultRegion = new Intl.Locale(wanted.language).maximize().region;
  return (
    same.find((l) => l.region === wanted.region) ??
    same.find((l) => l.region === defaultRegion) ??
    same[0]
  );
}

/** Locale to show for a system language: its file, else English, else the source */
export const resolveLocale = (requested: string): string =>
  (match(requested) ?? match(FALLBACK_LANGUAGE))?.id ?? SOURCE_LOCALE;

/** Where missing messages of `id` are looked up: English, then the source */
export function fallbackChain(id: string): string[] {
  const english = match(FALLBACK_LANGUAGE)?.id;
  return [english, SOURCE_LOCALE].filter((x): x is string => !!x && x !== id);
}

/** Name of the language in itself: «English (United States)», «Русский» */
export function languageName(id: string): string {
  const info = localeInfo(id);
  if (!info) return id;
  const twin = LOCALES.some((l) => l.id !== info.id && l.language === info.language);
  const shown = twin ? info.tag : info.language;
  try {
    return capitalize(new Intl.DisplayNames([info.tag], { type: "language" }).of(shown) ?? shown);
  } catch {
    return shown;
  }
}
