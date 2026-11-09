<script setup lang="ts">
import type { VariantProps } from "class-variance-authority";
import type { ToggleGroupItemProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { ToggleGroupItem, useForwardProps } from "reka-ui";
import { inject } from "vue";
import { cn } from "@/shared/lib/utils";
import { toggleVariants } from "@/shared/ui/toggle";

type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

const props = defineProps<
  ToggleGroupItemProps & {
    class?: HTMLAttributes["class"];
    variant?: ToggleGroupVariants["variant"];
    size?: ToggleGroupVariants["size"];
  }
>();

const context = inject<ToggleGroupVariants>("toggleGroup");

const delegatedProps = reactiveOmit(props, "class", "size", "variant");
const forwardedProps = useForwardProps(delegatedProps);
</script>

<template>
  <ToggleGroupItem
    v-slot="slotProps"
    data-slot="toggle-group-item"
    v-bind="forwardedProps"
    :class="
      cn(
        toggleVariants({
          variant: variant || context?.variant,
          size: size || context?.size,
        }),
        props.class,
      )
    "
  >
    <slot v-bind="slotProps" />
  </ToggleGroupItem>
</template>
