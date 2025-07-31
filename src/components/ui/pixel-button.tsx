import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const pixelButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-pixel text-xs font-bold uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "pixel-button",
        secondary: "bg-secondary text-secondary-foreground border-2 border-secondary hover:bg-secondary/80 shadow-pixel hover:shadow-glow",
        destructive: "bg-destructive text-destructive-foreground border-2 border-destructive hover:bg-destructive/80 shadow-pixel",
        outline: "border-2 border-border bg-background hover:bg-accent hover:text-accent-foreground shadow-pixel",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        retro: "retro-gradient text-white border-2 border-primary shadow-retro hover:shadow-glow",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-sm",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface PixelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof pixelButtonVariants> {
  asChild?: boolean
}

const PixelButton = React.forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(pixelButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
PixelButton.displayName = "PixelButton"

export { PixelButton, pixelButtonVariants }