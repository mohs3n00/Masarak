'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api/api.client';
import { BookOpen, Plus, PlayCircle, ChevronRight, Video, FileUp, FileText, CheckCircle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ExamResultsModal } from '@/features/teacher/components/ExamResultsModal';

export default function CourseLessonsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [courseId, setCourseId] = React.useState<string>('');
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [course, setCourse] = React.useState<any>(null);
  
  const [form, setForm] = React.useState({ 
    title: '', 
    description: '', 
    videoUrl: '', 
    type: 'VIDEO', 
    sectionName: '' 
  });
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState('');
  
  // Results Modal State
  const [resultsModalOpen, setResultsModalOpen] = React.useState(false);
  const [selectedExamLesson, setSelectedExamLesson] = React.useState<{id: string, title: string} | null>(null);

  React.useEffect(() => {
    params.then((p) => {
      setCourseId(p.id);
    });
  }, [params]);

  const fetchCourse = React.useCallback(async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const { data } = await apiClient.get(`/teacher/courses/${courseId}`);
      setCourse(data);
    } catch {
      router.push('/dashboard/teacher/courses');
    } finally {
      setLoading(false);
    }
  }, [courseId, router]);

  React.useEffect(() => { fetchCourse(); }, [fetchCourse]);

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      setError('العنوان مطلوب');
      return;
    }
    if (form.type === 'VIDEO' && !form.videoUrl) {
      setError('رابط الفيديو مطلوب');
      return;
    }
    if (form.type === 'PDF' && !selectedFile) {
      setError('يرجى اختيار ملف PDF للرفع');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      let fileUrl = '';
      let fileName = '';
      let fileType = '';
      let sizeBytes = 0;

      if (form.type === 'PDF' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('folder', 'masarak/attachments');
        const uploadRes = await apiClient.post('/upload/file', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        fileUrl = uploadRes.data.url;
        fileName = selectedFile.name;
        fileType = selectedFile.type || 'application/pdf';
        sizeBytes = selectedFile.size;
      }

      const payload = {
        title: form.title,
        description: form.description,
        type: form.type,
        sectionName: form.sectionName,
        ...(form.type === 'VIDEO' ? { videoUrl: form.videoUrl } : {}),
        ...(form.type === 'PDF' ? { fileUrl, fileName, fileType, sizeBytes } : {})
      };
      
      const res = await apiClient.post(`/teacher/courses/${courseId}/lessons`, payload);

      if (form.type === 'EXAM') {
        // Redirect to full-page exam builder
        router.push(`/dashboard/teacher/courses/${courseId}/lessons/${res.data.id}/exam`);
        return;
      }

      setForm(prev => ({ ...prev, title: '', description: '', videoUrl: '' }));
      setSelectedFile(null);
      fetchCourse(); // Refresh
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || 'فشل إضافة الدرس');
    } finally {
      setSubmitting(false);
    }
  };

  const handleExamCreated = () => {
    setForm(prev => ({ ...prev, title: '', description: '' }));
    fetchCourse();
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الدروس والاختبارات المرتبطة به.')) return;
    try {
      await apiClient.delete(`/teacher/courses/${courseId}/sections/${sectionId}`);
      fetchCourse();
    } catch (err: any) {
      alert(`فشل حذف القسم: ${err?.response?.data?.error?.message || err.message || JSON.stringify(err)}`);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
    try {
      await apiClient.delete(`/teacher/courses/${courseId}/lessons/${lessonId}`);
      fetchCourse();
    } catch (err: any) {
      alert(`فشل حذف الدرس: ${err?.response?.data?.error?.message || err.message || JSON.stringify(err)}`);
    }
  };

  if (loading || !course) {
    return <div className="p-8 text-center text-text-muted">جاري التحميل...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/teacher/courses" className="p-2 rounded-xl bg-muted text-text-muted hover:text-foreground transition-colors">
          <ChevronRight className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" /> إدارة محتوى الكورس
          </h1>
          <p className="text-sm text-text-muted mt-1 font-medium">{course.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Area */}
        <div className="lg:col-span-1 space-y-6">
          {/* Section Addition Card */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> إضافة قسم / وحدة
            </h2>
            <div className="flex gap-2">
              <input 
                type="text" 
                id="newSectionInput"
                placeholder="اسم القسم الجديد..." 
                className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none text-sm" 
              />
              <button 
                type="button"
                onClick={async () => {
                  const input = document.getElementById('newSectionInput') as HTMLInputElement;
                  if (!input.value) return;
                  try {
                    await apiClient.post(`/teacher/courses/${courseId}/sections`, { title: input.value });
                    input.value = '';
                    fetchCourse();
                  } catch (err) {
                    alert('خطأ في إضافة القسم');
                  }
                }}
                className="px-4 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors whitespace-nowrap"
              >
                إضافة
              </button>
            </div>
          </div>

          {/* Lesson Addition Card */}
          <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> إضافة محتوى جديد
            </h2>
            
            <form onSubmit={handleAddLesson} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">الوحدة / القسم</label>
                <select 
                  value={form.sectionName} 
                  onChange={(e) => setForm({ ...form, sectionName: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
                  required
                >
                  <option value="">-- اختر القسم --</option>
                  {course.sections?.map((sec: any) => (
                    <option key={sec.id} value={sec.title}>{sec.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">نوع المحتوى *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all cursor-pointer">
                  <option value="VIDEO">فيديو (شرح)</option>
                  <option value="PDF">ملف PDF / ملزمة</option>
                  <option value="EXAM">اختبار إلكتروني</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">عنوان الدرس *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="اكتب العنوان هنا..." className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all" />
              </div>

              {/* Dynamic Fields based on Type */}
              {form.type === 'VIDEO' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-foreground mb-2">رابط الفيديو (YouTube) *</label>
                  <input type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..." className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm text-left transition-all" dir="ltr" />
                </div>
              )}

              {form.type === 'PDF' && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-bold text-foreground mb-2">ارفع الملف (PDF) *</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="pdf-upload"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    <label 
                      htmlFor="pdf-upload"
                      className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-2xl cursor-pointer bg-muted/30 hover:bg-muted transition-colors"
                    >
                      {selectedFile ? (
                        <>
                          <CheckCircle className="w-6 h-6 text-emerald-500 mb-2" />
                          <span className="text-sm font-bold text-emerald-600 truncate px-4 w-full text-center">{selectedFile.name}</span>
                        </>
                      ) : (
                        <>
                          <FileUp className="w-6 h-6 text-text-muted mb-2" />
                          <span className="text-sm font-medium text-text-muted">اضغط لاختيار ملف</span>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              )}

              {form.type === 'EXAM' && (
                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center animate-in fade-in duration-300">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 font-bold mb-1">تجهيز الاختبار</p>
                  <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 leading-relaxed">عند الضغط على إضافة، ستفتح نافذة لبناء الأسئلة وتحديد الدرجات والوقت.</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-foreground mb-2">وصف مختصر (اختياري)</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="ملاحظات للطلاب قبل البدء..." rows={3} className="w-full px-4 py-3 rounded-2xl border border-border bg-muted/50 focus:bg-background focus:ring-2 focus:ring-primary/20 outline-none text-sm resize-none transition-all" />
              </div>

              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-xl">
                  <p className="text-xs text-error font-bold">{error}</p>
                </div>
              )}

              <button type="submit" disabled={submitting} className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary-hover shadow-lg shadow-primary/25 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none">
                {submitting ? 'جاري الحفظ...' : (form.type === 'EXAM' ? 'بناء الاختبار' : 'إضافة الدرس')}
              </button>
            </form>
          </div>
        </div>

        {/* Content List Area */}
        <div className="lg:col-span-2">
          {course.sections?.length > 0 ? (
            <div className="space-y-6">
              {course.sections.map((section: any) => {
                return (
                  <div key={section.id} className="bg-card border border-border/60 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-muted/30 px-6 py-4 border-b border-border/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-6 bg-primary rounded-full"></div>
                        <h3 className="font-black text-lg text-foreground">{section.title}</h3>
                      </div>
                      <button 
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-2 rounded-xl text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                        title="حذف القسم"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      {!section.lessons || section.lessons.length === 0 ? (
                        <div className="text-center py-6 text-text-muted text-sm bg-muted/30 rounded-2xl border border-dashed border-border/60">
                          لم يتم إضافة أي محتوى في هذا القسم حتى الآن.
                        </div>
                      ) : (
                        section.lessons.map((lesson: any, index: number) => (
                          <div key={lesson.id} className="group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl hover:bg-muted/40 border border-transparent hover:border-border/60 transition-all">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                              ${lesson.type === 'VIDEO' ? 'bg-rose-500/10 text-rose-500' : 
                                lesson.type === 'PDF' ? 'bg-blue-500/10 text-blue-500' : 
                                'bg-indigo-500/10 text-indigo-500'}`}
                            >
                              {lesson.type === 'VIDEO' && <Video className="w-5 h-5" />}
                              {lesson.type === 'PDF' && <FileText className="w-5 h-5" />}
                              {lesson.type === 'EXAM' && <BookOpen className="w-5 h-5" />}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-foreground truncate">{index + 1}. {lesson.title}</h4>
                              {lesson.description && <p className="text-xs text-text-muted truncate mt-1">{lesson.description}</p>}
                              
                              {/* Attachments UI inside the card */}
                              {lesson.attachments && lesson.attachments.length > 0 && (
                                <div className="mt-2.5 flex flex-wrap gap-2">
                                  {lesson.attachments.map((att: any) => (
                                    <a key={att.id} href={att.fileUrl} target="_blank" rel="noreferrer" 
                                      className="inline-flex items-center gap-1.5 text-[11px] font-bold bg-background border border-border px-2.5 py-1.5 rounded-lg text-text-muted hover:text-primary hover:border-primary/30 transition-colors">
                                      <FileText className="w-3.5 h-3.5" /> {att.fileName}
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            <div className="flex sm:flex-col items-center sm:items-end gap-2 mt-3 sm:mt-0">
                              <div className="flex items-center gap-2">
                                {lesson.type === 'VIDEO' && lesson.videoContent?.[0]?.videoUrl && (
                                  <a href={lesson.videoContent[0].videoUrl} target="_blank" rel="noreferrer" 
                                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 hover:bg-rose-500 hover:text-white text-xs font-bold transition-colors">
                                    مشاهدة
                                  </a>
                                )}
                                {lesson.type === 'EXAM' && (
                                  <>
                                    <button 
                                      onClick={() => {
                                        setSelectedExamLesson({ id: lesson.id, title: lesson.title });
                                        setResultsModalOpen(true);
                                      }}
                                      className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                                    >
                                      عرض النتائج
                                    </button>
                                    <Link 
                                      href={`/dashboard/teacher/courses/${courseId}/lessons/${lesson.id}/exam`}
                                      className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-white text-xs font-bold transition-colors"
                                    >
                                      تعديل الاختبار
                                    </Link>
                                  </>
                                )}
                              </div>
                              <button 
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-2 mt-1 rounded-xl text-text-muted hover:text-error hover:bg-error/10 transition-colors"
                                title="حذف الدرس"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-24 bg-card border border-border/60 rounded-3xl shadow-sm h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <BookOpen className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">لا يوجد محتوى حتى الآن</h3>
              <p className="text-sm text-text-muted max-w-sm mx-auto">ابدأ بإضافة الفيديوهات، الملفات، أو الاختبارات لطلابك من القائمة الجانبية.</p>
            </div>
          )}
        </div>
      </div>

      {resultsModalOpen && selectedExamLesson && (
        <ExamResultsModal 
          courseId={courseId}
          lessonId={selectedExamLesson.id}
          lessonTitle={selectedExamLesson.title}
          onClose={() => {
            setResultsModalOpen(false);
            setSelectedExamLesson(null);
          }}
        />
      )}
    </div>
  );
}
