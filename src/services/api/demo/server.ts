import { addDays } from "@/domain/dates";
import type { Worn } from "@/domain/items";
import { isMood } from "@/domain/moods";
import type { AppState, DateStr, SpaceMode, TapResult, Who } from "@/domain/types";
import { ApiError } from "../client";
import type { Action, PayloadOf, ResponseOf } from "../contract";
import {
  COATS,
  FRIEND_QUESTIONS,
  FRIEND_TASKS,
  ITEMS,
  QUESTIONS,
  SOLO_QUESTIONS,
  SOLO_TASKS,
  SOS,
  SOS_REPLIES,
  TALK_REPLIES,
  TASKS,
} from "./catalog";
import { blankWorld, readyWorld, type DemoUser, type U, type World } from "./world";

/**
 * A pretend server for the browser demo (`VITE_DEMO=1`): the same actions and answers as the
 * real Supabase function, kept in localStorage so two tabs (Аня and Максим) share one couple.
 * Nothing leaves the browser.
 */

const KEY = "sipsik-demo-world";
const DAILY_TAP_CAP = 1000;
const TASK_BONUS = 20;
const WISH_PHOTO_LIMIT = 5;
const MEMORY_LIMIT = 7;
/** Real notes arrive at a random moment within a week; in the demo — in 20 seconds */
const NOTE_DELAY_MS = 20_000;
const FREQS = ["Каждый день", "2 раза в неделю", "Раз в неделю", "Раз в месяц"];
const READ_ONLY = new Set<string>(["me", "state", "ping", "buy", "nvc.rewrite"]);

/** Which of the two people this tab is: `?as=b` is Максим, anything else is Аня */
export const viewer = (): U => (new URLSearchParams(location.search).get("as") === "b" ? "b" : "a");
const other = (u: U): U => (u === "a" ? "b" : "a");

/* ---------- storage ---------- */

function load(): World {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as World;
  } catch {
    // fall through to a fresh world
  }
  return readyWorld();
}

function save(w: World) {
  try {
    localStorage.setItem(KEY, JSON.stringify(w));
  } catch {
    throw new ApiError("В демо не хватает места. Выбери фото поменьше или сбрось демо");
  }
}

/** Start the demo over: a ready-made couple, or from scratch to try onboarding and invites */
export function resetDemo(kind: "ready" | "blank") {
  save(kind === "ready" ? readyWorld() : blankWorld());
}

/* ---------- helpers ---------- */

function fail(message: string): never {
  throw new ApiError(message);
}
const isDay = (d: unknown): d is DateStr => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d);
const uid = () => Math.random().toString(36).slice(2, 10);
const nowIso = () => new Date().toISOString();
const ALPH = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const makeCode = () =>
  Array.from({ length: 6 }, () => ALPH[Math.floor(Math.random() * ALPH.length)] ?? "A").join("");

function str(v: unknown, max: number, required?: string): string | null {
  const s = typeof v === "string" ? v.trim().slice(0, max) : "";
  if (!s && required) fail(`${required}: заполни поле`);
  return s || null;
}
const need = (v: unknown, what: string): string => str(v, 2000, what) ?? "";

function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function dailyTaskIdx(day: string, size: number) {
  const out: number[] = [];
  let seed = hashStr(`demo|${day}`);
  while (out.length < 3) {
    seed = Math.imul(seed ^ (seed >>> 15), 2246822507) >>> 0;
    const i = seed % size;
    if (!out.includes(i)) out.push(i);
  }
  return out;
}
const dayNum = (day: string) => Math.floor(Date.parse(`${day}T00:00:00Z`) / 864e5);

interface Ctx {
  w: World;
  me: U;
  meUser: DemoUser;
  /** The other person, when they are in the couple too */
  partner: U | null;
  day: DateStr;
}

function couple(c: Ctx) {
  return c.w.couple ?? fail("Сначала создай пару или присоединись к ней");
}
const needPartner = (c: Ctx): U => c.partner ?? fail("Партнёр ещё не присоединился");
const modeOf = (c: Ctx): SpaceMode | "solo" => {
  const cp = c.w.couple;
  if (cp && cp.mode === "solo" && !c.partner) return "solo";
  return cp?.mode === "friends" ? "friends" : "pair";
};
const tasksFor = (c: Ctx) =>
  modeOf(c) === "solo" ? SOLO_TASKS : modeOf(c) === "friends" ? FRIEND_TASKS : TASKS;
