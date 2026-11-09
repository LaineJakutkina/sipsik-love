import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export { default as Button } from "./Button.vue";

export const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full border-2 text-center font-bold transition-colors outline-none disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        /** Navy filled — the main call to action */
        default: "border-primary bg-primary text-primary-foreground",
        /** White with navy outline — secondary actions on light surfaces */
        outline: "border-primary bg-background text-foreground",
        /** Peach filled — highlighted / playful actions */
        secondary: "border-secondary bg-secondary text-secondary-foreground",
        /** Transparent with light outline — for use on navy surfaces */
        inverse: "border-primary-foreground bg-transparent text-primary-foreground",
        /** Outlined warning — destructive confirmations */
        warn: "border-destructive bg-background text-destructive",
        /** Borderless muted — tiny inline icons like × */
        ghost: "border-transparent bg-transparent text-muted-foreground",
        /** Text link styled as button */
        link: "h-auto rounded-none border-0 bg-transparent px-0 py-1.5 text-[13px] text-destructive",
      },
      size: {
        default: "min-h-[46px] px-[18px] py-2.5 text-[15px]",
        sm: "border-[1.5px] px-2.5 py-1 text-xs",
        icon: "size-10 p-0",
        "icon-sm": "size-[30px] p-0 text-xl leading-none font-normal",
        none: "",
      },
      block: {
        true: "w-full",
      },
    },
    compoundVariants: [{ variant: "link", class: "min-h-0 justify-start" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
export type ButtonVariants = VariantProps<typeof buttonVariants>;
