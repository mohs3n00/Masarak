'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export default function DashboardAdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/taxonomy/categories');
      setCategories(res.data);
    } catch (error) {
      toast.error('حدث خطأ أثناء جلب التصنيفات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ name: cat.name, description: cat.description || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) return toast.error('الاسم مطلوب');
    try {
      if (editingCategory) {
        await apiClient.patch(`/admin/taxonomy/categories/${editingCategory.id}`, formData);
        toast.success('تم التعديل بنجاح');
      } else {
        await apiClient.post('/admin/taxonomy/categories', formData);
        toast.success('تمت الإضافة بنجاح');
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحفظ');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من الحذف؟')) return;
    try {
      await apiClient.delete(`/admin/taxonomy/categories/${id}`);
      toast.success('تم الحذف بنجاح');
      fetchCategories();
    } catch (error) {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">التصنيفات</h1>
          <p className="text-muted-foreground mt-1">إدارة تصنيفات الكورسات (مثل: برمجة، تصميم، لغات)</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="flex gap-2">
          <Plus className="w-4 h-4" /> إضافة تصنيف
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-semibold">الاسم</th>
                  <th className="px-6 py-4 font-semibold">الوصف</th>
                  <th className="px-6 py-4 font-semibold text-left">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-muted-foreground">جاري التحميل...</td>
                  </tr>
                ) : categories.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-10 text-muted-foreground">لا يوجد تصنيفات حالياً</td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 font-medium">{cat.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{cat.description || '-'}</td>
                      <td className="px-6 py-4 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenModal(cat)}>
                          <Edit className="w-4 h-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(cat.id)}>
                          <Trash className="w-4 h-4 text-error" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">اسم التصنيف</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="أدخل اسم التصنيف"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">الوصف (اختياري)</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="أدخل وصفاً قصيراً"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
            <Button onClick={handleSave}>حفظ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
