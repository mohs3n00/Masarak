'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { apiClient } from '@/shared/api/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';

interface CourseRatingSectionProps {
  courseId: string;
  initialAverageRating?: number;
  initialReviewCount?: number;
}

export function CourseRatingSection({
  courseId,
  initialAverageRating = 0,
  initialReviewCount = 0,
}: CourseRatingSectionProps) {
  const { user } = useAuthStore();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [averageRating, setAverageRating] = useState<number>(initialAverageRating);
  const [reviewCount, setReviewCount] = useState<number>(initialReviewCount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage({ type: 'error', text: 'يرجى تسجيل الدخول لتقييم الكورس' });
      return;
    }
    if (rating === 0) {
      setMessage({ type: 'error', text: 'يرجى اختيار تقييم من 1 إلى 5 نجوم' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await apiClient.post(`/student/courses/${courseId}/rate`, {
        rating,
        comment,
      });

      if (res.data?.averageRating !== undefined) {
        setAverageRating(res.data.averageRating);
        setReviewCount(res.data.reviewCount);
      }
      setMessage({ type: 'success', text: 'تم حفظ تقييمك بنجاح! شكراً لمشاركتك.' });
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'تعذر تقييم الكورس، تأكد من اشتراكك في الكورس.';
      setMessage({ type: 'error', text: errMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8 my-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h3 className="text-xl font-bold font-heading text-foreground mb-1">تقييمات الطلاب</h3>
          <p className="text-sm text-muted-foreground">آراء وتقييمات الطلاب في هذا الكورس</p>
        </div>

        <div className="flex items-center gap-4 bg-muted/30 px-5 py-3 rounded-xl border border-border/60">
          <div className="flex items-center gap-1">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500 shrink-0" />
            <span className="text-2xl font-black text-foreground">{Number(averageRating || 0).toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">/ 5</span>
          </div>
          <div className="h-6 w-px bg-border" />
          <span className="text-sm font-medium text-muted-foreground">{reviewCount} تقييم</span>
        </div>
      </div>

      {/* Interactive Rating Form */}
      <div className="mt-6">
        <h4 className="font-semibold text-foreground mb-3 text-base">قيم هذا الكورس:</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                aria-label={`تقييم ${star} نجوم`}
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-muted-foreground/30'
                  }`}
                />
              </button>
            ))}
            <span className="text-sm font-semibold text-muted-foreground mr-2">
              {hoverRating || rating ? `${hoverRating || rating} من 5` : 'حدد التقييم'}
            </span>
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="اكتب تعليقك أو رأيك في المحتوى (اختياري)..."
            rows={3}
            className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
          />

          {message && (
            <div
              className={`p-3 rounded-xl text-sm font-medium ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground font-bold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-50"
          >
            {isSubmitting ? 'جاري الحفظ...' : 'إرسال التقييم'}
          </button>
        </form>
      </div>
    </div>
  );
}
