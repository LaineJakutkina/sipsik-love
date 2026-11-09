<script setup lang="ts">
import { computed, ref } from "vue";
import { daysBetween, formatDate, today } from "@/domain/dates";
import { isTmp, tmpId } from "@/domain/ids";
import { importantDates } from "@/domain/relationship";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import { DateField, ListRow, ListSub, ListTitle, RemoveButton } from "@/shared/components";
import { DAY_FORMS, plural } from "@/shared/lib/plural";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { useSessionStore } from "@/stores/session";

const session = useSessionStore();

const items = computed(() => {
  const t = today();
  const { couple, dates } = session.app;
  return importantDates(couple.start_date, dates ?? [], t, session.isPair).map((x) => ({
    ...x,
    days: daysBetween(t, x.next),
  }));
});

const title = ref("");
const day = ref("");
const yearly = ref(true);

function add() {
  const t = title.value.trim();
  const d = day.value.trim();
  const y = yearly.value;
  if (!t || !d) {
    notify("Нужны название и дата");
    return;
  }
  session.mutate(
    "date.add",
    { title: t, day: d, yearly: y },
    (s) => {
      (s.dates ??= []).push({ id: tmpId(), title: t, day: d, yearly: y });
    },
    "Дата добавлена 💗",
  );
  title.value = "";
  day.value = "";
  yearly.value = true;
}

function remove(id: Id) {
  if (isTmp(id)) {
    notify("Секунду, сохраняем…");
    return;
  }
  session.mutate("date.delete", { id }, (s) => {
    s.dates = (s.dates ?? []).filter((x) => x.id !== id);
  });
}
</script>

<template>
  <Card>
    <CardTitle>Важные даты</CardTitle>
    <p class="text-muted-foreground mt-0.5 text-[13px]">
      Бот напомнит {{ session.solo ? "тебе" : "вам обоим" }} за 3 дня и в сам день
    </p>
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="x in items" :key="x.id ?? x.title">
        <template #lead>
          <span
            class="bg-accent grid size-[38px] flex-none place-items-center rounded-full text-[17px]"
          >
            {{ x.icon }}
          </span>
        </template>
        <ListTitle>{{ x.title }}</ListTitle>
        <ListSub>{{ formatDate(x.next) }}</ListSub>
        <template #trail>
          <span class="text-muted-foreground tabular flex-none text-right text-xs font-bold">
            <template v-if="x.past">было</template>
            <b v-else-if="x.days === 0" class="text-foreground block text-base">сегодня</b>
            <template v-else>
              <b class="text-foreground block text-base">{{ x.days }}</b
              >{{ plural(x.days, DAY_FORMS) }}
            </template>
          </span>
          <RemoveButton v-if="x.id !== undefined" @remove="remove(x.id)" />
        </template>
      </ListRow>
    </ul>
    <form class="mt-2.5 flex flex-col gap-2" @submit.prevent="add">
      <Input v-model="title" placeholder="Например, первое свидание" maxlength="80" />
      <div class="grid grid-cols-2 gap-2">
        <DateField v-model="day" placeholder="Дата" />
        <Button type="submit">Добавить</Button>
      </div>
      <label class="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <Switch v-model="yearly" />
        <span>Повторять каждый год</span>
      </label>
    </form>
  </Card>
</template>
