import * as React from "react"
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export interface TextareaProps extends React.ComponentProps<typeof ShadcnTextarea> {
  error?: boolean;
}

export const Textarea = React.forwardRef<React.ElementRef<typeof ShadcnTextarea>, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <ShadcnTextarea
        ref={ref}
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"
