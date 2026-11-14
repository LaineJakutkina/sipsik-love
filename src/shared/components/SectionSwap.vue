<script setup lang="ts">
/**
 * Swaps the sections of one screen (the segmented tabs): the old section blinks out,
 * the new one fades up. `id` is the active section; the wrapper keeps the page's gap.
 */
defineProps<{ id: string }>();
</script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="animate-in fade-in-0 slide-in-from-bottom-1 ease-out-soft duration-200"
    leave-active-class="animate-out fade-out-0 ease-in-quick duration-75"
  >
    <div :key="id" class="flex flex-col gap-3.5">
      <slot />
    </div>
  </Transition>
</template>
