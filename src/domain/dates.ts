import type { DateStr } from "./types";
import { capitalize, formatLocale } from "./i18n";

const DAY_MS = 864e5;
const pad = (n: number) => String(n).padStart(2, "0");

export const ymd = (d: Date): DateStr =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const today = (): DateStr => ymd(new Date());

/** Parse `YYYY-MM-DD` as a local date */
export function parseDate(s: DateStr): Date {
  const [y = 1970, m = 1, d = 1] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(s: DateStr, n: number): DateStr {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return ymd(d);
}

/** Whole days from `a` to `b` */
export const daysBetween = (a: DateStr, b: DateStr): number =>
  Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / DAY_MS);

/* ---------- locale-aware formatting (follows the UI language) ---------- */

const formatters = new Map<string, Intl.DateTimeFormat>();
function dateFormat(name: string, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
  const locale = formatLocale();
  const key = `${locale}|${name}`;
  let f = formatters.get(key);
  if (!f) {
    f = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, f);
  }
  return f;
}

/** «15 ноября 2026 г.» / «November 15, 2026» */
export const formatDate = (s: DateStr): string =>
  dateFormat("date", { day: "numeric", month: "long", year: "numeric" }).format(parseDate(s));

/** «15 ноября» / «November 15» */
export const formatShort = (s: DateStr): string =>
  dateFormat("short", { day: "numeric", month: "long" }).format(parseDate(s));

/** «15 нояб.» / «Nov 15» */
export const formatCompact = (s: DateStr): string =>
  dateFormat("compact", { day: "numeric", month: "short" }).format(parseDate(s));

/** «нояб.» / «Nov» */
export const formatMonthShort = (s: DateStr): string =>
  dateFormat("monthShort", { month: "short" }).format(parseDate(s));

/** «Воскресенье, 15 ноября» / «Sunday, November 15» */
export const formatWeekdayDate = (s: DateStr): string =>
  capitalize(
    dateFormat("weekdayDate", { weekday: "long", day: "numeric", month: "long" }).format(
      parseDate(s),
    ),
  );

/** `YYYY-MM` → «Ноябрь 2026 г.» / «November 2026» */
export const formatMonthYear = (ym: string): string =>
  capitalize(
    dateFormat("monthYear", { month: "long", year: "numeric" }).format(parseDate(`${ym}-01`)),
  );

/** ISO timestamp → «15 ноября, 18:30» / «November 15, 6:30 PM» */
export const formatDateTime = (iso: string): string =>
  dateFormat("dateTime", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

/** Time of day stored as `HH:MM` → «18:30» / «6:30 PM» */
export function formatTime(hm: string): string {
  const [h = 0, m = 0] = hm.split(":").map(Number);
  return dateFormat("time", { hour: "numeric", minute: "2-digit" }).format(
    new Date(1970, 0, 1, h, m),
  );
}

/** «сегодня», «завтра», «через 5 дней» / «today», «tomorrow», «in 5 days» */
export const inDays = (d: DateStr): string =>
  new Intl.RelativeTimeFormat(formatLocale(), { numeric: "auto" }).format(
    daysBetween(today(), d),
    "day",
  );

/** «Сегодня», «Вчера» or a short date — for feed day headers */
export function dayHeading(d: DateStr): string {
  const k = daysBetween(today(), d);
  if (k === 0 || k === -1)
    return capitalize(
      new Intl.RelativeTimeFormat(formatLocale(), { numeric: "auto" }).format(k, "day"),
    );
  return formatShort(d);
}

/** First day of the week in the UI locale: 1 = Monday … 7 = Sunday */
export function firstDayOfWeek(): number {
  try {
    const locale = new Intl.Locale(formatLocale());
    return (locale.getWeekInfo?.() ?? locale.weekInfo)?.firstDay ?? 1;
  } catch {
    return 1;
  }
}

/** Short weekday names starting from the locale's first day: «пн вт…» / «Sun Mon…» */
export function weekdaysShort(firstDay = firstDayOfWeek()): string[] {
  const f = dateFormat("weekdayShort", { weekday: "short" });
  // 1 January 2024 was a Monday
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(2024, 0, firstDay + i)));
}

/* ---------- calendar maths ---------- */

/** Next occurrence (this year or next) of a yearly date such as a birthday */
export function nextOccurrence(full: DateStr): DateStr {
  const t = today();
  const y = parseDate(t).getFullYear();
  const md = full.slice(5);
  const c = `${y}-${md}`;
  return c < t ? `${y + 1}-${md}` : c;
}

export const sameMonthDay = (a: DateStr, b: DateStr) => a.slice(5) === b.slice(5);

export const isoToDay = (iso: string): DateStr => ymd(new Date(iso));

export const isWithinLastWeek = (iso: string) => Date.parse(iso) > Date.now() - 7 * DAY_MS;

export const addWeekTo = (iso: string): DateStr =>
  ymd(new Date(new Date(iso).getTime() + 7 * DAY_MS));

/** `YYYY-MM` shifted by `delta` months */
export function shiftMonth(ym: string, delta: number): string {
  const [y = 1970, m = 1] = ym.split("-").map(Number);
  return ymd(new Date(y, m - 1 + delta, 1)).slice(0, 7);
}

/** 6×7 (or 5×7) grid of dates for a `YYYY-MM` month, weeks starting on `firstDay` (1 = Monday … 7 = Sunday) */
export function monthGrid(
  ym: string,
  firstDay = firstDayOfWeek(),
): { date: DateStr; day: number; inMonth: boolean }[] {
  const [y = 1970, m = 1] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const offset = (first.getDay() - (firstDay % 7) + 7) % 7;
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(y, m - 1, 1 - offset + i);
    if (i >= 35 && d.getMonth() !== m - 1) break;
    cells.push({ date: ymd(d), day: d.getDate(), inMonth: d.getMonth() === m - 1 });
  }
  return cells;
}
