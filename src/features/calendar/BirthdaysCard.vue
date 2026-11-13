<script setup lang="ts">
import { computed, ref } from "vue";
import { inDays, MONTHS_GEN, nextOccurrence, parseDate, today } from "@/domain/dates";
import { isTmp, tmpId } from "@/domain/ids";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import { DateField, ListRow, ListSub, ListTitle, RemoveButton } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSessionStore } from "@/stores/session";

const session = useSessionStore();

const list = computed(() =>
  session.app.birthdays
    .map((b) => {
      const next = nextOccurrence(b.bdate);
      const d = parseDate(next);
      return {
        ...b,
        next,
        dayOfMonth: d.getDate(),
        month: (MONTHS_GEN[d.getMonth()] ?? "").slice(0, 3),
        turns: d.getFullYear() - parseDate(b.bdate).getFullYear(),
      };
    })
    .sort((a, b) => a.next.localeCompare(b.next)),
);

const adding = ref(false);
const name = ref("");
const bdate = ref("");
const max = today();

function add() {
  const n = name.value.trim();
  const d = bdate.value.trim();
  if (!n || !d) {
    notify("Нужны имя и дата");
    return;
  }
  session.mutate(
    "bday.add",
    { name: n, bdate: d },
    (s) => {
      s.birthdays.push({ id: tmpId(), name: n, bdate: d });
    },
    "Добавлено: " + n,
  );
  name.value = "";
  bdate.value = "";
  adding.value = false;
}

function remove(id: Id) {
  if (isTmp(id)) {
    notify("Секунду, сохраняем…");
    return;
  }
  session.mutate("bday.delete", { id }, (s) => {
    s.birthdays = s.birthdays.filter((x) => x.id !== id);
  });
}
</script>

<template>
  <Card>
    <div class="flex items-center justify-between gap-2.5">
      <CardTitle>Дни рождения</CardTitle>
      <Button v-if="list.length" variant="link" :aria-expanded="adding" @click="adding = !adding">
        {{ adding ? "Скрыть" : "+ Добавить" }}
      </Button>
    </div>
    <p class="text-muted-foreground text-[13px]">
      Напомним {{ session.solo ? "тебе" : "вам обоим" }} за 3 дня и в сам день
    </p>
    <form
      v-if="adding || !list.length"
      class="bg-muted mt-3 flex flex-col gap-2 rounded-2xl p-3"
      @submit.prevent="add"
    >
      <Input v-model="name" placeholder="Имя" maxlength="60" />
      <div class="grid grid-cols-2 gap-2">
        <DateField v-model="bdate" placeholder="Дата рождения" :max="max" />
        <Button type="submit">Добавить</Button>
      </div>
    </form>
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="b in list" :key="b.id">
        <template #lead>
          <span
            class="bg-muted grid size-[42px] flex-none place-content-center rounded-2xl text-center leading-none"
          >
            <b class="tabular text-[15px] font-extrabold">{{ b.dayOfMonth }}</b>
            <span class="text-muted-foreground mt-0.5 text-[10px] font-bold">{{ b.month }}</span>
          </span>
        </template>
        <ListTitle>{{ b.name }}</ListTitle>
        <ListSub>{{ inDays(b.next) }} · исполнится {{ b.turns }}</ListSub>
        <template #trail><RemoveButton @remove="remove(b.id)" /></template>
      </ListRow>
    </ul>
  </Card>
</template>
