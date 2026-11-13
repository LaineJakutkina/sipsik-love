<script setup lang="ts">
import { computed } from "vue";
import { useCareActions } from "@/features/care/careActions";
import { ChatBubble } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardEyebrow, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";

/** The support signal already sent to the partner; the invitation lives in `CareCards` */
const session = useSessionStore();
const sheets = useSheetsStore();
const { resolveSos } = useCareActions();
const sos = computed(() => (session.app.partner ? session.app.sos : null));
</script>

<template>
  <Card v-if="sos?.mine" tone="muted">
    <CardEyebrow>Сигнал отправлен</CardEyebrow>
    <CardTitle>{{ sos.mine.emoji }} {{ sos.mine.ask }}</CardTitle>
    <div class="mt-3 flex flex-col gap-2">
      <ChatBubble v-if="sos.mine.reply" from="partner" :author="session.partnerName">
        {{ sos.mine.reply }}
      </ChatBubble>
      <ChatBubble v-else from="wait">
        {{ session.partnerName }} получил(а) сигнал в Telegram. Ответ появится здесь
      </ChatBubble>
    </div>
    <div class="mt-3 grid grid-cols-2 gap-2">
      <Button variant="outline" @click="sheets.open('breath')">Подышать с котиком</Button>
      <Button @click="resolveSos(sos.mine.id)">Мне уже лучше</Button>
    </div>
  </Card>
</template>
