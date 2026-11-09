<script setup lang="ts">
import { ref } from "vue";
import { tmpId, isTmp } from "@/domain/ids";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import { ListRow, RemoveButton } from "@/shared/components";
import { plural } from "@/shared/lib/plural";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSessionStore } from "@/stores/session";

const session = useSessionStore();
const title = ref("");

function add() {
  const t = title.value.trim();
  if (!t) return;
  session.mutate("place.add", { title: t }, (s) => {
    s.places.push({ id: tmpId(), title: t });
  });
  title.value = "";
}

function remove(id: Id) {
  if (isTmp(id)) {
    notify("Секунду, сохраняем…");
    return;
  }
  session.mutate("place.delete", { id }, (s) => {
    s.places = s.places.filter((p) => p.id !== id);
  });
}
</script>

<template>
  <form class="flex gap-2" @submit.prevent="add">
    <Input v-model="title" placeholder="Кафе, парк, кино" maxlength="80" class="flex-1" />
    <Button type="submit" class="flex-none">Добавить</Button>
  </form>
  <Card>
    <div class="flex items-center justify-between gap-2.5">
      <CardTitle>Наши места</CardTitle>
      <span class="text-muted-foreground text-[13px]">
        {{ session.app.places.length }}
        {{ plural(session.app.places.length, ["место", "места", "мест"]) }}
      </span>
    </div>
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="p in session.app.places" :key="p.id">
        <div class="font-semibold">{{ p.title }}</div>
        <template #trail><RemoveButton @remove="remove(p.id)" /></template>
      </ListRow>
      <li
        v-if="!session.app.places.length"
        class="text-muted-foreground px-2 py-[18px] text-center text-sm font-semibold"
      >
        Добавь хотя бы два места
      </li>
    </ul>
  </Card>
</template>
