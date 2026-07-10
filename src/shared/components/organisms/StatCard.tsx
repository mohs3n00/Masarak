import * as React from "react"
import { Card } from "../molecules/Card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown } from "lucide-react"

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; label: string };
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-muted-foreground text-sm">{title}</h3>
        <div className="p-2 bg-primary/10 text-primary rounded-full">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-3xl font-bold">{value}</span>
        {trend && (
          <div className="flex items-center gap-1 mt-1">
            <span className={cn("text-xs font-medium flex items-center", trend.value >= 0 ? "text-success" : "text-destructive")}>
              {trend.value >= 0 ? <TrendingUp className="h-3 w-3 me-1" /> : <TrendingDown className="h-3 w-3 me-1" />}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </Card>
  )
}