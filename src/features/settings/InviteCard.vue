<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useInvite } from "./invite";

/** Navy “invite your partner” card; renders nothing once there is a partner or in solo mode */
const session = useSessionStore();
const link = computed(() => {
  const s = session.state;
  if (!s?.couple || s.partner || session.solo) return null;
  return s.couple.invite_link || null;
});

const { shareInvite, copyInvite } = useInvite();
</script>

<template>
  <Card v-if="link" tone="dark" class="gap-2.5">
    <CardTitle>{{
      session.friends ? t("settings.invite.inviteFriend") : t("settings.invite.invitePartner")
    }}</CardTitle>
    <p class="mt-1 text-[13px] opacity-80">
      {{ t("settings.invite.cardText", { who: session.other.nom }) }}
    </p>
    <div
      class="bg-navy-2 rounded-[14px] px-3 py-2.5 text-[13px] font-semibold wrap-anywhere select-all"
    >
      {{ link }}
    </div>
    <div class="grid grid-cols-2 gap-2">
      <Button variant="secondary" @click="shareInvite">{{ t("common.actions.send") }}</Button>
      <Button variant="inverse" @click="copyInvite">{{ t("settings.invite.copy") }}</Button>
    </div>
  </Card>
</template>
