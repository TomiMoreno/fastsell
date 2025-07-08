import { cva, type VariantProps } from "class-variance-authority";
import React from "react";
import { cn } from "~/lib/utils";

const kbdVariants = cva(
  "relative  block min-w-[0.75rem] cursor-default select-none rounded-sm border border-foreground/10 bg-transparent px-[5px] py-[2px] text-center font-mono text-base leading-[1] active:top-[1px] active:shadow-[0_1px_0_0.05px_hsl(var(--foreground)_/_0.1)]",
  {
    variants: {
      disabled: {
        true: "top-[1px] shadow-[0_1px_0_0.05px_hsl(var(--foreground)_/_0.1)] cursor-not-allowed opacity-50 ",
        false: "top-[-1px] shadow-[0_2px_0_1px_hsl(var(--foreground)_/_0.1)]",
      },
    },
  },
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, disabled = false, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(kbdVariants({ disabled, className }))}
        onClick={() => {
          if (disabled) return;
          // Reproduce sound
          const audio = new Audio("/sounds/click.wav");
          audio.play().catch((err) => console.error(err));
        }}
        {...props}
      />
    );
  },
);
Kbd.displayName = "kbd";

export { Kbd };
