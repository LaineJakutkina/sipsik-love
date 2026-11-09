<script setup lang="ts">
import { computed } from "vue";
import { Card, CardEyebrow, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useCareActions } from "./careActions";
import CareTip from "./CareTip.vue";
import ReplyBox from "./ReplyBox.vue";

/** The partner asked for support: how to help and quick replies */
const session = useSessionStore();
const { replySos } = useCareActions();
const sos = computed(() => (session.app.partner ? session.app.sos : null));
</script>

<template>
  <Card v-if="sos?.partner" tone="dark">
    <CardEyebrow class="text-peach">{{ session.partnerName }} просит поддержки</CardEyebrow>
    <CardTitle>{{ sos.partner.emoji }} «{{ sos.partner.ask }}»</CardTitle>
    <p v-if="sos.partner.body" class="mt-1.5">{{ sos.partner.body }}</p>
    <CareTip>{{ sos.partner.tip }}</CareTip>
    <p v-if="sos.partner.reply" class="mt-2.5 text-[13px] opacity-80">
      Ты ответил(а): <b>{{ sos.partner.reply }}</b>
    </p>
    <ReplyBox v-else :replies="sos.replies" :maxlength="200" @reply="replySos" />
  </Card>
</template>
