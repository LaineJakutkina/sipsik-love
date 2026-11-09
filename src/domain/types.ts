/** Shapes of the data the backend returns. `AppState` is the whole couple snapshot. */
import type { CoatOffer } from "./coats";
import type { Gender, MoodId } from "./moods";
import type { Worn } from "./items";

export type Id = string;
export type Who = "me" | "partner";
/** ISO calendar date `YYYY-MM-DD` */
export type DateStr = string;

export interface Me {
  name: string;
  gender: Gender | null;
  notify?: boolean;
}

export interface Partner {
  name: string;
  gender: Gender | null;
}

/** Space mode: a couple, two friends, or just me and the cat */
export type SpaceMode = "pair" | "friends";

export interface Couple {
  start_date: DateStr;
  pet_name: string | null;
  clicks: number;
  taps_today: number;
  tap_cap?: number;
  worn: Worn;
  coat?: string;
  owned?: string[];
  solo?: boolean;
  /** Who the two people are to each other; absent means a couple */
  mode?: SpaceMode;
  invite_link?: string | null;
  invite_code?: string | null;
  rev?: number;
}

export interface Note {
  id: Id;
  body: string;
  delivered_at: string | null;
  created_at: string;
}

export interface Plan {
  id: Id;
  day: DateStr;
  time: string | null;
  title: string;
}

export interface Birthday {
  id: Id;
  name: string;
  bdate: DateStr;
}

export interface ImportantDate {
  id: Id;
  title: string;
  day: DateStr;
  yearly: boolean;
}

export interface Place {
  id: Id;
  title: string;
}

export interface ShopItem {
  id: Id;
  title: string;
  done: boolean;
}

export interface Chore {
  id: Id;
  title: string;
  who: Who;
  freq: string | null;
  done_on: DateStr | null;
}

export interface Wish {
  id: Id;
  owner: Who;
  title: string;
  price: string | null;
  link: string | null;
  note: string | null;
  photo_url: string | null;
  thumb_url: string | null;
  done: boolean;
  reserved_by_me: boolean;
}

export interface Memory {
  id: Id;
  who: Who | null;
  day: DateStr;
  body: string;
  photo_url: string | null;
  thumb_url: string | null;
}

export interface Thanks {
  id: Id;
  who: Who;
  body: string;
  hearted: boolean;
  created_at: string;
}

export interface DailyTask {
  idx: number;
  text: string;
  done: Who | false | null;
}

export interface Question {
  text: string;
  mine: string | null;
  partner: string | null;
  partner_answered?: boolean;
}

export interface SosMine {
  id: Id;
  emoji: string;
  ask: string;
  reply: string | null;
}
export interface SosPartner extends SosMine {
  body: string | null;
  tip: string;
}
export interface SosState {
  mine: SosMine | null;
  partner: SosPartner | null;
  replies: string[];
}

export interface TalkMessage {
  id: Id;
  body: string;
  reply: string | null;
}
export interface TalkState {
  mine: TalkMessage | null;
  partner: TalkMessage | null;
  replies: string[];
  ai?: boolean;
}

export interface Streak {
  n: number;
  partner_today?: boolean;
}

export interface Limits {
  wish_photos: number;
  memories: number;
}

export interface AppState {
  me: Me;
  partner: Partner | null;
  /** `null` until the user creates or joins a couple */
  couple: Couple | null;
  moods: { me: MoodId | null; partner: MoodId | null };
  notes: { sent: Note[]; received: Note[] };
  plans: Plan[];
  birthdays: Birthday[];
  dates?: ImportantDate[];
  places: Place[];
  shop: ShopItem[];
  chores: Chore[];
  wishes: Wish[];
  memories?: Memory[];
  thanks?: Thanks[];
  tasks?: DailyTask[];
  task_bonus?: number;
  question?: Question | null;
  sos?: SosState | null;
  talk?: TalkState | null;
  streak?: Streak;
  limits?: Limits;
  coats?: CoatOffer[];
  missed?: number;
  joinError?: string;
}

/** State once onboarding is done: the couple is guaranteed */
export type CoupleState = AppState & { couple: Couple };

export interface TapResult {
  clicks: number;
  today: number;
  capped?: boolean;
  worn: Worn;
  unlocked?: string[];
}

export interface Photo {
  full: string;
  thumb: string;
}
