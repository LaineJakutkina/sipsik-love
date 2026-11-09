<script setup lang="ts">
import type { SwitchRootEmits, SwitchRootProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { reactiveOmit } from "@vueuse/core";
import { SwitchRoot, SwitchThumb, useForwardPropsEmits } from "reka-ui";
import { cn } from "@/shared/lib/utils";

const props = defineProps<SwitchRootProps & { class?: HTMLAttributes["class"] }>();
const emits = defineEmits<SwitchRootEmits>();
const delegatedProps = reactiveOmit(props, "class");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <SwitchRoot
    data-slot="switch"
    v-bind="forwarded"
    :class="
      cn(
        'peer border-primary bg-muted data-[state=checked]:bg-secondary relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 transition-colors outline-none disabled:opacity-50',
        props.class,
      )
    "
  >
    <SwitchThumb
      data-slot="switch-thumb"
      class="bg-primary pointer-events-none block size-[18px] translate-x-[3px] rounded-full transition-transform data-[state=checked]:translate-x-[23px]"
    />
  </SwitchRoot>
</template>
