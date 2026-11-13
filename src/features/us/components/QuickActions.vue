<script setup lang="ts">
import { CalendarIcon, GiftIcon, ShoppingCartIcon } from "@lucide/vue";
import type { Component } from "vue";
import { useRouter } from "vue-router";
import { useCalendarUiStore } from "@/features/calendar/calendarUi";
import { useWishUiStore } from "@/features/wishlist/wishUi";
import { cn } from "@/shared/lib/utils";
import { useSheetsStore } from "@/stores/sheets";

/** Shortcuts: new wish, shopping item, plan for today */
const router = useRouter();
const sheets = useSheetsStore();
const wishUi = useWishUiStore();
const calendarUi = useCalendarUiStore();

const ACTIONS: { label: string; icon: Component; run: () => void }[] = [
  {
    label: "Желание",
    icon: GiftIcon,
    run: () => {
      wishUi.openForm();
      void router.push({ name: "wish" });
    },
  },
  { label: "Покупка", icon: ShoppingCartIcon, run: () => sheets.open("shop") },
  {
    label: "План",
    icon: CalendarIcon,
    run: () => {
      calendarUi.planToday();
      void router.push({ name: "cal" });
    },
  },
];
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="(a, i) in ACTIONS"
      :key="a.label"
      type="button"
      :class="
        cn(
          'bg-muted flex min-w-0 flex-col items-center gap-1.5 rounded-[18px] px-1.5 py-3 text-[13px] font-bold',
          i === 0 && 'bg-secondary',
        )
      "
      @click="a.run"
    >
      <component :is="a.icon" class="size-6" :stroke-width="2.2" aria-hidden="true" />
      {{ a.label }}
    </button>
  </div>
</template>
