<script setup lang="ts">
import { computed, ref } from "vue";
import { daysBetween, formatDate, today } from "@/domain/dates";
import { isTmp, tmpId } from "@/domain/ids";
import { importantDates } from "@/domain/relationship";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import { DateField, ListRow, ListSub, ListTitle, RemoveButton } from "@/shared/components";
import { DAY_FORMS, plural } from "@/shared/lib/plural";
import { Badge } from "@/shared/ui/badge";
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

const adding = ref(false);
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
  adding.value = false;
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
    <div class="flex items-center justify-between gap-2.5">
      <CardTitle>Важные даты</CardTitle>
      <Button variant="link" :aria-expanded="adding" @click="adding = !adding">
        {{ adding ? "Скрыть" : "+ Добавить" }}
      </Button>
    </div>
    <p class="text-muted-foreground text-[13px]">
      Напомним {{ session.solo ? "тебе" : "вам обоим" }} за 3 дня и в сам день
    </p>
    <form
      v-if="adding"
      class="bg-muted mt-3 flex flex-col gap-2 rounded-2xl p-3"
      @submit.prevent="add"
    >
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
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="x in items" :key="x.id ?? x.title">
        <template #lead>
          <span
            class="bg-accent grid size-[42px] flex-none place-items-center rounded-2xl text-[18px]"
          >
            {{ x.icon }}
          </span>
        </template>
        <ListTitle>{{ x.title }}</ListTitle>
        <ListSub>{{ formatDate(x.next) }}</ListSub>
        <template #trail>
          <span v-if="x.past" class="text-muted-foreground flex-none text-xs font-bold">было</span>
          <Badge v-else-if="x.days === 0" variant="secondary">сегодня</Badge>
          <Badge v-else variant="soft" class="tabular">
            {{ x.days }} {{ plural(x.days, DAY_FORMS) }}
          </Badge>
          <RemoveButton v-if="x.id !== undefined" @remove="remove(x.id)" />
        </template>
      </ListRow>
    </ul>
  </Card>
</template>
