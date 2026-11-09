<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/shared/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
  defaultValue?: string | number;
  modelValue?: string | number;
}>();

const emits = defineEmits<{
  (e: "update:modelValue", payload: string | number): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
  passive: true,
  defaultValue: props.defaultValue,
});
</script>

<template>
  <textarea
    v-model="modelValue"
    data-slot="textarea"
    :class="
      cn(
        'border-input bg-background placeholder:text-muted-foreground focus:border-ring block w-full min-w-0 resize-y rounded-[18px] border-2 px-4 py-2.5 outline-none disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
