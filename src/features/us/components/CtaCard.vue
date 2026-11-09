<script setup lang="ts">
import { Card, CardTitle, type CardVariants } from "@/shared/ui/card";

/** Invitation card: title and a short explanation, with an action on the side */
defineProps<{ title: string; text: string; tone?: CardVariants["tone"] }>();
</script>

<template>
  <Card :tone="tone" class="flex-row flex-wrap items-center justify-between gap-3">
    <div class="min-w-[170px] flex-1">
      <CardTitle>{{ title }}</CardTitle>
      <p class="text-muted-foreground mt-1 text-[13px]">{{ text }}</p>
    </div>
    <slot />
  </Card>
</template>
