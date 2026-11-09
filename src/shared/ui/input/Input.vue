<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { useVModel } from "@vueuse/core";
import { cn } from "@/shared/lib/utils";

const props = defineProps<{
  defaultValue?: string | number;
  modelValue?: string | number;
  class?: HTMLAttributes["class"];
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
  <input
    v-model="modelValue"
    data-slot="input"
    :class="
      cn(
        'border-input bg-background placeholder:text-muted-foreground focus:border-ring block h-[46px] w-full max-w-full min-w-0 rounded-full border-2 px-4 py-2.5 outline-none disabled:opacity-50',
        props.class,
      )
    "
  />
</template>
