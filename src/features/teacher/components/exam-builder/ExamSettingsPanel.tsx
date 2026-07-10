import React from 'react';
import { ExamSettings } from './types';
import { Settings, Clock, Target, AlertCircle, Calendar, Eye, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ExamSettingsPanelProps {
  settings: ExamSettings;
  onChange: (settings: ExamSettings) => void;
}

export function ExamSettingsPanel({ settings, onChange }: ExamSettingsPanelProps) {
  const handleChange = (field: keyof ExamSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  const handleRuleChange = (field: string, value: any) => {
    onChange({
      ...settings,
      rules: {
        ...(settings.rules || {}),
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* القسم الأول: المعلومات الأساسية */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
          <Settings className="w-6 h-6 text-primary" /> المعلومات الأساسية
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">عنوان الاختبار *</label>
            <input
              type="text"
              value={settings.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="مثال: اختبار الوحدة الأولى"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">وصف الاختبار</label>
            <textarea
              value={settings.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[80px]"
              placeholder="وصف مختصر للاختبار يظهر للطلاب قبل البدء"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">تعليمات الاختبار</label>
            <textarea
              value={settings.instructions || ''}
              onChange={(e) => handleChange('instructions', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px]"
              placeholder="تعليمات هامة، مثلاً: يمنع استخدام الآلة الحاسبة، راجع دروس الوحدة قبل البدء..."
            />
          </div>
        </div>
      </div>

      {/* القسم الثاني: الضوابط والشروط */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
          <Target className="w-6 h-6 text-warning" /> الضوابط والشروط
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* المدة (واضحة جداً كما طلب المستخدم) */}
          <div className="space-y-3 bg-primary/5 p-4 rounded-2xl border border-primary/20">
            <label className="block text-base font-black text-primary flex items-center gap-2">
              <Clock className="w-5 h-5" /> مدة الاختبار بالدقائق
            </label>
            <div className="flex items-center gap-3">
              <select
                value={settings.durationMin || 30}
                onChange={(e) => handleChange('durationMin', parseInt(e.target.value) || 30)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-primary/30 bg-background focus:ring-2 focus:ring-primary outline-none font-bold text-lg"
              >
                <option value={10}>10 دقائق</option>
                <option value={15}>15 دقيقة</option>
                <option value={20}>20 دقيقة</option>
                <option value={30}>30 دقيقة</option>
                <option value={45}>45 دقيقة</option>
                <option value={60}>60 دقيقة (ساعة)</option>
                <option value={90}>90 دقيقة (ساعة ونصف)</option>
                <option value={120}>120 دقيقة (ساعتين)</option>
                {/* if custom value exists that is not in the list, show it */}
                {![10, 15, 20, 30, 45, 60, 90, 120].includes(settings.durationMin || 30) && (
                  <option value={settings.durationMin}>{settings.durationMin} دقيقة (مخصص)</option>
                )}
              </select>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">أو إدخال مخصص:</span>
                <input
                  type="number"
                  min="1"
                  value={settings.durationMin || 30}
                  onChange={(e) => handleChange('durationMin', parseInt(e.target.value) || 30)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none font-bold text-center text-lg"
                  placeholder="مثال: 45"
                />
              </div>
            </div>
            <p className="text-xs font-bold text-muted-foreground mt-2">
              سيبدأ العداد التنازلي فور بدء الطالب للاختبار ويتم التسليم التلقائي عند انتهاء الوقت.
            </p>
          </div>

          {/* مرات الإعادة */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-foreground flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-error" /> المحاولات المسموحة
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleChange('attemptsLimit', 1)}
                className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-colors ${settings.attemptsLimit === 1 || !settings.attemptsLimit ? 'bg-primary text-white border-primary' : 'bg-muted/30 border-border text-foreground hover:bg-muted'}`}
              >
                مرة واحدة
              </button>
              <button
                type="button"
                onClick={() => handleChange('attemptsLimit', 2)}
                className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-colors ${settings.attemptsLimit === 2 ? 'bg-primary text-white border-primary' : 'bg-muted/30 border-border text-foreground hover:bg-muted'}`}
              >
                مرتان
              </button>
              <button
                type="button"
                onClick={() => handleChange('attemptsLimit', 0)}
                className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold transition-colors ${settings.attemptsLimit === 0 ? 'bg-primary text-white border-primary' : 'bg-muted/30 border-border text-foreground hover:bg-muted'}`}
              >
                غير محدود
              </button>
            </div>
            {(settings.attemptsLimit > 2 || (settings.attemptsLimit > 0 && ![1,2].includes(settings.attemptsLimit))) && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">عدد مخصص:</span>
                <input
                  type="number"
                  min="1"
                  value={settings.attemptsLimit}
                  onChange={(e) => handleChange('attemptsLimit', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none"
                />
              </div>
            )}
          </div>

          {/* درجة النجاح */}
          <div className="space-y-3 md:col-span-2 bg-muted/20 p-4 rounded-2xl border border-border/50">
            <label className="block text-sm font-bold text-foreground flex items-center gap-1">
              <Target className="w-4 h-4 text-emerald-500" /> شرط النجاح
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex bg-muted/50 p-1 rounded-xl w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleChange('passingScoreType', 'PERCENTAGE')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${settings.passingScoreType === 'PERCENTAGE' || !settings.passingScoreType ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  نسبة مئوية (%)
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('passingScoreType', 'MARKS')}
                  className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${settings.passingScoreType === 'MARKS' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  درجات (نقاط)
                </button>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min="1"
                  max={settings.passingScoreType === 'PERCENTAGE' || !settings.passingScoreType ? 100 : undefined}
                  value={settings.passingScore || 50}
                  onChange={(e) => handleChange('passingScore', parseInt(e.target.value) || 50)}
                  className="w-24 px-4 py-2 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none text-center font-bold"
                />
                <span className="text-sm font-bold text-muted-foreground">
                  {settings.passingScoreType === 'PERCENTAGE' || !settings.passingScoreType ? '% للنجاح' : 'درجة للنجاح'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* القسم الثالث: التوفر والجدولة */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
          <Calendar className="w-6 h-6 text-indigo-500" /> الجدولة والإتاحة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-foreground mb-2">متاح من (تاريخ ووقت)</label>
            <input
              type="datetime-local"
              value={settings.availableFrom ? new Date(settings.availableFrom).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('availableFrom', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none"
            />
            <p className="text-xs text-muted-foreground mt-2">اتركه فارغاً ليكون متاحاً فوراً.</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-2">متاح حتى (تاريخ ووقت)</label>
            <input
              type="datetime-local"
              value={settings.availableUntil ? new Date(settings.availableUntil).toISOString().slice(0, 16) : ''}
              onChange={(e) => handleChange('availableUntil', e.target.value ? new Date(e.target.value).toISOString() : null)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/50 focus:bg-background outline-none"
            />
            <p className="text-xs text-muted-foreground mt-2">اتركه فارغاً ليكون متاحاً دائماً.</p>
          </div>
        </div>
      </div>

      {/* القسم الرابع: العشوائية والمراجعة */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
          <RefreshCw className="w-6 h-6 text-blue-500" /> العشوائية وإعدادات المراجعة
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-sm border-b pb-2">العشوائية (Randomization)</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!settings.rules?.randomizeQuestions}
                onChange={(e) => handleRuleChange('randomizeQuestions', e.target.checked)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="font-bold text-sm">عشوائية ترتيب الأسئلة</p>
                <p className="text-xs text-muted-foreground">يظهر ترتيب الأسئلة بشكل مختلف لكل طالب</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={!!settings.rules?.randomizeAnswers}
                onChange={(e) => handleRuleChange('randomizeAnswers', e.target.checked)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="font-bold text-sm">عشوائية ترتيب الخيارات</p>
                <p className="text-xs text-muted-foreground">خلط خيارات الإجابة في أسئلة الاختيار من متعدد</p>
              </div>
            </label>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-sm border-b pb-2">بعد التسليم</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={settings.rules?.showScore !== 'NEVER'}
                onChange={(e) => handleRuleChange('showScore', e.target.checked ? 'IMMEDIATELY' : 'NEVER')}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="font-bold text-sm">عرض الدرجة للطالب</p>
                <p className="text-xs text-muted-foreground">يستطيع الطالب رؤية درجته فور التسليم</p>
              </div>
            </label>
            
            <label className={`flex items-center gap-3 ${settings.rules?.showScore === 'NEVER' ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}>
              <input 
                type="checkbox" 
                checked={!!settings.rules?.reviewAnswers}
                onChange={(e) => handleRuleChange('reviewAnswers', e.target.checked)}
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary"
              />
              <div>
                <p className="font-bold text-sm">السماح بمراجعة الإجابات</p>
                <p className="text-xs text-muted-foreground">يمكن للطالب رؤية إجاباته الخاطئة والصحيحة بعد التسليم</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* القسم الخامس: حالة النشر */}
      <div className="bg-card border border-border/60 rounded-3xl p-6 shadow-sm space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4 border-b border-border/50 pb-4">
          <Eye className="w-6 h-6 text-foreground" /> حالة الاختبار (Visibility)
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="button"
            onClick={() => handleChange('status', 'PUBLISHED')}
            className={`flex-1 p-4 rounded-2xl border-2 text-start transition-all ${settings.status === 'PUBLISHED' || !settings.status ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80 bg-background'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-lg text-foreground">منشور ومتاح</span>
              {(settings.status === 'PUBLISHED' || !settings.status) && <CheckCircle2 className="w-6 h-6 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">يمكن للطلاب رؤيته والدخول إليه (حسب التواريخ أعلاه).</p>
          </button>

          <button
            type="button"
            onClick={() => handleChange('status', 'DRAFT')}
            className={`flex-1 p-4 rounded-2xl border-2 text-start transition-all ${settings.status === 'DRAFT' ? 'border-warning bg-warning/5' : 'border-border hover:border-border/80 bg-background'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-black text-lg text-foreground">مسودة (غير منشور)</span>
              {settings.status === 'DRAFT' && <CheckCircle2 className="w-6 h-6 text-warning" />}
            </div>
            <p className="text-sm text-muted-foreground">مخفي تماماً عن الطلاب، يمكنك العودة لتعديله لاحقاً.</p>
          </button>
        </div>
      </div>

    </div>
  );
}
