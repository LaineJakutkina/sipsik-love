<script setup lang="ts">
import { computed } from "vue";
import { Card, CardEyebrow } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useCareActions } from "./careActions";
import CareTip from "./CareTip.vue";
import ReplyBox from "./ReplyBox.vue";

/** The partner sent a careful message and waits for an answer */
const session = useSessionStore();
const { replyTalk } = useCareActions();
const talk = computed(() => (session.app.partner ? session.app.talk : null));
</script>

<template>
  <Card v-if="talk?.partner && !talk.partner.reply" tone="dark">
    <CardEyebrow class="text-peach">{{ session.partnerName }} хочет бережно поговорить</CardEyebrow>
    <p class="mt-2 text-base leading-[1.45]">«{{ talk.partner.body }}»</p>
    <CareTip>
      Сначала просто постарайся услышать чувства, а не обвинение. Не оправдывайся сразу.
    </CareTip>
    <ReplyBox :replies="talk.replies" :maxlength="500" @reply="replyTalk" />
  </Card>
</template>
