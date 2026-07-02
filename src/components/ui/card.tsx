import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Card — Masarak Design System
 *
 * Hierarchy:
 *  card-flat    → no shadow, border only (list items, sidebars)
 *  card-default → subtle shadow (standard content cards)
 *  card-raised  → medium shadow (featured / hero cards)
 *
 * All interactive variants include hover state.
 */

// ── Card Root ────────────────────────────────────────────────
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "flat" | "default" | "raised"
    interactive?: boolean
  }
>(({ className, variant = "default", interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card"
    className={cn(
      "rounded-xl border bg-card text-card-foreground",
      variant === "flat"    && "border-border shadow-none",
      variant === "default" && "border-border shadow-sm",
      variant === "raised"  && "border-border shadow-md",
      interactive && [
        "cursor-pointer transition-all duration-200",
        "hover:shadow-md hover:-translate-y-0.5",
        "active:scale-[0.99] active:shadow-sm",
      ],
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// ── Card Header ──────────────────────────────────────────────
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-header"
    className={cn("flex flex-col gap-1.5 p-5 pb-0", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

// ── Card Title ───────────────────────────────────────────────
const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-slot="card-title"
    className={cn("text-lg font-bold leading-tight text-foreground", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// ── Card Description ─────────────────────────────────────────
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="card-description"
    className={cn("text-sm text-text-muted leading-relaxed", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

// ── Card Content ─────────────────────────────────────────────
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-content"
    className={cn("p-5", className)}
    {...props}
  />
))
CardContent.displayName = "CardContent"

// ── Card Footer ──────────────────────────────────────────────
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="card-footer"
    className={cn("flex items-center gap-3 p-5 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
