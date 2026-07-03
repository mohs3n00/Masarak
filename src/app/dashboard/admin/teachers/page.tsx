'use client';

import React, { useEffect, useState } from 'react';
import { Teacher } from '@/types/models';
import { adminService } from '@/features/admin/services/admin.service';
import { TeacherListTable } from '@/features/admin/components/teachers/TeacherListTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    bio: '',
    avatar: '',
  });

  const loadTeachers = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getTeachers();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleOpenAddModal = () => {
    setEditingTeacher(null);
    setFormData({ name: '', email: '', specialization: '', bio: '', avatar: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      specialization: teacher.specialization || '',
      bio: teacher.bio || '',
      avatar: teacher.avatar || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (editingTeacher) {
        await adminService.updateTeacher(editingTeacher.id as string, formData);
      } else {
        await adminService.addTeacher(formData);
      }
      setIsModalOpen(false);
      await loadTeachers();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المدرس؟ سيتم حذف جميع الكورسات المرتبطة به.')) return;
    try {
      await adminService.deleteTeacher(id);
      await loadTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    if (!confirm(currentStatus ? 'هل تريد بالتأكيد إيقاف حساب هذا المدرس؟' : 'هل تريد تفعيل حساب هذا المدرس؟')) return;
    console.log(`Toggle status for ${id}`);
    alert('تم تغيير حالة الحساب بنجاح (Simulation)');
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
      <TeacherListTable 
        teachers={teachers} 
        onAddTeacher={handleOpenAddModal}
        onEditTeacher={handleOpenEditModal}
        onDeleteTeacher={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingTeacher ? 'تعديل بيانات المدرس' : 'إضافة مدرس جديد'}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">اسم المدرس</label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                placeholder="أحمد محمود"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">البريد الإلكتروني</label>
              <Input 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                placeholder="teacher@masarak.com"
                type="email"
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">التخصص</label>
              <Input 
                value={formData.specialization} 
                onChange={e => setFormData({...formData, specialization: e.target.value})} 
                placeholder="مدرس لغة عربية"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">صورة المدرس (رابط URL)</label>
              <Input 
                value={formData.avatar} 
                onChange={e => setFormData({...formData, avatar: e.target.value})} 
                placeholder="https://example.com/avatar.jpg"
                dir="ltr"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold">النبذة (Bio)</label>
              <Textarea 
                value={formData.bio} 
                onChange={e => setFormData({...formData, bio: e.target.value})} 
                placeholder="نبذة مختصرة عن المدرس..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave} loading={isSaving}>
              {editingTeacher ? 'حفظ التعديلات' : 'إضافة المدرس'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
