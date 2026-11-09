import { defineStore } from "pinia";
import { ref } from "vue";
import { shiftMonth, today } from "@/domain/dates";
import type { DateStr } from "@/domain/types";

/**
 * Calendar screen state: visible month and selected day. `focusPlan` lets the
 * “План” quick action jump here and focus the new-plan input.
 */
export const useCalendarUiStore = defineStore("calendarUi", () => {
  const month = ref(today().slice(0, 7));
  const selected = ref<DateStr>(today());
  const focusPlan = ref(false);

  function select(day: DateStr) {
    selected.value = day;
    if (day.slice(0, 7) !== month.value) month.value = day.slice(0, 7);
  }
  function shift(delta: number) {
    month.value = shiftMonth(month.value, delta);
  }
  function planToday() {
    select(today());
    focusPlan.value = true;
  }

  return { month, selected, focusPlan, select, shift, planToday };
});
