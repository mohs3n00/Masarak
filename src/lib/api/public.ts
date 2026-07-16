let envUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
if (envUrl && !envUrl.startsWith('http://') && !envUrl.startsWith('https://')) {
  envUrl = `https://${envUrl}`;
}
const API_BASE = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;
export interface PublicCourse {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnailUrl?: string;
  price: number;
  originalPrice?: number;
  accessType: string;
  grade?: string;
  averageRating: number;
  reviewCount: number;
  enrollmentCount: number;
  lessonsCount: number;
  category?: { id: string; name: string; slug: string; iconEmoji?: string } | null;
  teacher?: { id: string; name: string; avatar?: string } | null;
  createdAt: string;
}

export interface PublicTeacher {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
  specializations: string[];
  coursesCount: number;
  studentsCount: number;
  createdAt: string;
}

export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  iconEmoji?: string;
  color?: string;
  coursesCount: number;
}

export interface PublicStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalCategories: number;
}

async function safeFetch<T>(url: string, opts?: RequestInit, token?: string): Promise<T | null> {
  try {
    const headers: Record<string, string> = { ...(opts?.headers as Record<string, string>) };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(url, { cache: 'no-store', ...opts, headers });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchPublicCourses(params?: {
  take?: number;
  skip?: number;
  q?: string;
  category?: string;
  subject?: string;
  grade?: string;
  sort?: string;
  token?: string;
}): Promise<{ data: PublicCourse[]; total: number }> {
  const qs = new URLSearchParams();
  if (params?.take) qs.set('take', String(params.take));
  if (params?.skip) qs.set('skip', String(params.skip));
  if (params?.q) qs.set('q', params.q);
  if (params?.category) qs.set('category', params.category);
  if (params?.subject) qs.set('subject', params.subject);
  if (params?.grade) qs.set('grade', params.grade);
  if (params?.sort) qs.set('sort', params.sort);

  const res = await safeFetch<{ data: PublicCourse[]; total: number }>(
    `${API_BASE}/public/courses?${qs}`,
    undefined,
    params?.token
  );
  return res ?? { data: [], total: 0 };
}

export async function fetchPublicCourse(slug: string): Promise<any | null> {
  return safeFetch(`${API_BASE}/public/courses/${slug}`);
}

export async function fetchTeacherCourseBySlug(slug: string, token: string): Promise<any | null> {
  const headers: HeadersInit = { Authorization: `Bearer ${token}` };
  return safeFetch(`${API_BASE}/teacher/courses/slug/${slug}`, { headers });
}

export async function fetchAdminCourseBySlug(slug: string, token: string): Promise<any | null> {
  const headers: HeadersInit = { Authorization: `Bearer ${token}` };
  return safeFetch(`${API_BASE}/admin/courses/slug/${slug}`, { headers });
}

export async function fetchPublicTeachers(params?: {
  take?: number;
  skip?: number;
  q?: string;
  subjectId?: string;
}): Promise<{ data: PublicTeacher[]; total: number }> {
  const qs = new URLSearchParams();
  if (params?.take) qs.set('take', String(params.take));
  if (params?.skip) qs.set('skip', String(params.skip));
  if (params?.q) qs.set('q', params.q);
  if (params?.subjectId) qs.set('subjectId', params.subjectId);

  const res = await safeFetch<{ data: PublicTeacher[]; total: number }>(
    `${API_BASE}/public/teachers?${qs}`,
  );
  return res ?? { data: [], total: 0 };
}

export async function fetchPublicTeacher(id: string, token?: string): Promise<any | null> {
  return safeFetch(`${API_BASE}/public/teachers/${id}`, undefined, token);
}

export async function fetchPublicCategories(): Promise<PublicCategory[]> {
  const res = await safeFetch<PublicCategory[]>(`${API_BASE}/public/categories`);
  return res ?? [];
}

export async function fetchPublicSubjects(): Promise<any[]> {
  const res = await safeFetch<any[]>(`${API_BASE}/public/subjects`);
  return res ?? [];
}

export async function fetchPublicStats(): Promise<PublicStats> {
  const res = await safeFetch<PublicStats>(`${API_BASE}/public/stats`);
  return res ?? { totalStudents: 0, totalTeachers: 0, totalCourses: 0, totalCategories: 0 };
}
