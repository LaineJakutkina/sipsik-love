<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/shared/lib/utils";
import { skeletonVariants, type SkeletonVariants } from ".";

/** Placeholder for content that is still loading. A `span`, so it fits inside buttons too */
const props = defineProps<{
  class?: HTMLAttributes["class"];
  tone?: SkeletonVariants["tone"];
}>();
</script>

<template>
  <span
    data-slot="skeleton"
    aria-hidden="true"
    :class="cn(skeletonVariants({ tone }), props.class)"
  />
</template>
