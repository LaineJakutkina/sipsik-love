<script setup lang="ts">
import { CardTitle } from "@/shared/ui/card";

/** Card title with a small grey note (or link) on the right */
defineProps<{ title: string; note?: string }>();
</script>

<template>
  <div class="flex items-center justify-between gap-2.5">
    <CardTitle>{{ title }}</CardTitle>
    <slot>
      <span class="text-muted-foreground text-[13px]">{{ note }}</span>
    </slot>
  </div>
</template>
