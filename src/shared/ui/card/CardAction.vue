<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";

/** Top-right control of a `CardHeader`, aligned with the title row */
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="card-action"
    :class="cn('col-start-2 row-start-1 self-start justify-self-end', props.class)"
  >
    <slot />
  </div>
</template>
