import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import * as React from "react"

/**
 * Badge — Masarak Design System
 *
 * Used for: subject tags, status indicators, free/paid labels,
 * grade labels, course difficulty, enrollment count chips.
 *
 * All states: default, hover (where clickable), disabled
 */

const badgeVariants = cva(
  [
    "inline-flex items-center gap-1 rounded-md",
    "text-xs font-semibold whitespace-nowrap",
    "px-2.5 py-0.5",
    "border transition-colors duration-200",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Default — neutral label */
        default:
          "bg-muted text-text-secondary border-transparent",

        /** Primary — highlighted label */
        primary:
          "bg-primary-light text-primary border-primary/20",

        /** Success — free course, completed, verified */
        success:
          "bg-success/10 text-success border-success/20",

        /** Warning — in progress, expiring */
        warning:
          "bg-warning/10 text-warning border-warning/20",

        /** Error — failed, rejected, overdue */
        error:
          "bg-error/10 text-error border-error/20",

        /** Info — new, featured */
        info:
          "bg-info/10 text-info border-info/20",

        /** Outline — secondary taxonomy tags */
        outline:
          "bg-transparent text-foreground border-border",

        /** Dark — dark overlays on images */
        dark:
          "bg-foreground/80 text-background border-transparent",
      },
      size: {
        sm: "text-[11px] px-2 py-0.5 rounded",
        md: "text-xs px-2.5 py-0.5 rounded-md",
        lg: "text-sm px-3 py-1 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
