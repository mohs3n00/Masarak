import React from 'react';
import { AppContainer } from '@/shared/layouts/Containers';
import { Badge } from '@/components/ui/badge';
import type { Teacher } from '@/types/models';

interface TeacherHeroHeaderProps {
  teacher: Teacher;
}

export function TeacherHeroHeader({ teacher }: TeacherHeroHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden bg-primary/90 dark:bg-slate-900 pt-12 pb-16 md:pb-0 border-b border-border">
      {/* Topographic Background Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c13.866 0 25.362 10.24 26.882 23.635l.025.263C38.22 55.452 49.333 65 62 65c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 27.548 100.333 18 113 18V0C96.432 0 82.5 12.09 80.203 28.188l-.025.263C79.866 41.76 68.37 52 55 52c-13.866 0-25.362-10.24-26.882-23.635l-.025-.263C27.78 14.548 16.667 5 4 5V23c16.568 0 30.5 12.09 32.797 28.188l.025.263C37.134 64.24 48.63 74.48 62 74.48c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 37.028 100.333 27.48 113 27.48V9.48c-16.568 0-30.5-12.09-32.797-28.188l-.025-.263C79.866 5.48 68.37-4.76 55-4.76c-13.866 0-25.362 10.24-26.882 23.635l-.025.263C27.78 32.48 16.667 42.028 4 42.028v18c16.568 0 30.5 12.09 32.797 28.188l.025.263C37.134 101.98 48.63 112.22 62 112.22c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 74.768 100.333 65.22 113 65.22V47.22c-16.568 0-30.5-12.09-32.797-28.188l-.025-.263C79.866 5.48 68.37-4.76 55-4.76c-13.866 0-25.362 10.24-26.882 23.635l-.025.263C27.78 32.48 16.667 42.028 4 42.028z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '200px' 
        }} 
      />
      
      <AppContainer className="relative z-10">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-8 h-full">
          
          {/* Right Side: Info (RTL) */}
          <div className="flex flex-col items-center md:items-start text-white gap-4 flex-1 md:py-24">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-black/20 hover:bg-black/30 text-white border-transparent">
                معلم معتمد
              </Badge>
              <Badge variant="default" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white border-transparent">
                التقييم {(teacher.rating || 0).toFixed(1)}
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight drop-shadow-md">
              {teacher.name}
            </h1>
            
            <p className="text-xl md:text-2xl font-medium opacity-90 drop-shadow-sm">
              أستاذ {teacher.specialization}
            </p>
            
            <div className="mt-2">
              <Badge variant="outline" className="text-white border-white/40 bg-white/10 text-sm py-1 px-4 rounded-full">
                {teacher.specialization} - جميع المراحل
              </Badge>
            </div>
          </div>
          
          {/* Left Side: Teacher Standard Square Image */}
          <div className="relative w-full max-w-[300px] aspect-square shrink-0 mt-8 md:mt-12 self-end rounded-t-[2rem] overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
             {/* The Image */}
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img 
               src={teacher.avatar} 
               alt={teacher.name}
               className="w-full h-full object-cover"
             />
          </div>
          
        </div>
      </AppContainer>
    </div>
  );
}
