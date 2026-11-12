import { defineStore } from "pinia";
import { ref } from "vue";

/** Sections of the «Планы» tab; each is a child route with the same name */
export const PLAN_SECTIONS = ["cal", "go", "wish"] as const;
export type PlanSection = (typeof PLAN_SECTIONS)[number];
export const isPlanSection = (v: unknown): v is PlanSection =>
  PLAN_SECTIONS.includes(v as PlanSection);

/** Remembers the last open section so the «Планы» tab reopens where you left it */
export const usePlansStore = defineStore("plans", () => {
  const last = ref<PlanSection>("cal");
  return { last };
});
