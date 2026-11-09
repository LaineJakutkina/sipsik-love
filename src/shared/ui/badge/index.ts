import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Badge } from "./Badge.vue";

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full font-extrabold whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        soft: "bg-accent text-destructive",
        outline: "border-[1.5px] border-primary text-foreground",
        dashed:
          "border-[1.5px] border-dashed border-muted-foreground text-muted-foreground uppercase tracking-[.06em]",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-[11px]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
export type BadgeVariants = VariantProps<typeof badgeVariants>;
