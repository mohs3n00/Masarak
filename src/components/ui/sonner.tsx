"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

/**
 * Toaster (Sonner) — Masarak Design System
 * Clean solid toasts without glassmorphism.
 */

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      dir="rtl"
      icons={{
        success: <CircleCheckIcon className="size-5 text-success" />,
        info: <InfoIcon className="size-5 text-info" />,
        warning: <TriangleAlertIcon className="size-5 text-warning" />,
        error: <OctagonXIcon className="size-5 text-error" />,
        loading: <Loader2Icon className="size-5 text-primary animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: "group toast bg-surface border-border shadow-lg rounded-xl text-foreground font-sans",
          description: "text-text-muted text-sm",
          actionButton: "bg-primary text-primary-foreground font-semibold rounded-lg",
          cancelButton: "bg-muted text-foreground font-semibold rounded-lg",
          icon: "me-3",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
