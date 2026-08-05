import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { AppContainer, Section } from '@/shared/layouts/Containers';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';

import step1Img from '@/assets/images/step1_choose.png';
import step2Img from '@/assets/images/step2_browse.png';
import step3Img from '@/assets/images/step3_subscribe.png';
import step4Img from '@/assets/images/step4_study.png';
import step5Img from '@/assets/images/step5_compete.png';

const steps = [
  {
    id: 1,
    title: 'اختار صفك ومادتك',
    description: 'أول حاجة، بتختار الصف الدراسي (أولى - تانية - تالتة ثانوي) وبعدين بتختار المادة اللي عايز تذاكرها.',
    image: step1Img,
    className: 'bg-primary text-white col-span-2',
    numberColor: 'text-white/20'
  },
  {
    id: 2,
    title: 'شوف المدرسين والكورسات',
    description: 'هتلاقي قائمة بأفضل المدرسين لكل مادة، وكورسات متقسمة حسب المواضيع والمراجعات.',
    image: step2Img,
    className: 'bg-primary/80 text-white col-span-2',
    numberColor: 'text-white/20'
  },
  {
    id: 3,
    title: 'اشترك في الكورس',
    description: 'لقيت كورس عاجبك؟ دوس "اشترك الآن" وابدأ تتعلم فوراً! تقدر تتابع من الموبايل أو اللابتوب في أي وقت.',
    image: step3Img,
    className: 'bg-[#4ade80] text-primary-foreground col-span-2',
    numberColor: 'text-black/10'
  },
  {
    id: 4,
    title: 'ذاكر واتمرن',
    description: 'اتفرج على الفيديوهات، حل الامتحانات، خد نقاط، وارجع للمحتوى وقت ما تحب.',
    image: step4Img,
    className: 'bg-[#86efac] text-primary-foreground col-span-3',
    numberColor: 'text-black/10'
  },
  {
    id: 5,
    title: 'اسأل، شارك، ونافس',
    description: 'ادخل مجموعات المناقشة، اسأل عن أي حاجة مش واضحة، شارك أفكارك، وشوف أنت فين بين زمايلك.',
    image: step5Img,
    className: 'bg-[#bbf7d0] text-primary-foreground col-span-3',
    numberColor: 'text-black/10'
  }
];

export function HowItWorks() {
  return (
    <div className="w-full bg-background pt-20 pb-16">
      <AppContainer>
        <div className="flex flex-col items-end text-right mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            إزاي مسارك بتشتغل؟
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            كل خطوة في المنصة معمولة عشان تخلي رحلتك الدراسية أسهل وأوضح:
          </p>
        </div>

        <AnimatedDiv variant="staggerContainer" className="grid grid-cols-1 md:grid-cols-6 gap-6" dir="rtl">
          {steps.map((step) => (
            <div 
              key={step.id}
              className={cn(
                "relative overflow-hidden rounded-3xl p-8 min-h-[320px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2",
                step.className
              )}
            >
              <div className="flex justify-between items-start z-10 relative">
                <div className="max-w-[70%]">
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-sm leading-relaxed opacity-90 font-medium">
                    {step.description}
                  </p>
                </div>
                <span className={cn("text-6xl font-black leading-none", step.numberColor)}>
                  {step.id}
                </span>
              </div>
              
              {/* Image */}
              <div className="absolute -bottom-[5%] -left-[5%] w-[85%] h-[105%] z-0 pointer-events-none">
                <div className="relative w-full h-full opacity-[0.35] [mask-image:radial-gradient(circle_at_bottom_left,black_20%,transparent_70%)]">
                  <Image 
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-contain object-left-bottom mix-blend-multiply contrast-125"
                  />
                </div>
              </div>
            </div>
          ))}
        </AnimatedDiv>
      </AppContainer>
    </div>
  );
}
