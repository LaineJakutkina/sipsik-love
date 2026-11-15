<script setup lang="ts">
import { CalendarIcon, GiftIcon, ShoppingCartIcon } from "@lucide/vue";
import { computed, type Component } from "vue";
import { useRouter } from "vue-router";
import { t } from "@/domain/i18n";
import { useCalendarUiStore } from "@/features/calendar/calendarUi";
import { useWishUiStore } from "@/features/wishlist/wishUi";
import { cn } from "@/shared/lib/utils";
import { useSheetsStore } from "@/stores/sheets";

/** Shortcuts: new wish, shopping item, plan for today */
const router = useRouter();
const sheets = useSheetsStore();
const wishUi = useWishUiStore();
const calendarUi = useCalendarUiStore();

const actions = computed<{ id: string; label: string; icon: Component; run: () => void }[]>(() => [
  {
    id: "wish",
    label: t("us.quick.wish"),
    icon: GiftIcon,
    run: () => {
      wishUi.openForm();
      void router.push({ name: "wish" });
    },
  },
  { id: "shop", label: t("us.quick.shop"), icon: ShoppingCartIcon, run: () => sheets.open("shop") },
  {
    id: "plan",
    label: t("us.quick.plan"),
    icon: CalendarIcon,
    run: () => {
      calendarUi.planToday();
      void router.push({ name: "cal" });
    },
  },
]);
</script>

<template>
  <div class="grid grid-cols-3 gap-2">
    <button
      v-for="(a, i) in actions"
      :key="a.id"
      type="button"
      :class="
        cn(
          'bg-muted press flex min-w-0 flex-col items-center gap-1.5 rounded-[18px] px-1.5 py-3 text-[13px] font-bold',
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
