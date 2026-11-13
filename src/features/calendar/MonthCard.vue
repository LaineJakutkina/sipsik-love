<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/vue";
import { computed } from "vue";
import { formatDate, MONTHS, monthGrid, today, WEEKDAYS_SHORT } from "@/domain/dates";
import { isImportantOn } from "@/domain/relationship";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useCalendarUiStore } from "./calendarUi";
import { DAY_DOT, dayVariants, type DayMark } from "./dayVariants";

const session = useSessionStore();
const ui = useCalendarUiStore();

const title = computed(() => {
  const [y = "", m = 1] = ui.month.split("-");
  return `${MONTHS[Number(m) - 1] ?? ""} ${y}`;
});
/** «Сегодня» brings the calendar back once you have wandered off */
const away = computed(() => {
  const t = today();
  return ui.selected !== t || ui.month !== t.slice(0, 7);
});

const cells = computed(() => {
  const t = today();
  const { plans, birthdays, dates = [] } = session.app;
  return monthGrid(ui.month).map((c) => {
    const marks: DayMark[] = [];
    if (plans.some((p) => p.day === c.date)) marks.push("plan");
    if (birthdays.some((b) => b.bdate.slice(5) === c.date.slice(5))) marks.push("birthday");
    if (dates.some((x) => isImportantOn(x, c.date))) marks.push("important");
    return {
      ...c,
      marks,
      label: formatDate(c.date),
      selected: c.date === ui.selected,
      cls: dayVariants({
        out: !c.inMonth,
        today: c.date === t,
        selected: c.date === ui.selected,
      }),
    };
  });
});

const legend: { label: string; mark: DayMark }[] = [
  { label: "План", mark: "plan" },
  { label: "День рождения", mark: "birthday" },
  { label: session.isPair ? "Наша дата" : "Важная дата", mark: "important" },
];
</script>

<template>
  <Card>
    <div class="mb-3 flex items-center gap-2">
      <b class="min-w-0 flex-1 truncate text-lg font-extrabold">{{ title }}</b>
      <Button v-if="away" variant="outline" size="sm" @click="ui.select(today())">Сегодня</Button>
      <Button
        variant="ghost"
        size="none"
        class="bg-muted text-foreground size-9"
        aria-label="Предыдущий месяц"
        @click="ui.shift(-1)"
      >
        <ChevronLeftIcon class="size-5" :stroke-width="2.4" />
      </Button>
      <Button
        variant="ghost"
        size="none"
        class="bg-muted text-foreground size-9"
        aria-label="Следующий месяц"
        @click="ui.shift(1)"
      >
        <ChevronRightIcon class="size-5" :stroke-width="2.4" />
      </Button>
    </div>
    <div class="grid grid-cols-7 gap-1 text-center">
      <div
        v-for="w in WEEKDAYS_SHORT"
        :key="w"
        class="text-muted-foreground pb-1 text-[11px] font-bold uppercase"
      >
        {{ w }}
      </div>
      <button
        v-for="c in cells"
        :key="c.date"
        type="button"
        :class="c.cls"
        :aria-pressed="c.selected"
        :aria-label="c.label"
        @click="ui.select(c.date)"
      >
        {{ c.day }}
        <span
          v-if="c.marks.length"
          class="absolute inset-x-0 bottom-[5px] flex justify-center gap-[3px]"
          aria-hidden="true"
        >
          <i v-for="m in c.marks" :key="m" :class="cn('size-[5px] rounded-full', DAY_DOT[m])" />
        </span>
      </button>
    </div>
    <div
      class="text-muted-foreground mt-3 flex flex-wrap justify-center gap-x-3.5 gap-y-1 text-xs font-semibold"
    >
      <span v-for="l in legend" :key="l.mark" class="flex items-center gap-1.5">
        <i :class="cn('size-2 rounded-full', DAY_DOT[l.mark])" />{{ l.label }}
      </span>
    </div>
  </Card>
</template>
