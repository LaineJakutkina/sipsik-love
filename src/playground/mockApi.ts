import type { CoupleState, Wish } from "@/domain/types";
import type { Action } from "@/services/api/contract";
import { config } from "@/shared/config";
import { createFixture } from "./fixtures";

type Payload = Record<string, unknown>;
type Handler = (s: CoupleState, p: Payload) => unknown;

const LATENCY_MS = 250;
const byId = <T extends { id: string }>(list: T[], p: Payload) => list.find((x) => x.id === p.id);
const without = <T extends { id: string }>(list: T[], p: Payload) =>
  list.filter((x) => x.id !== p.id);

/**
 * Server-side behaviour the playground needs. Unlisted actions just answer with
 * the current state, so the optimistic update on screen stays as is.
 */
const handlers: Partial<Record<Action, Handler>> = {
  ping: (s) => ({ rev: s.couple.rev }),
  tap: (s, p) => {
    const n = Number(p.n) || 0;
    s.couple.clicks += n;
    s.couple.taps_today += n;
    return { clicks: s.couple.clicks, today: s.couple.taps_today, worn: s.couple.worn };
  },
  "wish.add": (s, p) => {
    const photo = typeof p.photo === "string" ? p.photo : null;
    const wish: Wish = {
      id: `pg${Date.now()}`,
      owner: p.owner === "partner" ? "partner" : "me",
      title: String(p.title),
      price: (p.price as string) || null,
      link: (p.link as string) || null,
      note: (p.note as string) || null,
      photo_url: photo,
      thumb_url: typeof p.thumb === "string" ? p.thumb : photo,
      done: false,
      reserved_by_me: false,
    };
    s.wishes.unshift(wish);
  },
  "wish.delete": (s, p) => {
    s.wishes = without(s.wishes, p);
  },
  "wish.done": (s, p) => {
    const w = byId(s.wishes, p);
    if (w) w.done = true;
  },
  "wish.reserve": (s, p) => {
    const w = byId(s.wishes, p);
    if (w) w.reserved_by_me = !w.reserved_by_me;
  },
  "wish.photo": (s, p) => {
    const w = byId(s.wishes, p);
    if (w) Object.assign(w, { photo_url: p.photo, thumb_url: p.thumb });
  },
  "shop.add": (s, p) => {
    s.shop.unshift({ id: `pg${Date.now()}`, title: String(p.title), done: false });
  },
  "shop.toggle": (s, p) => {
    const x = byId(s.shop, p);
    if (x) x.done = !x.done;
  },
  "shop.delete": (s, p) => {
    s.shop = without(s.shop, p);
  },
};

/** Answer requests to the API URL from memory instead of the network */
export function installMockApi() {
  const state = createFixture();
  const realFetch = window.fetch.bind(window);

  window.fetch = async (input, init) => {
    const url = input instanceof Request ? input.url : String(input);
    if (url !== config.apiUrl) return realFetch(input, init);

    const { action, ...payload } = JSON.parse(String(init?.body ?? "{}")) as Payload & {
      action: Action;
    };
    await new Promise((r) => setTimeout(r, LATENCY_MS));
    const result = handlers[action]?.(state, payload);
    if (!handlers[action] || result === undefined) state.couple.rev = (state.couple.rev ?? 0) + 1;
    console.debug("[mock api]", action, payload);
    return Response.json(structuredClone(result ?? state));
  };
}
