import { cva } from "class-variance-authority";

/**
 * Calendar day bubble. Variant order mirrors the legacy cascade
 * (out → plan → today → selected); `cn` resolves the overrides.
 */
export const dayVariants = cva(
  "border-primary bg-paper tabular relative grid aspect-square min-w-0 place-items-center rounded-full border-2 p-0 text-[13px] font-bold",
  {
    variants: {
      out: { true: "border-mist text-grey" },
      plan: { true: "bg-peach border-peach" },
      birthday: {
        true: "after:bg-navy after:border-paper after:absolute after:-top-0.5 after:-right-0.5 after:size-[9px] after:rounded-full after:border-2",
      },
      today: { true: "shadow-[0_0_0_3px_var(--peach-soft)]" },
      selected: { true: "bg-navy border-navy text-paper" },
      important: {
        true: "before:bg-peach-ink before:border-paper before:absolute before:-top-0.5 before:-left-0.5 before:size-[9px] before:rounded-full before:border-2",
      },
    },
  },
);
