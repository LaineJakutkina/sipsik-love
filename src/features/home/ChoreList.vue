<script setup lang="ts">
import { computed } from "vue";
import { today } from "@/domain/dates";
import type { Chore } from "@/domain/types";
import {
  CheckButton,
  EmptyState,
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
const mineCount = computed(() => chores.value.filter((c) => c.who === "me").length);
const day = computed(() => today());
const doer = (c: Chore) => (c.who === "me" ? session.meName : session.partnerName);
</script>

<template>
  <div class="mb-1 grid grid-cols-2 gap-2">
    <ChoreTally :name="session.meName" :count="mineCount" />
    <ChoreTally :name="session.partnerName" :count="chores.length - mineCount" dark />
  </div>
  <Card>
    <div class="flex items-center justify-between gap-2.5">
      <CardTitle>Дела</CardTitle>
      <Button v-if="hasPartner" variant="link" @click="household.splitChores()">
        Поделить поровну
      </Button>
    </div>
    <ul v-if="chores.length" class="flex flex-col">
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
                'border-primary bg-card flex-none rounded-full border-2 px-2.5 py-1 text-xs font-extrabold',
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
    <EmptyState v-else>Дел пока нет</EmptyState>
  </Card>
  <ChoreForm />
</template>
