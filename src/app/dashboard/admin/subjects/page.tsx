'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { BookOpen, Plus, Search, Edit2, Trash2, Loader2, RefreshCcw } from 'lucide-react';
import { toast } from 'sonner';

interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/admin/taxonomy/subjects');
      setSubjects(data);
    } catch {
      toast.error('فشل جلب المواد');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', description: '' });
    setIsModalOpen(true);
  };

  const openEdit = (sub: Subject) => {
    setEditingId(sub.id);
    setForm({ name: sub.name, description: sub.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error('الاسم مطلوب');
    
    setFormLoading(true);
    try {
      if (editingId) {
        await apiClient.patch(`/admin/taxonomy/subjects/${editingId}`, form);
        toast.success('تم التعديل بنجاح');
      } else {
        await apiClient.post('/admin/taxonomy/subjects', form);
        toast.success('تمت الإضافة بنجاح');
      }
      setIsModalOpen(false);
      fetchSubjects();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المادة؟')) return;
    try {
      await apiClient.delete(`/admin/taxonomy/subjects/${id}`);
      toast.success('تم الحذف بنجاح');
      setSubjects(s => s.filter(x => x.id !== id));
    } catch {
      toast.error('حدث خطأ أثناء الحذف');
    }
  };

  const filtered = subjects.filter(s => s.name.includes(q) || (s.description && s.description.includes(q)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            إدارة المواد الدراسية
          </h1>
          <p className="text-sm text-text-muted mt-1">أضف وعدل المواد المتاحة لاختيار المعلمين</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchSubjects} className="w-10 h-10 flex items-center justify-center rounded-xl border border-border text-text-muted hover:text-foreground hover:bg-muted transition-colors">
            <RefreshCcw className="w-4 h-4" />
          </button>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary-hover transition-colors text-sm">
            <Plus className="w-4 h-4" /> إضافة مادة
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 bg-card border border-border/60 p-4 rounded-2xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="ابحث عن مادة..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full ps-9 pe-4 py-2 bg-muted border border-transparent focus:border-border focus:bg-background rounded-xl outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p>جاري تحميل المواد...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <BookOpen className="w-12 h-12 mb-4 opacity-20" />
            <p>لا توجد مواد تطابق بحثك</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-start">
              <thead className="bg-muted/50 border-b border-border/60 text-text-muted font-semibold">
                <tr>
                  <th className="px-6 py-4 text-start font-bold">المادة</th>
                  <th className="px-6 py-4 text-start font-bold">الوصف</th>
                  <th className="px-6 py-4 text-start font-bold">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-foreground">{sub.name}</td>
                    <td className="px-6 py-4 text-text-muted max-w-xs truncate">{sub.description || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(sub)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors" title="تعديل">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(sub.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-error/10 text-error hover:bg-error hover:text-white transition-colors" title="حذف">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-black text-foreground">{editingId ? 'تعديل مادة' : 'إضافة مادة جديدة'}</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">اسم المادة <span className="text-error">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثال: لغة عربية"
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:bg-background outline-none text-sm transition-all"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">الوصف</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="وصف اختياري..."
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:bg-background outline-none text-sm transition-all resize-none"
                  rows={3}
                />
              </div>
              <div className="pt-4 flex items-center gap-3">
                <button type="submit" disabled={formLoading} className="flex-1 bg-primary text-white font-bold py-2.5 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50">
                  {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'حفظ'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-muted text-foreground font-bold py-2.5 rounded-xl hover:bg-border transition-colors">
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
