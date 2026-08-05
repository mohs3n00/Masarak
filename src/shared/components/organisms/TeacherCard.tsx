import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export interface TeacherCardProps {
  id: string;
  name: string;
  subject: string;
  avatar?: string;
  bio?: string;
  studentsCount?: number;
  coursesCount?: number;
}

export function TeacherCard({ 
  id, 
  name, 
  subject, 
  avatar,
}: TeacherCardProps) {
  return (
    <Link href={`/teachers/${id}`} className="block w-full h-full group">
      <div className="bg-white border-0 rounded-[2rem] p-3 shadow-xl shadow-black/5 flex flex-col items-center h-full w-full transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
        
        <div className="w-full aspect-square rounded-[1.5rem] bg-slate-100 overflow-hidden mb-5 flex items-center justify-center relative">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <span className="text-5xl font-bold text-slate-300">{name?.charAt(0) || 'م'}</span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1 mt-2">{name || 'معلم'}</h3>
        
        <span className="text-muted-foreground text-sm font-medium mb-4">
          {subject}
        </span>
        
      </div>
    </Link>
  )
}