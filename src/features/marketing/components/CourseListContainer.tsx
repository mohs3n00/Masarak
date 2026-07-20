'use client';

import React from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { CoursePreviewCard } from './cards/CourseCard';

interface CourseListContainerProps {
  initialCourses: any[];
}

function normalizeGradeString(str: string): string {
  if (!str) return '';
  return str.replace(/[أإآا]/g, 'ا').replace(/[ىي]/g, 'ي').trim();
}

function isGradeMatch(courseGrades: string[] | undefined, studentGrade: string | undefined): boolean {
  // If course has no grade restrictions (grades = []), it's general → visible to all
  if (!courseGrades || courseGrades.length === 0) return true;
  if (!studentGrade) return true;

  const normStudent = normalizeGradeString(studentGrade);
  return courseGrades.some((g) => normalizeGradeString(g) === normStudent);
}

export function CourseListContainer({ initialCourses }: CourseListContainerProps) {
  const { user, role } = useAuthStore();

  const studentGrade = (user as any)?.studentProfile?.grade || (user as any)?.grade;

  const filteredCourses = React.useMemo(() => {
    if (role !== 'STUDENT' || !studentGrade) {
      return initialCourses;
    }
    return initialCourses.filter((course) => isGradeMatch(course.grades, studentGrade));
  }, [initialCourses, role, studentGrade]);

  if (!filteredCourses || filteredCourses.length === 0) {
    return (
      <div className="col-span-full py-12 text-center text-muted-foreground">
        لا توجد دورات متاحة لصفك الدراسي حالياً
      </div>
    );
  }

  return (
    <>
      {filteredCourses.map((course: any) => (
        <CoursePreviewCard key={course.id} course={course} />
      ))}
    </>
  );
}
