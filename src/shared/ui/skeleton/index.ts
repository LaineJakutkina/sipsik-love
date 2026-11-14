import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Skeleton } from "./Skeleton.vue";

export const skeletonVariants = cva("block animate-pulse rounded-md", {
  variants: {
    tone: {
      /** On white pages and cards */
      default: "bg-muted",
      /** On the navy band */
      band: "bg-navy-2",
      /** On grey (`bg-muted`) tiles */
      tile: "bg-grey/20",
      /** On the dark photo overlay */
      overlay: "bg-primary-foreground/15",
    },
  },
  defaultVariants: { tone: "default" },
});

export type SkeletonVariants = VariantProps<typeof skeletonVariants>;
