<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";

/** Title + description; a `CardAction` sibling goes to the top-right corner */
const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div
    data-slot="card-header"
    :class="
      cn(
        'grid auto-rows-min items-start gap-x-2 gap-y-1 px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto]',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
