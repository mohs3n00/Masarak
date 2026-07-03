'use client';

import React, { useState } from 'react';
import { Subject, Level } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface AcademicTabsProps {
  subjects: Subject[];
  grades: Level[];
  onAddSubject: (data: Partial<Subject>) => Promise<void>;
  onDeleteSubject: (id: string) => Promise<void>;
  onAddGrade: (data: Partial<Level>) => Promise<void>;
  onDeleteGrade: (id: string) => Promise<void>;
}

export function AcademicTabs({ subjects, grades, onAddSubject, onDeleteSubject, onAddGrade, onDeleteGrade }: AcademicTabsProps) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newGradeName, setNewGradeName] = useState('');

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    await onAddSubject({ name: newSubjectName, slug: newSubjectName.toLowerCase().replace(/\s+/g, '-') });
    setNewSubjectName('');
  };

  const handleAddGrade = async () => {
    if (!newGradeName.trim()) return;
    await onAddGrade({ name: newGradeName, slug: newGradeName.toLowerCase().replace(/\s+/g, '-') });
    setNewGradeName('');
  };

  return (
    <Tabs defaultValue="subjects" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="subjects">المواد الدراسية</TabsTrigger>
        <TabsTrigger value="grades">الصفوف (المراحل)</TabsTrigger>
      </TabsList>

      <TabsContent value="subjects" className="space-y-6">
        <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
          <Input 
            placeholder="اسم المادة الجديدة (مثال: كيمياء)" 
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddSubject} disabled={!newSubjectName.trim()} className="gap-2 shrink-0">
            <Plus className="w-4 h-4" /> إضافة مادة
          </Button>
        </div>

        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 text-start">اسم المادة</th>
                <th className="px-4 py-3 text-start">المعرف (Slug)</th>
                <th className="px-4 py-3 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{subject.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{subject.slug}</td>
                  <td className="px-4 py-3 text-end">
                    <Button variant="ghost" size="icon-sm" onClick={() => onDeleteSubject(subject.id as string)} title="حذف">
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-error" />
                    </Button>
                  </td>
                </tr>
              ))}
              {subjects.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    لا يوجد مواد مسجلة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>

      <TabsContent value="grades" className="space-y-6">
        <div className="flex items-center gap-3 bg-card p-4 rounded-xl border border-border">
          <Input 
            placeholder="اسم الصف الجديد (مثال: الصف الأول الإعدادي)" 
            value={newGradeName}
            onChange={(e) => setNewGradeName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddGrade} disabled={!newGradeName.trim()} className="gap-2 shrink-0">
            <Plus className="w-4 h-4" /> إضافة صف
          </Button>
        </div>

        <div className="border border-border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 text-start">اسم الصف</th>
                <th className="px-4 py-3 text-start">المعرف (Slug)</th>
                <th className="px-4 py-3 text-end">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-foreground">{grade.name}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{grade.slug}</td>
                  <td className="px-4 py-3 text-end">
                    <Button variant="ghost" size="icon-sm" onClick={() => onDeleteGrade(grade.id as string)} title="حذف">
                      <Trash2 className="w-4 h-4 text-muted-foreground hover:text-error" />
                    </Button>
                  </td>
                </tr>
              ))}
              {grades.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    لا يوجد صفوف مسجلة.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
