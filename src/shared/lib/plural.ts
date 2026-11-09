export type PluralForms = readonly [one: string, few: string, many: string];

/** Russian plural form: 1 день, 2 дня, 5 дней */
export function plural(n: number, [one, few, many]: PluralForms): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last > 1 && last < 5) return few;
  if (last === 1) return one;
  return many;
}

export const DAY_FORMS: PluralForms = ["день", "дня", "дней"];
export const YEAR_FORMS: PluralForms = ["год", "года", "лет"];
export const TAP_FORMS: PluralForms = ["тап", "тапа", "тапов"];

export const formatNumber = (n: number) => n.toLocaleString("ru-RU");
