<script setup lang="ts">
import { computed } from "vue";
import { THANKS_CHIPS_SOLO } from "@/domain/care";
import { isWithinLastWeek } from "@/domain/dates";
import { t, tn } from "@/domain/i18n";
import { EmptyState } from "@/shared/components";
import { useSessionStore } from "@/stores/session";
import ThanksFeed from "../components/ThanksFeed.vue";
import ThanksForm from "../components/ThanksForm.vue";
import WeekSplit from "../components/WeekSplit.vue";
import { useThanks } from "../useThanks";

/** Solo mode: a gratitude journal instead of thanks to a partner */
const session = useSessionStore();
const { list } = useThanks();

const split = computed(() => {
  const week = list.value.filter((x) => isWithinLastWeek(x.created_at)).length;
  const total = list.value.length;
  return [
    { title: t("us.journal.week"), value: week, unit: tn("us.journal.entries", week) },
    { title: t("us.journal.total"), value: total, unit: tn("us.journal.entries", total) },
  ];
});
</script>

<template>
  <ThanksForm
    :title="session.gendered('us.journal.title')"
    :placeholder="t('us.journal.placeholder')"
    :chips="THANKS_CHIPS_SOLO"
    :submit="t('us.journal.submit')"
  />
  <WeekSplit :stats="split" />
  <ThanksFeed v-if="list.length" journal />
  <EmptyState v-else>
    {{ t("us.journal.empty") }}
  </EmptyState>
</template>
