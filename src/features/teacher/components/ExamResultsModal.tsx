'use client';

import React, { useState, useEffect } from 'react';
import { X, Trophy, Clock, CheckCircle2, User as UserIcon } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import Image from 'next/image';
import { toast } from 'sonner';

interface ExamSession {
  id: string;
  student: {
    id: string;
    name: string;
    phone: string | null;
    avatar: string | null;
  };
  startTime: string;
  endTime: string | null;
  status: string;
  score: number | null;
}

interface ExamResultsModalProps {
  courseId: string;
  lessonId: string;
  lessonTitle: string;
  onClose: () => void;
}

export function ExamResultsModal({ courseId, lessonId, lessonTitle, onClose }: ExamResultsModalProps) {
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retakeStatus, setRetakeStatus] = useState<Record<string, 'idle' | 'loading' | 'success'>>({});

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    
    apiClient.get(`/teacher/courses/${courseId}/lessons/${lessonId}/results`)
      .then(res => {
        if (isMounted) {
          setSessions(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error(err);
          setError('حدث خطأ أثناء جلب نتائج الاختبار. تأكد من أنك متصل بالإنترنت وقم بالمحاولة مرة أخرى.');
          setLoading(false);
        }
      });
      
    return () => { isMounted = false; };
  }, [courseId, lessonId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-card w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        dir="rtl"
      >
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">نتائج الاختبار: {lessonTitle}</h2>
            <p className="text-sm text-muted-foreground mt-1">قائمة الطلاب الذين قاموا ببدء أو إنهاء هذا الاختبار</p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 gap-4">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="text-muted-foreground font-medium">جاري تحميل النتائج...</p>
            </div>
          ) : error ? (
            <div className="bg-error/10 text-error p-6 rounded-2xl border border-error/20 flex flex-col items-center justify-center h-48 text-center">
              <p className="font-bold text-lg mb-2">{error}</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-bold mb-1">لا توجد نتائج بعد</h3>
              <p className="text-muted-foreground text-sm">لم يقم أي طالب ببدء هذا الاختبار حتى الآن.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessions.filter((session, index, self) => 
                index === self.findIndex((s) => s.student.id === session.student.id)
              ).map((session) => (
                <div key={session.id} className="bg-muted/10 border border-border/50 rounded-2xl p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    {session.student.avatar ? (
                      <Image 
                        src={session.student.avatar} 
                        alt={session.student.name} 
                        width={48} 
                        height={48} 
                        className="rounded-full object-cover w-12 h-12 ring-2 ring-background shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center ring-2 ring-background shadow-sm">
                        <UserIcon className="w-6 h-6" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-foreground text-sm truncate">{session.student.name}</h4>
                      <p className="text-xs text-muted-foreground truncate" dir="ltr">{session.student.phone}</p>
                    </div>
                    
                    {session.status === 'COMPLETED' ? (
                      <div className="flex flex-col items-end">
                        <span className="text-2xl font-black text-primary" dir="ltr">{session.score ?? 0}%</span>
                        <span className="text-[10px] font-bold text-primary/70 uppercase">Score</span>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-warning/10 text-warning text-[11px] font-bold rounded-full whitespace-nowrap">
                        جاري الامتحان
                      </span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-muted-foreground/50">البدء</span>
                        <span>{new Date(session.startTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    {session.endTime && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary/70" />
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground/50">الانتهاء</span>
                          <span>{new Date(session.endTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {session.status === 'COMPLETED' && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <button
                        disabled={retakeStatus[session.student.id] === 'loading' || retakeStatus[session.student.id] === 'success'}
                        onClick={() => {
                          setRetakeStatus(prev => ({ ...prev, [session.student.id]: 'loading' }));
                          apiClient.post(`/teacher/courses/${courseId}/lessons/${lessonId}/exam/retake`, { studentId: session.student.id })
                            .then(() => {
                              setRetakeStatus(prev => ({ ...prev, [session.student.id]: 'success' }));
                              toast.success('تم منح صلاحية إعادة الامتحان وإرسال إشعار للطالب بنجاح');
                            })
                            .catch((err) => {
                              setRetakeStatus(prev => ({ ...prev, [session.student.id]: 'idle' }));
                              toast.error('حدث خطأ أثناء منح صلاحية إعادة الامتحان');
                            });
                        }}
                        className={`py-2 text-xs font-bold rounded-xl border border-border/50 transition-colors ${
                          retakeStatus[session.student.id] === 'success' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : 'bg-background hover:bg-muted text-foreground'
                        }`}
                      >
                        {retakeStatus[session.student.id] === 'loading' ? 'جاري التنفيذ...' : 
                         retakeStatus[session.student.id] === 'success' ? 'تم السماح' : 'السماح بإعادة الامتحان'}
                      </button>
                      <a
                        href={`/exam-review/${session.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 text-xs font-bold rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors flex items-center justify-center"
                      >
                        عرض الإجابات
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
