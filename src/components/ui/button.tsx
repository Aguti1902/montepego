import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(44,85,138,0.25)] hover:bg-[#244872] hover:shadow-[0_10px_28px_rgba(44,85,138,0.3)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[#5f88a9]",
        outline:
          "border border-border/90 bg-white/50 hover:bg-white text-foreground backdrop-blur-sm",
        ghost: "hover:bg-muted text-foreground",
        accent:
          "bg-accent text-accent-foreground hover:bg-[#a37b38] shadow-[0_8px_24px_rgba(184,140,64,0.28)]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#7f2424]",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-7 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  ),
);
Button.displayName = "Button";
