<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
import { SegmentedPills } from "@/shared/components";
import { useHomeUiStore } from "./homeUi";

const homeUi = useHomeUiStore();
const options = computed(() => [
  { value: "shop" as const, label: t("home.band.shop") },
  { value: "chores" as const, label: t("home.band.chores") },
]);
</script>

<template>
  <h1 class="sr-only">{{ t("home.band.title") }}</h1>
  <SegmentedPills
    :model-value="homeUi.section"
    :options
    track
    :label="t('home.band.section')"
    @update:model-value="(v) => v && (homeUi.section = v)"
  />
</template>
