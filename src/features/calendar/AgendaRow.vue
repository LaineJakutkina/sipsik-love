<script setup lang="ts">
import { cva } from "class-variance-authority";

/** Row in the selected day's agenda: time (or a short note) first, then the title */
const rowVariants = cva("flex min-w-0 items-center gap-3 rounded-2xl py-2.5 pr-2 pl-3.5", {
  variants: {
    tone: {
      navy: "bg-primary text-primary-foreground",
      fill: "bg-accent text-foreground",
    },
  },
});
defineProps<{ tone: "navy" | "fill" }>();
</script>

<template>
  <div :class="rowVariants({ tone })">
    <span class="tabular w-11 flex-none text-xs font-extrabold"><slot name="right" /></span>
    <span class="min-w-0 flex-1 font-bold wrap-anywhere"><slot /></span>
    <span class="grid min-h-[30px] flex-none place-items-center"><slot name="action" /></span>
  </div>
</template>
