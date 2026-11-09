<script setup lang="ts">
import { computed } from "vue";
import { applyWear, itemProgress, ITEMS, visibleItems, type ItemId } from "@/domain/items";
import CharacterThumb from "@/game/vue/CharacterThumb.vue";
import { formatNumber } from "@/shared/lib/plural";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { useSessionStore } from "@/stores/session";
import { useUsUiStore } from "../usUi";
import CardHead from "./CardHead.vue";
import PickTile from "./PickTile.vue";

/** «Вещи котика»: progress to the next item and the wardrobe */
const session = useSessionStore();
const ui = useUsUiStore();

const couple = computed(() => session.app.couple);
const todayLine = computed(
  () => `${Math.min(couple.value.taps_today || 0, session.tapCap)} / ${session.tapCap} сегодня`,
);
const progress = computed(() => itemProgress(couple.value.clicks));
const items = computed(() => visibleItems(couple.value.clicks, ui.allItems));

function wear(id: ItemId) {
  const on = !couple.value.worn[id];
  session.mutate("wear", { item: id, on }, (s) => applyWear(s.couple.worn, id, on));
}
</script>

<template>
  <Card>
    <CardHead title="Вещи котика" :note="todayLine" />
    <div class="mt-2.5">
      <div class="mb-1.5 flex justify-between gap-2 text-[13px] font-bold">
        <span>
          {{
            progress.next
              ? `Следующая вещь: ${progress.next.name}`
              : `${session.petName} собрал всё`
          }}
        </span>
        <span v-if="progress.next" class="text-muted-foreground">
          ещё {{ formatNumber(progress.left) }}
        </span>
      </div>
      <Progress :model-value="progress.percent" />
    </div>
    <div class="mt-3.5 grid grid-cols-3 gap-2">
      <template v-for="it in items" :key="it.id">
        <PickTile
          v-if="couple.clicks >= it.at"
          :name="it.name"
          :caption="couple.worn[it.id] ? 'Надето' : 'Снято'"
          :on="!!couple.worn[it.id]"
          @select="wear(it.id)"
        >
          <CharacterThumb
            kind="item"
            :item="it.id"
            :coat="couple.coat"
            :width="64"
            class="h-[38px] w-full object-contain"
          />
        </PickTile>
        <PickTile v-else locked :name="it.name" :caption="`${formatNumber(it.at)} тапов`">
          <CharacterThumb
            kind="item"
            :item="it.id"
            :coat="couple.coat"
            :width="64"
            class="h-[38px] w-full object-contain opacity-30 grayscale"
          />
        </PickTile>
      </template>
    </div>
    <Button variant="link" class="self-start" @click="ui.allItems = !ui.allItems">
      {{ ui.allItems ? "Свернуть" : `Все ${ITEMS.length} вещей: от семечек до котёнка` }}
    </Button>
  </Card>
</template>
