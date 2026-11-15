<script setup lang="ts">
import { computed } from "vue";
import { formatList, t } from "@/domain/i18n";
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
  <SheetTitle>{{ t("home.shopSheet.title") }}</SheetTitle>
  <ShopAddRow in-sheet />
  <p class="text-muted-foreground text-[13px]">
    {{
      left.length
        ? t("home.shopSheet.inList", { items: formatList(left) })
        : t("home.shopSheet.empty")
    }}
  </p>
  <Button variant="outline" @click="sheets.close()">{{ t("home.shopSheet.done") }}</Button>
</template>
