'use client';

import React, { useState } from 'react';
import { Teacher } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/atoms/Avatar';
import { MoreHorizontal, Edit, Trash2, ShieldOff, ShieldCheck, Plus } from 'lucide-react';

interface TeacherListTableProps {
  teachers: Teacher[];
  onAddTeacher: () => void;
  onEditTeacher: (teacher: Teacher) => void;
  onDeleteTeacher: (id: string) => void;
  onToggleStatus: (id: string, currentStatus: boolean) => void; // Assuming we add a status field, or using role/bio for now
}

export function TeacherListTable({ teachers, onAddTeacher, onEditTeacher, onDeleteTeacher, onToggleStatus }: TeacherListTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">إدارة المدرسين</h2>
        <Button onClick={onAddTeacher} className="gap-2">
          <Plus className="w-4 h-4" /> إضافة مدرس جديد
        </Button>
      </div>

      <div className="border border-border rounded-xl bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 text-start">المدرس</th>
                <th className="px-4 py-3 text-start">التخصص</th>
                <th className="px-4 py-3 text-center">الكورسات</th>
                <th className="px-4 py-3 text-center">الطلاب</th>
                <th className="px-4 py-3 text-start">الحالة</th>
                <th className="px-4 py-3 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-border">
                        <AvatarImage src={teacher.avatar} alt={teacher.name} />
                        <AvatarFallback>{teacher.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">{teacher.name}</span>
                        <span className="text-xs text-muted-foreground">{teacher.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{teacher.specialization || '—'}</td>
                  <td className="px-4 py-3 text-center text-foreground font-medium">{teacher.coursesCount}</td>
                  <td className="px-4 py-3 text-center text-foreground font-medium">{teacher.studentsCount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold bg-success/10 text-success">
                      نشط
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => onEditTeacher(teacher)} title="تعديل">
                        <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onToggleStatus(teacher.id as string, true)} title="إيقاف">
                        <ShieldOff className="w-4 h-4 text-muted-foreground hover:text-warning" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => onDeleteTeacher(teacher.id as string)} title="حذف">
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-error" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {teachers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    لا يوجد مدرسين مسجلين حتى الآن.
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
