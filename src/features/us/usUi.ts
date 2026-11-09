import { defineStore } from "pinia";
import { ref } from "vue";
import { today } from "@/domain/dates";
import type { DateStr, Id, Photo } from "@/domain/types";

export type UsSegment = "today" | "thanks" | "mem";

/**
 * “Мы” screen state shared by the band (segment pills) and the page; it
 * survives tab switches like the legacy `ui` object did.
 */
export const useUsUiStore = defineStore("usUi", () => {
  const segment = ref<UsSegment>("today");
  /** Show every item, not only the earned ones and a peek at the next */
  const allItems = ref(false);
  /** Thanks entry waiting for the delete confirmation */
  const thanksDel = ref<Id | null>(null);

  const memForm = ref(false);
  const memDraft = ref<Photo | null>(null);
  const memText = ref("");
  const memDay = ref<DateStr>(today());
  /** Memory waiting for the delete confirmation */
  const memDel = ref<Id | null>(null);

  function show(next: UsSegment) {
    segment.value = next;
    memForm.value = false;
  }

  function openMemForm() {
    memForm.value = true;
    memDraft.value = null;
    memText.value = "";
    memDay.value = today();
  }

  function closeMemForm() {
    memForm.value = false;
    memDraft.value = null;
  }

  return {
    segment,
    allItems,
    thanksDel,
    memForm,
    memDraft,
    memText,
    memDay,
    memDel,
    show,
    openMemForm,
    closeMemForm,
  };
});
