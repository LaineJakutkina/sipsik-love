<script setup lang="ts">
import { HeartIcon } from "@lucide/vue";

/** The main number of the stats row: big value, its unit and a quiet second line */
defineProps<{ value: string | number; label: string; sub?: string }>();
</script>

<template>
  <div class="bg-accent relative flex min-w-0 flex-col justify-center rounded-[22px] px-4 py-3">
    <HeartIcon
      class="fill-secondary text-secondary absolute top-3 right-3 size-4"
      aria-hidden="true"
    />
    <p class="flex flex-wrap items-baseline gap-x-2 pr-5">
      <b class="tabular text-[34px] leading-none font-extrabold">{{ value }}</b>
      <span class="text-sm font-bold">{{ label }}</span>
    </p>
    <span v-if="sub" class="text-foreground/65 mt-1 text-xs font-semibold">{{ sub }}</span>
  </div>
</template>
