<script setup lang="ts">
import { computed } from "vue";
import { isWithinLastWeek } from "@/domain/dates";
import { THANKS_CHIPS_COUPLE } from "@/domain/care";
import { EmptyState } from "@/shared/components";
import { useSessionStore } from "@/stores/session";
import InviteCard from "@/features/settings/InviteCard.vue";
import ThanksFeed from "../components/ThanksFeed.vue";
import ThanksForm from "../components/ThanksForm.vue";
import WeekSplit from "../components/WeekSplit.vue";
import { useThanks } from "../useThanks";
import JournalSection from "./JournalSection.vue";

/** «Спасибо»: thanks for the little things, both ways */
const session = useSessionStore();
const { list } = useThanks();

const split = computed(() => {
  const week = list.value.filter((x) => isWithinLastWeek(x.created_at));
  const mine = week.filter((x) => x.who === "me").length;
  return [
    { title: "Ты за неделю", value: mine, unit: "спасибо" },
    { title: `${session.partnerName} за неделю`, value: week.length - mine, unit: "спасибо" },
  ];
});
</script>

<template>
  <JournalSection v-if="session.solo" />
  <template v-else-if="!session.app.partner">
    <InviteCard />
    <EmptyState>
      Когда {{ session.other.nom }} присоединится, здесь можно будет благодарить друг друга.
    </EmptyState>
  </template>
  <template v-else>
    <ThanksForm
      :title="`Спасибо, ${session.partnerName}, за…`"
      placeholder="Например: что заварил мне чай вечером"
      :chips="THANKS_CHIPS_COUPLE"
      submit="Поблагодарить 💛"
    />
    <WeekSplit :stats="split" />
    <ThanksFeed v-if="list.length" />
    <EmptyState v-else>
      Здесь будут ваши «спасибо» за мелочи, которые легко не заметить. Напиши первое «спасибо» 💛
    </EmptyState>
  </template>
</template>
