<script setup lang="ts">
/** Small tile: a value inside a progress ring (`percent` 0..100) and a caption */
defineProps<{ value: string | number; label: string; percent: number }>();
</script>

<template>
  <div
    class="bg-muted flex min-w-0 flex-col items-center justify-center gap-1.5 rounded-[22px] px-2 py-2.5 text-center"
  >
    <div class="relative grid size-14 place-items-center">
      <svg class="absolute inset-0 size-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
        <circle class="stroke-background fill-none" cx="18" cy="18" r="15.5" stroke-width="3.5" />
        <circle
          class="stroke-secondary fill-none"
          cx="18"
          cy="18"
          r="15.5"
          stroke-width="3.5"
          stroke-linecap="round"
          pathLength="100"
          :stroke-dasharray="`${percent} 100`"
        />
      </svg>
      <b class="tabular text-lg leading-none font-extrabold">{{ value }}</b>
    </div>
    <span class="text-muted-foreground text-[11px] leading-tight font-semibold text-balance">
      {{ label }}
    </span>
  </div>
</template>
