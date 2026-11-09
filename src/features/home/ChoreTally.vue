<script setup lang="ts">
import { plural } from "@/shared/lib/plural";

/** Chores count for one person; the partner's tile is navy */
defineProps<{ name: string; count: number; dark?: boolean }>();
</script>

<template>
  <div
    class="border-primary data-dark:bg-primary data-dark:text-primary-foreground rounded-[18px] border-2 px-3.5 py-2.5"
    :data-dark="dark || undefined"
  >
    <span class="text-xs font-semibold opacity-75">{{ name }}</span>
    <b class="tabular block text-[22px] font-extrabold">{{ count }}</b>
    <span class="text-xs font-semibold opacity-75">{{
      plural(count, ["дело", "дела", "дел"])
    }}</span>
  </div>
</template>
