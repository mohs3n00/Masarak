'use client';

import React, { useState, useEffect } from 'react';
import { Question, ExamSettings, QuestionType } from './types';
import { ExamSettingsPanel } from './ExamSettingsPanel';
import { QuestionEditor } from './QuestionEditor';
import { Plus, Save, ArrowRight, LayoutList, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import { useRouter } from 'next/navigation';

interface ExamBuilderLayoutProps {
  courseId: string;
  lessonId: string;
  initialData?: any; // The existing exam template if any
}

export function ExamBuilderLayout({ courseId, lessonId, initialData }: ExamBuilderLayoutProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(!initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Default initial state
  const [settings, setSettings] = useState<ExamSettings>({
    title: initialData?.title || 'اختبار جديد',
    description: initialData?.description || '',
    instructions: initialData?.instructions || '',
    durationMin: initialData?.durationMin || 30,
    passingScore: initialData?.passingScore || 50,
    passingScoreType: initialData?.passingScoreType || 'PERCENTAGE',
    attemptsLimit: initialData?.attemptsLimit ?? 1,
    availableFrom: initialData?.availableFrom,
    availableUntil: initialData?.availableUntil,
    status: initialData?.status || 'PUBLISHED',
    rules: initialData?.rules || {}
  });

  const [questions, setQuestions] = useState<Question[]>(
    initialData?.questions?.length > 0 
      ? initialData.questions 
      : [{ text: '', type: 'MULTIPLE_CHOICE', points: 1, choices: [{ text: '', isCorrect: true }, { text: '', isCorrect: false }] }]
  );

  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions');

  useEffect(() => {
    if (initialData) {
      setSettings({
        title: initialData.title || 'اختبار جديد',
        description: initialData.description || '',
        instructions: initialData.instructions || '',
        durationMin: initialData.durationMin || 30,
        passingScore: initialData.passingScore || 50,
        passingScoreType: initialData.passingScoreType || 'PERCENTAGE',
        attemptsLimit: initialData.attemptsLimit ?? 1,
        availableFrom: initialData.availableFrom,
        availableUntil: initialData.availableUntil,
        status: initialData.status || 'PUBLISHED',
        rules: initialData.rules || {}
      });
      if (initialData.questions?.length > 0) {
        setQuestions(initialData.questions);
      }
      setLoading(false);
      return;
    }

    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/teacher/courses/${courseId}/lessons/${lessonId}/exam`);
        if (res.data && !res.data.notFound) {
          setSettings({
            title: res.data.title || 'اختبار جديد',
            description: res.data.description || '',
            instructions: res.data.instructions || '',
            durationMin: res.data.durationMin || 30,
            passingScore: res.data.passingScore || 50,
            passingScoreType: res.data.passingScoreType || 'PERCENTAGE',
            attemptsLimit: res.data.attemptsLimit ?? 1,
            availableFrom: res.data.availableFrom,
            availableUntil: res.data.availableUntil,
            status: res.data.status || 'PUBLISHED',
            rules: res.data.rules || {}
          });
          if (res.data.questions?.length > 0) {
            setQuestions(res.data.questions);
          }
        }
      } catch (err) {
        console.error('Failed to load exam client-side:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [courseId, lessonId, initialData]);

  const handleAddQuestion = (type: QuestionType) => {
    let newChoices = [{ text: '', isCorrect: true }, { text: '', isCorrect: false }];
    if (type === 'TRUE_FALSE') {
      newChoices = [{ text: 'صح', isCorrect: true }, { text: 'خطأ', isCorrect: false }];
    } else if (type === 'SHORT_TEXT') {
      newChoices = [];
    }

    setQuestions([
      ...questions,
      {
        text: '',
        type,
        points: 1,
        choices: newChoices
      }
    ]);
  };

  const handleSave = async () => {
    // Basic validation
    if (!settings.title.trim()) return setError('يرجى إدخال عنوان الاختبار');
    if (questions.length === 0) return setError('يجب إضافة سؤال واحد على الأقل');

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return setError(`السؤال رقم ${i + 1} لا يمكن أن يكون فارغاً`);
      if (q.type !== 'SHORT_TEXT') {
        if (q.choices.length < 2 && q.type !== 'TRUE_FALSE') return setError(`السؤال رقم ${i + 1} يجب أن يحتوي على خيارين على الأقل`);
        if (q.choices.some(c => !c.text.trim())) return setError(`يوجد خيار فارغ في السؤال رقم ${i + 1}`);
        if (!q.choices.some(c => c.isCorrect)) return setError(`يجب تحديد إجابة صحيحة للسؤال رقم ${i + 1}`);
      }
    }

    try {
      setSaving(true);
      setError('');
      setSuccessMsg('');

      await apiClient.post(`/teacher/courses/${courseId}/lessons/${lessonId}/exam`, {
        ...settings,
        questions: questions.map((q, idx) => ({ ...q, order: idx }))
      });

      setSuccessMsg('تم حفظ الاختبار بنجاح!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      console.error('Failed to save exam:', err);
      setError(err.response?.data?.message || 'حدث خطأ أثناء حفظ الاختبار');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border/50 bg-card px-6 flex items-center justify-between sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push(`/dashboard/teacher/courses/${courseId}/lessons`)}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-text-muted hover:text-foreground"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-bold text-lg">{settings.title || 'اختبار بدون عنوان'}</h1>
            <p className="text-xs text-text-muted">حفظ تلقائي معطل - يرجى الحفظ يدوياً</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* حقل مخصص للمدة في الأعلى ليكون واضحاً للجميع دائماً */}
          <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-xl border-2 border-primary/20">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-black text-primary">المدة:</span>
            <input 
              type="number" 
              value={settings.durationMin || 30}
              onChange={(e) => setSettings({ ...settings, durationMin: parseInt(e.target.value) || 30 })}
              className="w-16 px-2 py-1 bg-background border border-border rounded-md outline-none text-center font-bold focus:ring-2 focus:ring-primary/20"
              title="مدة الاختبار بالدقائق"
            />
            <span className="text-sm font-bold text-muted-foreground">دقيقة</span>
          </div>

          {error && <span className="text-sm font-medium text-error bg-error/10 px-3 py-1 rounded-lg">{error}</span>}
          {successMsg && <span className="text-sm font-medium text-success bg-success/10 px-3 py-1 rounded-lg flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> {successMsg}</span>}
          
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl font-bold transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            حفظ الاختبار
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-l border-border/50 bg-card flex flex-col shrink-0">
          <div className="p-4 border-b border-border/50">
            <h2 className="font-bold flex items-center gap-2 text-text-muted mb-4">
              <LayoutList className="w-5 h-5" /> أجزاء الاختبار
            </h2>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('settings')}
                className={`text-right px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-foreground border border-transparent'}`}
              >
                إعدادات الاختبار
              </button>
              <button 
                onClick={() => setActiveTab('questions')}
                className={`text-right px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'questions' ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-foreground border border-transparent'}`}
              >
                الأسئلة ({questions.length})
              </button>
            </div>
          </div>
          
          {/* Quick Question List (if in questions tab) */}
          {activeTab === 'questions' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <p className="text-xs font-bold text-text-muted mb-2">قائمة الأسئلة</p>
              {questions.map((q, idx) => (
                <div key={idx} className="px-3 py-2 text-sm bg-muted/50 rounded-lg border border-border/50 truncate font-medium">
                  {idx + 1}. {q.text || 'سؤال جديد'}
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-y-auto bg-background/50 p-6 md:p-8">
          <div className="max-w-4xl mx-auto pb-32">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-sm text-text-muted font-bold">جاري تحميل بيانات الاختبار...</p>
              </div>
            ) : activeTab === 'settings' ? (
              <ExamSettingsPanel settings={settings} onChange={setSettings} />
            ) : (
              <div className="space-y-6">
                {questions.map((q, idx) => (
                  <QuestionEditor 
                    key={idx}
                    question={q}
                    index={idx}
                    onChange={(newQ) => {
                      const newQs = [...questions];
                      newQs[idx] = newQ;
                      setQuestions(newQs);
                    }}
                    onRemove={() => {
                      setQuestions(questions.filter((_, i) => i !== idx));
                    }}
                  />
                ))}

                <div className="flex flex-wrap gap-3 pt-4 justify-center">
                  <button 
                    onClick={() => handleAddQuestion('MULTIPLE_CHOICE')}
                    className="flex items-center gap-2 bg-card hover:bg-muted border border-border px-4 py-3 rounded-xl font-bold transition-all shadow-sm"
                  >
                    <Plus className="w-5 h-5 text-primary" /> اختيار من متعدد
                  </button>
                  <button 
                    onClick={() => handleAddQuestion('TRUE_FALSE')}
                    className="flex items-center gap-2 bg-card hover:bg-muted border border-border px-4 py-3 rounded-xl font-bold transition-all shadow-sm"
                  >
                    <Plus className="w-5 h-5 text-success" /> صح أم خطأ
                  </button>
                  <button 
                    onClick={() => handleAddQuestion('SHORT_TEXT')}
                    className="flex items-center gap-2 bg-card hover:bg-muted border border-border px-4 py-3 rounded-xl font-bold transition-all shadow-sm"
                  >
                    <Plus className="w-5 h-5 text-warning" /> إجابة قصيرة
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
