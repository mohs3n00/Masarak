import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Progress — Masarak Design System
 *
 * Used for: course completion, lesson progress, upload progress.
 * Clean bar — no glows, no animations except smooth width transition.
 *
 * Variants: default (green), info (blue), warning (orange)
 * Sizes: sm (4px), md (8px, default), lg (12px)
 */

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number          // 0–100
  max?: number
  variant?: "default" | "info" | "warning" | "success"
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  label?: string
}

const variantColor = {
  default: "bg-primary",
  success: "bg-success",
  info:    "bg-info",
  warning: "bg-warning",
}

const sizeClass = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
}

function Progress({
  value,
  max = 100,
  variant = "default",
  size = "md",
  showLabel = false,
  label,
  className,
  ...props
}: ProgressProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      data-slot="progress"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("w-full space-y-1", className)}
      {...props}
    >
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>{label}</span>
          <span className="font-semibold text-foreground">{Math.round(pct)}%</span>
        </div>
      )}
      <div
        className={cn(
          "w-full rounded-full bg-muted overflow-hidden",
          sizeClass[size]
        )}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            variantColor[variant]
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

export { Progress }
export type { ProgressProps }
