'use client';

import React, { useState } from 'react';
import { Button } from '@/shared/components/atoms/Button';
import Link from 'next/link';
import { CheckoutModal } from './CheckoutModal';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { apiClient } from '@/shared/api/api.client';
import { toast } from 'sonner';

interface CourseActionButtonsProps {
  courseId: string;
  price: number;
  instructorUserId?: string;
}

export function CourseActionButtons({ courseId, price, instructorUserId }: CourseActionButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    apiClient.get('/users/me')
      .then(async res => {
        if (res.data?.id) {
          const role = res.data.role;
          setUserRole(role);
          setUserId(res.data.id);
          if (role === 'STUDENT') {
            try {
              const enrollRes = await apiClient.get(`/student/courses/${courseId}/check-enrollment`);
              if (enrollRes.data?.isEnrolled) {
                setIsEnrolled(true);
              }
            } catch (err) {}
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoadingUser(false));
  }, [courseId]);

  const handleFreeEnroll = async () => {
    try {
      setIsEnrolling(true);
      const res = await apiClient.post('/student/checkout/enroll', { courseId });
      if (res.data?.success) {
        toast.success('تم الانضمام للكورس بنجاح!');
        router.refresh();
        setTimeout(() => {
          router.push(`/dashboard/student/course/${courseId}`);
        }, 100);
      }
    } catch (error: any) {
      const status = error.status;
      const message = error.message;
      
      if (status === 401 || status === 403) {
        toast.error('يجب تسجيل الدخول أولاً للانضمام');
        const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
        router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
        return;
      }

      if (message === 'You are already enrolled in this course') {
        // Just redirect them to the course if they are already enrolled
        router.push(`/dashboard/student/course/${courseId}`);
        return;
      }

      toast.error(message || 'حدث خطأ أثناء الانضمام');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoadingUser) {
    return <div className="h-12 bg-muted animate-pulse rounded-xl w-full"></div>;
  }

  const isTeacher = userRole === 'TEACHER';
  const isOwnCourse = isTeacher && userId === instructorUserId;

  return (
    <>
      <div className="flex flex-col gap-3">
        {isTeacher ? (
          isOwnCourse ? (
            <Button 
              size="lg" 
              className="w-full text-lg font-bold"
              onClick={() => router.push(`/dashboard/teacher/courses/${courseId}/lessons`)}
            >
              إدارة الكورس
            </Button>
          ) : (
            <Button 
              size="lg" 
              variant="outline"
              className="w-full text-lg font-bold opacity-70 cursor-not-allowed"
              disabled
            >
              غير مصرح للمعلمين دخول كورسات أخرى
            </Button>
          )
        ) : (
          price === 0 ? (
            <Button 
              size="lg" 
              className="w-full text-lg font-bold"
              onClick={isEnrolled ? () => router.push(`/dashboard/student/course/${courseId}`) : handleFreeEnroll}
              disabled={isEnrolling}
            >
              {isEnrolling ? 'جاري الانضمام...' : (isEnrolled ? 'ادخل للمحاضرة' : 'ادخل للكورس')}
            </Button>
          ) : (
            isEnrolled ? (
              <Button 
                size="lg" 
                className="w-full text-lg font-bold"
                onClick={() => router.push(`/dashboard/student/course/${courseId}`)}
              >
                ادخل للمحاضرة
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="w-full text-lg font-bold"
                onClick={() => {
                  if (!userRole) {
                    toast.error('يجب تسجيل الدخول أولاً للانضمام');
                    const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
                    router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`);
                  } else {
                    setIsModalOpen(true);
                  }
                }}
              >
                اشترك الآن
              </Button>
            )
          )
        )}
      </div>

      <CheckoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        courseId={courseId} 
        originalPrice={price} 
      />
    </>
  );
}
