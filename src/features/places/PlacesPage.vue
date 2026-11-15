<script setup lang="ts">
import { MapPinIcon } from "@lucide/vue";
import { ref } from "vue";
import { t, tn } from "@/domain/i18n";
import { tmpId, isTmp } from "@/domain/ids";
import type { Id } from "@/domain/types";
import { notify } from "@/services/notify";
import { AnimatedList, ListRow, RemoveButton } from "@/shared/components";
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
  const place = title.value.trim();
  if (!place) return;
  session.mutate("place.add", { title: place }, (s) => {
    s.places.push({ id: tmpId(), title: place });
  });
  title.value = "";
}

function remove(id: Id) {
  if (isTmp(id)) {
    notify(t("common.savingWait"));
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
      <CardTitle>{{ t("places.page.title") }}</CardTitle>
      <span class="text-muted-foreground text-[13px]">
        {{ tn("places.page.count", session.app.places.length) }}
      </span>
    </div>
    <form class="mt-2.5 flex gap-2" @submit.prevent="add">
      <Input
        v-model="title"
        :placeholder="t('places.page.placeholder')"
        maxlength="80"
        class="flex-1"
      />
      <Button type="submit" class="flex-none">{{ t("common.actions.add") }}</Button>
    </form>
    <AnimatedList class="mt-1.5 flex flex-col">
      <ListRow v-for="p in session.app.places" :key="p.id">
        <template #lead>
          <span class="bg-muted grid size-9 flex-none place-items-center rounded-xl">
            <MapPinIcon class="size-[18px]" :stroke-width="2.2" aria-hidden="true" />
          </span>
        </template>
        <div class="font-semibold">{{ p.title }}</div>
        <template #trail>
          <Badge v-if="!roulette.spinning && roulette.result === p.title" variant="secondary">
            {{ t("places.page.picked") }}
          </Badge>
          <RemoveButton @remove="remove(p.id)" />
        </template>
      </ListRow>
    </AnimatedList>
    <p
      v-if="session.app.places.length < 2"
      class="bg-muted text-muted-foreground mt-2 rounded-2xl px-3.5 py-3 text-center text-sm font-semibold"
    >
      {{ t("places.page.needTwo") }}
    </p>
  </Card>
</template>
