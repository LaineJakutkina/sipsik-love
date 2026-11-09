<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="card-eyebrow"
    :class="
      cn('text-muted-foreground text-[11px] font-extrabold tracking-[.08em] uppercase', props.class)
    "
  >
    <slot />
  </div>
</template>
