<script setup lang="ts">
import { computed } from "vue";
import { sameMonthDay, today } from "@/domain/dates";
import { EmptyState } from "@/shared/components";
import { plural, YEAR_FORMS } from "@/shared/lib/plural";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import MemoryCard from "../components/MemoryCard.vue";
import MemoryForm from "../components/MemoryForm.vue";
import { useUsUiStore } from "../usUi";

/** Shared photo memories; the ones from this day in past years come back on top */
const session = useSessionStore();
const ui = useUsUiStore();

const all = computed(() => session.app.memories ?? []);
const limit = computed(() => session.limits.memories);
const sorted = computed(() => all.value.slice().sort((a, b) => b.day.localeCompare(a.day)));

const onThis = computed(() => {
  const t = today();
  const y = Number(t.slice(0, 4));
  return sorted.value
    .filter((m) => sameMonthDay(m.day, t) && m.day < t)
    .map((m) => {
      const k = y - Number(m.day.slice(0, 4));
      return { memory: m, ago: `${k} ${plural(k, YEAR_FORMS)} назад` };
    });
});
const feed = computed(() => {
  const ids = new Set(onThis.value.map((x) => x.memory.id));
  return sorted.value.filter((m) => !ids.has(m.id));
});
</script>

<template>
  <MemoryForm v-if="ui.memForm" />
  <div
    v-else-if="all.length >= limit"
    class="bg-muted text-muted-foreground flex items-center gap-2 rounded-full px-3.5 py-[9px] text-xs font-semibold"
  >
    Воспоминаний {{ limit }} из {{ limit }}. Чтобы добавить новое, удали одно из старых
  </div>
  <Button v-else variant="secondary" block @click="ui.openMemForm()">
    + Добавить воспоминание · {{ all.length }} из {{ limit }}
  </Button>

  <Card v-if="onThis.length" tone="soft" class="gap-3">
    <CardTitle>В этот день</CardTitle>
    <MemoryCard v-for="x in onThis" :key="x.memory.id" :memory="x.memory" :ago="x.ago" soft />
  </Card>
  <div v-if="feed.length" class="flex flex-col gap-3">
    <MemoryCard v-for="m in feed" :key="m.id" :memory="m" />
  </div>
  <EmptyState v-else-if="!onThis.length">
    Здесь будут ваши моменты: фото и пара слов о дне. Через год Сипсик покажет их вам снова.
  </EmptyState>
</template>
