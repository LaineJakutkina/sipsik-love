import { addDays, today } from "@/domain/dates";
import type { Worn } from "@/domain/items";
import type { Gender, MoodId } from "@/domain/moods";
import type { DateStr, SpaceMode } from "@/domain/types";

/** The two demo people: «a» is Аня, «b» is Максим */
export type U = "a" | "b";

export interface DemoUser {
  name: string;
  gender: Gender | null;
  notify: boolean;
  inCouple: boolean;
}

export interface DemoCouple {
  start_date: DateStr;
  pet_name: string;
  clicks: number;
  worn: Worn;
  coat: string;
  owned: string[];
  mode: SpaceMode | "solo";
  invite_code: string | null;
  rev: number;
  streak: number;
  streak_last: DateStr | null;
}

interface Photo {
  photo: string | null;
  thumb: string | null;
}

/** Everything the demo server keeps; rows mirror the real database tables */
export interface World {
  users: Record<U, DemoUser>;
  couple: DemoCouple | null;
  /** `${user}|${day}` → taps that day */
  taps: Record<string, number>;
  visits: Record<string, true>;
  moods: Record<string, MoodId>;
  answers: Record<string, string>;
  taskDone: { day: DateStr; idx: number; user: U }[];
  notes: { id: string; from: U; body: string; deliver_at: number; created_at: string }[];
  wishes: ({
    id: string;
    owner: U;
    title: string;
    price: string | null;
    link: string | null;
    note: string | null;
    done: boolean;
    reserved_by: U | null;
  } & Photo)[];
  shop: { id: string; title: string; done: boolean }[];
  chores: { id: string; title: string; assignee: U; freq: string | null; done_on: DateStr | null }[];
  plans: { id: string; day: DateStr; time: string | null; title: string }[];
  birthdays: { id: string; name: string; bdate: DateStr }[];
  places: { id: string; title: string }[];
  dates: { id: string; title: string; day: DateStr; yearly: boolean }[];
  memories: ({ id: string; user: U; day: DateStr; body: string } & Photo)[];
  thanks: { id: string; from: U; body: string; hearted: boolean; created_at: string }[];
  sos: { id: string; from: U; kind: string; body: string | null; reply: string | null; resolved: boolean }[];
  talks: { id: string; from: U; body: string; reply: string | null; closed: boolean }[];
}

const people = (inCouple: boolean): Record<U, DemoUser> => ({
  a: { name: "Аня", gender: "f", notify: true, inCouple },
  b: { name: "Максим", gender: "m", notify: true, inCouple },
});

/** Nobody has a couple yet: try onboarding, then invite the other tab */
export function blankWorld(): World {
  return {
    users: people(false),
    couple: null,
    taps: {},
    visits: {},
    moods: {},
    answers: {},
    taskDone: [],
    notes: [],
    wishes: [],
    shop: [],
    chores: [],
    plans: [],
    birthdays: [],
    places: [],
    dates: [],
    memories: [],
    thanks: [],
    sos: [],
    talks: [],
  };
}

/** A couple that has been together for a while, with a bit of everything */
export function readyWorld(): World {
  const d = today();
  const bday = (inDays: number, year: number) => `${year}-${addDays(d, inDays).slice(5)}`;
  const ago = (min: number) => new Date(Date.now() - min * 60_000).toISOString();
  return {
    ...blankWorld(),
    users: people(true),
    couple: {
      start_date: addDays(d, -412),
      pet_name: "Сипсик",
      clicks: 520,
      worn: { cap: true, chain: true, coffee: true },
      coat: "ginger",
      owned: ["black", "ginger", "fox"],
      mode: "pair",
      invite_code: null,
      rev: 1,
      streak: 6,
      streak_last: addDays(d, -1),
    },
    moods: { [`b|${d}`]: "happy" },
    notes: [
      { id: "n1", from: "b", body: "Ты сегодня самая красивая 💜", deliver_at: Date.now() - 3_600_000, created_at: ago(600) },
    ],
    wishes: [
      { id: "w1", owner: "a", title: "Плед с рукавами", price: "35 €", link: null, note: "Сиреневый!", done: false, reserved_by: null, photo: null, thumb: null },
      { id: "w2", owner: "a", title: "Билеты на концерт", price: "80 €", link: null, note: null, done: false, reserved_by: "b", photo: null, thumb: null },
      { id: "w3", owner: "b", title: "Наушники", price: "120 €", link: null, note: null, done: false, reserved_by: null, photo: null, thumb: null },
      { id: "w4", owner: "b", title: "Книга про космос", price: "20 €", link: null, note: null, done: false, reserved_by: null, photo: null, thumb: null },
    ],
    shop: [
      { id: "s1", title: "Молоко", done: false },
      { id: "s2", title: "Клубника 🍓", done: false },
      { id: "s3", title: "Корм для кота", done: true },
    ],
    chores: [
      { id: "c1", title: "Пропылесосить", assignee: "b", freq: "Раз в неделю", done_on: null },
      { id: "c2", title: "Полить цветы", assignee: "a", freq: "2 раза в неделю", done_on: null },
    ],
    plans: [{ id: "p1", day: addDays(d, 2), time: "19:00", title: "Кино и пицца 🍕" }],
    birthdays: [
      { id: "b1", name: "Мама", bdate: bday(5, 1972) },
      { id: "b2", name: "Лена", bdate: bday(3, 1999) },
    ],
    places: [
      { id: "pl1", title: "Каток ⛸️" },
      { id: "pl2", title: "Кофейня у парка ☕" },
      { id: "pl3", title: "Суши-бар 🍣" },
      { id: "pl4", title: "Кино 🎬" },
    ],
    thanks: [
      { id: "t1", from: "b", body: "Спасибо за завтрак в постель ☕", hearted: true, created_at: ago(1440) },
    ],
  };
}
