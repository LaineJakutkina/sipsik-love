import { t, type MessageKey } from "./i18n";

/** A read-only list of texts translated on every read, so it follows the current language */
export function translatedList(keys: readonly MessageKey[]): readonly string[] {
  const list: string[] = [];
  keys.forEach((key, i) => Object.defineProperty(list, i, { get: () => t(key), enumerable: true }));
  return Object.freeze(list);
}
