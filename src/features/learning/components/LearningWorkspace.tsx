'use client';

import React, { useState } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { useApi } from '@/lib/providers/ApiProvider';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { WorkspaceLesson, WorkspaceChapter } from '@/features/learning/types';
import { CourseAccordion } from '@/features/learning/components/CourseAccordion';
import { LessonTabs } from '@/features/learning/components/LessonTabs';
import { MasarakPlayer } from '@/features/media/components/VideoPlayer/MasarakPlayer';
import { ExamPlayer } from '@/features/learning/components/ExamPlayer';
import { ArrowRight, Star } from 'lucide-react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
};

export function LearningWorkspace({ slug }: { slug?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [courseTitle, setCourseTitle] = useState('');
  const [chapters, setChapters] = useState<WorkspaceChapter[]>([]);
  const [resourcesMap, setResourcesMap] = useState<Record<string, any[]>>({});
  
  const [activeLesson, setActiveLesson] = useState<WorkspaceLesson | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoLoading, setVideoLoading] = useState(false);

  const [courseId, setCourseId] = useState<string>('');
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingComment, setRatingComment] = useState<string>('');
  const [ratingHover, setRatingHover] = useState<number>(0);
  const [submittingRating, setSubmittingRating] = useState<boolean>(false);

  const handleLessonComplete = (lessonId: string) => {
    setChapters(prev => prev.map(ch => ({
      ...ch,
      lessons: ch.lessons.map(les => 
        les.id === lessonId ? { ...les, completed: true } : les
      )
    })));
    apiClient.post(`/student/lessons/${lessonId}/complete`).catch(console.error);
  };

  // ✅ Auto-complete logic when viewing a lesson
  React.useEffect(() => {
    if (!activeLesson || activeLesson.completed || activeLesson.type === 'exam') return;
    
    // For PDFs and Videos, mark as complete upon opening/viewing
    handleLessonComplete(String(activeLesson.id));
    setActiveLesson(prev => prev ? { ...prev, completed: true } : null);
  }, [activeLesson?.id]);

  // ✅ جلب الـ video URL بشكل آمن من الـ stream endpoint عند تغيير المحاضرة
  React.useEffect(() => {
    if (!activeLesson) return;
    const resources = resourcesMap[activeLesson.id] || [];
    const videoResource = resources.find((r: any) => r.type === 'VIDEO');
    if (!videoResource) { setVideoUrl(null); return; }
    
    setVideoLoading(true);
    setVideoUrl(null);
    apiClient.get(`/student/video/${videoResource.videoId}/stream`)
      .then((res) => setVideoUrl(res.data.videoUrl))
      .catch(() => setVideoUrl(null))
      .finally(() => setVideoLoading(false));
  }, [activeLesson?.id]);

  const handleDurationReady = React.useCallback((durationSeconds: number) => {
    if (!activeLesson || activeLesson.type !== 'video') return;

    const formattedDuration = formatDuration(durationSeconds);
    
    // Update activeLesson duration
    setActiveLesson(prev => prev ? { ...prev, duration: formattedDuration } : null);

    // Update chapters list duration
    setChapters(prev => prev.map(ch => ({
      ...ch,
      lessons: ch.lessons.map(les => 
        les.id === activeLesson.id ? { ...les, duration: formattedDuration } : les
      )
    })));

    // Update resourcesMap duration
    setResourcesMap(prev => {
      const currentResources = prev[activeLesson.id] || [];
      return {
        ...prev,
        [activeLesson.id]: currentResources.map(r => 
          r.type === 'VIDEO' ? { ...r, durationSeconds } : r
        )
      };
    });
  }, [activeLesson?.id]);

  React.useEffect(() => {
    if (!slug) return;
    
    apiClient.get(`/student/courses/${slug}/workspace`)
      .then((res) => {
        const data = res.data;
        setCourseTitle(data.course.title);
        setCourseId(data.course.id);
        if (data.userRating) {
          setUserRating(data.userRating.rating);
          setRatingComment(data.userRating.comment || '');
        }
        
        const mappedChapters: WorkspaceChapter[] = data.sections.map((sec: any) => ({
          id: sec.id,
          title: sec.title,
          order: sec.order,
          lessons: sec.lessons.map((les: any) => ({
            id: les.id,
            chapterId: sec.id,
            courseId: data.course.id,
            title: les.title,
            type: les.type === 'VIDEO' ? 'video' : les.type === 'EXAM' ? 'exam' : 'pdf',
            duration: les.videos?.[0]?.duration ? formatDuration(les.videos[0].duration) : undefined,
            completed: les.progress?.length > 0 ? les.progress[0].isCompleted : false,
            order: les.order,
            isPreview: les.isFreePreview
          }))
        }));
        
        setChapters(mappedChapters);
        
        // ✅ بناء خريطة الموارد مع الفيديوهات كـ IDs فقط (الـ URL يُجلب بشكل آمن لاحقاً)
        const resMap: Record<string, any[]> = {};
        data.sections.forEach((sec: any) => {
          sec.lessons.forEach((les: any) => {
            const media: any[] = [];
            if (les.videos?.length > 0) {
              les.videos.forEach((v: any, idx: number) => {
                media.push({
                  id: v.id,
                  lessonId: les.id,
                  title: 'فيديو الشرح',
                  type: 'VIDEO',
                  // ✅ الـ URL لا يأتي مع workspace - يُطلب بشكل منفصل عند التشغيل
                  videoId: v.id,
                  thumbnailUrl: v.thumbnailUrl,
                  durationSeconds: v.duration,
                  provider: v.provider,
                  order: idx
                });
              });
            }
            if (les.attachments?.length > 0) {
              les.attachments.forEach((a: any, idx: number) => {
                media.push({
                  id: a.id,
                  lessonId: les.id,
                  title: a.fileName,
                  type: a.fileType?.toUpperCase().includes('PDF') ? 'PDF' : 'LINK',
                  url: a.fileUrl,
                  sizeBytes: a.sizeBytes,
                  order: 10 + idx
                });
              });
            }
            resMap[les.id] = media;
          });
        });
        
        setResourcesMap(resMap);
        
        if (mappedChapters.length > 0 && mappedChapters[0].lessons.length > 0) {
          setActiveLesson(mappedChapters[0].lessons[0]);
        }
      })

      .catch((err) => {
        if (err?.response?.status === 401) {
          const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
          router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
          return;
        }
        if (err?.response?.status === 403) {
          toast.error('يجب الاشتراك في الكورس أولاً للوصول إلى محتواه');
          router.push(`/course/${slug}`);
          return;
        }
        setError(err?.response?.data?.message || 'Course not found or access denied');
      })
      .finally(() => setLoading(false));
  }, [slug, router, pathname, searchParams]);

  const handleRatingSubmit = async (stars: number) => {
    if (!courseId) return;
    setUserRating(stars);
    setSubmittingRating(true);
    try {
      await apiClient.post(`/student/courses/${courseId}/rate`, {
        rating: stars,
        comment: ratingComment || undefined
      });
      toast.success('تم حفظ تقييمك بنجاح! شكراً لك.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'فشل في حفظ التقييم');
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId) return;
    if (userRating === 0) {
      toast.error('يرجى تحديد عدد النجوم أولاً للتقييم');
      return;
    }
    setSubmittingRating(true);
    try {
      await apiClient.post(`/student/courses/${courseId}/rate`, {
        rating: userRating,
        comment: ratingComment
      });
      toast.success('تم تحديث تعليقك بنجاح!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'فشل في حفظ التعليق');
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !chapters.length || !activeLesson) {
    return (
      <div className="w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center p-8 bg-background">
        <div className="text-center p-8 max-w-md bg-surface border border-border rounded-3xl shadow-sm">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4 text-3xl">⚠️</div>
          <h2 className="text-xl font-bold font-heading mb-2">{error ? 'خطأ في جلب البيانات' : 'محتوى الكورس غير متاح'}</h2>
          <p className="text-muted-foreground mb-6">{error || "عذراً، لم يتم العثور على محتوى لهذا الكورس. قد يكون غير متوفر حالياً أو لم تقم بالاشتراك فيه."}</p>
          <button onClick={() => router.back()} className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors">
            العودة للصفحة السابقة
          </button>
        </div>
      </div>
    );
  }

  // Get resources for the active lesson
  const resources = resourcesMap[activeLesson.id] || [];
  const videoResource = resources.find((r: any) => r.type === 'VIDEO');

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-background">
      {/* Top Navigation Bar inside Workspace */}
      <div className="w-full bg-card border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 z-40">
         <div className="flex items-center gap-4">
           <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
              <ArrowRight className="w-5 h-5 text-foreground" />
           </button>
           <div className="flex flex-col">
             <h1 className="text-lg font-bold font-heading">{courseTitle}</h1>
             <span className="text-sm text-muted-foreground">{activeLesson.title}</span>
           </div>
         </div>
      </div>

      <div className="max-w-[1600px] mx-auto w-full p-4 lg:p-6 flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Area (Player + Tabs) */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          
          {/* Main Content Area */}
          <div className={`w-full rounded-2xl overflow-hidden shadow-lg relative border border-border ${activeLesson.type === 'video' ? 'bg-black aspect-video' : 'bg-card min-h-[500px]'}`}>
            {activeLesson.type === 'video' ? (
              videoLoading ? (
                <div className="w-full h-full flex items-center justify-center bg-black absolute inset-0">
                  <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : videoUrl ? (
                <MasarakPlayer 
                  src={videoUrl} 
                  poster={videoResource?.thumbnailUrl}
                  lessonId={String(activeLesson.id)}
                  videoId={String(videoResource?.videoId)}
                  initialDuration={videoResource?.durationSeconds || 0}
                  onProgress={(progress) => {}}
                  onDurationReady={handleDurationReady}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-card absolute inset-0">
                   <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                     <span className="text-2xl">👀</span>
                   </div>
                   <h2 className="text-xl font-bold mb-2">لا يوجد فيديو لهذه المحاضرة</h2>
                   <p>يرجى تصفح المرفقات أو الاختبار أسفل هذه الشاشة.</p>
                </div>
              )
            ) : activeLesson.type === 'pdf' ? (
              <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center bg-muted/20">
                {resources.find(r => r.type === 'PDF')?.url ? (
                  <iframe 
                    src={`${resources.find(r => r.type === 'PDF')?.url}#toolbar=0`} 
                    className="w-full h-full min-h-[600px] border-0"
                    title={activeLesson.title}
                  />
                ) : (
                  <div className="text-center p-8">
                    <span className="text-4xl mb-4 block">📄</span>
                    <h2 className="text-xl font-bold mb-2">لا يوجد ملف مرفق</h2>
                    <p className="text-muted-foreground">الملف غير متاح حالياً أو لم يقم المعلم برفعه بعد.</p>
                  </div>
                )}
              </div>
            ) : activeLesson.type === 'exam' ? (
              <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-background p-4">
                <ExamPlayer 
                  key={String(activeLesson.id)} 
                  lessonId={String(activeLesson.id)} 
                  courseId={String(activeLesson.courseId)} 
                  onExamCompleted={() => handleLessonComplete(String(activeLesson.id))}
                />
              </div>
            ) : null}
          </div>

          {/* Lesson Title and Info */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold font-heading text-foreground">{activeLesson.title}</h2>
              {activeLesson.duration && (
                <span className="text-sm text-muted-foreground font-mono">المدة: {activeLesson.duration}</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {activeLesson.completed && (
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <span>مكتمل</span>
                  <span>✔</span>
                </span>
              )}
            </div>
          </div>

          {/* Lesson Tabs */}
          <LessonTabs 
             lessonId={String(activeLesson.id)}
             resources={resources} 
             onSelectResource={(res: any) => {
               if (res.type === 'LINK' || res.type === 'PDF') window.open(res.url, '_blank');
             }} 
          />
          
        </div>

        {/* Sidebar Accordion Area */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
           <CourseAccordion 
             chapters={chapters} 
             activeLessonId={String(activeLesson.id)}
             onLessonSelect={setActiveLesson}
             className="sticky top-[90px] max-h-[calc(100vh-320px)] overflow-y-auto"
           />

           {/* Rating Widget */}
           <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm space-y-4">
             <h3 className="font-bold text-base text-foreground flex items-center gap-2">
               <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
               تقييم الكورس
             </h3>
             <p className="text-xs text-muted-foreground leading-relaxed">
               رأيك يهمنا! قيم الكورس لمساعدة المعلم والطلاب الآخرين.
             </p>
             
             {/* Stars */}
             <div className="flex items-center gap-1.5 justify-start" style={{ direction: 'ltr' }}>
               {[1, 2, 3, 4, 5].map((stars) => {
                 const active = ratingHover >= stars || (ratingHover === 0 && userRating >= stars);
                 return (
                   <button
                     key={stars}
                     type="button"
                     disabled={submittingRating}
                     className="p-1 transition-transform hover:scale-110 duration-200 outline-none"
                     onMouseEnter={() => setRatingHover(stars)}
                     onMouseLeave={() => setRatingHover(0)}
                     onClick={() => handleRatingSubmit(stars)}
                   >
                     <Star 
                       className={cn(
                         "w-6 h-6 transition-colors", 
                         active ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30 hover:text-amber-400"
                       )} 
                     />
                   </button>
                 );
               })}
             </div>

             {/* Comment form */}
             {userRating > 0 && (
               <form onSubmit={handleCommentSubmit} className="space-y-2 mt-2">
                 <textarea
                   rows={2}
                   value={ratingComment}
                   onChange={(e) => setRatingComment(e.target.value)}
                   placeholder="اكتب رأيك أو تعليقك هنا (اختياري)..."
                   className="w-full text-xs p-3 bg-muted/40 border border-border/50 rounded-xl outline-none focus:border-primary transition-all resize-none"
                   disabled={submittingRating}
                 />
                 <button
                   type="submit"
                   disabled={submittingRating}
                   className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                 >
                   {submittingRating ? 'جاري الحفظ...' : 'حفظ التعليق'}
                 </button>
               </form>
             )}
           </div>
        </div>

      </div>
    </div>
  );
}
