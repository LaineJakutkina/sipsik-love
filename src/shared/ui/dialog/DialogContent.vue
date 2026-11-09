<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/shared/lib/utils";

defineOptions({ inheritAttrs: false });

const props = defineProps<
  DialogContentProps & { class?: HTMLAttributes["class"]; overlayClass?: HTMLAttributes["class"] }
>();
const emits = defineEmits<DialogContentEmits>();
const delegatedProps = reactiveOmit(props, "class", "overlayClass");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      data-slot="dialog-overlay"
      :class="
        cn(
          'bg-primary/55 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-40',
          props.overlayClass,
        )
      "
    />
    <DialogContent
      data-slot="dialog-content"
      v-bind="{ ...$attrs, ...forwarded }"
      :class="
        cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 fixed top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 outline-none',
          props.class,
        )
      "
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
