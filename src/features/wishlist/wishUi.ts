import { defineStore } from "pinia";
import { ref } from "vue";
import type { Photo } from "@/domain/types";

/**
 * Wishlist screen state that survives tab switches (whose list is shown) and
 * lets other screens open the “new wish” form (quick action on “Мы”).
 */
export const useWishUiStore = defineStore("wishUi", () => {
  const who = ref<"me" | "partner">("me");
  const formOpen = ref(false);
  const draftPhoto = ref<Photo | null>(null);
  /** Set by `openForm`; the page focuses the title input once and resets it */
  const focusTitle = ref(false);

  function showList(list: "me" | "partner") {
    who.value = list;
    closeForm();
  }
  /** Open the form for the list shown now and focus its title */
  function showForm() {
    formOpen.value = true;
    draftPhoto.value = null;
    focusTitle.value = true;
  }
  function openForm() {
    who.value = "me";
    showForm();
  }
  function closeForm() {
    formOpen.value = false;
    draftPhoto.value = null;
  }

  return { who, formOpen, draftPhoto, focusTitle, showList, showForm, openForm, closeForm };
});
