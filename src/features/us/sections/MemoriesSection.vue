<script setup lang="ts">
import { computed } from "vue";
import { sameMonthDay, today } from "@/domain/dates";
import { t, tn } from "@/domain/i18n";
import { AnimatedList, EmptyState, Expand } from "@/shared/components";
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
  const now = today();
  const y = Number(now.slice(0, 4));
  return sorted.value
    .filter((m) => sameMonthDay(m.day, now) && m.day < now)
    .map((m) => {
      const k = y - Number(m.day.slice(0, 4));
      return { memory: m, ago: tn("us.memories.yearsAgo", k) };
    });
});
const feed = computed(() => {
  const ids = new Set(onThis.value.map((x) => x.memory.id));
  return sorted.value.filter((m) => !ids.has(m.id));
});
</script>

<template>
  <Expand>
    <MemoryForm v-if="ui.memForm" />
    <div
      v-else-if="all.length >= limit"
      class="bg-muted text-muted-foreground flex items-center gap-2 rounded-full px-3.5 py-[9px] text-xs font-semibold"
    >
      {{ t("us.memories.limitReached", { limit }) }}
    </div>
    <Button v-else variant="secondary" block @click="ui.openMemForm()">
      {{ t("us.memories.add", { n: all.length, limit }) }}
    </Button>
  </Expand>

  <Card v-if="onThis.length" tone="soft" class="gap-3">
    <CardTitle>{{ t("us.memories.onThisDay") }}</CardTitle>
    <MemoryCard v-for="x in onThis" :key="x.memory.id" :memory="x.memory" :ago="x.ago" soft />
  </Card>
  <AnimatedList v-if="feed.length" as="div" class="flex flex-col gap-3">
    <MemoryCard v-for="m in feed" :key="m.id" :memory="m" />
  </AnimatedList>
  <EmptyState v-else-if="!onThis.length">
    {{ t("us.memories.empty") }}
  </EmptyState>
</template>
