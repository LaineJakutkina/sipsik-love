<script setup lang="ts">
import { computed, ref } from "vue";
import { formatShort, inDays, nextOccurrence, parseDate, today } from "@/domain/dates";
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
        turns: d.getFullYear() - parseDate(b.bdate).getFullYear(),
      };
    })
    .sort((a, b) => a.next.localeCompare(b.next)),
);

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
    <CardTitle>Дни рождения</CardTitle>
    <p class="text-muted-foreground mt-0.5 text-[13px]">
      Бот напомнит {{ session.solo ? "тебе" : "вам обоим" }} за 3 дня и в сам день
    </p>
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="b in list" :key="b.id">
        <template #lead>
          <span
            class="bg-primary text-primary-foreground grid size-[38px] flex-none place-items-center rounded-full text-[13px] font-extrabold"
          >
            {{ b.dayOfMonth }}
          </span>
        </template>
        <ListTitle>{{ b.name }}</ListTitle>
        <ListSub
          >{{ formatShort(b.next) }} · {{ inDays(b.next) }}, исполнится {{ b.turns }}</ListSub
        >
        <template #trail><RemoveButton @remove="remove(b.id)" /></template>
      </ListRow>
      <li
        v-if="!list.length"
        class="text-muted-foreground px-2 py-[18px] text-center text-sm font-semibold"
      >
        Добавь близких, и бот напомнит заранее
      </li>
    </ul>
    <form class="mt-2.5 flex flex-col gap-2" @submit.prevent="add">
      <Input v-model="name" placeholder="Имя" maxlength="60" />
      <div class="grid grid-cols-2 gap-2">
        <DateField v-model="bdate" placeholder="Дата рождения" :max="max" />
        <Button type="submit">Добавить</Button>
      </div>
    </form>
  </Card>
</template>