const questionsFor = (c: Ctx) =>
  modeOf(c) === "solo" ? SOLO_QUESTIONS : modeOf(c) === "friends" ? FRIEND_QUESTIONS : QUESTIONS;
const whoOf = (c: Ctx, u: U): Who => (u === c.me ? "me" : "partner");

function find<T extends { id: string }>(rows: T[], id: unknown): T {
  return rows.find((r) => r.id === id) ?? fail("Запись не найдена, обнови экран");
}
function drop<T extends { id: string }>(rows: T[], id: unknown, keep?: (r: T) => boolean): T[] {
  return rows.filter((r) => r.id !== id || (keep ? keep(r) : false));
}

function putOn(worn: Worn, id: string) {
  const slot = ITEMS.find(([x]) => x === id)?.[2];
  for (const [x, , s] of ITEMS) if (s === slot && x !== id) worn[x] = false;
  worn[id] = true;
}

function addTaps(c: Ctx, n: number) {
  const cp = couple(c);
  const before = cp.clicks;
  cp.clicks += n;
  const unlocked = ITEMS.filter(([, at]) => before < at && cp.clicks >= at).map(([id]) => id);
  for (const id of unlocked) putOn(cp.worn, id);
  return unlocked;
}

function touchVisit(c: Ctx): number {
  const cp = c.w.couple;
  if (!cp) return 0;
  const prev = Object.keys(c.w.visits)
    .map((k) => k.split("|")[1] ?? "")
    .filter((d) => d < c.day)
    .sort()
    .at(-1);
  c.w.visits[`${c.me}|${c.day}`] = true;
  const both = !c.partner || c.w.visits[`${c.partner}|${c.day}`];
  if (both && cp.streak_last !== c.day) {
    cp.streak = cp.streak_last === addDays(c.day, -1) ? cp.streak + 1 : 1;
    cp.streak_last = c.day;
  }
  return prev ? dayNum(c.day) - dayNum(prev) - 1 : 0;
}

function joinByCode(c: Ctx, raw: unknown) {
  const code = String(raw ?? "")
    .trim()
    .toUpperCase();
  if (!/^[A-Z0-9]{4,12}$/.test(code)) fail("Код приглашения выглядит неправильно");
  const cp = c.w.couple;
  if (!cp || cp.invite_code !== code) fail("Приглашение не найдено или уже использовано");
  if (c.meUser.inCouple) return;
  if (c.w.users[other(c.me)].inCouple === false) fail("Приглашение не найдено или уже использовано");
  c.meUser.inCouple = true;
  if (cp) {
    cp.invite_code = null;
    if (cp.mode === "solo") cp.mode = "friends";
  }
}

const inviteLink = (code: string | null) => {
  if (!code) return null;
  const u = new URL(location.href);
  u.hash = "";
  u.search = `?as=b&join=${code}`;
  return u.toString();
};

/* ---------- state (same shape as the real server) ---------- */

