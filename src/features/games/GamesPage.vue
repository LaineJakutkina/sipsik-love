<script setup lang="ts">
import { t } from "@/domain/i18n";
import { EmptyState } from "@/shared/components";
import { Card } from "@/shared/ui/card";
</script>

<template>
  <Card>
    <EmptyState>{{ t("games.soon") }}</EmptyState>
  </Card>
</template>
