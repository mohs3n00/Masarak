import * as React from "react"
import { Badge as ShadcnBadge, badgeVariants } from "@/components/ui/badge"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

export interface BadgeProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnBadge>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <ShadcnBadge className={cn(className)} variant={variant} {...props} />
  )
}

export { Badge, badgeVariants }
