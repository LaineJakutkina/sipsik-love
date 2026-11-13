<script setup lang="ts">
/** Compact invitation to a care action: the whole tile is the button */
defineProps<{ title: string; text: string }>();
defineEmits<{ select: [] }>();
</script>

<template>
  <button
    type="button"
    class="border-primary/35 bg-card flex min-w-0 flex-col gap-1 rounded-lg border-[1.5px] border-dashed p-3.5 text-left"
    @click="$emit('select')"
  >
    <b class="text-[15px] leading-tight font-extrabold">{{ title }}</b>
    <span class="text-muted-foreground text-xs leading-snug">{{ text }}</span>
  </button>
</template>
