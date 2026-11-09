<script setup lang="ts">
import { cn } from "@/shared/lib/utils";

/** Pill row on the navy “Не забудь” card; `fill` highlights the nearest event */
defineProps<{ title: string; when: string; fill?: boolean }>();
</script>

<template>
  <div
    :class="
      cn(
        'border-primary-foreground flex min-w-0 items-center justify-between gap-2.5 rounded-full border-2 px-4 py-[9px]',
        fill && 'bg-secondary border-secondary text-foreground',
      )
    "
  >
    <span class="min-w-0 font-bold wrap-anywhere">{{ title }}</span>
    <span class="tabular flex-none text-xs font-bold">{{ when }}</span>
  </div>
</template>
