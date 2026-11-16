<script setup lang="ts">
import { computed } from "vue";
import { t, tg, tn } from "@/domain/i18n";
import type { DailyTask } from "@/domain/types";
import { telegram } from "@/services/telegram";
import { CheckButton, ListRow, ListSub } from "@/shared/components";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import CardHead from "./CardHead.vue";
import { serverText } from "@/shared/locale/serverText";

/** «Задания дня»: each one gives the cat bonus taps */
const session = useSessionStore();
const tasks = computed(() => session.app.tasks ?? null);
const bonus = computed(() => session.app.task_bonus ?? 0);
const left = computed(() => (tasks.value ?? []).filter((x) => !x.done).length);

function doneBy(task: DailyTask): string {
  if (task.done === "me") return session.gendered("us.tasks.doneByMe");
  return tg("us.tasks.doneByPartner", session.app.partner?.gender, { name: session.partnerName });
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
    tn("us.tasks.bonus", b, { name: session.petName }),
  );
}
</script>

<template>
  <Card v-if="tasks">
    <CardHead
      :title="t('us.tasks.title')"
      :note="left ? t('us.tasks.left', { n: left }) : t('us.tasks.allDone')"
    />
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="task in tasks" :key="task.idx" :done="!!task.done">
        <template #lead>
          <CheckButton
            :checked="!!task.done"
            :disabled="!!task.done"
            :label="t('us.tasks.done')"
            @toggle="complete(task.idx)"
          />
        </template>
        <span
          class="group-data-done:text-muted-foreground font-semibold group-data-done:line-through"
        >
          {{ serverText(task.text) }}
        </span>
        <ListSub v-if="task.done">{{ doneBy(task) }}</ListSub>
        <template v-if="!task.done" #trail>
          <Badge variant="soft" size="sm">+{{ bonus }}</Badge>
        </template>
      </ListRow>
    </ul>
  </Card>
</template>
