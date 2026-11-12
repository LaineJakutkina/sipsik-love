<script setup lang="ts">
import { computed, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import { SegmentedPills } from "@/shared/components";
import type { PillOption } from "@/shared/components";
import { isPlanSection, usePlansStore, type PlanSection } from "@/stores/plans";

const OPTIONS: readonly PillOption<PlanSection>[] = [
  { value: "cal", label: "Календарь" },
  { value: "go", label: "Места" },
  { value: "wish", label: "Желания" },
];

const route = useRoute();
const router = useRouter();
const plans = usePlansStore();

watch(
  () => route.name,
  (name) => {
    if (isPlanSection(name)) plans.last = name;
  },
  { immediate: true },
);

const section = computed({
  get: () => plans.last,
  set: (v: PlanSection | "") => {
    if (v) void router.replace({ name: v });
  },
});
</script>

<template>
  <SegmentedPills v-model="section" :options="OPTIONS" inverse center label="Раздел планов" />
  <RouterView name="band" />
</template>
