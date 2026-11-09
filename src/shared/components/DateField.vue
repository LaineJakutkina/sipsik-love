<script setup lang="ts">
import { Input } from "@/shared/ui/input";

/** Native date input that shows a placeholder while empty (iOS shows nothing otherwise) */
defineOptions({ inheritAttrs: false });
defineProps<{ placeholder: string; type?: "date" | "time" }>();
const model = defineModel<string>({ default: "" });
</script>

<template>
  <span class="relative block min-w-0">
    <Input v-bind="$attrs" v-model="model" :type="type ?? 'date'" :aria-label="placeholder" />
    <span
      v-if="!model"
      class="text-muted-foreground bg-background pointer-events-none absolute inset-x-4 top-1/2 -translate-y-1/2 truncate font-medium"
      aria-hidden="true"
    >
      {{ placeholder }}
    </span>
  </span>
</template>
