<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
import { useCareActions } from "@/features/care/careActions";
import { ChatBubble } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardEyebrow, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import { serverText } from "@/shared/locale/serverText";

/** The support signal already sent to the partner; the invitation lives in `CareCards` */
const session = useSessionStore();
const sheets = useSheetsStore();
const { resolveSos } = useCareActions();
const sos = computed(() => (session.app.partner ? session.app.sos : null));
</script>

<template>
  <Card v-if="sos?.mine" tone="muted">
    <CardEyebrow>{{ t("us.support.eyebrow") }}</CardEyebrow>
    <CardTitle>{{ sos.mine.emoji }} {{ serverText(sos.mine.ask) }}</CardTitle>
    <div class="mt-3 flex flex-col gap-2">
      <ChatBubble v-if="sos.mine.reply" from="partner" :author="session.partnerName">
        {{ sos.mine.reply }}
      </ChatBubble>
      <ChatBubble v-else from="wait">
        {{ t("us.support.waiting", { name: session.partnerName }) }}
      </ChatBubble>
    </div>
    <div class="mt-3 grid grid-cols-2 gap-2">
      <Button variant="outline" @click="sheets.open('breath')">
        {{ t("us.support.breathe") }}
      </Button>
      <Button @click="resolveSos(sos.mine.id)">{{ t("us.support.better") }}</Button>
    </div>
  </Card>
</template>
