'use client';

import React from 'react';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import {
  Search, CheckCircle, XCircle, Ban, RefreshCw, Trash2,
  GraduationCap, Filter, ChevronLeft, ChevronRight,
} from 'lucide-react';

type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface Teacher {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  verificationStatus: VerificationStatus;
  specializations: string[];
  teachingSubjects: string[];
}

const STATUS_COLORS: Record<VerificationStatus, string> = {
  PENDING: 'bg-warning/10 text-warning',
  APPROVED: 'bg-success/10 text-success',
  REJECTED: 'bg-error/10 text-error',
};
const STATUS_LABELS: Record<VerificationStatus, string> = {
  PENDING: 'بانتظار الموافقة',
  APPROVED: 'مُوافق عليه',
  REJECTED: 'مرفوض',
};

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = React.useState<Teacher[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('');
  const [page, setPage] = React.useState(0);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const take = 20;

  const fetchTeachers = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        take: String(take),
        skip: String(page * take),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });
      const { data } = await apiClient.get(`/admin/teachers?${params}`);
      setTeachers(data.data || []);
      setTotal(data.total || 0);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  React.useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

  const handleApprove = async (id: string) => {
    setActionLoading(id + '_approve');
    try {
      await apiClient.post(`/admin/teachers/${id}/approve`);
      fetchTeachers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id + '_reject');
    try {
      await apiClient.post(`/admin/teachers/${id}/reject`);
      fetchTeachers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (id: string) => {
    setActionLoading(id + '_suspend');
    try {
      await apiClient.post(`/admin/users/${id}/suspend`);
      fetchTeachers();
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟ لا يمكن التراجع عن هذه الخطوة.')) return;
    
    setActionLoading(id + '_delete');
    try {
      await apiClient.post(`/admin/users/${id}/delete`);
      fetchTeachers();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            إدارة المدرسين
          </h1>
          <p className="text-sm text-text-muted mt-1">إجمالي {total.toLocaleString()} مدرس</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/60 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="البحث بالاسم أو الهاتف..."
            className="w-full ps-9 pe-4 py-2.5 text-sm bg-muted rounded-xl border border-transparent focus:border-border focus:bg-background outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-text-muted shrink-0" />
          {(['', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(0); }}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-bold transition-all',
                statusFilter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-muted hover:bg-muted/80'
              )}
            >
              {s === '' ? 'الكل' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-border/40 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : teachers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <GraduationCap className="w-12 h-12 text-text-muted mb-3" />
            <p className="font-bold text-foreground">لا يوجد مدرسون</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-end px-4 py-3 font-bold text-text-muted">المدرس</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">رقم الهاتف</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">الحالة</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">تاريخ التسجيل</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {teacher.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={teacher.avatar} alt={teacher.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {teacher.name?.[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-foreground">{teacher.name}</p>
                            {teacher.specializations?.length > 0 && (
                              <p className="text-xs text-text-muted">{teacher.specializations.slice(0, 2).join('، ')}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary font-mono text-xs">{teacher.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={cn('inline-flex w-fit px-2.5 py-1 rounded-lg text-xs font-bold', STATUS_COLORS[teacher.verificationStatus])}>
                            {STATUS_LABELS[teacher.verificationStatus]}
                          </span>
                          {!teacher.isActive && (
                            <span className="inline-flex w-fit px-2.5 py-1 rounded-lg text-xs font-bold bg-error/10 text-error">موقوف</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {new Date(teacher.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {teacher.verificationStatus === 'PENDING' && (
                            <>
                              <button onClick={() => handleApprove(teacher.id)} disabled={!!actionLoading}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-success/10 text-success text-xs font-bold hover:bg-success hover:text-white transition-colors disabled:opacity-50">
                                <CheckCircle className="w-3.5 h-3.5" />قبول
                              </button>
                              <button onClick={() => handleReject(teacher.id)} disabled={!!actionLoading}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-error/10 text-error text-xs font-bold hover:bg-error hover:text-white transition-colors disabled:opacity-50">
                                <XCircle className="w-3.5 h-3.5" />رفض
                              </button>
                            </>
                          )}
                          {teacher.isActive ? (
                            <button onClick={() => handleSuspend(teacher.id)} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-bold hover:bg-warning hover:text-white transition-colors disabled:opacity-50">
                              <Ban className="w-3.5 h-3.5" />إيقاف
                            </button>
                          ) : (
                            <button onClick={() => apiClient.post(`/admin/users/${teacher.id}/activate`).then(fetchTeachers)} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-success/10 text-success text-xs font-bold hover:bg-success hover:text-white transition-colors disabled:opacity-50">
                              <RefreshCw className="w-3.5 h-3.5" />تفعيل
                            </button>
                          )}
                          <button onClick={() => handleDelete(teacher.id)} disabled={!!actionLoading}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-error/10 text-error text-xs font-bold hover:bg-error hover:text-white transition-colors disabled:opacity-50">
                            <Trash2 className="w-3.5 h-3.5" />حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/40">
              <p className="text-xs text-text-muted">عرض {page * take + 1} - {Math.min((page + 1) * take, total)} من {total}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
                <span className="text-sm font-bold text-foreground">{page + 1}</span>
                <button onClick={() => setPage(p => p + 1)} disabled={(page + 1) * take >= total}
                  className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