function buildState(c: Ctx): AppState {
  const { w, me } = c;
  const meUser = w.users[me];
  const meOut = { name: meUser.name, gender: meUser.gender, notify: meUser.notify };
  const cp = w.couple;
  if (!cp || !meUser.inCouple) return { ...emptyLists(), me: meOut, partner: null, couple: null };
  const p = c.partner;
  const now = Date.now();
  const tl = tasksFor(c);
  const ql = questionsFor(c);
  const myAnswer = w.answers[`${me}|${c.day}`] ?? null;
  const theirAnswer = p ? (w.answers[`${p}|${c.day}`] ?? null) : null;
  const sosOf = (u: U | null) => {
    const r = u && w.sos.find((s) => s.from === u && !s.resolved);
    const kind = r ? SOS[r.kind] : undefined;
    if (!r || !kind) return null;
    const ask = w.users[r.from].gender === "f" && kind.askF ? kind.askF : kind.ask;
    return { id: r.id, emoji: kind.emoji, ask, tip: kind.tip, body: r.body, reply: r.reply };
  };
  const talkOf = (u: U | null) => {
    const r = u && w.talks.find((t) => t.from === u && !t.closed);
    return r ? { id: r.id, body: r.body, reply: r.reply } : null;
  };
  return {
    me: meOut,
    partner: p ? { name: w.users[p].name, gender: w.users[p].gender } : null,
    couple: {
      start_date: cp.start_date,
      pet_name: cp.pet_name,
      clicks: cp.clicks,
      worn: cp.worn,
      coat: COATS[cp.coat] ? cp.coat : "black",
      taps_today: (w.taps[`a|${c.day}`] ?? 0) + (w.taps[`b|${c.day}`] ?? 0),
      tap_cap: DAILY_TAP_CAP,
      owned: cp.owned,
      invite_link: p ? null : inviteLink(cp.invite_code),
      invite_code: p ? null : cp.invite_code,
      solo: modeOf(c) === "solo",
      mode: modeOf(c) === "friends" ? "friends" : "pair",
      rev: cp.rev,
    },
    moods: {
      me: w.moods[`${me}|${c.day}`] ?? null,
      partner: p ? (w.moods[`${p}|${c.day}`] ?? null) : null,
    },
    notes: {
      sent: w.notes
        .filter((n) => n.from === me)
        .map((n) => ({
          id: n.id,
          body: n.body,
          delivered_at: n.deliver_at <= now ? new Date(n.deliver_at).toISOString() : null,
          created_at: n.created_at,
        })),
      received: w.notes
        .filter((n) => (n.from !== me || modeOf(c) === "solo") && n.deliver_at <= now)
        .map((n) => ({
          id: n.id,
          body: n.body,
          delivered_at: new Date(n.deliver_at).toISOString(),
          created_at: n.created_at,
        })),
    },
    wishes: w.wishes.map((x) => ({
      id: x.id,
      owner: whoOf(c, x.owner),
      title: x.title,
      price: x.price,
      link: x.link,
      note: x.note,
      photo_url: x.photo,
      thumb_url: x.thumb ?? x.photo,
      done: x.done,
      reserved_by_me: x.owner !== me && x.reserved_by === me,
    })),
    shop: w.shop.map(({ id, title, done }) => ({ id, title, done })),
    chores: w.chores.map((x) => ({
      id: x.id,
      title: x.title,
      who: whoOf(c, x.assignee),
      freq: x.freq,
      done_on: x.done_on,
    })),
    plans: w.plans
      .filter((x) => x.day >= addDays(c.day, -62))
      .sort((a, b) => a.day.localeCompare(b.day)),
    birthdays: [...w.birthdays].sort((a, b) => a.name.localeCompare(b.name)),
    places: w.places,
    dates: w.dates,
    streak: {
      n: cp.streak_last && cp.streak_last >= addDays(c.day, -1) ? cp.streak : 0,
      partner_today: !!p && !!w.visits[`${p}|${c.day}`],
    },
    tasks: dailyTaskIdx(c.day, tl.length).map((i) => {
      const t = w.taskDone.find((x) => x.day === c.day && x.idx === i);
      return { idx: i, text: tl[i] ?? "", done: t ? whoOf(c, t.user) : null };
    }),
    task_bonus: TASK_BONUS,
    limits: { wish_photos: WISH_PHOTO_LIMIT, memories: MEMORY_LIMIT },
    coats: Object.entries(COATS).map(([id, x]) => ({
      id,
      name: x.n,
      price: x.price,
      kind: x.animal ? "animal" : "cat",
    })),
    question: {
      text: ql[(dayNum(c.day) + hashStr("demo")) % ql.length] ?? "",
      mine: myAnswer,
      partner_answered: !!theirAnswer,
      partner: myAnswer && theirAnswer ? theirAnswer : null,
    },
    thanks: w.thanks.map((t) => ({
      id: t.id,
      who: whoOf(c, t.from),
      body: t.body,
      hearted: t.hearted,
      created_at: t.created_at,
    })),
    talk: { mine: talkOf(me), partner: talkOf(p), replies: [...TALK_REPLIES], ai: false },
    sos: { mine: sosOf(me), partner: sosOf(p), replies: [...SOS_REPLIES] },
    memories: w.memories.map((m) => ({
      id: m.id,
      who: whoOf(c, m.user),
      day: m.day,
      body: m.body,
      photo_url: m.photo,
      thumb_url: m.thumb ?? m.photo,
    })),
  };
}

