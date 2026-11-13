<script setup lang="ts">
import { cn } from "@/shared/lib/utils";

/** Pill row on the navy “Не забудь” card; `fill` highlights the nearest event */
defineProps<{ title: string; when: string; fill?: boolean }>();
</script>

<template>
  <div
    :class="
      cn(
        'bg-navy-2 flex min-w-0 items-center justify-between gap-2.5 rounded-full px-4 py-[11px]',
        fill && 'bg-secondary text-foreground',
      )
    "
  >
    <span class="min-w-0 truncate font-bold">{{ title }}</span>
    <span class="tabular flex-none text-xs font-bold">{{ when }}</span>
  </div>
</template>
