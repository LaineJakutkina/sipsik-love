import { t } from "./i18n";
import { translatedList } from "./translatedList";

const QUICK_SHOPPING_IDS = ["bread", "eggs", "milk", "sugar", "coffee", "catFood"] as const;

export const QUICK_SHOPPING = translatedList(
  QUICK_SHOPPING_IDS.map((id) => `domain.catalog.quickShopping.${id}` as const),
);

/** Stored on the server as these exact strings; show them with `choreFrequencyLabel` */
export const CHORE_FREQUENCIES = [
  "Каждый день",
  "2 раза в неделю",
  "Раз в неделю",
  "Раз в месяц",
] as const;

const CHORE_FREQUENCY_IDS = ["daily", "twiceWeekly", "weekly", "monthly"] as const;

/** A stored chore frequency in the current language; unknown values are shown as is */
export function choreFrequencyLabel(value: string): string {
  const i = CHORE_FREQUENCIES.findIndex((f) => f === value);
  const id = CHORE_FREQUENCY_IDS[i];
  return id ? t(`domain.catalog.choreFrequency.${id}`) : value;
}

export const DEFAULT_LIMITS = { wish_photos: 5, memories: 7 } as const;

export const DEFAULT_TAP_CAP = 1000;

/** Make a user-entered link openable */
export function safeUrl(u: string): string {
  const s = String(u).trim();
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}
