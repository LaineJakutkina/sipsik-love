<script setup lang="ts">
import { Card, CardTitle, type CardVariants } from "@/shared/ui/card";
import CornerEmoji from "./CornerEmoji.vue";

/**
 * Invitation card: title and a short explanation, with an action on the side.
 * `emoji` is drawn as a faint picture in the corner, behind the content.
 */
defineProps<{ title: string; text: string; tone?: CardVariants["tone"]; emoji?: string }>();
</script>

<template>
  <Card
    :tone="tone"
    class="relative flex-row flex-wrap items-center justify-between gap-3 overflow-hidden"
  >
    <CornerEmoji v-if="emoji" :emoji />
    <div class="relative min-w-[170px] flex-1">
      <CardTitle>{{ title }}</CardTitle>
      <p class="text-muted-foreground mt-1 text-[13px]">{{ text }}</p>
    </div>
    <slot />
  </Card>
</template>
