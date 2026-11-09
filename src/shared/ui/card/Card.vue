<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import type { CardVariants } from ".";
import { Primitive } from "reka-ui";
import { cn } from "@/shared/lib/utils";
import { cardVariants } from ".";

const props = withDefaults(
  defineProps<PrimitiveProps & { tone?: CardVariants["tone"]; class?: HTMLAttributes["class"] }>(),
  { as: "section" },
);
</script>

<template>
  <Primitive
    data-slot="card"
    :as="as"
    :as-child="asChild"
    :class="cn(cardVariants({ tone }), props.class)"
  >
    <slot />
  </Primitive>
</template>
