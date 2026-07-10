'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/shared/api/api.client';
import { ArrowRight, CheckCircle2, CheckSquare, Clock, Trophy, XCircle } from 'lucide-react';

interface ReviewData {
  session: {
    id: string;
    score: number;
    startTime: string;
    endTime: string;
    status: string;
    answers: {
      id: string;
      questionId: string;
      choiceId: string | null;
      selectedChoiceIds?: string[] | null;
      textAnswer?: string | null;
    }[];
    exam: {
      title: string;
      passingScoreType: 'PERCENTAGE' | 'MARKS';
      lesson: {
        title: string;
      };
    };
  };
  questions: {
    id: string;
    text: string;
    type: 'MULTIPLE_CHOICE' | 'MULTIPLE_RESPONSE' | 'TRUE_FALSE' | 'SHORT_TEXT';
    points: number;
    imageUrl?: string | null;
    choices: {
      id: string;
      text: string;
      isCorrect: boolean;
      imageUrl?: string | null;
    }[];
  }[];
}

export default function ExamReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.sessionId) return;

    apiClient
      .get(`/exams/review/${params.sessionId}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('لا تملك صلاحية الوصول أو أن الامتحان غير موجود.');
        setLoading(false);
      });
  }, [params.sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">جاري تحميل الإجابات...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center gap-4 p-4">
        <div className="w-20 h-20 bg-error/10 text-error rounded-full flex items-center justify-center mb-2">
          <XCircle className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground">خطأ في التحميل</h2>
        <p className="text-muted-foreground">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors"
        >
          العودة
        </button>
      </div>
    );
  }

  const totalPoints = data.questions.reduce((acc, question) => acc + question.points, 0);

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-bold text-foreground text-lg sm:text-xl truncate">
                مراجعة: {data.session.exam?.title || data.session.exam?.lesson?.title}
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl text-primary font-bold">
            <Trophy className="w-5 h-5" />
            <span>
              النتيجة: {data.session.score}
              {data.session.exam?.passingScoreType === 'MARKS' ? ` / ${totalPoints}` : '%'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="sm:hidden bg-primary/10 border border-primary/20 rounded-2xl p-6 mb-8 flex flex-col items-center justify-center text-center">
          <Trophy className="w-12 h-12 text-primary mb-3" />
          <h2 className="text-2xl font-black text-primary">
            {data.session.score} 
            {data.session.exam?.passingScoreType === 'MARKS' ? (
              <span className="text-lg font-bold text-primary/70"> / {totalPoints}</span>
            ) : (
              <span className="text-lg font-bold text-primary/70">%</span>
            )}
          </h2>
          <p className="text-sm font-bold text-primary/80 mt-1">النتيجة النهائية</p>
        </div>

        <div className="space-y-6">
          {data.questions.map((question, index) => {
            const studentAnswer = data.session.answers.find((answer) => answer.questionId === question.id);
            const selectedChoiceIds = studentAnswer?.selectedChoiceIds || (studentAnswer?.choiceId ? [studentAnswer.choiceId] : []);
            const correctChoiceIds = question.choices.filter((choice) => choice.isCorrect).map((choice) => choice.id);
            const isAnswered = question.type === 'SHORT_TEXT'
              ? !!studentAnswer?.textAnswer?.trim()
              : selectedChoiceIds.length > 0;
            const isCorrect = question.type === 'SHORT_TEXT'
              ? false
              : correctChoiceIds.length === selectedChoiceIds.length && correctChoiceIds.every((id) => selectedChoiceIds.includes(id));

            return (
              <div
                key={question.id}
                className={`bg-card rounded-2xl p-5 sm:p-7 shadow-sm border-2 ${isCorrect ? 'border-success/30' : 'border-error/30'}`}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-bold text-lg ${isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                      {index + 1}
                    </div>
                    <div className="pt-1 space-y-3">
                      <h3 className="text-lg font-medium text-foreground leading-relaxed">{question.text}</h3>
                      {question.imageUrl && (
                        <img src={question.imageUrl} alt={question.text} className="max-w-full rounded-xl border border-border object-contain" />
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-center gap-1">
                    {question.type === 'SHORT_TEXT' ? (
                      <Clock className="w-8 h-8 text-warning" />
                    ) : isCorrect ? (
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    ) : (
                      <XCircle className="w-8 h-8 text-error" />
                    )}
                    <span className="text-xs font-bold text-muted-foreground">{question.points} نقاط</span>
                  </div>
                </div>

                {question.type === 'SHORT_TEXT' ? (
                  <div className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="text-xs font-bold text-muted-foreground mb-2">إجابة الطالب</p>
                    <p className="text-foreground whitespace-pre-wrap">{studentAnswer?.textAnswer || 'لم يتم تقديم إجابة'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {question.choices.map((choice) => {
                      const isStudentChoice = selectedChoiceIds.includes(choice.id);
                      const isActualCorrect = choice.isCorrect;

                      let bgClass = 'bg-muted/30 border-transparent text-foreground';
                      let icon: React.ReactNode = null;

                      if (isActualCorrect) {
                        bgClass = 'bg-success/10 border-success text-success-foreground ring-1 ring-success';
                        icon = <CheckCircle2 className="w-5 h-5 text-success" />;
                      } else if (isStudentChoice && !isActualCorrect) {
                        bgClass = 'bg-error/10 border-error text-error-foreground ring-1 ring-error';
                        icon = <XCircle className="w-5 h-5 text-error" />;
                      }

                      return (
                        <div key={choice.id} className={`w-full p-4 rounded-xl border flex items-center justify-between gap-4 ${bgClass}`}>
                          <div className="flex-1 space-y-2">
                            <span className="font-medium">{choice.text}</span>
                            {choice.imageUrl && (
                              <img src={choice.imageUrl} alt={choice.text} className="max-w-40 rounded-lg border border-border object-contain" />
                            )}
                          </div>
                          {question.type === 'MULTIPLE_RESPONSE' ? (
                            isStudentChoice ? <CheckSquare className="w-5 h-5 text-primary" /> : icon
                          ) : (
                            icon
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isAnswered && question.type !== 'SHORT_TEXT' && (
                  <div className="mt-4 p-3 bg-warning/10 text-warning rounded-lg border border-warning/20 text-sm font-bold flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    لم يتم الإجابة على هذا السؤال
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}