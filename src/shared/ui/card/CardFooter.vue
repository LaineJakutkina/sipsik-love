<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
  <div data-slot="card-footer" :class="cn('flex items-center gap-1.5 px-3', props.class)">
    <slot />
  </div>
</template>
