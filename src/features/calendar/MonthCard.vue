<script setup lang="ts">
import { computed } from "vue";
import { formatDate, MONTHS, monthGrid, today, WEEKDAYS_SHORT } from "@/domain/dates";
import { isImportantOn } from "@/domain/relationship";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import { useCalendarUiStore } from "./calendarUi";
import { dayVariants } from "./dayVariants";

const session = useSessionStore();
const ui = useCalendarUiStore();

const title = computed(() => {
  const [y = "", m = 1] = ui.month.split("-");
  return `${MONTHS[Number(m) - 1] ?? ""} ${y}`;
});

const cells = computed(() => {
  const t = today();
  const { plans, birthdays, dates = [] } = session.app;
  return monthGrid(ui.month).map((c) => ({
    ...c,
    label: formatDate(c.date),
    selected: c.date === ui.selected,
    cls: cn(
      dayVariants({
        out: !c.inMonth,
        plan: plans.some((p) => p.day === c.date),
        birthday: birthdays.some((b) => b.bdate.slice(5) === c.date.slice(5)),
        today: c.date === t,
        selected: c.date === ui.selected,
        important: dates.some((x) => isImportantOn(x, c.date)),
      }),
    ),
  }));
});

const legend = [
  { label: "План", dot: "bg-peach" },
  { label: "День рождения", dot: "bg-navy" },
  { label: "Наша дата", dot: "bg-peach-ink" },
];
</script>

<template>
  <Card>
    <div class="mb-2.5 flex items-center justify-center gap-[18px]">
      <Button
        variant="ghost"
        size="none"
        class="text-foreground size-[34px] text-[22px]"
        aria-label="Предыдущий месяц"
        @click="ui.shift(-1)"
      >
        ‹
      </Button>
      <b class="min-w-[9ch] text-center text-[17px] font-extrabold">{{ title }}</b>
      <Button
        variant="ghost"
        size="none"
        class="text-foreground size-[34px] text-[22px]"
        aria-label="Следующий месяц"
        @click="ui.shift(1)"
      >
        ›
      </Button>
    </div>
    <div class="grid grid-cols-7 gap-1.5 text-center">
      <div
        v-for="w in WEEKDAYS_SHORT"
        :key="w"
        class="text-muted-foreground py-0.5 text-xs font-bold"
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
      </button>
    </div>
    <div class="text-muted-foreground mt-3 flex justify-center gap-3.5 text-xs font-semibold">
      <span v-for="l in legend" :key="l.label">
        <i :class="cn('mr-[5px] inline-block size-2.5 rounded-full align-[-1px]', l.dot)" />{{
          l.label
        }}
      </span>
    </div>
  </Card>
</template>
