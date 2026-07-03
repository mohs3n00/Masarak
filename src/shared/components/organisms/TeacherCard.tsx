import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, BookOpen } from "lucide-react"

/**
 * TeacherCard — Masarak Design System
 * Clean layout for teacher profiles in catalog/search.
 */

export interface TeacherCardProps {
  id: string;
  name: string;
  subject: string;
  avatar?: string;
  bio: string;
  studentsCount?: number;
  coursesCount?: number;
}

export function TeacherCard({ 
  id, 
  name, 
  subject, 
  avatar, 
  bio, 
  studentsCount, 
  coursesCount 
}: TeacherCardProps) {
  return (
    <Card 
      className="text-center overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/20 hover:-translate-y-1 group bg-card"
    >
      <div className="h-24 bg-muted w-full relative">
        {/* Subtle pattern background for the cover */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
        />
      </div>
      <CardContent className="px-5 pb-6 pt-0 relative flex flex-col items-center">
        <div className="flex justify-center -mt-12 mb-3">
          <Avatar className="h-24 w-24 border-4 border-background shadow-sm bg-surface">
            <AvatarImage src={avatar} alt={name} className="object-cover" />
            <AvatarFallback className="text-2xl font-bold text-primary">{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        
        <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-primary text-sm font-medium mb-3">{subject}</p>
        
        <p className="text-sm text-text-muted line-clamp-2 mb-4 leading-relaxed">
          {bio}
        </p>
        
        <div className="flex items-center justify-center gap-6 text-sm text-text-muted mb-6 w-full px-2">
          {studentsCount !== undefined && (
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-foreground">{studentsCount.toLocaleString('ar-EG')}</span>
              <span className="text-xs flex items-center gap-1"><Users className="size-3" /> طالب</span>
            </div>
          )}
          
          {(studentsCount !== undefined && coursesCount !== undefined) && (
            <div className="w-[1px] h-8 bg-border" />
          )}

          {coursesCount !== undefined && (
            <div className="flex flex-col items-center gap-1">
              <span className="font-bold text-foreground">{coursesCount.toLocaleString('ar-EG')}</span>
              <span className="text-xs flex items-center gap-1"><BookOpen className="size-3" /> كورس</span>
            </div>
          )}
        </div>

        <Button render={<Link href={`/teachers/${id}`} />} nativeButton={false} variant="outline" className="w-full rounded-xl bg-muted/50 border-transparent hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
          الصفحة الشخصية
        </Button>
      </CardContent>
    </Card>
  )
}