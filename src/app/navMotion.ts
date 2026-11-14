import { ref, shallowRef } from "vue";
import type { RouteLocationNormalized, Router } from "vue-router";

/** Screens in the order they sit in the bottom nav; moving right slides content left */
const ORDER = ["us", "cal", "go", "wish", "home", "games", "shop"] as const;

export type NavDirection = "forward" | "back";
export const navDirection = ref<NavDirection>("forward");

const rank = (r: RouteLocationNormalized) =>
  ORDER.findIndex((name) => name === r.name || name === r.meta.tab);

/** How long the scroll waits for the old screen to fade out, at most */
const LEAVE_MS = 140;
let settle: (() => void) | null = null;

/** Called by `RouteView` once the old screen is gone */
export function pageLeft() {
  settle?.();
  settle = null;
}

/** Resolves when the old screen has left, so the page never jumps to the top under it */
function oldPageGone() {
  return new Promise<void>((resolve) => {
    settle = resolve;
    setTimeout(resolve, LEAVE_MS);
  });
}

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

export async function scrollAfterLeave(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (from.matched.length && to.name !== from.name) await oldPageGone();
  return { top: 0 };
}
