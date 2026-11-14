import { ref, shallowRef } from "vue";
import type { RouteLocationNormalized, Router } from "vue-router";

/** Screens in the order they sit in the bottom nav; moving right slides content left */
const ORDER = ["us", "cal", "go", "wish", "home", "games", "shop"] as const;

export type NavDirection = "forward" | "back";
export const navDirection = ref<NavDirection>("forward");

const rank = (r: RouteLocationNormalized) =>
  ORDER.findIndex((name) => name === r.name || name === r.meta.tab);

/** A screen whose code is still downloading; set only after a short wait so fast loads never flash */
export const pendingRoute = shallowRef<RouteLocationNormalized | null>(null);
const PENDING_DELAY_MS = 120;
let pendingTimer: ReturnType<typeof setTimeout> | undefined;

function settlePending() {
  clearTimeout(pendingTimer);
  pendingRoute.value = null;
}

export function installNavMotion(router: Router) {
  router.beforeEach((to, from) => {
    navDirection.value = rank(to) >= rank(from) ? "forward" : "back";
    clearTimeout(pendingTimer);
    pendingTimer = setTimeout(() => (pendingRoute.value = to), PENDING_DELAY_MS);
  });
  router.afterEach(settlePending);
  router.onError(settlePending);
}
