'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, Tag, X, Check, MessageSquare, BarChart3, BookOpen } from 'lucide-react';
import { KnowledgeItem, SupportCategory } from '@/features/support/types';
import { masarakKnowledge } from '@/features/support/knowledge/masarakKnowledge';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS: Record<SupportCategory, string> = {
  login: 'تسجيل الدخول', registration: 'إنشاء حساب', password: 'كلمة المرور', otp: 'OTP',
  enrollment: 'الاشتراك', payment: 'الدفع', wallet: 'المحفظة', coupon: 'الكوبونات',
  certificate: 'الشهادات', homework: 'الواجبات', quiz: 'الاختبارات', navigation: 'التنقل',
  video: 'الفيديوهات', pdf: 'PDF', download: 'التحميل', teacher: 'المدرسين',
  policy: 'السياسات', refund: 'الاسترداد', technical: 'مشاكل تقنية', account: 'الحساب', general: 'عام',
};

function getAnalytics() {
  if (typeof window === 'undefined') return {} as Record<string, unknown>;
  try { return JSON.parse(localStorage.getItem('masarak_support_analytics') ?? '{}'); } catch { return {}; }
}

export default function AdminSupportPage() {
  const [items, setItems] = useState<KnowledgeItem[]>(masarakKnowledge);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'knowledge' | 'analytics'>('knowledge');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState<Partial<KnowledgeItem>>({ category: 'general', question: '', answer: '', keywords: [] });
  const [keywordInput, setKeywordInput] = useState('');

  const analytics = getAnalytics();
  const filtered = items.filter(i => i.question.includes(search) || i.answer.includes(search) || i.keywords.some(k => k.includes(search)));

  const handleDelete = (id: string) => {
    if (confirm('هل تريد حذف هذا العنصر؟')) setItems(prev => prev.filter(i => i.id !== id));
  };

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    setNewItem(prev => ({ ...prev, keywords: [...(prev.keywords ?? []), keywordInput.trim()] }));
    setKeywordInput('');
  };

  const handleSaveNew = () => {
    if (!newItem.question?.trim() || !newItem.answer?.trim()) return;
    const item: KnowledgeItem = {
      id: `custom_${Date.now()}`, category: (newItem.category as SupportCategory) ?? 'general',
      question: newItem.question!, answer: newItem.answer!, keywords: newItem.keywords ?? [],
    };
    setItems(prev => [item, ...prev]);
    setShowAddForm(false);
    setNewItem({ category: 'general', question: '', answer: '', keywords: [] });
    setKeywordInput('');
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black">إدارة قاعدة معرفة الدعم الذكي</h1>
            <p className="text-muted-foreground text-sm mt-1">المعرفة التي يستخدمها المساعد الذكي</p>
          </div>
          <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
            {(['knowledge', 'analytics'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  activeTab === tab ? 'bg-background shadow text-foreground' : 'text-muted-foreground')}>
                {tab === 'knowledge' ? <><BookOpen className="w-4 h-4" />قاعدة المعرفة</> : <><BarChart3 className="w-4 h-4" />الإحصائيات</>}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'knowledge' && (
          <>
            <div className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="ابحث..." className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-border bg-card text-sm outline-none focus:border-primary" />
              </div>
              <button onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90">
                <Plus className="w-4 h-4" />إضافة سؤال
              </button>
            </div>

            {showAddForm && (
              <div className="bg-card border border-primary/30 rounded-2xl p-5 mb-6 shadow-sm">
                <h3 className="font-bold mb-4">إضافة سؤال جديد</h3>
                <div className="space-y-3">
                  <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value as SupportCategory }))}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary">
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <input value={newItem.question} onChange={e => setNewItem(p => ({ ...p, question: e.target.value }))}
                    placeholder="السؤال..." className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary" />
                  <textarea value={newItem.answer} onChange={e => setNewItem(p => ({ ...p, answer: e.target.value }))}
                    placeholder="الإجابة..." rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary resize-none" />
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {newItem.keywords?.map(kw => (
                        <span key={kw} className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs">
                          {kw}<button onClick={() => setNewItem(p => ({ ...p, keywords: p.keywords?.filter(k => k !== kw) }))}><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={keywordInput} onChange={e => setKeywordInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAddKeyword()} placeholder="كلمة مفتاحية..."
                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm outline-none focus:border-primary" />
                      <button onClick={handleAddKeyword} className="px-3 py-2 bg-muted rounded-lg"><Tag className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={handleSaveNew} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                    <Check className="w-4 h-4" />حفظ
                  </button>
                  <button onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm">إلغاء</button>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground mb-3">{filtered.length} من {items.length} سؤال</div>

            <div className="space-y-2">
              {filtered.map(item => (
                <div key={item.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                          {CATEGORY_LABELS[item.category]}
                        </span>
                        {item.keywords.slice(0, 3).map(kw => (
                          <span key={kw} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{kw}</span>
                        ))}
                      </div>
                      <p className="text-sm font-bold flex items-start gap-1.5 mb-1">
                        <MessageSquare className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />{item.question}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{item.answer}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-destructive/10 rounded-lg text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'إجمالي الأسئلة', value: analytics?.total ?? 0, icon: '💬' },
              { label: 'حالات التصعيد', value: analytics?.escalations ?? 0, icon: '🔺' },
              { label: 'تقييم مفيد', value: analytics?.helpful ?? 0, icon: '👍' },
              { label: 'تقييم غير مفيد', value: analytics?.not_helpful ?? 0, icon: '👎' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-2xl p-5 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <p className="text-3xl font-black text-primary">{String(s.value)}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
