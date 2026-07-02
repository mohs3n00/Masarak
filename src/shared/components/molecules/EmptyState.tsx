import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * EmptyState — Masarak Design System
 *
 * Used when: no courses, no search results, no notifications, empty wishlist, etc.
 * Clean, minimal, educational feeling. No glassmorphism.
 *
 * States: default (icon + title + description + action)
 */

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center text-center",
        "py-16 px-6 rounded-xl border border-dashed border-border",
        "bg-surface",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-2xl bg-muted text-text-muted [&_svg]:size-8">
          {icon}
        </div>
      )}
      <h3 className="text-base font-bold text-foreground mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-muted max-w-xs leading-relaxed mb-6">
          {description}
        </p>
      )}
      {action && !description && <div className="mt-4">{action}</div>}
      {action && description && <div>{action}</div>}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
