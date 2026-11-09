<script setup lang="ts">
import { Toggle } from "@/shared/ui/toggle";

/** Multi-select chips; keeps the order in which they were picked */
defineProps<{ options: readonly string[] }>();
const model = defineModel<string[]>({ required: true });

function toggle(x: string, on: boolean) {
  model.value = on ? [...model.value, x] : model.value.filter((y) => y !== x);
}
</script>

<template>
  <div class="mt-0.5 flex flex-wrap gap-1.5">
    <Toggle
      v-for="x in options"
      :key="x"
      variant="chip"
      size="sm"
      :model-value="model.includes(x)"
      @update:model-value="toggle(x, $event)"
    >
      {{ x }}
    </Toggle>
  </div>
</template>
