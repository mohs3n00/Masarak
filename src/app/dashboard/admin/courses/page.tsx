'use client';

import React, { useEffect, useState } from 'react';
import { Course } from '@/types/models';
import { adminService } from '@/features/admin/services/admin.service';
import { CourseListTable } from '@/features/admin/components/courses/CourseListTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    thumbnail: '',
  });

  const loadCourses = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || '',
      price: course.price,
      thumbnail: course.thumbnail || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCourse) return;
    setIsSaving(true);
    try {
      await adminService.updateCourse(editingCourse.id as string, formData);
      setIsModalOpen(false);
      await loadCourses();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الكورس؟ هذا الإجراء لا يمكن التراجع عنه.')) return;
    try {
      await adminService.deleteCourse(id);
      await loadCourses();
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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <CourseListTable 
        courses={courses} 
        onEditCourse={handleOpenEditModal}
        onDeleteCourse={handleDelete}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الكورس</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">اسم الكورس</label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                placeholder="عنوان الكورس"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">السعر (ج.م)</label>
              <Input 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: Number(e.target.value) || 0})} 
                type="number"
                min={0}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">صورة الكورس (رابط URL)</label>
              <Input 
                value={formData.thumbnail} 
                onChange={e => setFormData({...formData, thumbnail: e.target.value})} 
                placeholder="https://example.com/thumbnail.jpg"
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">الوصف</label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder="وصف الكورس..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} loading={isSaving}>حفظ التعديلات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
