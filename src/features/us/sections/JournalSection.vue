<script setup lang="ts">
import { computed } from "vue";
import { THANKS_CHIPS_SOLO } from "@/domain/care";
import { isWithinLastWeek } from "@/domain/dates";
import { EmptyState } from "@/shared/components";
import { plural, type PluralForms } from "@/shared/lib/plural";
import { useSessionStore } from "@/stores/session";
import ThanksFeed from "../components/ThanksFeed.vue";
import ThanksForm from "../components/ThanksForm.vue";
import WeekSplit from "../components/WeekSplit.vue";
import { useThanks } from "../useThanks";

const ENTRY_FORMS: PluralForms = ["запись", "записи", "записей"];

/** Solo mode: a gratitude journal instead of thanks to a partner */
const session = useSessionStore();
const { list } = useThanks();

const split = computed(() => {
  const week = list.value.filter((x) => isWithinLastWeek(x.created_at)).length;
  const total = list.value.length;
  return [
    { title: "За неделю", value: week, unit: plural(week, ENTRY_FORMS) },
    { title: "Всего", value: total, unit: plural(total, ENTRY_FORMS) },
  ];
});
</script>

<template>
  <ThanksForm
    :title="`Сегодня я ${session.gendered('благодарен', 'благодарна', 'благодарен(на)')} за…`"
    placeholder="Например: за тёплый чай и тихий вечер"
    :chips="THANKS_CHIPS_SOLO"
    submit="Записать 💛"
  />
  <WeekSplit :stats="split" />
  <ThanksFeed v-if="list.length" journal />
  <EmptyState v-else>
    Дневник благодарности: каждый день одна строчка о хорошем. Через месяц будет приятно перечитать
    💛
  </EmptyState>
</template>
