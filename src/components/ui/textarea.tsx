import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Textarea — Masarak Design System
 * Consistent with Input styling, resizable vertically, min 100px.
 * Uses native <textarea> — no @base-ui/react/textarea (not available).
 */

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        data-slot="textarea"
        data-error={error || undefined}
        className={cn(
          "w-full min-w-0 min-h-[100px] rounded-lg",
          "border border-input-border bg-input",
          "px-4 py-3 text-[15px] text-foreground",
          "placeholder:text-text-muted",
          "resize-y transition-colors duration-200",
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
)
Textarea.displayName = "Textarea"

export { Textarea }
