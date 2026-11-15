<script setup lang="ts">
import { computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { t } from "@/domain/i18n";
import { SegmentedPills } from "@/shared/components";
import type { PillOption } from "@/shared/components";
import RouteView from "./RouteView.vue";
import { isPlanSection, usePlansStore, type PlanSection } from "@/stores/plans";
import { useSessionStore } from "@/stores/session";

const options = computed<readonly PillOption<PlanSection>[]>(() => [
  { value: "cal", label: t("app.plans.cal") },
  { value: "go", label: t("app.plans.go") },
  { value: "wish", label: t("app.plans.wish") },
]);

const route = useRoute();
const router = useRouter();
const plans = usePlansStore();
const session = useSessionStore();

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

/** Screen-reader title for sections whose band has nothing else; «Места» brings its own */
const heading = computed(() => {
  const titles: Record<PlanSection, string | null> = {
    cal: t("app.plans.cal"),
    go: null,
    wish: t(session.solo ? "app.plans.myWishlist" : "app.plans.ourWishlist"),
  };
  return titles[plans.last];
});
</script>

<template>
  <h1 v-if="heading" class="sr-only">{{ heading }}</h1>
  <SegmentedPills v-model="section" :options track :label="t('app.plans.label')" />
  <RouteView name="band" />
</template>
