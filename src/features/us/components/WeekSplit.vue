<script setup lang="ts">
export interface SplitStat {
  title: string;
  value: number;
  unit: string;
}

/** Two counters side by side; the second one is navy */
defineProps<{ stats: readonly SplitStat[] }>();
</script>

<template>
  <div class="mb-1 grid grid-cols-2 gap-2">
    <div
      v-for="(s, i) in stats"
      :key="i"
      class="border-primary rounded-[18px] border-2 px-3.5 py-2.5 last:bg-primary last:text-primary-foreground"
    >
      <span class="text-xs font-semibold opacity-75">{{ s.title }}</span>
      <b class="tabular block text-[22px] font-extrabold">{{ s.value }}</b>
      <span class="text-xs font-semibold opacity-75">{{ s.unit }}</span>
    </div>
  </div>
</template>
