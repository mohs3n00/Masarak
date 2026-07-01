import * as React from "react"
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Spinner } from "./Spinner"

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof ShadcnButton> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = React.forwardRef<React.ElementRef<typeof ShadcnButton>, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <ShadcnButton
        ref={ref}
        variant={variant}
        size={size}
        disabled={loading || disabled}
        className={cn(className)}
        {...props}
      >
        {loading && <Spinner size="sm" className="me-2" />}
        {!loading && leftIcon && <span className="me-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ms-2">{rightIcon}</span>}
      </ShadcnButton>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
