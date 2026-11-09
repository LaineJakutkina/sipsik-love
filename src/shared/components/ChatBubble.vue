<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const bubble = cva("rounded-[18px] px-3.5 py-2.5 text-sm leading-[1.4] wrap-anywhere", {
  variants: {
    from: {
      me: "bg-primary text-primary-foreground max-w-[88%] self-end rounded-br-md",
      partner: "bg-accent max-w-[88%] self-start rounded-bl-md",
      wait: "bg-muted text-muted-foreground self-start",
      thanks: "bg-butter max-w-[84%] rounded-bl-md",
      "thanks-me": "bg-primary text-primary-foreground max-w-[84%] rounded-br-md",
    },
  },
});

/** Chat-like message bubble (question answers, thanks) */
defineProps<{ from: NonNullable<VariantProps<typeof bubble>["from"]>; author?: string }>();
</script>

<template>
  <div :class="bubble({ from })">
    <small v-if="author" class="mb-0.5 block text-[11px] font-bold opacity-70">{{ author }}</small>
    <slot />
  </div>
</template>
