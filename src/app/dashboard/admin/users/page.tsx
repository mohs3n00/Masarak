'use client';

import React from 'react';
import { apiClient } from '@/shared/api/api.client';
import { cn } from '@/lib/utils';
import {
  Search, Ban, RefreshCw, Trash2,
  Users, Filter, ChevronLeft, ChevronRight, GraduationCap, UserCheck,
} from 'lucide-react';

type UserRole = 'STUDENT' | 'TEACHER' | 'SUPER_ADMIN' | 'ADMIN';

interface UserRow {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  lockedUntil?: string | null;
  failedLoginAttempts?: number;
  createdAt: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  STUDENT: 'طالب',
  TEACHER: 'مدرس',
  ADMIN: 'مدير',
  SUPER_ADMIN: 'مدير عام',
};
const ROLE_COLORS: Record<UserRole, string> = {
  STUDENT: 'bg-blue-500/10 text-blue-500',
  TEACHER: 'bg-green-500/10 text-green-600',
  ADMIN: 'bg-primary/10 text-primary',
  SUPER_ADMIN: 'bg-purple-500/10 text-purple-600',
};

export default function AdminUsersPage() {
  const [users, setUsers] = React.useState<UserRow[]>([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('');
  const [page, setPage] = React.useState(0);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const take = 20;

  const fetchUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      // Fetch both students and teachers, then merge
      const params = new URLSearchParams({
        take: String(take),
        skip: String(page * take),
        ...(search && { search }),
      });

      let combined: UserRow[] = [];
      let totalCount = 0;

      if (!roleFilter || roleFilter === 'STUDENT') {
        const { data: sData } = await apiClient.get(`/admin/students?${params}`);
        const students = (sData.data || []).map((s: any) => ({ ...s, role: 'STUDENT' as UserRole }));
        if (!roleFilter) {
          combined = [...combined, ...students];
          totalCount += sData.total || 0;
        } else {
          combined = students;
          totalCount = sData.total || 0;
        }
      }

      if (!roleFilter || roleFilter === 'TEACHER') {
        const { data: tData } = await apiClient.get(`/admin/teachers?${params}`);
        const teachers = (tData.data || []).map((t: any) => ({ ...t, role: 'TEACHER' as UserRole }));
        if (!roleFilter) {
          combined = [...combined, ...teachers];
          totalCount += tData.total || 0;
        } else {
          combined = teachers;
          totalCount = tData.total || 0;
        }
      }

      setUsers(combined);
      setTotal(totalCount);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  React.useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSuspend = async (id: string) => {
    setActionLoading(id + '_suspend');
    try {
      await apiClient.post(`/admin/users/${id}/suspend`);
      fetchUsers();
    } finally { setActionLoading(null); }
  };

  const handleActivate = async (id: string) => {
    setActionLoading(id + '_activate');
    try {
      await apiClient.post(`/admin/users/${id}/activate`);
      fetchUsers();
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الحساب نهائياً؟ لا يمكن التراجع عن هذه الخطوة.')) return;
    setActionLoading(id + '_delete');
    try {
      await apiClient.post(`/admin/users/${id}/delete`);
      fetchUsers();
    } finally { setActionLoading(null); }
  };

  const handleUnlock = async (id: string) => {
    setActionLoading(id + '_unlock');
    try {
      await apiClient.patch(`/admin/users/${id}/unlock`);
      fetchUsers();
    } finally { setActionLoading(null); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            كل المستخدمين
          </h1>
          <p className="text-sm text-text-muted mt-1">إجمالي {total.toLocaleString()} مستخدم</p>
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
          {(['', 'STUDENT', 'TEACHER'] as const).map((r) => (
            <button
              key={r}
              onClick={() => { setRoleFilter(r); setPage(0); }}
              className={cn(
                'px-3 py-2 rounded-xl text-xs font-bold transition-all',
                roleFilter === r ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-muted hover:bg-muted/80'
              )}
            >
              {r === '' ? 'الكل' : ROLE_LABELS[r as UserRole]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-4 border-b border-border/40 flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="w-12 h-12 text-text-muted mb-3" />
            <p className="font-bold text-foreground">لا يوجد مستخدمون</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-muted/30">
                    <th className="text-end px-4 py-3 font-bold text-text-muted">المستخدم</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">رقم الهاتف</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">الدور</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">الحالة</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">تاريخ التسجيل</th>
                    <th className="text-end px-4 py-3 font-bold text-text-muted">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id + user.role} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {user.name?.[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-foreground">{user.name}</p>
                            {user.email && <p className="text-xs text-text-muted">{user.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary font-mono text-xs">{user.phone}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold', ROLE_COLORS[user.role])}>
                          {user.role === 'STUDENT' ? <UserCheck className="w-3 h-3" /> : <GraduationCap className="w-3 h-3" />}
                          {ROLE_LABELS[user.role]}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex px-2.5 py-1 rounded-lg text-xs font-bold', user.isActive ? 'bg-success/10 text-success' : 'bg-error/10 text-error')}>
                          {user.isActive ? 'نشط' : 'موقوف'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted text-xs">
                        {new Date(user.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {user.isActive ? (
                            <button onClick={() => handleSuspend(user.id)} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-warning/10 text-warning text-xs font-bold hover:bg-warning hover:text-white transition-colors disabled:opacity-50">
                              <Ban className="w-3.5 h-3.5" />إيقاف
                            </button>
                          ) : (
                            <button onClick={() => handleActivate(user.id)} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-success/10 text-success text-xs font-bold hover:bg-success hover:text-white transition-colors disabled:opacity-50">
                              <RefreshCw className="w-3.5 h-3.5" />تفعيل
                            </button>
                          )}
                          {user.lockedUntil && (
                            <button onClick={() => handleUnlock(user.id)} disabled={!!actionLoading}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-colors disabled:opacity-50">
                              <RefreshCw className="w-3.5 h-3.5" />فتح الحساب
                            </button>
                          )}
                          <button onClick={() => handleDelete(user.id)} disabled={!!actionLoading}
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
              <p className="text-xs text-text-muted">
                عرض {Math.min(page * take + 1, total)} - {Math.min((page + 1) * take, total)} من {total}
              </p>
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
