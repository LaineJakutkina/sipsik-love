import { addDays, daysBetween, nextOccurrence, parseDate, today, ymd } from "./dates";
import type { DateStr, Id, ImportantDate } from "./types";
import { plural, YEAR_FORMS } from "@/shared/lib/plural";

export interface Anniversary {
  /** Ordinal of the coming (or today's) anniversary */
  years: number;
  date: DateStr;
  inDays: number;
}

export function nextAnniversary(start: DateStr, t: DateStr = today()): Anniversary {
  const st = parseDate(start);
  let years = parseDate(t).getFullYear() - st.getFullYear();
  const at = (n: number) => ymd(new Date(st.getFullYear() + n, st.getMonth(), st.getDate()));
  let date = at(years);
  if (date < t) date = at(++years);
  return { years, date, inDays: daysBetween(t, date) };
}

export interface DateEntry {
  /** Absent for automatic milestones */
  id?: Id;
  icon: string;
  title: string;
  next: DateStr;
  past: boolean;
}

/** Automatic milestones (every 100 days, anniversaries) plus the couple's own dates */
export function importantDates(start: DateStr, dates: ImportantDate[], t = today()): DateEntry[] {
  const items: DateEntry[] = [];
  const together = daysBetween(start, t);
  const next100 = (Math.floor(together / 100) + 1) * 100;
  items.push({
    icon: "💯",
    title: `${next100} дней вместе`,
    next: addDays(start, next100),
    past: false,
  });

  const y = parseDate(t).getFullYear();
  let years = y - parseDate(start).getFullYear();
  let ann = y + start.slice(4);
  if (ann < t) {
    ann = y + 1 + start.slice(4);
    years++;
  }
  if (years > 0) items.push({ icon: "🎉", title: `${years}-я годовщина`, next: ann, past: false });

  for (const x of dates) {
    const next = x.yearly ? nextOccurrence(x.day) : x.day;
    const n = x.yearly ? Number(next.slice(0, 4)) - Number(x.day.slice(0, 4)) : 0;
    items.push({
      id: x.id,
      icon: "💗",
      title: x.title + (x.yearly && n > 0 ? ` · ${n} ${plural(n, YEAR_FORMS)}` : ""),
      next,
      past: !x.yearly && x.day < t,
    });
  }
  return items.sort((a, b) => Number(a.past) - Number(b.past) || a.next.localeCompare(b.next));
}

export const isImportantOn = (x: ImportantDate, day: DateStr) =>
  x.yearly ? x.day.slice(5) === day.slice(5) && x.day <= day : x.day === day;
