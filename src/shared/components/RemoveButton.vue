<script setup lang="ts">
import { t } from "@/domain/i18n";
import { Button } from "@/shared/ui/button";

/** Quiet × button for deleting a list entry */
defineProps<{ label?: string }>();
defineEmits<{ remove: [] }>();
</script>

<template>
  <Button
    variant="ghost"
    size="icon-sm"
    :aria-label="label ?? t('common.actions.delete')"
    @click="$emit('remove')"
  >
    ×
  </Button>
</template>
