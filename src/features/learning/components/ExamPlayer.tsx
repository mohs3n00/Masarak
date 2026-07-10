'use client';

import React, { useEffect, useRef, useState } from 'react';
import { apiClient } from '@/shared/api/api.client';
import { AlertCircle, CheckCircle2, CheckSquare, Clock, Square } from 'lucide-react';

interface ExamPlayerProps {
  lessonId: string;
  courseId: string;
  onExamCompleted?: () => void;
}

type QuestionType = 'MULTIPLE_CHOICE' | 'MULTIPLE_RESPONSE' | 'TRUE_FALSE' | 'SHORT_TEXT';

interface PlayerQuestionChoice {
  id: string;
  text: string;
  imageUrl?: string | null;
}

interface PlayerQuestion {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  imageUrl?: string | null;
  choices: PlayerQuestionChoice[];
}

interface PlayerAnswer {
  choiceId?: string;
  selectedChoiceIds?: string[];
  textAnswer?: string;
}

export function ExamPlayer({ lessonId, courseId, onExamCompleted }: ExamPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [examDetails, setExamDetails] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [questions, setQuestions] = useState<PlayerQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, PlayerAnswer>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const saveTimersRef = useRef<Record<string, number>>({});

  const clearSaveTimer = (questionId: string) => {
    const timerId = saveTimersRef.current[questionId];
    if (timerId) {
      window.clearTimeout(timerId);
      delete saveTimersRef.current[questionId];
    }
  };

  const scheduleSave = (questionId: string, answer: PlayerAnswer, delay = 0) => {
    clearSaveTimer(questionId);
    saveTimersRef.current[questionId] = window.setTimeout(() => {
      if (!session?.id) return;
      apiClient.post('/exams/save', {
        sessionId: session.id,
        answers: [{ questionId, ...answer }],
      }).catch(() => console.error('Auto save failed'));
    }, delay);
  };

  useEffect(() => {
    return () => {
      Object.values(saveTimersRef.current).forEach((timerId) => window.clearTimeout(timerId));
    };
  }, []);

  useEffect(() => {
    setExamDetails(null);
    setSession(null);
    setQuestions([]);
    setAnswers({});
    setError('');
    setTimeLeft(null);

    const fetchExam = async () => {
      try {
        setLoading(true);
        const { data } = await apiClient.get(`/exams/lesson/${lessonId}`);
        setExamDetails(data);

        if (data.existingSession?.status === 'IN_PROGRESS') {
          await startExam(data.template.id);
        } else if (data.existingSession?.status === 'COMPLETED') {
          setSession(data.existingSession);
        }
      } catch (err: any) {
        if (err.response?.status !== 404) {
          setError('حدث خطأ أثناء جلب تفاصيل الاختبار');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || session?.status === 'COMPLETED') return;
    const timerId = window.setInterval(() => setTimeLeft((prev) => (prev ?? 0) - 1), 1000);
    return () => window.clearInterval(timerId);
  }, [timeLeft, session?.status]);

  const hydrateAnswers = (sessionAnswers: any[] = []) => {
    const nextAnswers: Record<string, PlayerAnswer> = {};
    for (const answer of sessionAnswers) {
      if (Array.isArray(answer.selectedChoiceIds)) {
        nextAnswers[answer.questionId] = { selectedChoiceIds: answer.selectedChoiceIds };
      } else if (answer.choiceId) {
        nextAnswers[answer.questionId] = { choiceId: answer.choiceId };
      } else if (answer.textAnswer != null) {
        nextAnswers[answer.questionId] = { textAnswer: answer.textAnswer };
      }
    }
    setAnswers(nextAnswers);
  };

  const startExam = async (templateId: string) => {
    try {
      setLoading(true);
      setError('');
      const { data } = await apiClient.post('/exams/start', { examTemplateId: templateId });
      setSession(data.session);
      setQuestions(data.questions);
      hydrateAnswers(data.session?.answers || []);

      const start = new Date(data.session.startTime).getTime();
      const durationMs = (data.session.exam?.durationMin || 0) * 60 * 1000;
      const end = start + durationMs;
      const now = new Date().getTime();
      setTimeLeft(Math.max(0, Math.floor((end - now) / 1000)));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل بدء الاختبار');
    } finally {
      setLoading(false);
    }
  };

  const updateSingleChoiceAnswer = (questionId: string, choiceId: string) => {
    const nextAnswer = { choiceId };
    setAnswers((prev) => ({ ...prev, [questionId]: nextAnswer }));
    scheduleSave(questionId, nextAnswer);
  };

  const toggleMultipleChoiceAnswer = (questionId: string, choiceId: string) => {
    const currentSelection = answers[questionId]?.selectedChoiceIds || [];
    const nextSelection = currentSelection.includes(choiceId)
      ? currentSelection.filter((id) => id !== choiceId)
      : [...currentSelection, choiceId];
    const nextAnswer = { selectedChoiceIds: nextSelection };
    setAnswers((prev) => ({ ...prev, [questionId]: nextAnswer }));
    scheduleSave(questionId, nextAnswer);
  };

  const updateTextAnswer = (questionId: string, textAnswer: string) => {
    const nextAnswer = { textAnswer };
    setAnswers((prev) => ({ ...prev, [questionId]: nextAnswer }));
    scheduleSave(questionId, nextAnswer, 500);
  };

  useEffect(() => {
    if (timeLeft === 0 && !submitting && session?.status === 'IN_PROGRESS') {
      submitExam(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, submitting, session?.status]);

  const submitExam = async (force = false) => {
    if (!force && !confirm('هل أنت متأكد من إنهاء الاختبار وتسليمه؟')) return;

    try {
      setSubmitting(true);
      const { data } = await apiClient.post('/exams/submit', { sessionId: session.id });
      setSession((prev: typeof session) => (prev ? { ...prev, status: 'COMPLETED', score: data.score } : undefined));
      setTimeLeft(0);
      onExamCompleted?.();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'فشل تسليم الاختبار');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading && !examDetails) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground font-bold">جاري تحميل الاختبار...</p>
      </div>
    );
  }

  if (!examDetails || !examDetails.template) {
    return (
      <div className="text-center p-12">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">الاختبار غير متاح</h2>
        <p className="text-muted-foreground">لم يتم العثور على تفاصيل الاختبار لهذا الدرس.</p>
      </div>
    );
  }

  if (session?.status === 'COMPLETED') {
    return (
      <div className="text-center p-12 bg-card rounded-2xl">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-black mb-2 text-foreground">تم إنجاز الاختبار بنجاح!</h2>
        <p className="text-muted-foreground mb-8">لقد قمت بتسليم هذا الاختبار مسبقاً.</p>

        {session.score !== null && (
          <div className="inline-block bg-muted/50 border border-border px-8 py-6 rounded-2xl mb-6">
            <p className="text-sm font-bold text-muted-foreground mb-2">النتيجة النهائية</p>
            <div className="text-5xl font-black text-primary">{session.score}%</div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => window.open(`/exam-review/${session.id}`, '_blank')}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            عرض الإجابات
          </button>

          {examDetails?.hasRetakePermission && (
            <button
              onClick={() => startExam(examDetails.template.id)}
              className="px-6 py-3 bg-warning text-warning-foreground rounded-xl font-bold hover:bg-warning/90 transition-colors w-full sm:w-auto"
            >
              إعادة الاختبار الآن
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto text-center p-8 bg-card rounded-3xl border border-border/50 shadow-sm">
        <div className="w-20 h-20 bg-indigo-500/10 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-3">{examDetails.template.title}</h2>

        <div className="flex items-center justify-center gap-6 mb-8 mt-6">
          <div className="bg-muted/50 px-4 py-3 rounded-2xl flex flex-col items-center min-w-[100px]">
            <span className="text-xs font-bold text-muted-foreground mb-1">المدة</span>
            <span className="text-lg font-black text-foreground">{examDetails.template.durationMin} دقيقة</span>
          </div>
          <div className="bg-muted/50 px-4 py-3 rounded-2xl flex flex-col items-center min-w-[100px]">
            <span className="text-xs font-bold text-muted-foreground mb-1">عدد الأسئلة</span>
            <span className="text-lg font-black text-foreground">{examDetails.totalQuestions} سؤال</span>
          </div>
          <div className="bg-muted/50 px-4 py-3 rounded-2xl flex flex-col items-center min-w-[100px]">
            <span className="text-xs font-bold text-muted-foreground mb-1">النجاح</span>
            <span className="text-lg font-black text-foreground">
              {examDetails.template.passingScore}
              {examDetails.template.passingScoreType === 'MARKS' ? ' درجة' : '%'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-8 text-sm font-bold text-muted-foreground text-center">
          {examDetails.template.attemptsLimit > 0 ? (
            <p>لديك <span className="text-foreground">{examDetails.template.attemptsLimit}</span> محاولات مسموحة</p>
          ) : (
            <p>عدد المحاولات: <span className="text-foreground">غير محدود</span></p>
          )}

          {examDetails.template.availableUntil && (
            <p>ينتهي الاختبار في: <span className="text-foreground">{new Date(examDetails.template.availableUntil).toLocaleString('ar-EG')}</span></p>
          )}
        </div>

        {error && <p className="text-error font-bold text-sm mb-4">{error}</p>}

        <button
          onClick={() => startExam(examDetails.template.id)}
          disabled={loading}
          className="w-full py-3.5 bg-primary text-white font-black rounded-2xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
        >
          {loading ? 'جاري البدء...' : 'ابدأ الاختبار الآن'}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col h-full max-h-[800px]">
      <div className="bg-card border border-border/50 p-4 rounded-2xl shadow-sm mb-6 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h3 className="font-black text-lg text-foreground">{examDetails.template.title}</h3>
          <p className="text-xs font-bold text-muted-foreground mt-1">أجب عن جميع الأسئلة قبل انتهاء الوقت</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold font-mono transition-colors ${timeLeft !== null && timeLeft <= 60 ? 'bg-error text-white animate-pulse' : timeLeft !== null && timeLeft <= 300 ? 'bg-warning/20 text-warning' : 'bg-primary/10 text-primary'}`}>
          <Clock className="w-5 h-5" />
          <span className="text-lg">{timeLeft !== null ? formatTime(timeLeft) : '--:--'}</span>
        </div>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 p-3 rounded-xl mb-6">
          <p className="text-sm font-bold text-error">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-6 pb-6 px-1">
        {questions.map((question, index) => {
          const answer = answers[question.id] || {};
          const selectedChoiceIds = answer.selectedChoiceIds || [];

          return (
            <div key={question.id} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-5">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-black shrink-0 shadow-sm">{index + 1}</span>
                <div className="flex-1 pt-1 space-y-3">
                  <h4 className="font-bold text-foreground leading-relaxed text-lg">{question.text}</h4>
                  {question.imageUrl && (
                    <img src={question.imageUrl} alt={question.text} className="max-w-full rounded-xl border border-border object-contain" />
                  )}
                </div>
              </div>

              {question.type === 'SHORT_TEXT' ? (
                <textarea
                  value={answer.textAnswer || ''}
                  onChange={(e) => updateTextAnswer(question.id, e.target.value)}
                  placeholder="اكتب إجابتك هنا..."
                  className="w-full min-h-[120px] rounded-xl border border-border bg-muted/20 px-4 py-3 outline-none focus:bg-background"
                />
              ) : (
                <div className="space-y-3 mr-12">
                  {question.choices.map((choice) => {
                    const isSelected = question.type === 'MULTIPLE_RESPONSE'
                      ? selectedChoiceIds.includes(choice.id)
                      : answer.choiceId === choice.id;

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => {
                          if (question.type === 'MULTIPLE_RESPONSE') {
                            toggleMultipleChoiceAnswer(question.id, choice.id);
                          } else {
                            updateSingleChoiceAnswer(question.id, choice.id);
                          }
                        }}
                        className={`w-full p-4 border rounded-xl transition-all flex items-center justify-between gap-4 text-start ${isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border bg-muted/20 hover:bg-muted/50 hover:border-border/80'}`}
                      >
                        <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>{choice.text}</span>
                        <div className="shrink-0 flex items-center gap-3">
                          {question.type === 'MULTIPLE_RESPONSE' ? (
                            isSelected ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground/40'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="pt-6 border-t border-border mt-auto">
        <button
          onClick={() => submitExam()}
          disabled={submitting}
          className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 text-lg"
        >
          {submitting ? 'جاري التسليم...' : 'إنهاء وتسليم الاختبار'}
        </button>
      </div>
    </div>
  );
}