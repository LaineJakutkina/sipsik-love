<script setup lang="ts">
import AppShell from "@/app/AppShell.vue";
import { t } from "@/domain/i18n";
import CatStage from "@/game/vue/CatStage.vue";
import { config } from "@/shared/config";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import LoadingView from "./LoadingView.vue";

/** Loading / “open in Telegram” / error screens shown before the app is ready */
const session = useSessionStore();
</script>

<template>
  <LoadingView v-if="session.status === 'loading'" />
  <AppShell v-else>
    <template #band>
      <template v-if="session.status === 'notg'">
        <CatStage :look="{ mood: 'tired', worn: {} }" />
        <h1>{{ t("status.notg.title") }}</h1>
      </template>
      <template v-else>
        <CatStage :look="{ mood: 'tears', worn: {} }" />
        <h1>{{ t("status.error.title") }}</h1>
      </template>
    </template>

    <Card v-if="session.status === 'notg'">
      <p>
        {{ t("status.notg.text") }}
        <template v-if="config.botUsername">
          <b>@{{ config.botUsername }}</b>
        </template>
        {{ t("status.notg.tap") }}
      </p>
    </Card>
    <Card v-else class="gap-3.5">
      <p>{{ session.error }}</p>
      <Button @click="session.boot()">{{ t("status.error.retry") }}</Button>
    </Card>
  </AppShell>
</template>
