<script setup lang="ts">
import { computed, ref } from "vue";
import { today } from "@/domain/dates";
import type { Chore } from "@/domain/types";
import { CheckButton, ListRow, ListSub, ListTitle, RemoveButton } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { useSessionStore } from "@/stores/session";
import ChoreForm from "./ChoreForm.vue";
import ChoreTally from "./ChoreTally.vue";
import { useHousehold } from "./useHousehold";

const session = useSessionStore();
const household = useHousehold();

const chores = computed(() => session.app.chores);
const hasPartner = computed(() => !!session.app.partner);
const day = computed(() => today());
const tally = (who: Chore["who"]) => {
  const list = chores.value.filter((c) => c.who === who);
  return { count: list.length, done: list.filter((c) => c.done_on === day.value).length };
};
const mine = computed(() => tally("me"));
const theirs = computed(() => tally("partner"));
const doer = (c: Chore) => (c.who === "me" ? session.meName : session.partnerName);
const adding = ref(false);
</script>

<template>
  <div v-if="hasPartner" class="grid grid-cols-2 gap-2">
    <ChoreTally :name="session.meName" :count="mine.count" :done="mine.done" />
    <ChoreTally :name="session.partnerName" :count="theirs.count" :done="theirs.done" dark />
  </div>
  <Card>
    <div class="flex items-center justify-between gap-2.5">
      <CardTitle>Дела</CardTitle>
      <Button v-if="chores.length" variant="link" :aria-expanded="adding" @click="adding = !adding">
        {{ adding ? "Скрыть" : "+ Добавить" }}
      </Button>
    </div>
    <ChoreForm v-if="adding || !chores.length" class="mt-2.5" @added="adding = false" />
    <ul v-if="chores.length" class="mt-1.5 flex flex-col">
      <ListRow v-for="c in chores" :key="c.id" :done="c.done_on === day">
        <template #lead>
          <CheckButton
            :checked="c.done_on === day"
            label="Сделано сегодня"
            @toggle="household.toggleChore(c.id)"
          />
        </template>
        <ListTitle>{{ c.title }}</ListTitle>
        <ListSub>{{ c.freq || "" }}</ListSub>
        <template #trail>
          <button
            type="button"
            :class="
              cn(
                'bg-accent max-w-[96px] flex-none truncate rounded-full px-2.5 py-1.5 text-xs font-extrabold',
                c.who !== 'me' && 'bg-primary text-primary-foreground',
              )
            "
            :disabled="!hasPartner"
            aria-label="Поменять, кто делает"
            @click="household.swapChore(c.id)"
          >
            {{ doer(c) }}
          </button>
          <RemoveButton @remove="household.removeChore(c.id)" />
        </template>
      </ListRow>
    </ul>
    <p v-if="chores.length" class="text-muted-foreground mt-2 text-xs leading-snug font-medium">
      Галочки сбрасываются каждый день{{
        hasPartner ? ". Нажми на имя, чтобы передать дело" : ""
      }}
    </p>
  </Card>
</template>
