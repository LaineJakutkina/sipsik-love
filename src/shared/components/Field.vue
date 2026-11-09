<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";

/**
 * Small grey caption above a form control. Wrap the control in the default slot.
 * Use `as="div"` when the slot holds a group of buttons instead of one input.
 */
const props = defineProps<{
  label?: string;
  hint?: string;
  as?: "label" | "div";
  class?: HTMLAttributes["class"];
}>();
</script>

<template>
  <component
    :is="as ?? 'label'"
    :class="cn('text-muted-foreground flex w-full flex-col gap-1.5 text-xs font-bold', props.class)"
  >
    <span v-if="label">{{ label }}</span>
    <slot />
    <span v-if="hint" class="text-xs leading-[1.4] font-medium">{{ hint }}</span>
  </component>
</template>
