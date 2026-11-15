<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef, watch, type ComponentPublicInstance } from "vue";
import { formatShort, formatTime, formatWeekdayDate, parseDate, today } from "@/domain/dates";
import { t } from "@/domain/i18n";
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

const heading = computed(() => formatWeekdayDate(ui.selected));
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
  const what = title.value.trim();
  const tm = time.value.trim();
  const day = ui.selected;
  if (!what) {
    notify(t("calendar.day.needTitle"));
    return;
  }
  session.mutate(
    "plan.add",
    { day, time: tm, title: what },
    (s) => {
      s.plans.push({ id: tmpId(), day, time: tm || null, title: what });
    },
    t("calendar.day.added", { date: formatShort(day) }),
  );
  title.value = "";
  time.value = "";
}

function remove(id: Id) {
  if (isTmp(id)) {
    notify(t("common.savingWait"));
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
      <Badge v-if="ui.selected === today()" variant="secondary" size="sm">
        {{ t("calendar.today") }}
      </Badge>
    </div>
    <div class="mt-2.5 flex flex-col gap-2">
      <AgendaRow v-for="b in birthdays" :key="b.id" tone="navy">
        {{
          b.age > 0
            ? t("calendar.day.birthdayAge", { name: b.name, age: b.age })
            : t("calendar.day.birthday", { name: b.name })
        }}
        <template #right>🎂</template>
      </AgendaRow>
      <AgendaRow v-for="p in plans" :key="p.id" tone="fill">
        {{ p.title }}
        <template #right>{{ p.time ? formatTime(p.time) : t("calendar.day.allDay") }}</template>
        <template #action>
          <RemoveButton
            :label="t('calendar.day.removePlan')"
            class="text-navy"
            @remove="remove(p.id)"
          />
        </template>
      </AgendaRow>
      <p
        v-if="!birthdays.length && !plans.length"
        class="bg-muted text-muted-foreground rounded-2xl px-3.5 py-3 text-center text-sm font-semibold"
      >
        {{ t("calendar.day.empty") }}
      </p>
    </div>
    <form class="mt-3 flex flex-col gap-2" @submit.prevent="add">
      <Input
        ref="input"
        v-model="title"
        :placeholder="t('calendar.day.placeholder')"
        maxlength="100"
      />
      <div class="grid grid-cols-2 gap-2">
        <DateField v-model="time" type="time" :placeholder="t('calendar.day.time')" />
        <Button type="submit">{{ t("common.actions.add") }}</Button>
      </div>
    </form>
  </Card>
</template>
