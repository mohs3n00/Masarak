'use client';

import React, { useEffect, useState } from 'react';
import { Subject, Level } from '@/types/models';
import { adminService } from '@/features/admin/services/admin.service';
import { AcademicTabs } from '@/features/admin/components/academic/AcademicTabs';
import { Loader2 } from 'lucide-react';

export default function AdminAcademicPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [grades, setGrades] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [subs, grds] = await Promise.all([
        adminService.getSubjects(),
        adminService.getGrades(),
      ]);
      setSubjects(subs);
      setGrades(grds);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddSubject = async (data: Partial<Subject>) => {
    try {
      await adminService.addSubject(data);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟ قد يؤثر هذا على الكورسات المرتبطة بها.')) return;
    try {
      await adminService.deleteSubject(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddGrade = async (data: Partial<Level>) => {
    try {
      await adminService.addGrade(data);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteGrade = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصف؟ قد يؤثر هذا على الكورسات المرتبطة به.')) return;
    try {
      await adminService.deleteGrade(id);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-foreground">التقسيم الأكاديمي</h2>
      </div>

      <AcademicTabs 
        subjects={subjects}
        grades={grades}
        onAddSubject={handleAddSubject}
        onDeleteSubject={handleDeleteSubject}
        onAddGrade={handleAddGrade}
        onDeleteGrade={handleDeleteGrade}
      />
    </div>
  );
}
