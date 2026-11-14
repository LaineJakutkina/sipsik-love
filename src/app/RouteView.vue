<script setup lang="ts">
import { computed, inject, unref } from "vue";
import { RouterView, viewDepthKey, type RouteLocationNormalizedLoaded } from "vue-router";
import { navDirection, pageLeft } from "./navMotion";

/**
 * `RouterView` with a screen transition: the old screen slips out, the new one
 * slides in from the side you're heading to. `out-in`, so two screens (and two
 * WebGL cats) never live at once. Each view switches only when the route record
 * at its own depth changes: the top level per tab, «Планы» per section.
 */
defineProps<{ name?: string }>();
const depth = unref(inject(viewDepthKey, 0));

const enter = computed(() =>
  navDirection.value === "forward"
    ? "animate-in fade-in-0 slide-in-from-right-6 duration-300 ease-out-soft"
    : "animate-in fade-in-0 slide-in-from-left-6 duration-300 ease-out-soft",
);
const leave = computed(() =>
  navDirection.value === "forward"
    ? "animate-out fade-out-0 slide-out-to-left-3 duration-120 ease-in-quick"
    : "animate-out fade-out-0 slide-out-to-right-3 duration-120 ease-in-quick",
);

const keyOf = (route: RouteLocationNormalizedLoaded) => route.matched[depth]?.path ?? "";
</script>

<template>
  <RouterView v-slot="{ Component, route }" :name>
    <Transition
      mode="out-in"
      :enter-active-class="enter"
      :leave-active-class="leave"
      @after-leave="pageLeft"
    >
      <div v-if="Component" :key="keyOf(route)" class="flex flex-col gap-3.5">
        <component :is="Component" />
      </div>
    </Transition>
  </RouterView>
</template>
