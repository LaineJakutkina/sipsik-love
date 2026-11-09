<script setup lang="ts">
import { computed } from "vue";
import { useCareActions } from "@/features/care/careActions";
import { ChatBubble } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardEyebrow } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import CtaCard from "./CtaCard.vue";

/** «Что-то задело?»: open the careful-talk helper, or follow the message already sent */
const session = useSessionStore();
const sheets = useSheetsStore();
const { closeTalk } = useCareActions();
const talk = computed(() => (session.app.partner ? session.app.talk : null));
</script>

<template>
  <template v-if="talk">
    <Card v-if="talk.mine" tone="muted">
      <CardEyebrow>Твоё сообщение для {{ session.partnerName }}</CardEyebrow>
      <div class="mt-3 flex flex-col gap-2">
        <ChatBubble from="me">{{ talk.mine.body }}</ChatBubble>
        <ChatBubble v-if="talk.mine.reply" from="partner" :author="session.partnerName">
          {{ talk.mine.reply }}
        </ChatBubble>
        <ChatBubble v-else from="wait">
          {{ session.partnerName }} получил(а) сообщение. Ответ появится здесь
        </ChatBubble>
      </div>
      <Button variant="outline" block class="mt-3" @click="closeTalk(talk.mine.id)">
        Мы поговорили ✓
      </Button>
    </Card>
    <CtaCard
      v-else
      tone="dashed"
      title="🕊 Что-то задело?"
      :text="`Помогу сказать это бережно, без обвинений, чтобы ${session.partnerName} услышал(а)`"
    >
      <Button @click="sheets.open('talk')">Сказать бережно</Button>
    </CtaCard>
  </template>
</template>
