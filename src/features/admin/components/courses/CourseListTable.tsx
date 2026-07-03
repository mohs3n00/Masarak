'use client';

import React from 'react';
import { Course } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CourseListTableProps {
  courses: Course[];
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string) => void;
}

export function CourseListTable({ courses, onEditCourse, onDeleteCourse }: CourseListTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">إدارة الكورسات</h2>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 text-start">الكورس</th>
                <th className="px-4 py-3 text-start">المدرب (ID)</th>
                <th className="px-4 py-3 text-center">السعر</th>
                <th className="px-4 py-3 text-center">الطلاب</th>
                <th className="px-4 py-3 text-start">الحالة</th>
                <th className="px-4 py-3 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 relative rounded-md overflow-hidden bg-muted shrink-0">
                        <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground line-clamp-1" title={course.title}>
                          {course.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {course.lessonsCount} درس • {course.durationHours} ساعة
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{course.teacherId}</td>
                  <td className="px-4 py-3 text-center text-foreground font-medium">
                    {course.price > 0 ? `${course.price} ${course.currency}` : <span className="text-success">مجاني</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-foreground font-medium">{course.studentsCount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success">
                      منشور
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/course/${course.slug}`} target="_blank">
                        <Button variant="ghost" size="icon-sm" title="عرض الكورس">
                          <ArrowUpRight className="w-4 h-4 text-muted-foreground hover:text-primary" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon-sm" onClick={() => onEditCourse(course)} title="تعديل">
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDeleteCourse(course.id as string)} title="حذف">
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-error" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {courses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    لا يوجد كورسات مسجلة حتى الآن.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
