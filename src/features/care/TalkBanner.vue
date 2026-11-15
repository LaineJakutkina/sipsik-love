<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
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
    <CardEyebrow class="text-peach">{{
      t("care.talkBanner.wants", { name: session.partnerName })
    }}</CardEyebrow>
    <p class="mt-2 text-base leading-[1.45]">«{{ talk.partner.body }}»</p>
    <CareTip>{{ t("care.talkBanner.tip") }}</CareTip>
    <ReplyBox :replies="talk.replies" :maxlength="500" @reply="replyTalk" />
  </Card>
</template>
