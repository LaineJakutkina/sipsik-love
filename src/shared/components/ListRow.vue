<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";

/** Row in a divided list: optional leading control, growing body, trailing actions */
const props = defineProps<{ done?: boolean; class?: HTMLAttributes["class"] }>();
</script>

<template>
  <li
    :class="
      cn(
        'border-mist flex min-w-0 items-center gap-3 border-t-[1.5px] py-[11px] first:border-t-0',
        props.class,
      )
    "
    :data-done="done || undefined"
  >
    <slot name="lead" />
    <div class="group min-w-0 flex-1 wrap-anywhere" :data-done="done || undefined">
      <slot />
    </div>
    <slot name="trail" />
  </li>
</template>
