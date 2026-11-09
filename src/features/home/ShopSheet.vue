<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/shared/ui/button";
import { SheetTitle } from "@/shared/ui/sheet";
import { useSessionStore } from "@/stores/session";
import { useSheetsStore } from "@/stores/sheets";
import ShopAddRow from "./ShopAddRow.vue";

/** Quick “Покупка” sheet: add to the shopping list without leaving the screen */
const session = useSessionStore();
const sheets = useSheetsStore();
const left = computed(() => session.app.shop.filter((x) => !x.done).map((x) => x.title));
</script>

<template>
  <SheetTitle>Добавить в покупки</SheetTitle>
  <ShopAddRow in-sheet />
  <p class="text-muted-foreground text-[13px]">
    {{ left.length ? `Уже в списке: ${left.join(", ")}` : "Список пока пуст" }}
  </p>
  <Button variant="outline" @click="sheets.close()">Готово</Button>
</template>
