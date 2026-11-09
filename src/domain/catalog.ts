export const QUICK_SHOPPING = ["Хлеб", "Яйца", "Молоко", "Сахар", "Кофе", "Корм Сипсику"] as const;

export const CHORE_FREQUENCIES = [
  "Каждый день",
  "2 раза в неделю",
  "Раз в неделю",
  "Раз в месяц",
] as const;

export const DEFAULT_LIMITS = { wish_photos: 5, memories: 7 } as const;

export const DEFAULT_TAP_CAP = 1000;

/** Make a user-entered link openable */
export function safeUrl(u: string): string {
  const s = String(u).trim();
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}
