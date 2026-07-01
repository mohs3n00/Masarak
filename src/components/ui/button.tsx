import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-2xl border border-transparent bg-clip-padding text-sm font-bold whitespace-nowrap transition-all duration-300 outline-none select-none focus-visible:ring-4 focus-visible:ring-primary/20 active:not-aria-[haspopup]:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5",
        outline:
          "border-2 border-border/50 bg-transparent hover:bg-muted/50 hover:text-foreground hover:border-border",
        secondary:
          "bg-secondary/50 text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-muted/50 hover:text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:shadow-md hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-12 px-6 gap-2",
        xs: "h-8 px-3 text-xs rounded-xl gap-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-10 px-4 text-[0.85rem] rounded-xl gap-1.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-14 px-8 text-base gap-2.5",
        icon: "size-12",
        "icon-xs": "size-8 rounded-xl [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-10 rounded-xl",
        "icon-lg": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
