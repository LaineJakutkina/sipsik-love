<script setup lang="ts">
import { computed } from "vue";
import { isWithinLastWeek } from "@/domain/dates";
import { t } from "@/domain/i18n";
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
    { title: t("us.thanksSection.mineWeek"), value: mine, unit: t("us.thanksSection.unit") },
    {
      title: t("us.thanksSection.partnerWeek", { name: session.partnerName }),
      value: week.length - mine,
      unit: t("us.thanksSection.unit"),
    },
  ];
});
</script>

<template>
  <JournalSection v-if="session.solo" />
  <template v-else-if="!session.app.partner">
    <InviteCard />
    <EmptyState>
      {{ t("us.thanksSection.waitPartner", { other: session.other.nom }) }}
    </EmptyState>
  </template>
  <template v-else>
    <ThanksForm
      :title="t('us.thanksSection.title', { name: session.partnerName })"
      :placeholder="t('us.thanksSection.placeholder')"
      :chips="THANKS_CHIPS_COUPLE"
      :submit="t('us.thanksSection.submit')"
    />
    <WeekSplit :stats="split" />
    <ThanksFeed v-if="list.length" />
    <EmptyState v-else>
      {{ t("us.thanksSection.empty") }}
    </EmptyState>
  </template>
</template>
