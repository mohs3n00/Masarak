import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/lib/utils"

/**
 * Input — Masarak Design System
 *
 * Height: 52px (--input-h)
 * All states: default, hover, focus, disabled, error, readonly
 * Supports: start/end icons, helper text, error message, label
 */

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

function Input({
  className,
  type,
  error,
  startIcon,
  endIcon,
  ...props
}: InputProps) {
  if (startIcon || endIcon) {
    return (
      <div className="relative flex items-center w-full">
        {startIcon && (
          <span className="absolute end-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none [&_svg]:size-5">
            {startIcon}
          </span>
        )}
        <InputPrimitive
          type={type}
          data-slot="input"
          data-error={error || undefined}
          className={cn(
            // Base
            "h-[52px] w-full min-w-0 rounded-lg",
            "border border-input-border bg-input",
            "px-4 text-[15px] text-foreground",
            "placeholder:text-text-muted",
            // Transitions
            "transition-colors duration-200",
            // Hover
            "hover:border-border-strong",
            // Focus
            "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
            // Error
            error && "border-error focus-visible:border-error focus-visible:ring-error/20",
            // Icon padding
            startIcon && "pe-11",
            endIcon && "ps-11",
            className
          )}
          {...props}
        />
        {endIcon && (
          <span className="absolute start-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none [&_svg]:size-5">
            {endIcon}
          </span>
        )}
      </div>
    )
  }

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-error={error || undefined}
      className={cn(
        "h-[52px] w-full min-w-0 rounded-lg",
        "border border-input-border bg-input",
        "px-4 text-[15px] text-foreground",
        "placeholder:text-text-muted",
        "transition-colors duration-200",
        "hover:border-border-strong",
        "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
        error && "border-error focus-visible:border-error focus-visible:ring-error/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
