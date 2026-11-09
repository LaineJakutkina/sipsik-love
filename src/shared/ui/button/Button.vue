<script setup lang="ts">
import type { PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import type { ButtonVariants } from ".";
import { Primitive } from "reka-ui";
import { cn } from "@/shared/lib/utils";
import { buttonVariants } from ".";

interface Props extends PrimitiveProps {
  variant?: ButtonVariants["variant"];
  size?: ButtonVariants["size"];
  block?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  as: "button",
});
</script>

<template>
  <Primitive
    data-slot="button"
    :data-variant="variant"
    :as="as"
    :as-child="asChild"
    :type="as === 'button' ? 'button' : undefined"
    :class="cn(buttonVariants({ variant, size, block }), props.class)"
  >
    <slot />
  </Primitive>
</template>
