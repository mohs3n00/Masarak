import * as React from "react"
import { Badge, type BadgeProps } from "./Badge"
import { cn } from "@/lib/utils"

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
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ms-1 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/20 focus:outline-none"
        >
          <span className="sr-only">Remove</span>
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Badge>
  )
}
