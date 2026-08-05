'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  Search,
  ShieldCheck,
  BookOpen,
  TrendingUp,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { createCommunityApi } from '@/features/community/services/community-api.service';
import { CommunitySpace } from '@/features/community/types';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from 'sonner';

export default function AdminCommunityPage() {
  const { accessToken } = useAuthStore();
  const [spaces, setSpaces] = useState<CommunitySpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [reSeeding, setReSeeding] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const fetchAllSpaces = async () => {
    try {
      setLoading(true);
      const api = createCommunityApi(accessToken || undefined);
      const res = await api.getSpaces({ status: statusFilter });
      setSpaces(res);
    } catch (err) {
      console.error('Failed to fetch communities for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSpaces();
  }, [statusFilter]);

  const handleUpdateStatus = async (id: string, status: string) => {
    const actionName = status === 'APPROVED' ? 'اعتماد' : 'رفض';
    try {
      setActionLoadingId(id);
      toast.loading(`جاري ${actionName} الطلب...`, { id: 'status-update' });
      const api = createCommunityApi(accessToken || undefined);
      await api.updateSpaceStatus(id, status);
      toast.success(`تم ${actionName} طلب المجتمع بنجاح!`, { id: 'status-update' });
      await fetchAllSpaces();
    } catch (err: any) {
      console.error('Failed to update status:', err);
      toast.error(err?.message || `حدث خطأ أثناء ${actionName} الطلب`, { id: 'status-update' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteSpace = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف المجتمع "${name}" نهائياً؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    try {
      setActionLoadingId(id + '_delete');
      toast.loading('جاري حذف المجتمع...', { id: 'delete-space' });
      const api = createCommunityApi(accessToken || undefined);
      await api.deleteSpace(id);
      toast.success('تم حذف المجتمع نهائياً بنجاح!', { id: 'delete-space' });
      await fetchAllSpaces();
    } catch (err: any) {
      console.error('Failed to delete space:', err);
      toast.error(err?.message || 'حدث خطأ أثناء حذف المجتمع', { id: 'delete-space' });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReSeed = async () => {
    try {
      setReSeeding(true);
      toast.loading('جاري استزراع مجتمعات المواد الرسمية...', { id: 'reseed' });
      const api = createCommunityApi(accessToken || undefined);
      await api.seedDefaultCommunities();
      toast.success('تم استزراع المجتمعات الرسمية بنجاح!', { id: 'reseed' });
      await fetchAllSpaces();
    } catch (err: any) {
      console.error('Failed to re-seed default communities:', err);
      toast.error(err?.message || 'حدث خطأ أثناء الاستزراع', { id: 'reseed' });
    } finally {
      setReSeeding(false);
    }
  };

  const pendingSpaces = spaces.filter((s) => s.status === 'PENDING_REVIEW');
  const approvedSpaces = spaces.filter((s) => s.status === 'APPROVED');
  const rejectedSpaces = spaces.filter((s) => s.status === 'REJECTED');

  return (
    <div className="p-6 sm:p-8 space-y-8 dir-rtl text-right max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground flex items-center gap-2.5">
            <Users className="w-7 h-7 text-primary" />
            إدارة ومراجعة المجتمعات الأكاديمية (Community 2.0)
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            مراجعة الطلبات المقدمة من الطلاب والمعلمين وإعادة استزراع مجتمعات المواد الرسمية بنقرة واحدة.
          </p>
        </div>

        <Button
          onClick={handleReSeed}
          disabled={reSeeding}
          className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm h-11 px-5"
        >
          {reSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          استزراع مجتمعات المواد الرسمية
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">إجمالي المجتمعات</span>
            <BookOpen className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{spaces.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-xs font-medium">طلبات قيد المراجعة</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-amber-500">{pendingSpaces.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-500">
            <span className="text-xs font-medium">مجتمعات نشطة ومعتمدة</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">{approvedSpaces.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">معدل التفاعل والنشاط</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">100%</div>
        </div>
      </div>

      {/* Pending Review Table Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            طلبات الإنشاء المعلقة (Pending Review Queue)
          </h2>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
            {pendingSpaces.length} طلبات تنتظر القرار
          </Badge>
        </div>

        {pendingSpaces.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card border border-dashed border-border text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-foreground">لا توجد طلبات معلقة حالياً</p>
            <p className="text-xs text-muted-foreground">تم البت في جميع الطلبات المقدمة من المستخدمين.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingSpaces.map((space) => (
              <div key={space.id} className="p-6 rounded-2xl bg-card border border-amber-500/30 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-mono text-xs">
                    {space.communityId}
                  </Badge>
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs">
                    قيد المراجعة
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground">{space.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {space.description || 'بدون وصف'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                  <span>صاحب الطلب: {space.createdByName || 'مستخدم'}</span>
                  <span>التصنيف: {space.category}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={() => handleUpdateStatus(space.id, 'APPROVED')}
                    disabled={actionLoadingId === space.id}
                    size="sm"
                    className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 h-9"
                  >
                    {actionLoadingId === space.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    موافقة واعتماد
                  </Button>

                  <Button
                    onClick={() => handleUpdateStatus(space.id, 'REJECTED')}
                    disabled={actionLoadingId === space.id}
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs gap-1.5 h-9"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    رفض
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* All Communities List */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-foreground">جميع المجتمعات المعتمدة والرسمية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {approvedSpaces.map((space) => (
            <div key={space.id} className="p-4 rounded-xl bg-card border border-border flex items-center justify-between gap-3">
              <div>
                <div className="font-bold text-sm text-foreground">{space.name}</div>
                <div className="text-xs text-muted-foreground font-mono">{space.communityId}</div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge variant="outline" className="text-[11px]">
                  {space.type}
                </Badge>
                <button
                  onClick={() => handleDeleteSpace(space.id, space.name)}
                  disabled={actionLoadingId === space.id + '_delete'}
                  className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors flex items-center justify-center"
                  title="حذف المجتمع"
                >
                  {actionLoadingId === space.id + '_delete' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejected Communities List */}
      {rejectedSpaces.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border mt-8">
          <h2 className="text-lg font-bold text-red-500 flex items-center gap-2">
            <XCircle className="w-5 h-5" />
            الطلبات المرفوضة ({rejectedSpaces.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rejectedSpaces.map((space) => (
              <div key={space.id} className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 flex items-center justify-between gap-3">
                <div>
                  <div className="font-bold text-sm text-foreground">{space.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">{space.communityId}</div>
                  <Badge className="mt-1.5 bg-red-500/10 text-red-500 border-red-500/20 text-[10px]">
                    مرفوض
                  </Badge>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Button
                    onClick={() => handleUpdateStatus(space.id, 'APPROVED')}
                    disabled={actionLoadingId === space.id}
                    size="sm"
                    variant="outline"
                    className="rounded-lg text-[11px] border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 h-8"
                  >
                    إعادة اعتماد
                  </Button>
                  <button
                    onClick={() => handleDeleteSpace(space.id, space.name)}
                    disabled={actionLoadingId === space.id + '_delete'}
                    className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-lg transition-colors flex items-center justify-center text-xs gap-1"
                    title="حذف نهائي"
                  >
                    {actionLoadingId === space.id + '_delete' ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
