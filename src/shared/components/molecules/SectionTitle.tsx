import * as React from "react"
import { cn } from "@/lib/utils"

export function SectionTitle({ title, subtitle, action, className }: { title: React.ReactNode, subtitle?: React.ReactNode, action?: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-end justify-between gap-4", className)}>
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}