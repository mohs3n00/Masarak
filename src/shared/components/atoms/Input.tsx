import * as React from "react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { Eye, EyeOff, Search } from "lucide-react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<typeof ShadcnInput> {
  error?: boolean;
}

export const Input = React.forwardRef<React.ElementRef<typeof ShadcnInput>, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <ShadcnInput
        ref={ref}
        className={cn(error && "border-destructive focus-visible:ring-destructive", className)}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export const PasswordInput = React.forwardRef<React.ElementRef<typeof ShadcnInput>, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-12", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 end-0 flex items-center pe-4 text-muted-foreground hover:text-foreground focus:outline-none"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
          <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

export const SearchInput = React.forwardRef<React.ElementRef<typeof ShadcnInput>, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <Search className="absolute start-4 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          className={cn("ps-10", className)}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"
