import { defineStore } from "pinia";
import { ref } from "vue";

export type HomeSection = "shop" | "chores";

/** Which part of “Дом” is open; survives tab switches */
export const useHomeUiStore = defineStore("homeUi", () => {
  const section = ref<HomeSection>("shop");
  return { section };
});
