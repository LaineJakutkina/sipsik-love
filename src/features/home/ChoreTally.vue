<script setup lang="ts">
import { plural } from "@/shared/lib/plural";

/** One person's chores: how many are theirs and how many are done today; the partner's tile is navy */
defineProps<{ name: string; count: number; done: number; dark?: boolean }>();
</script>

<template>
  <div
    class="bg-accent data-dark:bg-primary data-dark:text-primary-foreground min-w-0 rounded-[22px] px-4 py-3"
    :data-dark="dark || undefined"
  >
    <span class="block truncate text-xs font-bold opacity-75">{{ name }}</span>
    <p class="flex items-baseline gap-1.5">
      <b class="tabular text-[28px] leading-tight font-extrabold">{{ count }}</b>
      <span class="text-[13px] font-bold">{{ plural(count, ["дело", "дела", "дел"]) }}</span>
    </p>
    <span v-if="count" class="tabular block text-xs font-semibold opacity-75">
      сегодня сделано {{ done }} из {{ count }}
    </span>
  </div>
</template>
