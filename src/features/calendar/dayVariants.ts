import { cva } from "class-variance-authority";

/**
 * Calendar day: a plain number; today gets a peach ring, the selected day a navy
 * fill. What happens on the day is shown by dots under the number (`DAY_DOT`).
 */
export const dayVariants = cva(
  "group tabular relative grid aspect-square min-w-0 place-items-center rounded-full p-0 text-sm font-bold",
  {
    variants: {
      out: { true: "text-grey/60 font-semibold" },
      today: { true: "ring-secondary ring-2 ring-inset" },
      selected: { true: "bg-navy text-paper" },
    },
  },
);

/** Dot colours, shared by the day cells and the legend */
export const DAY_DOT = {
  plan: "bg-peach",
  birthday: "bg-navy group-aria-pressed:bg-paper",
  important: "bg-peach-ink group-aria-pressed:bg-peach-soft",
} as const;
export type DayMark = keyof typeof DAY_DOT;
