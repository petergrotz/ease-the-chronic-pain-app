import * as React from "react"
import { cn } from "@/lib/utils"

const PixelCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pixel-card rounded-none p-4 bg-card text-card-foreground",
      className
    )}
    {...props}
  />
))
PixelCard.displayName = "PixelCard"

const PixelCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 p-0", className)}
    {...props}
  />
))
PixelCardHeader.displayName = "PixelCardHeader"

const PixelCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-pixel text-lg font-bold leading-none tracking-wider uppercase",
      className
    )}
    {...props}
  />
))
PixelCardTitle.displayName = "PixelCardTitle"

const PixelCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("font-pixel text-xs text-muted-foreground leading-relaxed", className)}
    {...props}
  />
))
PixelCardDescription.displayName = "PixelCardDescription"

const PixelCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-0 pt-4", className)} {...props} />
))
PixelCardContent.displayName = "PixelCardContent"

const PixelCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-0 pt-4", className)}
    {...props}
  />
))
PixelCardFooter.displayName = "PixelCardFooter"

export { PixelCard, PixelCardHeader, PixelCardFooter, PixelCardTitle, PixelCardDescription, PixelCardContent }