import { createRouter, createWebHashHistory, RouterView, type RouteRecordRaw } from "vue-router";
import { storage } from "@/services/storage";
import { PLAN_SECTIONS } from "@/stores/plans";

export const TABS = ["us", "plans", "home", "games", "shop"] as const;
export type TabId = (typeof TABS)[number];

declare module "vue-router" {
  interface RouteMeta {
    /** Which bottom-nav item this route belongs to */
    tab?: TabId;
  }
}

/**
 * Each tab fills two slots: the navy `band` at the top and the `default` page body.
 * Pages are lazy so the first paint only loads the active tab.
 * «Планы» is a parent route: its band holds the section switch, and the sections
 * (`cal`, `go`, `wish`) are child routes that fill the same two slots.
 */
const routes: RouteRecordRaw[] = [
  {
    path: "/us",
    name: "us",
    meta: { tab: "us" },
    components: {
      band: () => import("@/features/us/UsBand.vue"),
      default: () => import("@/features/us/UsPage.vue"),
    },
  },
  {
    path: "/plans",
    meta: { tab: "plans" },
    components: {
      band: () => import("./PlansBand.vue"),
      default: RouterView,
    },
    children: [
      { path: "", redirect: { name: "cal" } },
      {
        path: "cal",
        name: "cal",
        components: {
          band: () => import("@/features/calendar/CalendarBand.vue"),
          default: () => import("@/features/calendar/CalendarPage.vue"),
        },
      },
      {
        path: "go",
        name: "go",
        components: {
          band: () => import("@/features/places/PlacesBand.vue"),
          default: () => import("@/features/places/PlacesPage.vue"),
        },
      },
      {
        path: "wish",
        name: "wish",
        components: {
          band: () => import("@/features/wishlist/WishBand.vue"),
          default: () => import("@/features/wishlist/WishPage.vue"),
        },
      },
    ],
  },
  {
    path: "/home",
    name: "home",
    meta: { tab: "home" },
    components: {
      band: () => import("@/features/home/HomeBand.vue"),
      default: () => import("@/features/home/HomePage.vue"),
    },
  },
  {
    path: "/games",
    name: "games",
    meta: { tab: "games" },
    components: {
      band: () => import("@/features/games/GamesBand.vue"),
      default: () => import("@/features/games/GamesPage.vue"),
    },
  },
  {
    path: "/shop",
    name: "shop",
    meta: { tab: "shop" },
    components: {
      band: () => import("@/features/coats/ShopBand.vue"),
      default: () => import("@/features/coats/ShopPage.vue"),
    },
  },
  /** Old links: `#/cal`, `#/go`, `#/wish` lived at the top level before «Планы» */
  ...PLAN_SECTIONS.map((s): RouteRecordRaw => ({ path: `/${s}`, redirect: { name: s } })),
  { path: "/:pathMatch(.*)*", redirect: "/us" },
];

/** Even older links used `#cal`; the hash router expects `#/cal` */
function migrateLegacyHash() {
  const h = location.hash.slice(1);
  const known: readonly string[] = [...TABS, ...PLAN_SECTIONS];
  if (known.includes(h)) history.replaceState(null, "", `#/${h}`);
}

const RELOAD_KEY = "sipsik.chunkReload";
const RELOAD_GAP_MS = 30_000;
const CHUNK_ERROR = /dynamically imported module|module script failed|error loading/i;

/**
 * After a new deploy the page still open in Telegram asks for page chunks that no
 * longer exist, so tabs stop opening. Reload once into the tab that was asked for;
 * the timestamp stops a reload loop when the network itself is down.
 */
function reloadOnStaleChunk(error: unknown, target: string) {
  if (!(error instanceof Error) || !CHUNK_ERROR.test(error.message)) return;
  const last = Number(storage.get(RELOAD_KEY) ?? 0);
  if (Date.now() - last < RELOAD_GAP_MS) return;
  storage.set(RELOAD_KEY, String(Date.now()));
  history.replaceState(null, "", `#${target}`);
  location.reload();
}

export function createAppRouter() {
  migrateLegacyHash();
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
  });
  router.onError((error, to) => reloadOnStaleChunk(error, to.fullPath));
  return router;
}
