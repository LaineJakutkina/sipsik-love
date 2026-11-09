import type { DateStr } from "./types";
import { plural, DAY_FORMS } from "@/shared/lib/plural";

export const MONTHS_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
] as const;

export const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
] as const;

export const WEEKDAYS = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
] as const;

export const WEEKDAYS_SHORT = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"] as const;

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

export function formatDate(s: DateStr): string {
  const d = parseDate(s);
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatShort(s: DateStr): string {
  const d = parseDate(s);
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Next occurrence (this year or next) of a yearly date such as a birthday */
export function nextOccurrence(full: DateStr): DateStr {
  const t = today();
  const y = parseDate(t).getFullYear();
  const md = full.slice(5);
  const c = `${y}-${md}`;
  return c < t ? `${y + 1}-${md}` : c;
}

export function inDays(d: DateStr): string {
  const k = daysBetween(today(), d);
  if (k === 0) return "сегодня";
  if (k === 1) return "завтра";
  return `через ${k} ${plural(k, DAY_FORMS)}`;
}

export const sameMonthDay = (a: DateStr, b: DateStr) => a.slice(5) === b.slice(5);

export const isoToDay = (iso: string): DateStr => ymd(new Date(iso));

/** «Сегодня», «Вчера» or a short date — for feed day headers */
export function dayHeading(d: DateStr): string {
  const k = daysBetween(d, today());
  return k === 0 ? "Сегодня" : k === 1 ? "Вчера" : formatShort(d);
}

export const isWithinLastWeek = (iso: string) => Date.parse(iso) > Date.now() - 7 * DAY_MS;

export const addWeekTo = (iso: string): DateStr =>
  ymd(new Date(new Date(iso).getTime() + 7 * DAY_MS));

/** `YYYY-MM` shifted by `delta` months */
export function shiftMonth(ym: string, delta: number): string {
  const [y = 1970, m = 1] = ym.split("-").map(Number);
  return ymd(new Date(y, m - 1 + delta, 1)).slice(0, 7);
}

/** Monday-first 6×7 (or 5×7) grid of dates for a `YYYY-MM` month */
export function monthGrid(ym: string): { date: DateStr; day: number; inMonth: boolean }[] {
  const [y = 1970, m = 1] = ym.split("-").map(Number);
  const first = new Date(y, m - 1, 1);
  const offset = (first.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(y, m - 1, 1 - offset + i);
    if (i >= 35 && d.getMonth() !== m - 1) break;
    cells.push({ date: ymd(d), day: d.getDate(), inMonth: d.getMonth() === m - 1 });
  }
  return cells;
}
