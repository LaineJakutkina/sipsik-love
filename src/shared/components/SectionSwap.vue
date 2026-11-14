<script setup lang="ts">
import { leaveAtOnce } from "@/shared/lib/motion";

/**
 * Swaps the sections of one screen (the segmented tabs): the old section goes in the
 * same frame, the new one settles up from a light fade — no empty frame in between.
 * `id` is the active section; the wrapper keeps the page's gap.
 */
defineProps<{ id: string }>();
</script>

<template>
  <Transition
    enter-active-class="animate-in fade-in-60 slide-in-from-bottom-1 ease-out-soft duration-200"
    @leave="leaveAtOnce"
  >
    <div :key="id" class="flex flex-col gap-3.5">
      <slot />
    </div>
  </Transition>
</template>
