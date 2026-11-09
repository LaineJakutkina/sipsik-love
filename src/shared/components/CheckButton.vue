<script setup lang="ts">
import { CheckIcon } from "@lucide/vue";

/** Round checkbox-like toggle used in lists (shopping, chores, tasks) */
defineProps<{ checked: boolean; label: string; disabled?: boolean }>();
defineEmits<{ toggle: [] }>();
</script>

<template>
  <button
    type="button"
    class="border-primary aria-pressed:bg-secondary aria-pressed:border-secondary group grid size-7 flex-none place-items-center rounded-full border-2 p-0 disabled:cursor-default"
    :aria-pressed="checked"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('toggle')"
  >
    <CheckIcon class="size-3.5 opacity-0 group-aria-pressed:opacity-100" :stroke-width="3" />
  </button>
</template>
