<script setup lang="ts">
import { computed } from "vue";
import { daysBetween, formatDate, today } from "@/domain/dates";
import { formatNumber, t, tn } from "@/domain/i18n";
import { nextAnniversary } from "@/domain/relationship";
import { StatTile } from "@/shared/components";
import { useSessionStore } from "@/stores/session";
import HeroStat from "./HeroStat.vue";
import RingStat from "./RingStat.vue";

const YEAR_DAYS = 365;

/**
 * Days together as the big tile. A couple also sees a ring that fills up towards
 * the next anniversary; friends and solo see wishes and memories instead.
 */
const session = useSessionStore();

const days = computed(() => daysBetween(session.app.couple.start_date, today()));

const hero = computed(() => {
  if (!session.isPair) {
    const n = Math.max(0, days.value) + 1;
    return {
      value: formatNumber(n),
      label: tn(session.solo ? "us.stats.daysSolo" : "us.stats.daysFriends", n),
      sub: undefined,
    };
  }
  return {
    value: formatNumber(Math.max(0, days.value)),
    label: tn("us.stats.daysPair", days.value),
    sub: t("us.stats.since", { date: formatDate(session.app.couple.start_date) }),
  };
});

const anniversary = computed(() => {
  if (!session.isPair) return null;
  const ann = nextAnniversary(session.app.couple.start_date, today());
  if (ann.inDays === 0) {
    return {
      value: "🎉",
      label: t("us.stats.anniversaryToday", { years: ann.years }),
      percent: 100,
    };
  }
  return {
    value: ann.inDays,
    label: tn("us.stats.toAnniversary", ann.inDays, { years: ann.years }),
    percent: Math.min(100, Math.max(0, 100 - (ann.inDays / YEAR_DAYS) * 100)),
  };
});

const extras = computed(() => {
  if (session.isPair) return [];
  const wishes = session.app.wishes.filter((w) => !w.done).length;
  const memories = (session.app.memories ?? []).length;
  return [
    { value: wishes, label: tn("us.stats.wishes", wishes) },
    { value: memories, label: tn("us.stats.memories", memories) },
  ];
});
</script>

<template>
  <div class="grid grid-cols-6 gap-2">
    <HeroStat
      :value="hero.value"
      :label="hero.label"
      :sub="hero.sub"
      class="data-wide:col-span-6 col-span-4"
      :data-wide="!anniversary || undefined"
    />
    <RingStat
      v-if="anniversary"
      :value="anniversary.value"
      :label="anniversary.label"
      :percent="anniversary.percent"
      class="col-span-2"
    />
    <StatTile
      v-for="(s, i) in extras"
      :key="i"
      :value="s.value"
      :label="s.label"
      class="col-span-3"
    />
  </div>
</template>
