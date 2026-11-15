<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useInvite } from "./invite";

/** Settings footer: share the cat (solo), invite the other person, or show who is in the space */
const session = useSessionStore();
const { shareInvite, copyInvite } = useInvite();
const couple = computed(() => session.app.couple);
</script>

<template>
  <Card v-if="session.solo && couple.invite_link" tone="dark" class="my-1 gap-2.5">
    <CardTitle>{{ t("settings.invite.shareTitle") }}</CardTitle>
    <p class="mt-1 text-[13px] opacity-80">
      {{ session.gendered("settings.invite.shareInfo", { pet: session.petName }) }}
    </p>
    <div
      class="bg-navy-2 rounded-[14px] px-3 py-2.5 text-[13px] font-semibold wrap-anywhere select-all"
    >
      {{ couple.invite_link }}
    </div>
    <div class="grid grid-cols-2 gap-2">
      <Button variant="secondary" @click="shareInvite">{{ t("common.actions.send") }}</Button>
      <Button variant="inverse" @click="copyInvite">{{ t("settings.invite.copy") }}</Button>
    </div>
  </Card>
  <template v-else-if="couple.invite_link">
    <p class="text-muted-foreground text-[13px]">
      {{ t("settings.invite.code") }} <b>{{ couple.invite_code }}</b>
    </p>
    <Button variant="secondary" @click="shareInvite">{{
      t("settings.invite.invite", { who: session.other.gen })
    }}</Button>
  </template>
  <p v-else class="text-muted-foreground text-[13px]">
    {{
      t(session.friends ? "settings.invite.together" : "settings.invite.inPair", {
        me: session.meName,
        partner: session.partnerName,
      })
    }}
  </p>
</template>
