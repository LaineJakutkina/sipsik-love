<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch, type ComponentPublicInstance } from "vue";
import { formatShort, MONTHS_GEN, parseDate, today, WEEKDAYS } from "@/domain/dates";
import { isTmp, tmpId } from "@/domain/ids";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import { DateField, RemoveButton } from "@/shared/components";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSessionStore } from "@/stores/session";
import AgendaRow from "./AgendaRow.vue";
import { useCalendarUiStore } from "./calendarUi";

const session = useSessionStore();
const ui = useCalendarUiStore();

const heading = computed(() => {
  const d = parseDate(ui.selected);
  return `${WEEKDAYS[d.getDay()]}, ${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
});
const plans = computed(() =>
  session.app.plans
    .filter((p) => p.day === ui.selected)
    .sort((a, b) => (a.time ?? "").localeCompare(b.time ?? "")),
);
const birthdays = computed(() => {
  const year = parseDate(ui.selected).getFullYear();
  return session.app.birthdays
    .filter((b) => b.bdate.slice(5) === ui.selected.slice(5))
    .map((b) => ({ ...b, age: year - parseDate(b.bdate).getFullYear() }));
});

const title = ref("");
const time = ref("");

function add() {
  const t = title.value.trim();
  const tm = time.value.trim();
  const day = ui.selected;
  if (!t) {
    notify("Напиши, что планируете");
    return;
  }
  session.mutate(
    "plan.add",
    { day, time: tm, title: t },
    (s) => {
      s.plans.push({ id: tmpId(), day, time: tm || null, title: t });
    },
    "План добавлен на " + formatShort(day),
  );
  title.value = "";
  time.value = "";
}

function remove(id: Id) {
  if (isTmp(id)) {
    notify("Секунду, сохраняем…");
    return;
  }
  session.mutate("plan.delete", { id }, (s) => {
    s.plans = s.plans.filter((p) => p.id !== id);
  });
}

const card = useTemplateRef<ComponentPublicInstance>("card");
const input = useTemplateRef<ComponentPublicInstance>("input");

// “План” quick action: bring the day card into view and focus the title input
function focusPlan() {
  if (!ui.focusPlan) return;
  ui.focusPlan = false;
  setTimeout(() => {
    (card.value?.$el as HTMLElement | undefined)?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    (input.value?.$el as HTMLInputElement | undefined)?.focus({ preventScroll: true });
  }, 60);
}
onMounted(focusPlan);
watch(() => ui.focusPlan, focusPlan);
</script>

<template>
  <Card id="dayCard" ref="card">
    <div class="flex items-center gap-2">
      <CardTitle>{{ heading }}</CardTitle>
      <Badge v-if="ui.selected === today()" variant="secondary" size="sm">сегодня</Badge>
    </div>
    <div class="mt-2.5 flex flex-col gap-2">
      <AgendaRow v-for="b in birthdays" :key="b.id" tone="navy">
        День рождения: {{ b.name }}{{ b.age > 0 ? `, ${b.age}` : "" }}
        <template #right>🎂</template>
      </AgendaRow>
      <AgendaRow v-for="p in plans" :key="p.id" tone="fill">
        {{ p.title }}
        <template #right>{{ p.time ?? "день" }}</template>
        <template #action>
          <RemoveButton label="Удалить план" class="text-navy" @remove="remove(p.id)" />
        </template>
      </AgendaRow>
      <p
        v-if="!birthdays.length && !plans.length"
        class="bg-muted text-muted-foreground rounded-2xl px-3.5 py-3 text-center text-sm font-semibold"
      >
        На этот день пока ничего нет
      </p>
    </div>
    <form class="mt-3 flex flex-col gap-2" @submit.prevent="add">
      <Input ref="input" v-model="title" placeholder="Что планируем" maxlength="100" />
      <div class="grid grid-cols-2 gap-2">
        <DateField v-model="time" type="time" placeholder="Время" />
        <Button type="submit">Добавить</Button>
      </div>
    </form>
  </Card>
</template>
