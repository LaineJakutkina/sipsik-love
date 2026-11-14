import { ref } from "vue";
import type { RouteLocationNormalized, Router } from "vue-router";

/** Screens in the order they sit in the bottom nav; moving right slides content left */
const ORDER = ["us", "cal", "go", "wish", "home", "games", "shop"] as const;

export type NavDirection = "forward" | "back";
export const navDirection = ref<NavDirection>("forward");

const rank = (r: RouteLocationNormalized) =>
  ORDER.findIndex((name) => name === r.name || name === r.meta.tab);

/** How long the scroll waits for the old screen to fade out, at most */
const LEAVE_MS = 260;
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

export function installNavMotion(router: Router) {
  router.beforeEach((to, from) => {
    navDirection.value = rank(to) >= rank(from) ? "forward" : "back";
  });
}

export async function scrollAfterLeave(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  if (from.matched.length && to.name !== from.name) await oldPageGone();
  return { top: 0 };
}
