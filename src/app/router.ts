import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";
import { storage } from "@/services/storage";
import { PLAN_SECTIONS } from "@/stores/plans";
import { installNavMotion, scrollAfterLeave } from "./navMotion";
import RouteView from "./RouteView.vue";

export const TABS = ["us", "plans", "home", "games", "shop"] as const;
export type TabId = (typeof TABS)[number];

declare module "vue-router" {
  interface RouteMeta {
    /** Which bottom-nav item this route belongs to */
    tab?: TabId;
  }
}

/** Every lazy screen, so they can all be fetched in the background once the app is up */
const loaders: (() => Promise<unknown>)[] = [];
function lazy<T>(load: () => Promise<T>) {
  loaders.push(load);
  return load;
}

/**
 * Each tab fills two slots: the navy `band` at the top and the `default` page body.
 * Pages are lazy so the first paint only loads the active tab.
 * «Планы» is a parent route: its band holds the section switch, and the sections
 * (`cal`, `go`, `wish`) are child routes; a section without its own band (`cal`, `wish`)
 * leaves only the switch up there.
 */
const routes: RouteRecordRaw[] = [
  {
    path: "/us",
    name: "us",
    meta: { tab: "us" },
    components: {
      band: lazy(() => import("@/features/us/UsBand.vue")),
      default: lazy(() => import("@/features/us/UsPage.vue")),
    },
  },
  {
    path: "/plans",
    meta: { tab: "plans" },
    components: {
      band: lazy(() => import("./PlansBand.vue")),
      default: RouteView,
    },
    children: [
      { path: "", redirect: { name: "cal" } },
      {
        path: "cal",
        name: "cal",
        component: lazy(() => import("@/features/calendar/CalendarPage.vue")),
      },
      {
        path: "go",
        name: "go",
        components: {
          band: lazy(() => import("@/features/places/PlacesBand.vue")),
          default: lazy(() => import("@/features/places/PlacesPage.vue")),
        },
      },
      {
        path: "wish",
        name: "wish",
        component: lazy(() => import("@/features/wishlist/WishPage.vue")),
      },
    ],
  },
  {
    path: "/home",
    name: "home",
    meta: { tab: "home" },
    components: {
      band: lazy(() => import("@/features/home/HomeBand.vue")),
      default: lazy(() => import("@/features/home/HomePage.vue")),
    },
  },
  {
    path: "/games",
    name: "games",
    meta: { tab: "games" },
    components: {
      band: lazy(() => import("@/features/games/GamesBand.vue")),
      default: lazy(() => import("@/features/games/GamesPage.vue")),
    },
  },
  {
    path: "/shop",
    name: "shop",
    meta: { tab: "shop" },
    components: {
      band: lazy(() => import("@/features/coats/ShopBand.vue")),
      default: lazy(() => import("@/features/coats/ShopPage.vue")),
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

const PREFETCH_AFTER_MS = 1500;

/** Pulls in the other tabs' code after boot, so switching tabs never waits on the network */
function prefetchScreens() {
  setTimeout(() => {
    for (const load of loaders) load().catch(() => {});
  }, PREFETCH_AFTER_MS);
}

export function createAppRouter() {
  migrateLegacyHash();
  const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: scrollAfterLeave,
  });
  installNavMotion(router);
  router.onError((error, to) => reloadOnStaleChunk(error, to.fullPath));
  void router.isReady().then(prefetchScreens);
  return router;
}
