<script setup lang="ts">
import CatStage from "@/game/vue/CatStage.vue";
import AppShell from "@/app/AppShell.vue";
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
        <h1>Открой меня в Telegram</h1>
      </template>
      <template v-else>
        <CatStage :look="{ mood: 'tears', worn: {} }" />
        <h1>Что-то пошло не так</h1>
      </template>
    </template>

    <Card v-if="session.status === 'notg'">
      <p>
        Сипсик Love работает внутри Telegram. Найди бота
        <template v-if="config.botUsername">
          <b>@{{ config.botUsername }}</b>
        </template>
        и нажми «Открыть Сипсик Love».
      </p>
    </Card>
    <Card v-else class="gap-3.5">
      <p>{{ session.error }}</p>
      <Button @click="session.boot()">Попробовать снова</Button>
    </Card>
  </AppShell>
</template>
