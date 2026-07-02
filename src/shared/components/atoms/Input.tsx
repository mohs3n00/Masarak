"use client"

import * as React from "react"
import { Input as BaseInput, type InputProps } from "@/components/ui/input"
import { Eye, EyeOff, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Input Atoms — Masarak Design System
 *
 * Base Input  → plain 52px input
 * PasswordInput → with show/hide toggle
 * SearchInput   → with search icon + clear button
 * PhoneInput    → prefixed with +20 flag
 */

// ── Base Input ───────────────────────────────────────────────
export { BaseInput as Input }
export type { InputProps }

// ── Password Input ───────────────────────────────────────────
interface PasswordInputProps extends Omit<InputProps, "type" | "endIcon"> {
  showPasswordLabel?: string
  hidePasswordLabel?: string
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showPasswordLabel = "إظهار", hidePasswordLabel = "إخفاء", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative w-full">
        <BaseInput
          ref={ref}
          type={showPassword ? "text" : "password"}
          className={cn("ps-12", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={cn(
            "absolute inset-y-0 start-0 flex items-center px-4",
            "text-text-muted hover:text-foreground",
            "transition-colors duration-200",
            "focus:outline-none focus-visible:text-foreground"
          )}
          aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="size-5" aria-hidden="true" />
          ) : (
            <Eye className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
    )
  }
)
PasswordInput.displayName = "PasswordInput"

// ── Search Input ─────────────────────────────────────────────
interface SearchInputProps extends Omit<InputProps, "type"> {
  onClear?: () => void
  value?: string
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onClear, value, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {/* Search Icon — RTL: appears on the right */}
        <Search
          className="absolute end-4 top-1/2 -translate-y-1/2 size-5 text-text-muted pointer-events-none"
          aria-hidden="true"
        />
        <BaseInput
          ref={ref}
          type="search"
          value={value}
          className={cn(
            "pe-12",
            value && onClear && "ps-12",
            // Remove browser default search cancel button
            "[&::-webkit-search-cancel-button]:hidden",
            className
          )}
          {...props}
        />
        {/* Clear button — only visible when there is a value */}
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className={cn(
              "absolute start-4 top-1/2 -translate-y-1/2",
              "text-text-muted hover:text-foreground",
              "transition-colors duration-200",
              "focus:outline-none focus-visible:text-foreground"
            )}
            aria-label="مسح البحث"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = "SearchInput"

// ── Phone Input ──────────────────────────────────────────────
interface PhoneInputProps extends Omit<InputProps, "type"> {}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div className="relative w-full flex items-center">
        {/* Egypt prefix badge */}
        <span className={cn(
          "absolute end-px top-px bottom-px",
          "flex items-center gap-1.5 px-3",
          "bg-muted border-s border-input-border rounded-e-lg",
          "text-sm font-medium text-text-secondary pointer-events-none select-none"
        )}>
          🇪🇬 <span>01</span>
        </span>
        <BaseInput
          ref={ref}
          type="tel"
          inputMode="numeric"
          maxLength={9}
          placeholder="XXXXXXXXX"
          className={cn("pe-24 font-mono tracking-wide ltr:text-left", className)}
          dir="ltr"
          {...props}
        />
      </div>
    )
  }
)
PhoneInput.displayName = "PhoneInput"
