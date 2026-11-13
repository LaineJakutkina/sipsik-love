import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Card } from "./Card.vue";
export { default as CardTitle } from "./CardTitle.vue";
export { default as CardEyebrow } from "./CardEyebrow.vue";
export { default as CardHeader } from "./CardHeader.vue";
export { default as CardDescription } from "./CardDescription.vue";
export { default as CardAction } from "./CardAction.vue";
export { default as CardContent } from "./CardContent.vue";
export { default as CardFooter } from "./CardFooter.vue";

export const cardVariants = cva("flex min-w-0 flex-col rounded-lg border", {
  variants: {
    padding: {
      /** Free-form content padded by the card itself */
      default: "p-4",
      /**
       * shadcn layout: `CardHeader` / `CardContent` / `CardFooter` pad themselves.
       * Add `pt-0` when the card starts with full-bleed media.
       */
      sections: "gap-3 overflow-hidden py-3",
    },
    tone: {
      /** White card lifted by a hairline and a soft navy shadow — the default surface */
      default: "border-primary/10 bg-card text-card-foreground shadow-md shadow-navy/10",
      /** Navy surface with white text */
      dark: "border-primary bg-primary text-primary-foreground",
      /** Soft peach highlight: tips, notes, “on this day” */
      soft: "border-transparent bg-accent text-accent-foreground",
      /** Quiet grey surface: own pending messages */
      muted: "border-transparent bg-muted text-foreground",
      /** Warm yellow: gratitude */
      butter: "border-butter-edge/50 bg-butter text-foreground",
      /** Dashed outline: soft invitations to act */
      dashed: "border-[1.5px] border-dashed border-primary/35 bg-card text-card-foreground",
    },
  },
  defaultVariants: { tone: "default", padding: "default" },
});
export type CardVariants = VariantProps<typeof cardVariants>;
