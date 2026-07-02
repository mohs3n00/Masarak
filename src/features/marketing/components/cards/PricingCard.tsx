import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/molecules/Card';
import { Button } from '@/shared/components/atoms/Button';
import { CheckCircle2, Star } from 'lucide-react';
import type { PricingPlan } from '@/types/models';

interface PricingCardProps {
  plan: PricingPlan;
  className?: string;
}

export function PricingCard({ plan, className }: PricingCardProps) {
  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <Card className={cn(
        "h-full flex flex-col relative transition-all duration-300",
        plan.isPopular 
          ? "border-primary/50 shadow-[0_12px_40px_rgb(0,0,0,0.12)] scale-105 z-10 rounded-[2rem] bg-card" 
          : "border-border/40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 rounded-[2rem]",
        className
      )}>
        {plan.isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-current" />
            الأكثر شعبية
          </div>
        )}
        <CardHeader className="text-center pt-10 pb-6">
          <CardTitle className="text-2xl font-black text-foreground mb-4">{plan.name}</CardTitle>
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-5xl font-black text-primary tracking-tight">{plan.price}</span>
            <span className="text-sm font-bold text-muted-foreground">ج.م / {plan.period === 'MONTHLY' ? 'شهر' : 'سنة'}</span>
          </div>
        </CardHeader>
        <div className="h-px w-[80%] mx-auto bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <CardContent className="flex-1 pt-8 px-8">
          <ul className="space-y-5">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-[15px] font-medium text-muted-foreground leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="p-8 pt-0 mt-4">
          <Button 
            variant={plan.isPopular ? "primary" : "outline"} 
            className={cn(
              "w-full h-14 rounded-2xl text-[15px]",
              plan.isPopular ? "shadow-xl shadow-primary/25" : "border-2 hover:bg-muted/50"
            )}
          >
            اشترك الآن
          </Button>
        </CardFooter>
      </Card>
    </AnimatedDiv>
  );
}
