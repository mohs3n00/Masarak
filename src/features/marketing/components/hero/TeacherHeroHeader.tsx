import React from 'react';
import { AppContainer } from '@/shared/layouts/Containers';
import { Badge } from '@/components/ui/badge';
import type { Teacher } from '@/types/models';

interface TeacherHeroHeaderProps {
  teacher: Teacher;
}

export function TeacherHeroHeader({ teacher }: TeacherHeroHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-l from-primary to-primary/80 pt-32 md:pt-36 pb-12 md:pb-16 border-b border-border shadow-inner">
      {/* Paper Plane & Path Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='1440' height='400' viewBox='0 0 1440 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M-100,300 C200,400 500,50 800,200 C1100,350 1300,150 1600,100' fill='none' stroke='%23ffffff' stroke-width='4' stroke-dasharray='12 12' stroke-linecap='round'/%3E%3Cg transform='translate(1350, 110) rotate(-20) scale(2.5)'%3E%3Cpath d='M22 2L11 22l-4-9-9-4 22-11z' fill='%23ffffff'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} 
      />
      
      <AppContainer className="relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-10">
          
          {/* Left Side: Teacher Avatar */}
          <div className="relative w-40 h-40 md:w-56 md:h-56 shrink-0 rounded-[2.5rem] overflow-hidden bg-white/10 backdrop-blur-md border-[4px] border-white/30 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-300">
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={teacher.avatar} 
               alt={teacher.name}
               className="w-full h-full object-cover"
             />
          </div>

          {/* Right Side: Info (RTL) */}
          <div className="flex flex-col items-center md:items-start text-white gap-3 flex-1 text-center md:text-right">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-2">
              <Badge variant="default" className="bg-white text-primary hover:bg-slate-100 font-bold px-4 py-1 text-sm shadow-sm rounded-full">
                معلم معتمد
              </Badge>
              <Badge variant="default" className="bg-[#DC2626] text-white hover:bg-[#B91C1C] font-bold px-4 py-1 text-sm shadow-sm rounded-full">
                التقييم {(teacher.rating || 0).toFixed(1)}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-md leading-tight">
              {teacher.name}
            </h1>
            
            <p className="text-xl md:text-2xl font-medium opacity-90 drop-shadow-sm mb-2">
              أستاذ {teacher.specialization}
            </p>
            
            {teacher.bio && (
              <div className="bg-black/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 max-w-lg mt-2">
                <p className="text-sm md:text-base leading-relaxed opacity-95">
                  {teacher.bio}
                </p>
              </div>
            )}
          </div>
          
        </div>
      </AppContainer>
    </div>
  );
}
