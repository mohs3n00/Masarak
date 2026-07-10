import * as React from "react"
import { AlertCircle, CheckCircle2, Loader2, Inbox } from "lucide-react"

export function EmptyState({ title, description, icon: Icon = Inbox, action }: { title: string, description?: string, icon?: React.ElementType, action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="rounded-full bg-muted p-4 mb-4 text-muted-foreground"><Icon className="h-8 w-8" /></div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2 max-w-sm">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ title = "Something went wrong", description, onRetry }: { title?: string, description?: string, onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-destructive">
      <AlertCircle className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="text-sm mt-2 opacity-90">{description}</p>}
      {onRetry && <button onClick={onRetry} className="mt-4 underline underline-offset-4 font-medium">Try again</button>}
    </div>
  )
}

export function SuccessState({ title, description }: { title: string, description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-success">
      <CheckCircle2 className="h-10 w-10 mb-4" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-2">{description}</p>}
    </div>
  )
}

export function LoadingState({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
      <p className="text-sm animate-pulse">{text}</p>
    </div>
  )
}