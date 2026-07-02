import * as React from "react"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

/**
 * Chip — Masarak Design System
 * Interactive badge with optional icon and remove button.
 */

export interface ChipProps extends BadgeProps {
  onRemove?: () => void;
  icon?: React.ReactNode;
}

export function Chip({ className, children, onRemove, icon, ...props }: ChipProps) {
  return (
    <Badge
      className={cn("rounded-full px-3 py-1 flex items-center gap-1.5", className)}
      {...props}
    >
      {icon && <span className="flex-shrink-0 [&_svg]:size-3.5">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }}
          className={cn(
            "ms-1 rounded-full p-0.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "hover:bg-foreground/15 text-inherit"
          )}
          aria-label="إزالة"
        >
          <X className="size-3.5" />
        </button>
      )}
    </Badge>
  )
}