function emptyLists() {
  return { moods: { me: null, partner: null }, notes: { sent: [], received: [] }, plans: [], birthdays: [], places: [], shop: [], chores: [], wishes: [] };
}

/* ---------- actions ---------- */

type Body = Record<string, unknown>;
type Handler = (c: Ctx, b: Body) => unknown;

function photoOf(b: Body) {
  const photo = typeof b.photo === "string" ? b.photo : null;
  const thumb = typeof b.thumb === "string" ? b.thumb : null;
  return { photo, thumb };
}
function checkWishPhotoLimit(c: Ctx, owner: U, exceptId: string | null) {
  const n = c.w.wishes.filter((x) => x.owner === owner && x.photo && x.id !== exceptId).length;
  if (n >= WISH_PHOTO_LIMIT)
    fail(`В вишлисте можно держать до ${WISH_PHOTO_LIMIT} фото. Удали одно из желаний с фото, чтобы добавить новое`);
}

const ACTIONS: Record<string, Handler> = {
  me: () => undefined,
  state: () => undefined,
  ping: (c) => ({ rev: c.w.couple && c.meUser.inCouple ? c.w.couple.rev : -1 }),

  "couple.create": (c, b) => {
    if (c.meUser.inCouple) fail("Ты уже в паре");
    const mode: SpaceMode | "solo" =
      b.mode === "friends" ? "friends" : b.solo ? "solo" : "pair";
    const start = mode !== "pair" ? c.day : isDay(b.start_date) ? b.start_date : fail("Укажи дату начала отношений");
    if (start > c.day) fail("Дата начала не может быть в будущем");
    c.w = { ...blankWorld(), users: c.w.users };
    c.w.users.a.inCouple = false;
    c.w.users.b.inCouple = false;
    c.w.couple = {
      start_date: start,
      pet_name: str(b.pet_name, 30) ?? "Сипсик",
      clicks: 0,
      worn: {},
      coat: "black",
      owned: ["black"],
      mode,
      invite_code: makeCode(),
      rev: 1,
      streak: 0,
      streak_last: null,
    };
    c.meUser = c.w.users[c.me];
    c.meUser.inCouple = true;
    c.meUser.name = str(b.my_name, 30) ?? c.meUser.name;
    if (b.gender === "m" || b.gender === "f") c.meUser.gender = b.gender;
  },
  "couple.join": (c, b) => joinByCode(c, b.code),
  "couple.update": (c, b) => {
    const cp = couple(c);
    if (b.start_date !== undefined) {
      if (!isDay(b.start_date) || b.start_date > c.day) fail("Проверь дату начала отношений");
      cp.start_date = b.start_date;
    }
    if (b.pet_name !== undefined) cp.pet_name = str(b.pet_name, 30) ?? "Сипсик";
    if ((b.mode === "pair" || b.mode === "friends") && modeOf(c) !== "solo") cp.mode = b.mode;
    if (b.my_name !== undefined) c.meUser.name = str(b.my_name, 30) ?? c.meUser.name;
    if (b.notify !== undefined) c.meUser.notify = !!b.notify;
    if (b.gender !== undefined) c.meUser.gender = b.gender === "m" || b.gender === "f" ? b.gender : null;
  },
  "couple.leave": (c) => {
    const cp = couple(c);
    c.w.wishes = c.w.wishes.filter((x) => x.owner !== c.me);
    c.meUser.inCouple = false;
    if (c.partner) cp.invite_code = makeCode();
    else c.w = { ...blankWorld(), users: c.w.users };
  },

  tap: (c, b): TapResult & { cap: number } => {
    const cp = couple(c);
    const asked = Math.max(1, Math.min(300, Math.floor(Number(b.n) || 0)));
    const doneToday = (c.w.taps[`a|${c.day}`] ?? 0) + (c.w.taps[`b|${c.day}`] ?? 0);
    const n = Math.min(asked, Math.max(0, DAILY_TAP_CAP - doneToday));
    if (n <= 0) return { clicks: cp.clicks, worn: cp.worn, unlocked: [], today: doneToday, cap: DAILY_TAP_CAP, capped: true };
    const key = `${c.me}|${c.day}`;
    c.w.taps[key] = (c.w.taps[key] ?? 0) + n;
    const unlocked = addTaps(c, n);
    const total = doneToday + n;
    return { clicks: cp.clicks, worn: { ...cp.worn }, unlocked, today: total, cap: DAILY_TAP_CAP, capped: total >= DAILY_TAP_CAP };
  },
  wear: (c, b) => {
    const cp = couple(c);
    const item = ITEMS.find(([id]) => id === b.item) ?? fail("Нет такой вещи");
    if (cp.clicks < item[1]) fail("Эта вещь ещё не получена");
    if (b.on) putOn(cp.worn, item[0]);
    else cp.worn[item[0]] = false;
  },
  mood: (c, b) => {
    couple(c);
    const mood = b.mood;
    if (!isMood(mood)) fail("Нет такого настроения");
    c.w.moods[`${c.me}|${c.day}`] = mood;
  },

  "note.send": (c, b) => {
    couple(c);
    c.w.notes.unshift({ id: uid(), from: c.me, body: need(b.body, "Записка"), deliver_at: Date.now() + NOTE_DELAY_MS, created_at: nowIso() });
  },
  "note.delete": (c, b) => {
    c.w.notes = drop(c.w.notes, b.id, (n) => n.from !== c.me);
  },

  "wish.add": (c, b) => {
    couple(c);
    const owner = b.owner === "partner" ? needPartner(c) : c.me;
    const link = str(b.link, 500);
    if (link && !/^https?:\/\//i.test(link) && !/^[\w-]+(\.[\w-]+)+/.test(link)) fail("Ссылка выглядит неправильно");
    const { photo, thumb } = photoOf(b);
    if (photo) checkWishPhotoLimit(c, owner, null);
    c.w.wishes.unshift({
      id: uid(), owner, title: need(b.title, "Название"), price: str(b.price, 40), link, note: str(b.note, 300),
      photo, thumb, done: false, reserved_by: null,
    });
  },
  "wish.photo": (c, b) => {
    const x = find(c.w.wishes, b.id);
    checkWishPhotoLimit(c, x.owner, x.id);
    Object.assign(x, photoOf(b));
  },
  "wish.reserve": (c, b) => {
    const x = find(c.w.wishes, b.id);
    if (x.owner === c.me) fail("Себе подарок не забронируешь");
    x.reserved_by = x.reserved_by === c.me ? null : c.me;
  },
  "wish.done": (c, b) => {
    find(c.w.wishes, b.id).done = true;
  },
  "wish.delete": (c, b) => {
    c.w.wishes = drop(c.w.wishes, b.id);
  },

  "shop.add": (c, b) => {
    couple(c);
    c.w.shop.unshift({ id: uid(), title: need(b.title, "Покупка"), done: false });
  },
  "shop.toggle": (c, b) => {
    const r = find(c.w.shop, b.id);
    r.done = !r.done;
  },
  "shop.delete": (c, b) => {
    c.w.shop = drop(c.w.shop, b.id);
  },
  "shop.clear": (c) => {
    c.w.shop = c.w.shop.filter((r) => !r.done);
  },

  "chore.add": (c, b) => {
    couple(c);
    const assignee = b.who === "partner" && c.partner ? c.partner : c.me;
    const freq = typeof b.freq === "string" && FREQS.includes(b.freq) ? b.freq : (FREQS[0] ?? null);
    c.w.chores.push({ id: uid(), title: need(b.title, "Дело"), assignee, freq, done_on: null });
  },
  "chore.toggle": (c, b) => {
    const r = find(c.w.chores, b.id);
    r.done_on = r.done_on === c.day ? null : c.day;
  },
  "chore.swap": (c, b) => {
    const p = needPartner(c);
    const r = find(c.w.chores, b.id);
    r.assignee = r.assignee === c.me ? p : c.me;
  },
  "chore.delete": (c, b) => {
    c.w.chores = drop(c.w.chores, b.id);
  },
  "chore.split": (c) => {
    const p = needPartner(c);
    const order = c.w.chores.map((r) => [Math.random(), r] as const).sort((x, y) => x[0] - y[0]);
    order.forEach(([, r], i) => {
      r.assignee = i % 2 ? p : c.me;
    });
  },

  "plan.add": (c, b) => {
    couple(c);
    if (!isDay(b.day)) fail("Выбери день");
    const time = typeof b.time === "string" && /^\d{2}:\d{2}$/.test(b.time) ? b.time : null;
    c.w.plans.push({ id: uid(), day: b.day, time, title: need(b.title, "План") });
  },
  "plan.delete": (c, b) => {
    c.w.plans = drop(c.w.plans, b.id);
  },
  "bday.add": (c, b) => {
    couple(c);
    if (!isDay(b.bdate)) fail("Укажи дату рождения");
    c.w.birthdays.push({ id: uid(), name: need(b.name, "Имя"), bdate: b.bdate });
  },
  "bday.delete": (c, b) => {
    c.w.birthdays = drop(c.w.birthdays, b.id);
  },
  "place.add": (c, b) => {
    couple(c);
    c.w.places.push({ id: uid(), title: need(b.title, "Место") });
  },
  "place.delete": (c, b) => {
    c.w.places = drop(c.w.places, b.id);
  },
  "date.add": (c, b) => {
    couple(c);
    if (!isDay(b.day)) fail("Выбери дату");
    c.w.dates.push({ id: uid(), title: need(b.title, "Название"), day: b.day, yearly: b.yearly !== false });
  },
  "date.delete": (c, b) => {
    c.w.dates = drop(c.w.dates, b.id);
  },

  "task.done": (c, b) => {
    couple(c);
    const idx = Number(b.idx);
    if (!dailyTaskIdx(c.day, tasksFor(c).length).includes(idx)) fail("Этого задания сегодня нет, обнови экран");
    if (c.w.taskDone.some((x) => x.day === c.day && x.idx === idx)) return;
    c.w.taskDone.push({ day: c.day, idx, user: c.me });
    addTaps(c, TASK_BONUS);
  },
  answer: (c, b) => {
    couple(c);
    c.w.answers[`${c.me}|${c.day}`] = need(b.body, "Ответ");
  },

  "sos.send": (c, b) => {
    needPartner(c);
    if (typeof b.kind !== "string" || !SOS[b.kind]) fail("Выбери, что тебе сейчас нужно");
    for (const s of c.w.sos) if (s.from === c.me) s.resolved = true;
    c.w.sos.unshift({ id: uid(), from: c.me, kind: String(b.kind), body: str(b.body, 300), reply: null, resolved: false });
  },
  "sos.reply": (c, b) => {
    needPartner(c);
    const r = find(c.w.sos, b.id);
    if (r.from === c.me) fail("Это твой собственный сигнал");
    if (r.resolved) fail("Партнёру уже лучше 💜");
    r.reply = need(b.reply, "Ответ");
  },
  "sos.resolve": (c, b) => {
    const r = find(c.w.sos, b.id);
    if (r.from !== c.me) fail("Закрыть сигнал может только тот, кто его отправил");
    r.resolved = true;
  },
  "talk.send": (c, b) => {
    needPartner(c);
    for (const t of c.w.talks) if (t.from === c.me) t.closed = true;
    c.w.talks.unshift({ id: uid(), from: c.me, body: need(b.body, "Сообщение"), reply: null, closed: false });
  },
  "talk.reply": (c, b) => {
    needPartner(c);
    const r = find(c.w.talks, b.id);
    if (r.from === c.me) fail("Это твоё сообщение");
    r.reply = need(b.reply, "Ответ");
  },
  "talk.close": (c, b) => {
    find(c.w.talks, b.id).closed = true;
  },
  "nvc.rewrite": () => fail("В демо ИИ-помощник не работает"),

  "thanks.add": (c, b) => {
    couple(c);
    if (modeOf(c) !== "solo") needPartner(c);
    c.w.thanks.unshift({ id: uid(), from: c.me, body: need(b.body, "Благодарность"), hearted: false, created_at: nowIso() });
  },
  "thanks.heart": (c, b) => {
    const t = find(c.w.thanks, b.id);
    if (t.from === c.me) fail("Это твоя благодарность");
    t.hearted = !t.hearted;
  },
  "thanks.delete": (c, b) => {
    c.w.thanks = drop(c.w.thanks, b.id, (t) => t.from !== c.me);
  },

  "memory.add": (c, b) => {
    couple(c);
    const day = isDay(b.day) ? b.day : c.day;
    if (day > c.day) fail("Воспоминание не может быть из будущего");
    const body = str(b.body, 1000) ?? "";
    const { photo, thumb } = photoOf(b);
    if (!body && !photo) fail("Добавь фото или пару слов");
    if (c.w.memories.length >= MEMORY_LIMIT) fail(`Можно хранить до ${MEMORY_LIMIT} воспоминаний. Удали одно, чтобы добавить новое`);
    c.w.memories.unshift({ id: uid(), user: c.me, day, body, photo, thumb });
  },
  "memory.delete": (c, b) => {
    c.w.memories = drop(c.w.memories, b.id);
  },

  "coat.set": (c, b) => {
    const cp = couple(c);
    const coat = String(b.coat ?? "");
    const offer = COATS[coat] ?? fail("Нет такого окраса");
    if (!cp.owned.includes(coat) && offer.price > 0) fail("Этот окрас ещё не куплен");
    cp.coat = coat;
  },
  buy: (c, b) => {
    const cp = couple(c);
    const coat = String(b.coat ?? "");
    const offer = COATS[coat];
    if (!offer || !offer.price) fail("Этот окрас нельзя купить");
    if (cp.owned.includes(coat)) fail("Этот окрас уже ваш");
    return { link: `demo:${coat}` };
  },
};

/* ---------- entry points ---------- */

function context(w: World, day: DateStr): Ctx {
  const me = viewer();
  const p = other(me);
  return { w, me, meUser: w.users[me], partner: w.users[me].inCouple && w.users[p].inCouple ? p : null, day };
}

const pause = () => new Promise((r) => setTimeout(r, 120 + Math.random() * 180));

/** Same signature as the real `call()`; answers like the Supabase function would */
export async function demoCall<A extends Action>(action: A, payload: PayloadOf<A> | undefined, day: DateStr): Promise<ResponseOf<A>> {
  await pause();
  const handler = ACTIONS[action] ?? fail("Неизвестное действие");
  const body: Body = { ...payload };
  let c = context(load(), isDay(body.day) ? body.day : day);
  if (action === "me" && !c.meUser.inCouple) {
    const code = typeof body.code === "string" && body.code ? body.code : null;
    if (code) {
      try {
        joinByCode(c, code);
      } catch (e) {
        save(c.w);
        const st = buildState(context(c.w, c.day));
        return { ...st, joinError: e instanceof Error ? e.message : "Не получилось" } as ResponseOf<A>;
      }
      c = context(c.w, c.day);
    }
  }
  let missed = 0;
  if (action === "me" || action === "state") missed = touchVisit(c);
  const out = handler(c, body);
  if (!READ_ONLY.has(action) && c.w.couple) c.w.couple.rev += 1;
  save(c.w);
  if (out !== undefined) return out as ResponseOf<A>;
  const state = buildState(context(c.w, c.day));
  if (action === "me") state.missed = missed;
  return state as ResponseOf<A>;
}

/** What the bot does after a successful Stars payment: grant the coat and put it on */
export function grantDemoPurchase(link: string) {
  const coat = link.replace(/^demo:/, "");
  const w = load();
  if (!w.couple || !COATS[coat]) return;
  if (!w.couple.owned.includes(coat)) w.couple.owned.push(coat);
  w.couple.coat = coat;
  w.couple.rev += 1;
  save(w);
}

/** Stands in for the Telegram Stars window: nothing is charged */
export function payDemoInvoice(link: string): string {
  const offer = COATS[link.replace(/^demo:/, "")];
  if (!offer) return "failed";
  const ok = window.confirm(`Демо: купить «${offer.n}» за ${offer.price} ⭐ понарошку? Звёзды не спишутся.`);
  if (!ok) return "cancelled";
  grantDemoPurchase(link);
  return "paid";
}

/** localStorage key of the shared demo world, to notice changes made in the other tab */
export const DEMO_STORAGE_KEY = KEY;
export const demoNames = () => {
  const w = load();
  return { me: w.users[viewer()].name, other: w.users[other(viewer())].name };
};
