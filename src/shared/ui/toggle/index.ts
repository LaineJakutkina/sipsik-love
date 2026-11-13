import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Toggle } from "./Toggle.vue";

/**
 * Pressable pills / chips. Pressed state is driven by reka's `data-state=on`.
 */
export const toggleVariants = cva(
  "inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full font-bold transition-colors outline-none disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        /** Navy outline pill on light surfaces */
        default:
          "border-2 border-primary bg-background text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        /** White outline pill on navy surfaces */
        inverse:
          "border-2 border-primary-foreground bg-transparent text-primary-foreground data-[state=on]:bg-primary-foreground data-[state=on]:text-primary",
        /** Borderless item of a segmented track on navy surfaces; the pressed one is a white pill */
        segment:
          "grow border-0 bg-transparent text-primary-foreground/70 data-[state=on]:bg-primary-foreground data-[state=on]:text-primary data-[state=on]:shadow-sm",
        /** Same on light surfaces: grey track, the pressed item is a navy pill */
        "segment-light":
          "grow border-0 bg-transparent text-muted-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        /** Thin chip for quick suggestions */
        chip: "border-[1.5px] border-primary bg-background font-semibold text-foreground data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
        /** Thin chip on navy surfaces */
        "chip-inverse":
          "border-[1.5px] border-primary-foreground bg-transparent font-semibold text-primary-foreground",
        /** Large selectable tile */
        tile: "justify-start rounded-2xl border-2 border-primary bg-background px-3.5 py-3 text-left text-sm data-[state=on]:border-secondary data-[state=on]:bg-secondary",
      },
      size: {
        default: "px-3.5 py-[7px] text-sm",
        sm: "px-3 py-1.5 text-[13px]",
        none: "",
      },
    },
    compoundVariants: [{ variant: "tile", class: "px-3.5 py-3" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ToggleVariants = VariantProps<typeof toggleVariants>;
