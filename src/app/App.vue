<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
import { RouterView } from "vue-router";
import OnboardingView from "@/features/onboarding/OnboardingView.vue";
import StatusView from "@/features/status/StatusView.vue";
import CareBanners from "@/features/care/CareBanners.vue";
import { config } from "@/shared/config";
import { Toaster } from "@/shared/ui/sonner";
import { useSessionStore } from "@/stores/session";
import AppShell from "./AppShell.vue";
import SheetHost from "./SheetHost.vue";
import { useLiveSync } from "./useLiveSync";
import { useBodyBusy } from "./useBodyBusy";

const session = useSessionStore();
const screen = computed(() =>
  session.status !== "ready" ? "status" : session.hasCouple ? "app" : "onboarding",
);

// demo-only code is never loaded by the real app
const DemoBar = config.demo ? defineAsyncComponent(() => import("./DemoBar.vue")) : null;

useLiveSync();
useBodyBusy();
void session.boot();
</script>

<template>
  <DemoBar v-if="DemoBar" />
  <StatusView v-if="screen === 'status'" />
  <OnboardingView v-else-if="screen === 'onboarding'" />
  <AppShell v-else in-app>
    <template #band>
      <RouterView name="band" />
    </template>
    <CareBanners />
    <RouterView />
  </AppShell>
  <SheetHost v-if="screen === 'app'" />
  <Toaster />
</template>
