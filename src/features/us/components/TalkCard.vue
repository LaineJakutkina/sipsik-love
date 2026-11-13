<script setup lang="ts">
import { computed } from "vue";
import { useCareActions } from "@/features/care/careActions";
import { ChatBubble } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardEyebrow } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";

/** The careful message already sent to the partner; the invitation lives in `CareCards` */
const session = useSessionStore();
const { closeTalk } = useCareActions();
const talk = computed(() => (session.app.partner ? session.app.talk : null));
</script>

<template>
  <Card v-if="talk?.mine" tone="muted">
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
</template>
