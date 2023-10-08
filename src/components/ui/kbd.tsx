import React from "react";
import { cn } from "~/lib/utils";

// export interface KbdProps
//   extends React.HTMLAttributes<HTMLElement> {

// }

const Kbd = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => {
    return (
      <kbd
        ref={ref}
        className={cn(
          "relative top-[-1px] block min-w-[0.75rem] cursor-default rounded-sm border border-foreground/10 bg-transparent px-[5px] py-[2px] text-center text-base leading-[1] shadow-[0_2px_0_1px_hsl(var(--foreground)_/_0.1)] hover:top-[1px] hover:shadow-[0_1px_0_0.05px_hsl(var(--foreground)_/_0.1)]",
          className
        )}
        {...props}
      />
    );
  }
);
Kbd.displayName = "kbd";

export { Kbd };
