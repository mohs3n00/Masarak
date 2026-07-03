import React from 'react';
import { cn } from '@/lib/utils';
import { AnimatedDiv } from '@/shared/components/atoms/Motion';
import type { Teacher } from '@/types/models';
import Link from 'next/link';

interface TeacherPreviewCardProps {
  teacher: Teacher;
  className?: string;
}

export function TeacherPreviewCard({ teacher, className }: TeacherPreviewCardProps) {
  return (
    <AnimatedDiv variant="fadeUp" className="h-full">
      <Link href={`/teachers/${teacher.id}`} className="block h-full group">
        <div className={cn(
          "relative flex flex-col items-center p-4 md:p-5 rounded-2xl bg-[#eef7f9] dark:bg-slate-800/80 border border-transparent dark:border-slate-700/50",
          "transition-all duration-300 hover:shadow-xl hover:dark:shadow-black/40 hover:-translate-y-2 h-full",
          className
        )}>
          {/* Topographic Background Pattern */}
          <div 
            className="absolute inset-0 opacity-20 dark:opacity-5 pointer-events-none rounded-2xl" 
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c13.866 0 25.362 10.24 26.882 23.635l.025.263C38.22 55.452 49.333 65 62 65c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 27.548 100.333 18 113 18V0C96.432 0 82.5 12.09 80.203 28.188l-.025.263C79.866 41.76 68.37 52 55 52c-13.866 0-25.362-10.24-26.882-23.635l-.025-.263C27.78 14.548 16.667 5 4 5V23c16.568 0 30.5 12.09 32.797 28.188l.025.263C37.134 64.24 48.63 74.48 62 74.48c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 37.028 100.333 27.48 113 27.48V9.48c-16.568 0-30.5-12.09-32.797-28.188l-.025-.263C79.866 5.48 68.37-4.76 55-4.76c-13.866 0-25.362 10.24-26.882 23.635l-.025.263C27.78 32.48 16.667 42.028 4 42.028v18c16.568 0 30.5 12.09 32.797 28.188l.025.263C37.134 101.98 48.63 112.22 62 112.22c13.866 0 25.362-10.24 26.882-23.635l.025-.263C89.22 74.768 100.333 65.22 113 65.22V47.22c-16.568 0-30.5-12.09-32.797-28.188l-.025-.263C79.866 5.48 68.37-4.76 55-4.76c-13.866 0-25.362 10.24-26.882 23.635l-.025.263C27.78 32.48 16.667 42.028 4 42.028z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '150px' 
            }} 
          />
          
          {/* Teacher Image with specific rounded corners */}
          <div className="w-full aspect-square relative mb-5 overflow-hidden rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-xl rounded-bl-xl shadow-sm transition-transform duration-500 group-hover:scale-[1.02]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={teacher.avatar} 
              alt={teacher.name} 
              className="object-cover w-full h-full"
            />
          </div>

          {/* Teacher Info */}
          <div className="flex flex-col items-center text-center w-full mt-auto relative z-10">
            <h3 className="font-black text-xl md:text-2xl text-slate-800 dark:text-slate-100 leading-tight mb-2">
              {teacher.name}
            </h3>
            <p className="text-base md:text-lg font-medium text-slate-600 dark:text-slate-400">
              أستاذ {teacher.specialization}
            </p>
          </div>
        </div>
      </Link>
    </AnimatedDiv>
  );
}
