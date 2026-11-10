<script setup lang="ts">
import { useEventListener } from "@vueuse/core";
import { ref } from "vue";
import { DEMO_STORAGE_KEY, demoNames, resetDemo, viewer } from "@/services/api/demo/server";
import { Button } from "@/shared/ui/button";
import { useSessionStore } from "@/stores/session";

/**
 * Browser demo only: who you are (Аня or Максим), switching between them, and starting over.
 * The other tab's changes show up at once.
 */
const session = useSessionStore();
const names = ref(demoNames());
const resetOpen = ref(false);

function openAs(who: "a" | "b") {
  const url = new URL(location.href);
  url.search = who === "b" ? "?as=b" : "";
  return url.toString();
}
const otherUrl = openAs(viewer() === "a" ? "b" : "a");

function reset(kind: "ready" | "blank") {
  resetDemo(kind);
  location.replace(openAs(viewer()));
}

useEventListener(window, "storage", (e) => {
  if (e.key !== DEMO_STORAGE_KEY) return;
  names.value = demoNames();
  void session.refresh();
});
</script>

<template>
  <div class="bg-butter border-butter-edge text-foreground border-b-2 px-3 py-1.5 text-[12px]">
    <div class="mx-auto flex max-w-[520px] items-center gap-2">
      <b class="grow">🧪 Демо · ты — {{ names.me }}</b>
      <Button as="a" size="sm" variant="outline" :href="otherUrl">Стать: {{ names.other }}</Button>
      <Button size="sm" variant="outline" @click="resetOpen = !resetOpen">Сброс</Button>
    </div>
    <div v-if="resetOpen" class="mx-auto mt-1.5 flex max-w-[520px] flex-wrap items-center gap-2">
      <span class="grow">Начать заново:</span>
      <Button size="sm" variant="secondary" @click="reset('ready')">Готовая пара</Button>
      <Button size="sm" variant="secondary" @click="reset('blank')">С нуля</Button>
    </div>
  </div>
</template>
