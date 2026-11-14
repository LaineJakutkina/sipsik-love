<script setup lang="ts">
import { computed, inject, unref } from "vue";
import { RouterView, viewDepthKey, type RouteLocationNormalizedLoaded } from "vue-router";
import { navDirection, pageLeft, pendingRoute } from "./navMotion";
import RouteSkeleton from "./RouteSkeleton.vue";

/**
 * `RouterView` with a screen transition: the old screen fades out, the new one
 * slides in a little from the side you're heading to. `out-in`, so two screens (and two
 * WebGL cats) never live at once. Each view switches only when the route record
 * at its own depth changes: the top level per tab, «Планы» per section.
 * If the next screen's code is slow to arrive, a skeleton stands in for it.
 */
const props = defineProps<{ name?: string }>();
const depth = unref(inject(viewDepthKey, 0));

const enter = computed(() =>
  navDirection.value === "forward"
    ? "animate-in fade-in-0 slide-in-from-right-3 duration-200 ease-out-soft"
    : "animate-in fade-in-0 slide-in-from-left-3 duration-200 ease-out-soft",
);
const leave = "animate-out fade-out-0 duration-100 ease-in-quick";

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
    <Transition
      mode="out-in"
      :enter-active-class="enter"
      :leave-active-class="leave"
      @after-leave="pageLeft"
    >
      <RouteSkeleton v-if="showsSkeleton(route)" key="pending" :band="name === 'band'" />
      <div v-else-if="Component" :key="keyOf(route)" class="flex flex-col gap-3.5">
        <component :is="Component" />
      </div>
    </Transition>
  </RouterView>
</template>
