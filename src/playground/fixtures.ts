import { today } from "@/domain/dates";
import type { AppState, CoupleState, Wish } from "@/domain/types";

/** A flat SVG “photo” of any proportions: tall and wide ones catch layout bugs */
function photo(w: number, h: number, bg: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="${bg}"/><text x="50%" y="50%" font-family="sans-serif" font-size="${Math.min(w, h) / 6}" fill="#fff" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const TALL = photo(400, 1400, "#e0457b", "400×1400");
const WIDE = photo(1600, 400, "#3d7fd6", "1600×400");
const SQUARE = photo(800, 800, "#2f9e6e", "800×800");

let seq = 0;
function wish(owner: Wish["owner"], title: string, extra: Partial<Wish> = {}): Wish {
  return {
    id: `pg${++seq}`,
    owner,
    title,
    price: null,
    link: null,
    note: null,
    photo_url: null,
    thumb_url: null,
    done: false,
    reserved_by_me: false,
    ...extra,
  };
}
const withPhoto = (url: string) => ({ photo_url: url, thumb_url: url });

const WISHES: Wish[] = [
  wish("me", "Наушники", { price: "12 990 ₽", link: "example.com", ...withPhoto(TALL) }),
  wish("me", "Плед", { note: "Мягкий, серый или бежевый", ...withPhoto(WIDE) }),
  wish("me", "Очень длинное название желания, которое не помещается в две строки карточки", {
    price: "1 500 ₽",
    note: "И такая же длинная заметка, чтобы проверить, что текст обрезается аккуратно и не растягивает карточку",
    link: "https://example.com/some/very/long/path",
  }),
  wish("me", "Кофемашина", { price: "45 000 ₽", ...withPhoto(SQUARE) }),
  wish("me", "Книга", { done: true }),
  wish("partner", "Велосипед", { price: "30 000 ₽", reserved_by_me: true, ...withPhoto(TALL) }),
  wish("partner", "Цветы"),
  wish("partner", "Билеты в театр", {
    note: "На выходные",
    link: "example.com",
    ...withPhoto(WIDE),
  }),
  wish("partner", "Духи", { done: true, ...withPhoto(SQUARE) }),
];

/** Starting data of the playground couple */
export function createFixture(): CoupleState {
  const state: AppState = {
    me: { name: "Аня", gender: "f", notify: true },
    partner: { name: "Миша", gender: "m" },
    couple: {
      start_date: "2024-02-14",
      pet_name: "Сипсик",
      clicks: 420,
      taps_today: 12,
      worn: {},
      coat: "black",
      owned: ["black"],
      mode: "pair",
      invite_link: null,
      invite_code: null,
      rev: 1,
    },
    moods: { me: "happy", partner: null },
    notes: { sent: [], received: [] },
    plans: [{ id: "pgp1", day: today(), time: "19:00", title: "Ужин" }],
    birthdays: [],
    dates: [],
    places: [{ id: "pgpl1", title: "Новое кафе у парка" }],
    shop: [{ id: "pgs1", title: "Молоко", done: false }],
    chores: [],
    wishes: WISHES,
    memories: [],
    thanks: [],
    tasks: [],
    streak: { n: 3 },
    limits: { wish_photos: 5, memories: 7 },
  };
  return state as CoupleState;
}
