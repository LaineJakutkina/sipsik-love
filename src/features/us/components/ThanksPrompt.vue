<script setup lang="ts">
import { computed } from "vue";
import { isoToDay, today } from "@/domain/dates";
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
  const t = today();
  return !s.thanks.some((x) => x.who === "me" && isoToDay(x.created_at) === t);
});

const text = computed(() => {
  const grateful = session.gendered("благодарен", "благодарна", "благодарен(на)");
  return session.solo
    ? `За что ты ${grateful} сегодняшнему дню?`
    : `За что ты ${grateful} ${session.partnerName} сегодня?`;
});
</script>

<template>
  <CtaCard v-if="visible" tone="lilac" title="💜 Спасибо за мелочи" :text="text">
    <Button @click="ui.show('thanks')">{{ session.solo ? "Записать" : "Поблагодарить" }}</Button>
  </CtaCard>
</template>
