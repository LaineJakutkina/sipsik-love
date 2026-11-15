<script setup lang="ts">
import { computed, ref } from "vue";
import { daysBetween, formatDate, today } from "@/domain/dates";
import { t, tn } from "@/domain/i18n";
import { isTmp, tmpId } from "@/domain/ids";
import { importantDates } from "@/domain/relationship";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import {
  AnimatedList,
  Expand,
  DateField,
  ListRow,
  ListSub,
  ListTitle,
  RemoveButton,
} from "@/shared/components";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { useSessionStore } from "@/stores/session";

const session = useSessionStore();

const items = computed(() => {
  const now = today();
  const { couple, dates } = session.app;
  return importantDates(couple.start_date, dates ?? [], now, session.isPair).map((x) => ({
    ...x,
    days: daysBetween(now, x.next),
  }));
});

const adding = ref(false);
const title = ref("");
const day = ref("");
const yearly = ref(true);

function add() {
  const what = title.value.trim();
  const d = day.value.trim();
  const y = yearly.value;
  if (!what || !d) {
    notify(t("calendar.dates.needFields"));
    return;
  }
  session.mutate(
    "date.add",
    { title: what, day: d, yearly: y },
    (s) => {
      (s.dates ??= []).push({ id: tmpId(), title: what, day: d, yearly: y });
    },
    t("calendar.dates.added"),
  );
  title.value = "";
  day.value = "";
  yearly.value = true;
  adding.value = false;
}

function remove(id: Id) {
  if (isTmp(id)) {
    notify(t("common.savingWait"));
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
      <CardTitle>{{ t("calendar.dates.title") }}</CardTitle>
      <Button variant="link" :aria-expanded="adding" @click="adding = !adding">
        {{ adding ? t("common.actions.hide") : t("common.actions.addMore") }}
      </Button>
    </div>
    <p class="text-muted-foreground text-[13px]">
      {{ session.solo ? t("calendar.remind.solo") : t("calendar.remind.both") }}
    </p>
    <Expand>
      <form
        v-if="adding"
        class="bg-muted mt-3 flex flex-col gap-2 rounded-2xl p-3"
        @submit.prevent="add"
      >
        <Input v-model="title" :placeholder="t('calendar.dates.placeholder')" maxlength="80" />
        <div class="grid grid-cols-2 gap-2">
          <DateField v-model="day" :placeholder="t('calendar.dates.date')" />
          <Button type="submit">{{ t("common.actions.add") }}</Button>
        </div>
        <label class="flex cursor-pointer items-center gap-3 text-sm font-semibold">
          <Switch v-model="yearly" />
          <span>{{ t("calendar.dates.yearly") }}</span>
        </label>
      </form>
    </Expand>
    <AnimatedList class="mt-1.5 flex flex-col">
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
          <span v-if="x.past" class="text-muted-foreground flex-none text-xs font-bold">
            {{ t("calendar.dates.past") }}
          </span>
          <Badge v-else-if="x.days === 0" variant="secondary">{{ t("calendar.today") }}</Badge>
          <Badge v-else variant="soft" class="tabular">
            {{ tn("common.count.days", x.days) }}
          </Badge>
          <RemoveButton v-if="x.id !== undefined" @remove="remove(x.id)" />
        </template>
      </ListRow>
    </AnimatedList>
  </Card>
</template>
