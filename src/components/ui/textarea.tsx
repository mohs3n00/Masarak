import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full min-h-[120px] rounded-xl border-2 border-border/50 bg-muted/30 px-4 py-4 text-[15px] transition-all duration-300 outline-none placeholder:text-muted-foreground/70 focus-visible:border-primary/50 focus-visible:bg-transparent focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-4 aria-invalid:ring-destructive/10 hover:border-border",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
