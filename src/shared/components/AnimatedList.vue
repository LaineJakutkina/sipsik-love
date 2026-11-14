<script setup lang="ts">
import { useListMotion } from "@/shared/composables/useListMotion";

/**
 * List whose items animate in, out and into new places. Children need stable keys.
 * `grid` for tile grids: tiles zoom in, and the rest glide into a removed tile's gap.
 */
const props = withDefaults(defineProps<{ as?: string; grid?: boolean }>(), { as: "ul" });
const motion = useListMotion(() => props.grid);
</script>

<template>
  <TransitionGroup
    :tag="as"
    :css="false"
    move-class="transition-transform duration-300 ease-out-soft"
    @before-enter="motion.onBeforeEnter"
    @enter="motion.onEnter"
    @leave="motion.onLeave"
  >
    <slot />
  </TransitionGroup>
</template>
