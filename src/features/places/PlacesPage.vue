<script setup lang="ts">
import { MapPinIcon } from "@lucide/vue";
import { ref } from "vue";
import { tmpId, isTmp } from "@/domain/ids";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import { ListRow, RemoveButton } from "@/shared/components";
import { plural } from "@/shared/lib/plural";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useSessionStore } from "@/stores/session";
import { useRouletteStore } from "./roulette";

const session = useSessionStore();
const roulette = useRouletteStore();
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
  <Card>
    <div class="flex items-center justify-between gap-2.5">
      <CardTitle>Наши места</CardTitle>
      <span class="text-muted-foreground text-[13px]">
        {{ session.app.places.length }}
        {{ plural(session.app.places.length, ["место", "места", "мест"]) }}
      </span>
    </div>
    <form class="mt-2.5 flex gap-2" @submit.prevent="add">
      <Input v-model="title" placeholder="Кафе, парк, кино" maxlength="80" class="flex-1" />
      <Button type="submit" class="flex-none">Добавить</Button>
    </form>
    <ul class="mt-1.5 flex flex-col">
      <ListRow v-for="p in session.app.places" :key="p.id">
        <template #lead>
          <span class="bg-muted grid size-9 flex-none place-items-center rounded-xl">
            <MapPinIcon class="size-[18px]" :stroke-width="2.2" aria-hidden="true" />
          </span>
        </template>
        <div class="font-semibold">{{ p.title }}</div>
        <template #trail>
          <Badge v-if="!roulette.spinning && roulette.result === p.title" variant="secondary">
            выпало
          </Badge>
          <RemoveButton @remove="remove(p.id)" />
        </template>
      </ListRow>
    </ul>
    <p
      v-if="session.app.places.length < 2"
      class="bg-muted text-muted-foreground mt-2 rounded-2xl px-3.5 py-3 text-center text-sm font-semibold"
    >
      Добавь хотя бы два места, и рулетка выберет за вас
    </p>
  </Card>
</template>
