'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { Users, Search, Loader2, Phone, Book } from 'lucide-react';
import { toast } from 'sonner';

interface StudentData {
  enrollmentId: string;
  enrolledAt: string;
  student: {
    id: string;
    name: string;
    phone: string;
    avatar: string | null;
    grade: string | null;
    track: string | null;
  };
  course: {
    id: string;
    title: string;
    accessType: string;
    price: number;
  };
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchStudents = () => {
    apiClient.get('/teacher/students')
      .then(({ data }) => setStudents(data.data || []))
      .catch(() => toast.error('فشل تحميل قائمة الطلاب'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCancelSubscription = async (enrollmentId: string) => {
    if (!window.confirm('هل أنت متأكد من إلغاء اشتراك هذا الطالب؟')) return;
    
    setCancellingId(enrollmentId);
    try {
      await apiClient.delete(`/teacher/enrollments/${enrollmentId}`);
      toast.success('تم إلغاء الاشتراك بنجاح');
      fetchStudents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'فشل إلغاء الاشتراك');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredStudents = students.filter(s => 
    s.student.name?.toLowerCase().includes(search.toLowerCase()) || 
    s.student.phone?.includes(search)
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> طلابي
          </h1>
          <p className="text-text-muted text-sm mt-1">
            إجمالي الطلاب المسجلين: <span className="font-bold text-foreground">{students.length}</span>
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="relative max-w-md">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input 
              type="text" 
              placeholder="البحث بالاسم أو رقم الهاتف..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-11 py-3 rounded-xl border border-border bg-card focus:bg-background focus:border-primary outline-none text-sm font-medium transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-text-muted font-semibold">جاري تحميل البيانات...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-text-muted/50" />
            </div>
            <p className="text-text-muted font-bold text-lg">لا يوجد طلاب مطابقين للبحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right">
              <thead className="bg-muted/50 text-text-muted font-bold">
                <tr>
                  <th className="px-6 py-4">الطالب</th>
                  <th className="px-6 py-4">الاتصال</th>
                  <th className="px-6 py-4">الصف الدراسي</th>
                  <th className="px-6 py-4">الكورس المسجل</th>
                  <th className="px-6 py-4">تاريخ التسجيل</th>
                  <th className="px-6 py-4 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-medium">
                {filteredStudents.map((item) => (
                  <tr key={item.enrollmentId} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black overflow-hidden shrink-0">
                          {item.student.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={item.student.avatar} alt={item.student.name} className="w-full h-full object-cover" />
                          ) : item.student.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">{item.student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Phone className="w-4 h-4" />
                        <span dir="ltr">{item.student.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {item.student.grade || '-'} {item.student.track ? `(${item.student.track})` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Book className="w-4 h-4 text-primary" />
                        <span className="font-semibold">{item.course.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                      {new Date(item.enrolledAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(item.course.accessType === 'PAID' || item.course.price > 0) && (
                        <button
                          onClick={() => handleCancelSubscription(item.enrollmentId)}
                          disabled={cancellingId === item.enrollmentId}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === item.enrollmentId ? 'جاري الإلغاء...' : 'إلغاء الاشتراك'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
