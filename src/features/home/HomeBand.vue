<script setup lang="ts">
import { SegmentedPills } from "@/shared/components";
import { useHomeUiStore } from "./homeUi";

const homeUi = useHomeUiStore();
const options = [
  { value: "shop", label: "Покупки" },
  { value: "chores", label: "Обязанности" },
] as const;
</script>

<template>
  <h1>Дом</h1>
  <SegmentedPills
    :model-value="homeUi.section"
    :options
    inverse
    center
    label="Раздел"
    @update:model-value="(v) => v && (homeUi.section = v)"
  />
</template>
