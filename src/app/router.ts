import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const TABS = ["us", "wish", "home", "cal", "go", "shop"] as const;
export type TabId = (typeof TABS)[number];
export const isTab = (v: unknown): v is TabId => TABS.includes(v as TabId);

/**
 * Each tab fills two slots: the navy `band` at the top and the `default` page body.
 * Pages are lazy so the first paint only loads the active tab.
 */
const routes: RouteRecordRaw[] = [
  {
    path: "/us",
    name: "us",
    components: {
      band: () => import("@/features/us/UsBand.vue"),
      default: () => import("@/features/us/UsPage.vue"),
    },
  },
  {
    path: "/wish",
    name: "wish",
    components: {
      band: () => import("@/features/wishlist/WishBand.vue"),
      default: () => import("@/features/wishlist/WishPage.vue"),
    },
  },
  {
    path: "/home",
    name: "home",
    components: {
      band: () => import("@/features/home/HomeBand.vue"),
      default: () => import("@/features/home/HomePage.vue"),
    },
  },
  {
    path: "/cal",
    name: "cal",
    components: {
      band: () => import("@/features/calendar/CalendarBand.vue"),
      default: () => import("@/features/calendar/CalendarPage.vue"),
    },
  },
  {
    path: "/go",
    name: "go",
    components: {
      band: () => import("@/features/places/PlacesBand.vue"),
      default: () => import("@/features/places/PlacesPage.vue"),
    },
  },
  {
    path: "/shop",
    name: "shop",
    components: {
      band: () => import("@/features/coats/ShopBand.vue"),
      default: () => import("@/features/coats/ShopPage.vue"),
    },
  },
  { path: "/:pathMatch(.*)*", redirect: "/us" },
];

/** Old links used `#cal`; the hash router expects `#/cal` */
function migrateLegacyHash() {
  const h = location.hash.slice(1);
  if (isTab(h)) history.replaceState(null, "", `#/${h}`);
}

export function createAppRouter() {
  migrateLegacyHash();
  return createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
  });
}
