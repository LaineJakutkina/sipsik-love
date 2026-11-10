<script setup lang="ts">
import type { DialogContentEmits, DialogContentProps } from "reka-ui";
import { useTemplateRef, type ComponentPublicInstance, type HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { DialogContent, DialogOverlay, DialogPortal, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/shared/lib/utils";

defineOptions({ inheritAttrs: false });

const props = defineProps<DialogContentProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<DialogContentEmits>();
const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardPropsEmits(delegatedProps, emits);

const content = useTemplateRef<ComponentPublicInstance>("content");

/**
 * Don't focus the first field on open: on phones it pops the keyboard and makes the
 * slide-in animation jump. Focus the sheet itself so the focus trap still works.
 */
function onOpenAutoFocus(e: Event) {
  e.preventDefault();
  (content.value?.$el as HTMLElement | undefined)?.focus({ preventScroll: true });
}
</script>

<!-- Bottom sheet: the only sheet flavour this app uses -->
<template>
  <DialogPortal>
    <DialogOverlay
      data-slot="sheet-overlay"
      class="bg-primary/55 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-30"
    />
    <DialogContent
      ref="content"
      data-slot="sheet-content"
      v-bind="{ ...$attrs, ...forwarded }"
      @open-auto-focus="onOpenAutoFocus"
      :class="
        cn(
          'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom px-safe fixed inset-x-0 bottom-0 z-30 mx-auto flex max-h-[90%] w-full max-w-[520px] flex-col gap-3 overflow-auto rounded-t-2xl pt-[22px] pb-[calc(22px+env(safe-area-inset-bottom,0px))] outline-none data-[state=closed]:duration-200 data-[state=open]:duration-300 [&_*]:min-w-0',
          props.class,
        )
      "
    >
      <slot />
    </DialogContent>
  </DialogPortal>
</template>
