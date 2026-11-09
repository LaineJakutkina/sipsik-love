<script setup lang="ts">
import { cva } from "class-variance-authority";

/** Pill-shaped row in the selected day's agenda (legacy `.prow`) */
const rowVariants = cva(
  "flex min-w-0 items-center justify-between gap-2.5 rounded-full border-2 px-4 py-[9px]",
  {
    variants: {
      tone: {
        navy: "border-primary bg-primary text-primary-foreground",
        fill: "border-secondary bg-secondary text-navy",
      },
    },
  },
);
defineProps<{ tone: "navy" | "fill" }>();
</script>

<template>
  <div :class="rowVariants({ tone })">
    <span class="min-w-0 font-bold wrap-anywhere"><slot /></span>
    <span class="flex items-center gap-1">
      <span class="tabular flex-none text-xs font-bold"><slot name="right" /></span>
      <slot name="action" />
    </span>
  </div>
</template>
