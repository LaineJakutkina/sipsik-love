import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Card } from "./Card.vue";
export { default as CardTitle } from "./CardTitle.vue";
export { default as CardEyebrow } from "./CardEyebrow.vue";

export const cardVariants = cva("flex min-w-0 flex-col rounded-lg border-2 p-4", {
  variants: {
    tone: {
      /** White card with navy outline — the default surface */
      default: "border-primary bg-card text-card-foreground",
      /** Navy surface with white text */
      dark: "border-primary bg-primary text-primary-foreground",
      /** Soft peach highlight: tips, notes, “on this day” */
      soft: "border-secondary bg-accent text-accent-foreground",
      /** Quiet grey surface: own pending messages */
      muted: "border-primary bg-muted text-foreground",
      /** Warm yellow: gratitude */
      butter: "border-butter-edge bg-butter text-foreground",
      /** Dashed outline: soft invitations to act */
      dashed: "border-dashed border-primary bg-card text-card-foreground",
    },
  },
  defaultVariants: { tone: "default" },
});
export type CardVariants = VariantProps<typeof cardVariants>;
