<script setup lang="ts">
import { computed } from "vue";
import { daysBetween, MONTHS_GEN, parseDate, today } from "@/domain/dates";
import { nextAnniversary } from "@/domain/relationship";
import { StatTile } from "@/shared/components";
import { DAY_FORMS, formatNumber, plural, type PluralForms } from "@/shared/lib/plural";
import { useSessionStore } from "@/stores/session";

const WISH_FORMS: PluralForms = ["желание", "желания", "желаний"];
const MEMORY_FORMS: PluralForms = ["воспоминание", "воспоминания", "воспоминаний"];

interface Stat {
  value: string | number;
  label: string;
}

/** Three tiles: days together, since when, next anniversary (solo: cat, wishes, memories) */
const session = useSessionStore();

const stats = computed((): Stat[] => {
  const s = session.app;
  const t = today();
  const days = daysBetween(s.couple.start_date, t);
  if (session.solo) {
    const wishes = s.wishes.filter((w) => !w.done).length;
    const memories = (s.memories ?? []).length;
    return [
      {
        value: formatNumber(Math.max(0, days) + 1),
        label: `${plural(days + 1, DAY_FORMS)} вместе с котиком`,
      },
      { value: wishes, label: `${plural(wishes, WISH_FORMS)} в вишлисте` },
      { value: memories, label: plural(memories, MEMORY_FORMS) },
    ];
  }
  const start = parseDate(s.couple.start_date);
  const ann = nextAnniversary(s.couple.start_date, t);
  return [
    { value: formatNumber(Math.max(0, days)), label: `${plural(days, DAY_FORMS)} вместе` },
    {
      value: `${start.getDate()} ${MONTHS_GEN[start.getMonth()]?.slice(0, 3)}`,
      label: `с ${start.getFullYear()} года`,
    },
    ann.inDays === 0
      ? { value: "Сегодня", label: `${ann.years}-я годовщина` }
      : {
          value: ann.inDays,
          label: `${plural(ann.inDays, DAY_FORMS)} до ${ann.years}-й годовщины`,
        },
  ];
});
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <StatTile
      v-for="(s, i) in stats"
      :key="i"
      :value="s.value"
      :label="s.label"
      :highlight="i === 0"
    />
  </div>
</template>
