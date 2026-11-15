<script setup lang="ts">
import { computed, ref } from "vue";
import { choreFrequencyLabel } from "@/domain/catalog";
import { today } from "@/domain/dates";
import { t } from "@/domain/i18n";
import type { Chore } from "@/domain/types";
import {
  AnimatedList,
  CheckButton,
  Expand,
  ListRow,
  ListSub,
  ListTitle,
  RemoveButton,
} from "@/shared/components";
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
      <CardTitle>{{ t("home.chores.title") }}</CardTitle>
      <Button v-if="chores.length" variant="link" :aria-expanded="adding" @click="adding = !adding">
        {{ adding ? t("common.actions.hide") : t("common.actions.addMore") }}
      </Button>
    </div>
    <Expand>
      <ChoreForm v-if="adding || !chores.length" class="mt-2.5" @added="adding = false" />
    </Expand>
    <AnimatedList v-if="chores.length" class="mt-1.5 flex flex-col">
      <ListRow v-for="c in chores" :key="c.id" :done="c.done_on === day">
        <template #lead>
          <CheckButton
            :checked="c.done_on === day"
            :label="t('home.chores.doneToday')"
            @toggle="household.toggleChore(c.id)"
          />
        </template>
        <ListTitle>{{ c.title }}</ListTitle>
        <ListSub>{{ c.freq ? choreFrequencyLabel(c.freq) : "" }}</ListSub>
        <template #trail>
          <button
            type="button"
            :class="
              cn(
                'bg-accent press max-w-[96px] flex-none truncate rounded-full px-2.5 py-1.5 text-xs font-extrabold',
                c.who !== 'me' && 'bg-primary text-primary-foreground',
              )
            "
            :disabled="!hasPartner"
            :aria-label="t('home.chores.swap')"
            @click="household.swapChore(c.id)"
          >
            {{ doer(c) }}
          </button>
          <RemoveButton @remove="household.removeChore(c.id)" />
        </template>
      </ListRow>
    </AnimatedList>
    <p v-if="chores.length" class="text-muted-foreground mt-2 text-xs leading-snug font-medium">
      {{ hasPartner ? t("home.chores.resetHintPair") : t("home.chores.resetHint") }}
    </p>
  </Card>
</template>
