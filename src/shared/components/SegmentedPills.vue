<script setup lang="ts" generic="T extends string">
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { cn } from "@/shared/lib/utils";
import type { PillOption } from "./types";

/**
 * Single-choice row of pills (gender, frequency, filters).
 * `inverse` is for navy surfaces; `allowEmpty` lets a pressed pill be released.
 */
const props = defineProps<{
  options: readonly PillOption<T>[];
  inverse?: boolean;
  allowEmpty?: boolean;
  center?: boolean;
  label?: string;
}>();
const model = defineModel<T | "">({ default: "" });

function onUpdate(v: unknown) {
  const next = typeof v === "string" ? v : "";
  if (!next && !props.allowEmpty) return;
  model.value = next as T | "";
}
</script>

<template>
  <ToggleGroup
    type="single"
    :aria-label="label"
    :model-value="model"
    :variant="inverse ? 'inverse' : 'default'"
    :class="cn(center && 'justify-center')"
    @update:model-value="onUpdate"
  >
    <ToggleGroupItem v-for="o in options" :key="o.value" :value="o.value">
      {{ o.label }}
    </ToggleGroupItem>
  </ToggleGroup>
</template>
