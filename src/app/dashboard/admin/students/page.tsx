'use client';

import React from 'react';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import { Users, Search, Ban, CheckCircle2, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';


interface Student {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  grade?: string;
  track?: string;
  enrollmentCount: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const take = 20;

  const fetchStudents = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/admin/students?take=${take}&skip=${page * take}${search ? `&search=${search}` : ''}`);
      setStudents(data.data || []);
      setTotal(data.total || 0);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  React.useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const toggleUserStatus = async (id: string, isActive: boolean) => {
    setActionLoading(id);
    try {
      const endpoint = isActive ? `/admin/users/${id}/suspend` : `/admin/users/${id}/activate`;
      await apiClient.post(endpoint);
      fetchStudents();
    } catch {
      // ignore
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟ لا يمكن التراجع عن هذه الخطوة.')) return;
    setActionLoading(id + '_delete');
    try {
      await apiClient.post(`/admin/users/${id}/delete`);
      fetchStudents();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            إدارة الطلاب
          </h1>
          <p className="text-sm text-text-muted mt-1">إجمالي الطلاب: {total}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="البحث عن طالب..."
            className="w-full ps-9 pe-4 py-2.5 text-sm bg-card border border-border/60 rounded-xl focus:border-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start">
            <thead className="bg-muted/50 border-b border-border/60 text-text-muted font-bold">
              <tr>
                <th className="px-6 py-4 text-start font-bold">الطالب</th>
                <th className="px-6 py-4 text-start font-bold">الاتصال</th>
                <th className="px-6 py-4 text-start font-bold">الصف الدراسي</th>
                <th className="px-6 py-4 text-center font-bold">الكورسات</th>
                <th className="px-6 py-4 text-center font-bold">تاريخ الانضمام</th>
                <th className="px-6 py-4 text-center font-bold">الحالة</th>
                <th className="px-6 py-4 text-end font-bold">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-40 bg-muted rounded-xl" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-muted rounded" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-muted rounded" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-6 w-8 bg-muted rounded mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-muted rounded mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><div className="h-6 w-16 bg-muted rounded-full mx-auto" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 bg-muted rounded-lg ms-auto" /></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-muted">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    لا يوجد طلاب مطابقين للبحث
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {student.avatar ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                            {student.name[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-foreground">{student.name}</p>
                          <p className="text-xs text-text-muted">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{student.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted rounded-lg text-xs font-bold text-foreground">
                        {student.grade || 'غير محدد'} {student.track ? `(${student.track})` : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold">{student.enrollmentCount}</td>
                    <td className="px-6 py-4 text-center text-xs text-text-muted">
                      {new Date(student.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold',
                        student.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      )}>
                        {student.isActive ? 'نشط' : 'موقوف'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleUserStatus(student.id, student.isActive)}
                          disabled={actionLoading === student.id}
                          className={cn(
                            'p-2 rounded-lg transition-colors disabled:opacity-50',
                            student.isActive ? 'text-warning hover:bg-warning/10' : 'text-success hover:bg-success/10'
                          )}
                          title={student.isActive ? 'إيقاف الحساب' : 'تفعيل الحساب'}
                        >
                          {student.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          disabled={actionLoading === student.id + '_delete'}
                          className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors disabled:opacity-50"
                          title="حذف الحساب نهائياً"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && total > take && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-foreground px-3">{page + 1}</span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={(page + 1) * take >= total}
            className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
