<script setup lang="ts">
import { computed } from "vue";
import type { DailyTask } from "@/domain/types";
import { telegram } from "@/services/telegram";
import { CheckButton, ListRow, ListSub } from "@/shared/components";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import CardHead from "./CardHead.vue";

/** «Задания дня»: each one gives the cat bonus taps */
const session = useSessionStore();
const tasks = computed(() => session.app.tasks ?? null);
const bonus = computed(() => session.app.task_bonus ?? 0);
const left = computed(() => (tasks.value ?? []).filter((t) => !t.done).length);

function doneBy(t: DailyTask): string {
  if (t.done === "me") return session.gendered("Отметил ты", "Отметила ты", "Готово");
  const g = session.app.partner?.gender;
  const verb = g === "f" ? "Отметила " : g === "m" ? "Отметил " : "Отметил(а) ";
  return verb + session.partnerName;
}

function complete(idx: number) {
  const task = tasks.value?.find((x) => x.idx === idx);
  if (!task || task.done) return;
  telegram.haptic("success");
  const b = bonus.value;
  session.mutate(
    "task.done",
    { idx },
    (s) => {
      const x = s.tasks?.find((y) => y.idx === idx);
      if (x) x.done = "me";
      s.couple.clicks += s.task_bonus ?? 0;
    },
    `+${b} тапов ${session.petName} ⭐`,
  );
}
</script>

<template>
  <Card v-if="tasks">
    <CardHead title="Задания дня" :note="left ? `осталось ${left}` : 'все готовы 🎉'" />
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="t in tasks" :key="t.idx" :done="!!t.done">
        <template #lead>
          <CheckButton
            :checked="!!t.done"
            :disabled="!!t.done"
            label="Выполнено"
            @toggle="complete(t.idx)"
          />
        </template>
        <span
          class="group-data-done:text-muted-foreground font-semibold group-data-done:line-through"
        >
          {{ t.text }}
        </span>
        <ListSub v-if="t.done">{{ doneBy(t) }}</ListSub>
        <template v-if="!t.done" #trail>
          <Badge variant="soft" size="sm">+{{ bonus }}</Badge>
        </template>
      </ListRow>
    </ul>
  </Card>
</template>
