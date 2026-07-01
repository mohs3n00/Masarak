import * as React from "react"
import { cn } from "@/lib/utils"

export function AppContainer({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl", className)}>
      {children}
    </div>
  )
}

export function Section({ className, children, id }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section id={id} className={cn("py-12 md:py-16 lg:py-24", className)}>
      {children}
    </section>
  )
}

export function PageHeader({ className, children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <header className={cn("mb-8 md:mb-12", className)}>
      {children}
    </header>
  )
}

export function PageContent({ className, children }: React.HTMLAttributes<HTMLElement>) {
  return (
    <main className={cn("flex-1", className)}>
      {children}
    </main>
  )
}

export function ContentGrid({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8", className)}>
      {children}
    </div>
  )
}

export function DashboardContainer({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex min-h-[calc(100vh-4rem)] bg-muted/20 w-full", className)}>
      <div className="flex-1 w-full p-4 md:p-8 lg:p-12 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}