<script setup lang="ts">
/** Number tile in a stats grid; `highlight` paints it peach */
defineProps<{ value: string | number; label: string; highlight?: boolean }>();
</script>

<template>
  <div
    class="border-primary data-highlight:bg-secondary data-highlight:border-secondary min-w-0 rounded-[18px] border-2 px-1.5 py-[9px] text-center"
    :data-highlight="highlight || undefined"
  >
    <b class="tabular block text-xl leading-[1.15] font-extrabold">{{ value }}</b>
    <span class="text-muted-foreground in-data-highlight:text-foreground text-[11px] font-semibold">
      {{ label }}
    </span>
  </div>
</template>
