<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { inDays, nextOccurrence, today } from "@/domain/dates";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import CardHead from "./CardHead.vue";
import SoonRow from "./SoonRow.vue";

/** «Не забудь»: the next two plans and the nearest birthday */
const session = useSessionStore();
const router = useRouter();

const plans = computed(() => {
  const t = today();
  const key = (p: { day: string; time: string | null }) => p.day + (p.time ?? "");
  return session.app.plans
    .filter((p) => p.day >= t)
    .sort((a, b) => key(a).localeCompare(key(b)))
    .slice(0, 2);
});

const birthday = computed(
  () =>
    session.app.birthdays
      .map((b) => ({ b, d: nextOccurrence(b.bdate) }))
      .sort((a, b) => a.d.localeCompare(b.d))[0] ?? null,
);
</script>

<template>
  <Card tone="dark">
    <CardHead title="Не забудь">
      <Button variant="link" class="text-secondary" @click="router.push({ name: 'cal' })">
        Календарь ›
      </Button>
    </CardHead>
    <div class="mt-2.5 flex flex-col gap-2">
      <SoonRow
        v-for="(p, i) in plans"
        :key="p.id"
        :title="p.title"
        :when="inDays(p.day) + (p.time ? `, ${p.time}` : '')"
        :fill="i === 0"
      />
      <SoonRow v-if="birthday" :title="`ДР: ${birthday.b.name}`" :when="inDays(birthday.d)" />
      <p v-if="!plans.length && !birthday" class="text-[13px] opacity-70">
        Пока ничего. Добавь планы в календаре.
      </p>
    </div>
  </Card>
</template>
