'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { Users, Search, Loader2, Phone, Book, BarChart, Clock, CheckCircle, Activity, X } from 'lucide-react';
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

  // Statistics State
  const [selectedStudentForStats, setSelectedStudentForStats] = useState<StudentData | null>(null);
  const [studentStats, setStudentStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchStudentStats = async (studentId: string) => {
    setLoadingStats(true);
    setStudentStats(null);
    try {
      const { data } = await apiClient.get(`/teacher/students/${studentId}/statistics`);
      setStudentStats(data);
    } catch (error) {
      toast.error('فشل تحميل إحصائيات الطالب');
    } finally {
      setLoadingStats(false);
    }
  };

  const openStatsModal = (student: StudentData) => {
    setSelectedStudentForStats(student);
    fetchStudentStats(student.student.id);
  };

  const closeStatsModal = () => {
    setSelectedStudentForStats(null);
    setStudentStats(null);
  };

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

  const groupedStudents = React.useMemo(() => {
    const map = new Map<string, { student: StudentData['student'], enrollments: StudentData[] }>();
    filteredStudents.forEach(item => {
      const studentId = item.student.id;
      if (!map.has(studentId)) {
        map.set(studentId, { student: item.student, enrollments: [] });
      }
      map.get(studentId)!.enrollments.push(item);
    });
    return Array.from(map.values());
  }, [filteredStudents]);

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
                {groupedStudents.map((group) => (
                  <tr key={group.student.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black overflow-hidden shrink-0">
                          {group.student.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={group.student.avatar} alt={group.student.name} className="w-full h-full object-cover" />
                          ) : group.student.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground">{group.student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Phone className="w-4 h-4" />
                        <span dir="ltr">{group.student.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {group.student.grade || '-'} {group.student.track ? `(${group.student.track})` : ''}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        {group.enrollments.map(enr => (
                          <div key={enr.enrollmentId} className="flex items-center justify-between gap-3 bg-muted/20 p-2 rounded-lg border border-border/50">
                            <div className="flex flex-col items-start">
                              <div className="flex items-center gap-2">
                                <Book className="w-4 h-4 text-primary" />
                                <span className="font-semibold">{enr.course.title}</span>
                              </div>
                              <span className="text-[11px] text-text-muted mt-1 mr-6">
                                تسجيل: {new Date(enr.enrolledAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted whitespace-nowrap">
                      {group.enrollments.length} اشتراك
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openStatsModal(group.enrollments[0])}
                          className="px-3 py-1.5 flex items-center gap-1 text-xs font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          <BarChart className="w-3.5 h-3.5" />
                          الإحصائيات
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

      {/* Premium Statistics Modal */}
      {selectedStudentForStats && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-border flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black overflow-hidden shrink-0">
                  {selectedStudentForStats.student.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={selectedStudentForStats.student.avatar} alt={selectedStudentForStats.student.name} className="w-full h-full object-cover" />
                  ) : selectedStudentForStats.student.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-lg text-foreground">{selectedStudentForStats.student.name}</h3>
                  <p className="text-text-muted text-sm">{selectedStudentForStats.course.title}</p>
                </div>
              </div>
              <button 
                onClick={closeStatsModal}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-text-muted hover:bg-destructive hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6">
              {loadingStats ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                  <p className="text-text-muted font-semibold">جاري جلب الإحصائيات...</p>
                </div>
              ) : studentStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <Clock className="w-8 h-8 text-primary mb-3" />
                    <span className="text-2xl font-black text-foreground mb-1">
                      {Math.floor(studentStats.totalSecondsWatched / 3600)}h {Math.floor((studentStats.totalSecondsWatched % 3600) / 60)}m
                    </span>
                    <span className="text-sm font-semibold text-text-muted">إجمالي وقت المشاهدة</span>
                  </div>
                  
                  <div className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mb-3" />
                    <span className="text-2xl font-black text-foreground mb-1">
                      {studentStats.completedLessons}
                    </span>
                    <span className="text-sm font-semibold text-text-muted">الدروس المكتملة</span>
                  </div>
                  
                  <div className="col-span-2 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Activity className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">آخر تسجيل دخول</h4>
                      <p className="text-text-muted font-medium text-sm">
                        {studentStats.lastLoginAt 
                          ? new Date(studentStats.lastLoginAt).toLocaleString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : 'لم يقم بتسجيل الدخول بعد'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-text-muted font-bold">لا توجد بيانات متاحة.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
