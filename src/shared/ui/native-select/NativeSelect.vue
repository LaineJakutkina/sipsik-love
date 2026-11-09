<script setup lang="ts">
import type { AcceptableValue } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { ChevronDownIcon } from "@lucide/vue";
import { reactiveOmit, useVModel } from "@vueuse/core";
import { cn } from "@/shared/lib/utils";

defineOptions({ inheritAttrs: false });

const props = defineProps<{
  modelValue?: AcceptableValue | AcceptableValue[];
  class?: HTMLAttributes["class"];
}>();
const emit = defineEmits<{ "update:modelValue": [AcceptableValue] }>();
const modelValue = useVModel(props, "modelValue", emit, { passive: true, defaultValue: "" });
const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <div class="relative w-full min-w-0" data-slot="native-select-wrapper">
    <select
      v-bind="{ ...$attrs, ...delegatedProps }"
      v-model="modelValue"
      data-slot="native-select"
      :class="
        cn(
          'border-input bg-background focus:border-ring h-[46px] w-full min-w-0 appearance-none rounded-full border-2 py-2.5 pr-9 pl-4 outline-none',
          props.class,
        )
      "
    >
      <slot />
    </select>
    <ChevronDownIcon
      class="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 opacity-60"
      aria-hidden="true"
    />
  </div>
</template>
