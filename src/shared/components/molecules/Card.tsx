import * as React from "react"
import { Card as ShadcnCard, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<typeof ShadcnCard> & { elevated?: boolean }>(({ className, elevated, ...props }, ref) => (
  <ShadcnCard ref={ref} className={cn(elevated && "shadow-md border-transparent", className)} {...props} />
))
Card.displayName = "Card"
export { CardHeader, CardTitle, CardDescription, CardContent, CardFooter }