import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

/**
 * Button — Masarak Design System
 *
 * Heights:
 *  sm  → 40px (secondary actions, inline buttons)
 *  md  → 48px (default — most actions)
 *  lg  → 56px (hero / CTA / primary page actions)
 *  icon-sm → 40×40px
 *  icon    → 48×48px
 *  icon-lg → 56×56px
 *
 * All states implemented:
 *  default, hover, active, focus-visible, disabled, loading
 */

const buttonVariants = cva(
  [
    // Base
    "inline-flex shrink-0 items-center justify-center gap-2",
    "font-semibold whitespace-nowrap select-none",
    "border border-transparent",
    "smooth",
    // Focus
    "outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2",
    // Active press
    "active:scale-95 active:shadow-none",
    // Disabled
    "disabled:pointer-events-none disabled:opacity-50",
    // Icons inside button
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 group-hover:[&_svg]:scale-110",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Primary — main actions */
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:bg-primary/80",

        /** Secondary — supporting actions */
        secondary:
          "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20",

        /** Outline — less emphasis */
        outline:
          "bg-transparent text-foreground border-border-strong hover:bg-muted/80",

        /** Ghost — least emphasis, navigation */
        ghost:
          "bg-transparent text-foreground hover:bg-muted/50 border-transparent",

        /** Danger — destructive actions */
        danger:
          "bg-error text-error-foreground hover:bg-error/90 active:bg-error/80 shadow-sm hover:shadow-md hover:-translate-y-0.5",

        /** Danger Outline — reversible destructive */
        "danger-outline":
          "bg-transparent text-error border-error hover:bg-error/10",

        /** Link — inline text links */
        link: "bg-transparent text-primary underline-offset-4 hover:underline border-transparent p-0 h-auto active:scale-100",

        /** Success — confirmation actions */
        success:
          "bg-success text-success-foreground hover:bg-success/90 shadow-sm",
      },
      size: {
        sm:      "h-10 px-4 text-sm rounded-xl [&_svg]:size-4",
        md:      "h-12 px-6 text-[15px] rounded-xl [&_svg]:size-5",
        lg:      "h-14 px-10 text-base rounded-2xl [&_svg]:size-5",
        "icon-sm":  "size-10 rounded-xl p-0 [&_svg]:size-4",
        "icon":     "size-12 rounded-xl p-0 [&_svg]:size-5",
        "icon-lg":  "size-14 rounded-2xl p-0 [&_svg]:size-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  loadingText?: string
}

function Button({
  className,
  variant,
  size,
  loading = false,
  loadingText,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn("group", buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin [&_svg]:size-inherit"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
