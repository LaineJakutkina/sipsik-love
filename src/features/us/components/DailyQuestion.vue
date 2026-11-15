<script setup lang="ts">
import { computed, ref } from "vue";
import { t } from "@/domain/i18n";
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
  return t(
    q.value?.partner_answered ? "us.question.partnerAnswered" : "us.question.partnerLocked",
    {
      name: session.partnerName,
    },
  );
});

function send() {
  const body = answer.value.trim();
  if (!body) return notify(t("us.question.empty"));
  session.mutate(
    "answer",
    { body },
    (s) => {
      if (s.question) s.question.mine = body;
    },
    t("us.question.saved"),
  );
  answer.value = "";
}
</script>

<template>
  <Card v-if="q">
    <CardEyebrow>{{ t("us.question.eyebrow") }}</CardEyebrow>
    <CardTitle class="mt-1 text-[17px] leading-[1.3]">{{ q.text }}</CardTitle>
    <form v-if="!q.mine" class="mt-2.5 flex flex-col gap-2" @submit.prevent="send">
      <Textarea
        v-model="answer"
        rows="2"
        :placeholder="t('us.question.placeholder')"
        maxlength="1000"
      />
      <Button type="submit">{{ t("us.question.submit") }}</Button>
      <p v-if="hint" class="text-muted-foreground text-[13px]">{{ hint }}</p>
    </form>
    <div v-else class="mt-3 flex flex-col gap-2">
      <ChatBubble from="me" :author="t('us.question.you')">{{ q.mine }}</ChatBubble>
      <template v-if="session.app.partner">
        <ChatBubble v-if="q.partner" from="partner" :author="session.partnerName">
          {{ q.partner }}
        </ChatBubble>
        <ChatBubble v-else from="wait">
          {{ t("us.question.partnerWaiting", { name: session.partnerName }) }}
        </ChatBubble>
      </template>
    </div>
  </Card>
</template>
