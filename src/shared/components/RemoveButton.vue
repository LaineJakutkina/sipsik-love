<script setup lang="ts">
import { Button } from "@/shared/ui/button";

/** Quiet × button for deleting a list entry */
defineProps<{ label?: string }>();
defineEmits<{ remove: [] }>();
</script>

<template>
  <Button variant="ghost" size="icon-sm" :aria-label="label ?? 'Удалить'" @click="$emit('remove')">
    ×
  </Button>
</template>
