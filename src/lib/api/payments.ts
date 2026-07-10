import { apiClient } from '@/shared/api/api.client';

export async function checkoutCourse(courseId: string): Promise<{ clientSecret: string; paymentId: string; orderId: string }> {
  const { data } = await apiClient.post<{ clientSecret: string; paymentId: string; orderId: string }>(
    '/payments/checkout',
    { courseId }
  );
  return data;
}
