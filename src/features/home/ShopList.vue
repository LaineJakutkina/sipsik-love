<script setup lang="ts">
import { computed } from "vue";
import { CheckButton, EmptyState, ListRow, ListTitle, RemoveButton } from "@/shared/components";
import { Button } from "@/shared/ui/button";
import { Card, CardTitle } from "@/shared/ui/card";
import { useSessionStore } from "@/stores/session";
import ShopAddRow from "./ShopAddRow.vue";
import { useHousehold } from "./useHousehold";

const session = useSessionStore();
const household = useHousehold();

const shop = computed(() => session.app.shop);
const left = computed(() => shop.value.filter((x) => !x.done).length);
const sorted = computed(() => shop.value.slice().sort((a, b) => Number(a.done) - Number(b.done)));
const anyBought = computed(() => shop.value.some((x) => x.done));
</script>

<template>
  <Card>
    <div class="mb-2.5 flex items-center justify-between gap-2.5">
      <CardTitle>Покупки</CardTitle>
      <span v-if="shop.length" class="text-muted-foreground text-[13px]">
        {{ left ? `осталось ${left}` : "всё куплено" }}
      </span>
    </div>
    <ShopAddRow />
    <ul v-if="shop.length" class="mt-2 flex flex-col">
      <ListRow v-for="x in sorted" :key="x.id" :done="x.done">
        <template #lead>
          <CheckButton :checked="x.done" label="Куплено" @toggle="household.toggleShop(x.id)" />
        </template>
        <ListTitle>{{ x.title }}</ListTitle>
        <template #trail>
          <RemoveButton @remove="household.removeShop(x.id)" />
        </template>
      </ListRow>
    </ul>
    <EmptyState v-else>Список пуст. Добавь, что нужно купить.</EmptyState>
    <Button v-if="anyBought" variant="link" class="mt-1 self-start" @click="household.clearBought()">
      Убрать купленное
    </Button>
  </Card>
</template>
