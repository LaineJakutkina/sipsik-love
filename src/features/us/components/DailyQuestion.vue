<script setup lang="ts">
import { computed, ref } from "vue";
import { notify } from "@/services/notify";
import { ChatBubble } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardEyebrow, CardTitle } from "@/shared/ui/card";
import { Textarea } from "@/shared/ui/textarea";
import { useSessionStore } from "@/stores/session";

/** «Вопрос дня»: both answer, then both see each other's answers */
const session = useSessionStore();
const q = computed(() => session.app.question ?? null);
const answer = ref("");

const hint = computed(() => {
  if (session.solo) return null;
  return q.value?.partner_answered
    ? `${session.partnerName} уже ответил(а). Ответь, чтобы увидеть ответ`
    : `Ответ ${session.partnerName} откроется, когда вы оба ответите`;
});

function send() {
  const body = answer.value.trim();
  if (!body) return notify("Напиши ответ");
  session.mutate(
    "answer",
    { body },
    (s) => {
      if (s.question) s.question.mine = body;
    },
    "Ответ сохранён 💬",
  );
  answer.value = "";
}
</script>

<template>
  <Card v-if="q">
    <CardEyebrow>Вопрос дня</CardEyebrow>
    <CardTitle class="mt-1 text-[17px] leading-[1.3]">{{ q.text }}</CardTitle>
    <form v-if="!q.mine" class="mt-2.5 flex flex-col gap-2" @submit.prevent="send">
      <Textarea v-model="answer" rows="2" placeholder="Твой ответ" maxlength="1000" />
      <Button type="submit">Ответить</Button>
      <p v-if="hint" class="text-muted-foreground text-[13px]">{{ hint }}</p>
    </form>
    <div v-else class="mt-3 flex flex-col gap-2">
      <ChatBubble from="me" author="Ты">{{ q.mine }}</ChatBubble>
      <template v-if="session.app.partner">
        <ChatBubble v-if="q.partner" from="partner" :author="session.partnerName">
          {{ q.partner }}
        </ChatBubble>
        <ChatBubble v-else from="wait">
          {{ session.partnerName }} ещё не ответил(а). Ответ появится здесь
        </ChatBubble>
      </template>
    </div>
  </Card>
</template>
