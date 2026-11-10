<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { Primitive } from "reka-ui";
import { cn } from "@/shared/lib/utils";

const props = withDefaults(defineProps<PrimitiveProps & { class?: HTMLAttributes["class"] }>(), {
  as: "h2",
});
</script>

<template>
  <Primitive
    data-slot="card-title"
    :as="as"
    :as-child="asChild"
    :class="cn('m-0 text-base font-extrabold', props.class)"
  >
    <slot />
  </Primitive>
</template>
