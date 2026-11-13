<script setup lang="ts">
import { computed, onBeforeUnmount } from "vue";
import { today } from "@/domain/dates";
import { tmpId } from "@/domain/ids";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";
import { useRouletteStore } from "./roulette";

const session = useSessionStore();
const roulette = useRouletteStore();

const names = computed(() => session.app.places.map((p) => p.title));
const text = computed(() =>
  roulette.spinning ? roulette.display : (roulette.result ?? "Доверимся жребию"),
);

function goToday() {
  if (!roulette.result) return;
  const title = "Идём: " + roulette.result;
  const day = today();
  session.mutate(
    "plan.add",
    { day, title },
    (s) => {
      s.plans.push({ id: tmpId(), day, time: null, title });
    },
    "Записано в календарь на сегодня",
  );
}

onBeforeUnmount(roulette.settle);
</script>

<template>
  <h1>Куда идём сегодня?</h1>
  <div
    class="group bg-navy-2 text-primary-foreground data-hit:bg-peach data-hit:text-navy grid min-h-[96px] place-items-center rounded-2xl p-3.5 text-center transition-colors"
    :data-hit="(roulette.result && !roulette.spinning) || undefined"
    :data-spinning="roulette.spinning || undefined"
    aria-live="polite"
  >
    <b class="text-[23px] leading-[1.2] text-balance wrap-anywhere group-data-spinning:opacity-60">
      {{ text }}
    </b>
  </div>
  <div class="grid grid-cols-2 gap-2">
    <Button
      variant="secondary"
      class="border-paper"
      :disabled="names.length < 2 || roulette.spinning"
      @click="roulette.spin(names)"
    >
      {{ roulette.result ? "Ещё раз" : "Крутить" }}
    </Button>
    <Button variant="inverse" :disabled="!roulette.result || roulette.spinning" @click="goToday">
      Идём сегодня
    </Button>
  </div>
</template>
