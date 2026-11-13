<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import CtaCard from "./CtaCard.vue";

/** Surprise note for the partner (or the future self), delivered at a random moment */
const session = useSessionStore();
const sheets = useSheetsStore();

const title = computed(() => (session.solo ? "Записка себе в будущее" : "Записка-сюрприз"));
const text = computed(() => {
  const way = session.app.notes.sent.filter((n) => !n.delivered_at).length;
  const who = session.solo ? "Придёт тебе" : `${session.partnerName} получит её`;
  return `${who} в случайный момент недели${way ? `. В пути: ${way}` : ""}`;
});
</script>

<template>
  <CtaCard tone="soft" emoji="💌" :title="title" :text="text">
    <Button variant="secondary" class="relative flex-none" @click="sheets.open('note')">Написать</Button>
  </CtaCard>
</template>
