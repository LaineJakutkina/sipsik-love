<script setup lang="ts">
import { computed, inject, unref } from "vue";
import { RouterView, viewDepthKey, type RouteLocationNormalizedLoaded } from "vue-router";
import { leaveAtOnce } from "@/shared/lib/motion";
import { navDirection, pendingRoute } from "./navMotion";
import RouteSkeleton from "./RouteSkeleton.vue";

/**
 * `RouterView` with a screen transition: the old screen is swapped out in the same
 * frame, and the new one settles in from a light fade and a short slide from the side
 * you're heading to — never through an empty frame, so nothing blinks. One screen at
 * a time also means one WebGL cat. Each view switches only when the route record at
 * its own depth changes: the top level per tab, «Планы» per section.
 * If the next screen's code is slow to arrive, a skeleton stands in for it.
 */
const props = defineProps<{ name?: string }>();
const depth = unref(inject(viewDepthKey, 0));

const enter = computed(() =>
  navDirection.value === "forward"
    ? "animate-in fade-in-60 slide-in-from-right-3 duration-200 ease-out-soft"
    : "animate-in fade-in-60 slide-in-from-left-3 duration-200 ease-out-soft",
);

const keyOf = (route: RouteLocationNormalizedLoaded) => route.matched[depth]?.path ?? "";

/** Nested bands («Планы» sections) are small enough to simply wait */
const showsSkeleton = (route: RouteLocationNormalizedLoaded) => {
  const next = pendingRoute.value;
  if (!next || (props.name === "band" && depth > 0)) return false;
  return (next.matched[depth]?.path ?? "") !== keyOf(route);
};
</script>

<template>
  <RouterView v-slot="{ Component, route }" :name>
    <Transition :enter-active-class="enter" @leave="leaveAtOnce">
      <RouteSkeleton v-if="showsSkeleton(route)" key="pending" :band="name === 'band'" />
      <div v-else-if="Component" :key="keyOf(route)" class="flex flex-col gap-3.5">
        <component :is="Component" />
      </div>
    </Transition>
  </RouterView>
</template>
