import { createI18n, type I18nOptions } from "vue-i18n";
import { formatNumber, setLocalizer } from "@/domain/i18n";
import {
  fallbackChain,
  KNOWN_LOCALES,
  localeInfo,
  SOURCE_LOCALE,
  SOURCE_MESSAGES,
  tagOf,
} from "./locales";

const PLURAL_ORDER: readonly Intl.LDMLPluralRule[] = ["zero", "one", "two", "few", "many", "other"];

/**
 * Plural forms in a message go in CLDR order of the categories the language has:
 * ru «день | дня | дней» (one, few, many), en «day | days» (one, other).
 * Missing trailing forms reuse the last one.
 */
function pluralRule(tag: string) {
  const rules = new Intl.PluralRules(tag);
  const categories = rules.resolvedOptions().pluralCategories;
  const order = PLURAL_ORDER.filter((c) => categories.includes(c));
  return (choice: number, choicesLength: number) =>
    Math.max(0, Math.min(order.indexOf(rules.select(Math.abs(choice))), choicesLength - 1));
}

const options: I18nOptions & { legacy: false; locale: string } = {
  legacy: false,
  locale: SOURCE_LOCALE,
  fallbackLocale: [SOURCE_LOCALE],
  messages: { [SOURCE_LOCALE]: SOURCE_MESSAGES },
  pluralRules: Object.fromEntries(KNOWN_LOCALES.map((l) => [l.id, pluralRule(l.tag)])),
  // Partial translations are expected: fall back silently. Keys are type-checked against the source.
  missingWarn: false,
  fallbackWarn: false,
};

export const i18n = createI18n<false, typeof options>(options);

const composer = i18n.global;

setLocalizer({
  t: (key, params) => composer.t(key, params ?? {}),
  tn: (key, count, params) => composer.t(key, { n: formatNumber(count), ...params }, count),
  locale: () => tagOf(composer.locale.value),
});

const loaded = new Set<string>([SOURCE_LOCALE]);

async function ensureLoaded(id: string): Promise<boolean> {
  if (loaded.has(id)) return true;
  const info = localeInfo(id);
  if (!info) return false;
  try {
    composer.setLocaleMessage(id, await info.load());
    loaded.add(id);
    return true;
  } catch {
    return false;
  }
}

/** Show the UI in `id`, loading its file and the fallback ones first */
export async function applyLocale(id: string): Promise<void> {
  const chain = fallbackChain(id);
  const [ok, ...fallbacks] = await Promise.all([id, ...chain].map(ensureLoaded));
  const usable = chain.filter((_, i) => fallbacks[i]);
  const shown = ok ? id : (usable[0] ?? SOURCE_LOCALE);
  composer.fallbackLocale.value = usable.filter((x) => x !== shown);
  composer.locale.value = shown;
  document.documentElement.lang = tagOf(shown);
}
