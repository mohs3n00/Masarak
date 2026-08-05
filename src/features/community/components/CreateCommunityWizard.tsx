'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Users,
  Image as ImageIcon,
  BookOpen,
  Tag,
  Eye,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Upload,
  Layers,
} from 'lucide-react';
import { COMMUNITY_CATEGORIES, COMMUNITY_VISIBILITIES } from '../constants/categories';
import { createCommunityApi } from '../services/community-api.service';
import { CommunitySpace } from '../types';

interface CreateCommunityWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (community: CommunitySpace) => void;
}

export function CreateCommunityWizard({
  isOpen,
  onClose,
  onSuccess,
}: CreateCommunityWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [category, setCategory] = useState<string>('EDUCATION');
  const [gradeLevel, setGradeLevel] = useState<number | undefined>(undefined);
  const [subject, setSubject] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['مسارك', 'تعليم']);
  const [visibility, setVisibility] = useState<string>('PUBLIC');
  const [rules, setRules] = useState('');
  const [isSuccessPending, setIsSuccessPending] = useState(false);

  // Generated metadata preview
  const generatedId = React.useMemo(() => {
    return `MSC-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }, [name]);

  const generatedSlug = React.useMemo(() => {
    return name
      ? name
          .trim()
          .toLowerCase()
          .replace(/[^\wء-ي\s-]/g, '')
          .replace(/\s+/g, '-')
      : 'new-community';
  }, [name]);

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      setUploadingAvatar(true);
      setError(null);
      const api = createCommunityApi();
      const res = await api.uploadImage(file, 'masarak/community');
      if (res?.url) {
        setAvatarUrl(res.url);
      }
    } catch (err: any) {
      setError('فشل رفع صورة الشعار: ' + (err.message || ''));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverUpload = async (file: File) => {
    try {
      setUploadingCover(true);
      setError(null);
      const api = createCommunityApi();
      const res = await api.uploadImage(file, 'masarak/community');
      if (res?.url) {
        setCoverUrl(res.url);
      }
    } catch (err: any) {
      setError('فشل رفع صورة الغلاف: ' + (err.message || ''));
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const api = createCommunityApi();
      const newCommunity = await api.createSpace({
        name,
        description,
        avatarUrl,
        coverUrl,
        category: category as any,
        gradeLevel,
        subject,
        tags,
        visibility: visibility as any,
        rules,
        type: 'STUDENT',
      });
      onSuccess(newCommunity);
      if (newCommunity.status === 'PENDING_REVIEW') {
        setIsSuccessPending(true);
      } else {
        onClose();
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء المجتمع');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setName('');
    setDescription('');
    setAvatarUrl('');
    setCoverUrl('');
    setCategory('EDUCATION');
    setGradeLevel(undefined);
    setSubject('');
    setTags(['مسارك', 'تعليم']);
    setVisibility('PUBLIC');
    setRules('');
    setError(null);
    setIsSuccessPending(false);
  };

  if (isSuccessPending) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && (onClose(), resetForm())}>
        <DialogContent className="max-w-md dir-rtl text-center p-8 rounded-3xl flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            طلبك قيد المراجعة
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground text-center">
            تم إرسال طلب تأسيس المجتمع "{name}" إلى الإدارة بنجاح. سنقوم بمراجعة الطلب والموافقة عليه في أقرب وقت لكي يظهر لجميع الطلاب والمعلمين.
          </DialogDescription>
          <Button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="w-full mt-4 rounded-xl h-11"
          >
            حسناً، فهمت
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl dir-rtl text-right p-6 sm:p-8 rounded-3xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader className="mb-4 pt-4 sm:pt-2">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="px-3 py-1 bg-primary/10 text-primary border-primary/20">
              الخطوة {step} من 6
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              تأسيس مجتمع أكاديمي
            </div>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            {step === 1 && 'ما هو اسم مجتمعك الأكاديمي؟'}
            {step === 2 && 'اكتب وصفاً مختصراً للمجتمع'}
            {step === 3 && 'رفع الشعار والغلاف من جهازك'}
            {step === 4 && 'اختر تصنيف المجتمع'}
            {step === 5 && 'إضافة الوسوم الأكاديمية (Tags)'}
            {step === 6 && 'المعاينة والإرسال للمراجعة'}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
            {step === 1 && 'اختر اسماً واضحاً ومميزاً يعبر عن التخصص أو المادة.'}
            {step === 2 && 'اشرح الهدف من المجتمع والأنشطة المتاحة للطلاب.'}
            {step === 3 && 'ارفع صورة الشعار وصورة الغلاف مباشرة من ملفاتك (بدون روابط خروج).'}
            {step === 4 && 'يساعد التصنيف الطلاب والمعلمين في الوصول لمجتمعك بسهولة.'}
            {step === 5 && 'أضف الوسوم الرئيسية مثل: #فيزياء، #ثانوية_عامة...'}
            {step === 6 && 'راجع معاينة المجتمع وشكل الكارت قبل إرساله للإدارة.'}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Name & ID preview */}
        {step === 1 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">اسم المجتمع *</label>
              <Input
                placeholder="مثال: مجتمع الفيزياء المتقدمة - الثانوية العامة"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-2xl text-sm"
              />
            </div>
            {name.trim() && (
              <div className="p-3.5 rounded-2xl bg-muted/60 text-xs space-y-1 border border-border/60">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">معرف المجتمع المتوقع:</span>
                  <Badge variant="outline" className="font-mono text-primary font-bold">
                    {generatedId}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">الرابط المباشر (Slug):</span>
                  <span className="font-mono dir-ltr dir-left text-foreground font-semibold">/community/{generatedSlug}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">وصف المجتمع</label>
              <Textarea
                placeholder="تجمع خاص بطلاب الفيزياء لمناقشة الأسئلة والحلول ومشاركة الملخصات..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="rounded-2xl text-sm resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 3: Strictly File Upload Only */}
        {step === 3 && (
          <div className="space-y-6 py-2">
            {/* Avatar Upload Dropzone */}
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center justify-between">
                <span>صورة الشعار (Avatar Logo)</span>
                <span className="text-xs text-primary font-medium">رفع مباشر حصرياً</span>
              </label>

              <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-4 transition-colors flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : uploadingAvatar ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {avatarUrl ? 'تم اختيار صورة الشعار' : 'اختر صورة من جهازك'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">JPG, PNG, WEBP (حجم أقصى 5MB)</p>
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleAvatarUpload(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 pointer-events-none">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingAvatar ? 'جاري الرفع...' : avatarUrl ? 'تغيير الصورة' : 'اختيار صورة'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Cover Upload Dropzone */}
            <div className="space-y-2 pt-4 border-t border-border">
              <label className="text-sm font-semibold flex items-center justify-between">
                <span>صورة الغلاف (Cover Banner)</span>
                <span className="text-xs text-primary font-medium">رفع مباشر حصرياً</span>
              </label>

              <div className="relative border-2 border-dashed border-border hover:border-primary/50 rounded-2xl p-4 transition-colors flex items-center justify-between bg-card">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-12 rounded-2xl bg-muted flex items-center justify-center overflow-hidden border border-border shrink-0">
                    {coverUrl ? (
                      <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : uploadingCover ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      {coverUrl ? 'تم اختيار صورة الغلاف' : 'اختر غلافاً عريضاً'}
                    </p>
                    <p className="text-[11px] text-muted-foreground">صورة عريضة بدقة عالية</p>
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverUpload(file);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 pointer-events-none">
                    <Upload className="w-3.5 h-3.5" />
                    {uploadingCover ? 'جاري الرفع...' : coverUrl ? 'تغيير الغلاف' : 'اختيار غلاف'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Category */}
        {step === 4 && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">الصف الدراسي (ضروري للتصنيف)</label>
                <select
                  value={gradeLevel || ''}
                  onChange={(e) => setGradeLevel(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full h-12 px-4 rounded-2xl text-sm bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="">غير محدد</option>
                  <option value="1">الصف الأول الثانوي</option>
                  <option value="2">الصف الثاني الثانوي</option>
                  <option value="3">الصف الثالث الثانوي</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">المادة (ضروري للتصنيف)</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl text-sm bg-background border border-border focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                >
                  <option value="">غير محدد</option>
                  <option value="physics">الفيزياء</option>
                  <option value="chemistry">الكيمياء</option>
                  <option value="math">الرياضيات</option>
                  <option value="biology">الأحياء</option>
                  <option value="arabic">اللغة العربية</option>
                  <option value="english">اللغة الإنجليزية</option>
                  <option value="geology">الجيولوجيا</option>
                  <option value="history">التاريخ</option>
                  <option value="cs">علوم الحاسب</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Tags */}
        {step === 5 && (
          <div className="space-y-4 py-2">
            <div className="flex gap-2">
              <Input
                placeholder="أضف وسم جديد..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                className="h-11 rounded-2xl text-sm flex-1"
              />
              <Button onClick={handleAddTag} className="h-11 px-5 rounded-2xl">
                إضافة
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[70px] p-3.5 rounded-2xl border border-dashed border-border">
              {tags.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="px-3 py-1 rounded-xl text-xs gap-1.5 cursor-pointer hover:bg-red-500/20 hover:text-red-500 transition-colors"
                  onClick={() => handleRemoveTag(t)}
                >
                  #{t} ×
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Final Live Preview Card */}
        {step === 6 && (
          <div className="space-y-4 py-2">
            <div className="text-xs font-semibold text-muted-foreground">معاينة شكل كارت المجتمع للطلاب:</div>
            
            <div className="p-5 rounded-2xl bg-card border border-border shadow-md space-y-4">
              <div className="relative h-24 rounded-xl bg-slate-800 overflow-hidden">
                {coverUrl ? (
                  <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-primary/30 to-indigo-500/20" />
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="text-[10px] font-mono bg-background/80 backdrop-blur-md">
                    {generatedId}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-3 -mt-8 px-2">
                <div className="w-14 h-14 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center border-2 border-card shadow-md overflow-hidden shrink-0">
                  {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : (name || 'مجتمع').substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-base text-foreground">{name || 'اسم المجتمع'}</h4>
                  <p className="text-xs text-muted-foreground">{category}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 px-2">
                {description || 'لا يوجد وصف للمجتمع بعد.'}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs text-muted-foreground px-2">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> 1 عضو (أنت)
                </span>
                <Badge className="bg-amber-500/10 text-amber-600 text-[10px]">
                  معلق للمراجعة
                </Badge>
              </div>
            </div>

            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              عند الإرسال، سيراجع الأدمن طلب التأسيس ويُفعل المجتمع للطلاب والمعلمين.
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep(step - 1)}
              disabled={loading || uploadingAvatar || uploadingCover}
              className="rounded-2xl gap-2 h-11 text-xs sm:text-sm"
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </Button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <Button
              onClick={() => {
                if (step === 1 && !name.trim()) {
                  setError('يرجى إدخال اسم المجتمع');
                  return;
                }
                setError(null);
                setStep(step + 1);
              }}
              disabled={uploadingAvatar || uploadingCover}
              className="rounded-2xl gap-2 h-11 text-xs sm:text-sm px-6"
            >
              التالي
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !name.trim() || uploadingAvatar || uploadingCover}
              className="rounded-2xl gap-2 h-11 text-xs sm:text-sm px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              إنشاء المجتمع وإرساله للمراجعة
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
