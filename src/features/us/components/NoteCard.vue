<script setup lang="ts">
import { computed } from "vue";
import { t } from "@/domain/i18n";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import CtaCard from "./CtaCard.vue";

/** Surprise note for the partner (or the future self), delivered at a random moment */
const session = useSessionStore();
const sheets = useSheetsStore();

const title = computed(() => t(session.solo ? "us.note.titleSolo" : "us.note.titleCouple"));
const text = computed(() => {
  const way = session.app.notes.sent.filter((n) => !n.delivered_at).length;
  const when = session.solo
    ? t("us.note.textSolo")
    : t("us.note.textCouple", { name: session.partnerName });
  return way ? t("us.note.onTheWay", { text: when, n: way }) : when;
});
</script>

<template>
  <CtaCard tone="soft" emoji="💌" :title="title" :text="text">
    <Button variant="secondary" class="relative flex-none" @click="sheets.open('note')">
      {{ t("us.note.write") }}
    </Button>
  </CtaCard>
</template>
