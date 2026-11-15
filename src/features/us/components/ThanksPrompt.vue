<script setup lang="ts">
import { computed } from "vue";
import { isoToDay, today } from "@/domain/dates";
import { t } from "@/domain/i18n";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useUsUiStore } from "../usUi";
import CtaCard from "./CtaCard.vue";

/** Nudge to say thanks, until the user has done it today */
const session = useSessionStore();
const ui = useUsUiStore();

const visible = computed(() => {
  const s = session.app;
  if ((!s.partner && !session.solo) || !s.thanks) return false;
  const now = today();
  return !s.thanks.some((x) => x.who === "me" && isoToDay(x.created_at) === now);
});

const text = computed(() =>
  session.solo
    ? session.gendered("us.thanksPrompt.textSolo")
    : session.gendered("us.thanksPrompt.textCouple", { name: session.partnerName }),
);
</script>

<template>
  <CtaCard v-if="visible" tone="lilac" :title="t('us.thanksPrompt.title')" emoji="💜" :text="text">
    <Button class="relative" @click="ui.show('thanks')">
      {{ session.solo ? t("us.thanksPrompt.write") : t("us.thanksPrompt.thank") }}
    </Button>
  </CtaCard>
</template>
