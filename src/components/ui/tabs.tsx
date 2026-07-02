"use client"

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Tabs — Masarak Design System
 *
 * Variants:
 *  pills   → pill-shaped tabs with fill (default)
 *  line    → underline indicator (for page-level tabs)
 *  boxed   → contained tabs on a muted bg
 *
 * All states: default, hover, active (selected), focus, disabled
 */

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-4 data-horizontal:flex-col",
        className
      )}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center",
  {
    variants: {
      variant: {
        pills: "gap-1 bg-muted rounded-lg p-1",
        line:  "gap-0 border-b border-border w-full rounded-none p-0",
        boxed: "gap-0 border border-border rounded-lg p-0 overflow-hidden",
      },
    },
    defaultVariants: {
      variant: "pills",
    },
  }
)

function TabsList({
  className,
  variant = "pills",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        // Base
        "relative inline-flex items-center justify-center gap-2",
        "text-sm font-semibold whitespace-nowrap select-none",
        "transition-all duration-200",
        // Focus
        "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
        // Disabled
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-disabled:pointer-events-none aria-disabled:opacity-50",
        // Icons
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        // Pills variant
        "group-data-[variant=pills]/tabs-list:h-9 group-data-[variant=pills]/tabs-list:px-4 group-data-[variant=pills]/tabs-list:rounded-md",
        "group-data-[variant=pills]/tabs-list:text-text-muted group-data-[variant=pills]/tabs-list:hover:text-foreground",
        "group-data-[variant=pills]/tabs-list:data-active:bg-background group-data-[variant=pills]/tabs-list:data-active:text-foreground group-data-[variant=pills]/tabs-list:data-active:shadow-sm",

        // Line variant
        "group-data-[variant=line]/tabs-list:h-10 group-data-[variant=line]/tabs-list:px-4 group-data-[variant=line]/tabs-list:rounded-none",
        "group-data-[variant=line]/tabs-list:text-text-muted group-data-[variant=line]/tabs-list:hover:text-foreground",
        "group-data-[variant=line]/tabs-list:data-active:text-primary",
        "group-data-[variant=line]/tabs-list:data-active:border-b-2 group-data-[variant=line]/tabs-list:data-active:border-primary",
        "group-data-[variant=line]/tabs-list:data-active:mb-[-1px]",

        // Boxed variant
        "group-data-[variant=boxed]/tabs-list:h-10 group-data-[variant=boxed]/tabs-list:px-5 group-data-[variant=boxed]/tabs-list:border-e group-data-[variant=boxed]/tabs-list:last:border-e-0 group-data-[variant=boxed]/tabs-list:border-border",
        "group-data-[variant=boxed]/tabs-list:text-text-muted group-data-[variant=boxed]/tabs-list:hover:bg-muted",
        "group-data-[variant=boxed]/tabs-list:data-active:bg-primary group-data-[variant=boxed]/tabs-list:data-active:text-primary-foreground",

        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
