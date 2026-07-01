import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/shared/components/molecules/Accordion';
import type { FAQ } from '@/types/models';

interface FAQAccordionProps {
  items: FAQ[];
  className?: string;
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  return (
    <AnimatedDiv variant="fadeUp" className={cn("w-full max-w-3xl mx-auto", className)}>
      <Accordion className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-start text-lg font-medium">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </AnimatedDiv>
  );
}
