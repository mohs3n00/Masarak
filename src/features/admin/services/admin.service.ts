import { Teacher, Course, Subject, Level, Category } from '@/types/models';
import { teachers as mockTeachers } from '@/mock/teachers';
import { courses as mockCourses } from '@/mock/courses';

// Local State for Mocking Admin Operations
let teachers = [...mockTeachers];
let courses = [...mockCourses];

let subjects: Subject[] = [
  { id: 'sub_1', name: 'لغة عربية', slug: 'arabic' },
  { id: 'sub_2', name: 'رياضيات', slug: 'math' },
  { id: 'sub_3', name: 'فيزياء', slug: 'physics' },
];

let grades: Level[] = [
  { id: 'lvl_1', name: 'الصف الأول الثانوي', slug: 'grade-10' },
  { id: 'lvl_2', name: 'الصف الثاني الثانوي', slug: 'grade-11' },
  { id: 'lvl_3', name: 'الصف الثالث الثانوي', slug: 'grade-12' },
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const adminService = {
  // === TEACHERS ===
  async getTeachers(): Promise<Teacher[]> {
    await delay(300);
    return teachers;
  },

  async addTeacher(data: Partial<Teacher>): Promise<Teacher> {
    await delay(500);
    const newTeacher: Teacher = {
      id: `teach_${Date.now()}`,
      name: data.name || 'مدرس جديد',
      email: data.email || '',
      role: 'TEACHER',
      joinedAt: new Date().toISOString(),
      bio: data.bio || '',
      specialization: data.specialization || '',
      rating: 0,
      studentsCount: 0,
      coursesCount: 0,
    };
    teachers.push(newTeacher);
    return newTeacher;
  },

  async updateTeacher(id: string, data: Partial<Teacher>): Promise<Teacher> {
    await delay(500);
    const index = teachers.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Teacher not found');
    
    teachers[index] = { ...teachers[index], ...data };
    return teachers[index];
  },

  async deleteTeacher(id: string): Promise<void> {
    await delay(500);
    teachers = teachers.filter(t => t.id !== id);
  },

  // === COURSES ===
  async getCourses(): Promise<Course[]> {
    await delay(300);
    return courses;
  },

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    await delay(500);
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');
    
    courses[index] = { ...courses[index], ...data };
    return courses[index];
  },

  async deleteCourse(id: string): Promise<void> {
    await delay(500);
    courses = courses.filter(c => c.id !== id);
  },

  // === ACADEMIC (Subjects & Grades) ===
  async getSubjects(): Promise<Subject[]> {
    await delay(200);
    return subjects;
  },

  async addSubject(data: Partial<Subject>): Promise<Subject> {
    await delay(400);
    const newSub: Subject = {
      id: `sub_${Date.now()}`,
      name: data.name || '',
      slug: data.slug || '',
    };
    subjects.push(newSub);
    return newSub;
  },

  async deleteSubject(id: string): Promise<void> {
    await delay(400);
    subjects = subjects.filter(s => s.id !== id);
  },

  async getGrades(): Promise<Level[]> {
    await delay(200);
    return grades;
  },

  async addGrade(data: Partial<Level>): Promise<Level> {
    await delay(400);
    const newGrade: Level = {
      id: `lvl_${Date.now()}`,
      name: data.name || '',
      slug: data.slug || '',
    };
    grades.push(newGrade);
    return newGrade;
  },

  async deleteGrade(id: string): Promise<void> {
    await delay(400);
    grades = grades.filter(g => g.id !== id);
  }
};
