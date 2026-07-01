'use client';

import React from 'react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { AppContainer } from '@/shared/layouts/Containers';
import { PlayCircle, Clock, BookOpen, Star, Users, CheckCircle2, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';

export default function CourseDetailsPage() {
  const course = studentMockData.courseDetails;

  return (
    <div className="pb-20">
      {/* Premium Hero Section */}
      <div className="bg-slate-900 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={studentMockData.allCourses[0].thumbnail} alt="Course Cover" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
        </div>

        <AppContainer className="relative z-10 flex flex-col lg:flex-row gap-12">
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3 text-sm font-bold tracking-wider uppercase text-blue-400">
              <Link href="/dashboard/student/courses" className="hover:text-white transition-colors">My Learning</Link>
              <ChevronRight className="w-4 h-4" />
              <span>Mathematics</span>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black font-heading leading-tight max-w-3xl">
              {course.title}
            </h1>
            
            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium mt-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-white">4.9 <span className="text-slate-400">(2.4k ratings)</span></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-5 h-5" /> 15,230 students
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-5 h-5" /> 24 total hours
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <Link 
                href={`/course/${course.id}/player`} 
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" /> Resume Learning
              </Link>
            </div>
          </div>

          {/* Floating Course Info Card */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-card text-card-foreground rounded-3xl p-6 shadow-2xl border border-border/50 sticky top-24">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.teacher.avatar} alt={course.teacher.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{course.teacher.name}</h3>
                  <p className="text-sm text-muted-foreground">{course.teacher.role}</p>
                </div>
              </div>

              <div className="h-px w-full bg-border/50 my-6" />

              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-end text-sm">
                  <span className="text-text-secondary font-bold">Your Progress</span>
                  <span className="font-bold text-primary text-lg">{course.progress}%</span>
                </div>
                <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${course.progress}%` }} />
                </div>
              </div>

              <div className="h-px w-full bg-border/50 my-6" />
              
              <h4 className="font-bold mb-4">This course includes:</h4>
              <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                <li className="flex items-center gap-3"><PlayCircle className="w-5 h-5 text-primary" /> 42 Video Lessons</li>
                <li className="flex items-center gap-3"><FileText className="w-5 h-5 text-primary" /> 12 Downloadable Resources</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-primary" /> End of Course Certificate</li>
                <li className="flex items-center gap-3"><Users className="w-5 h-5 text-primary" /> Exclusive Study Group</li>
              </ul>
            </div>
          </div>
        </AppContainer>
      </div>

      {/* Content Section */}
      <AppContainer className="mt-16 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 flex flex-col gap-12">
          
          {/* Objectives */}
          <section>
            <h2 className="text-2xl font-bold font-heading mb-6">What you&apos;ll learn</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/20 p-6 rounded-3xl border border-border/50">
              {course.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-text-secondary leading-relaxed">{obj}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Curriculum */}
          <section>
            <h2 className="text-2xl font-bold font-heading mb-6">Course Content</h2>
            <div className="border border-border/50 rounded-3xl overflow-hidden bg-card">
              {course.sections.map((section, idx) => (
                <div key={section.id} className="border-b border-border/50 last:border-0">
                  <div className="p-5 bg-muted/30 font-bold flex justify-between items-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <span className="text-lg">{section.title}</span>
                    <span className="text-sm text-muted-foreground">{section.lessons.length} lessons</span>
                  </div>
                  <div className="p-2">
                    {section.lessons.map(lesson => (
                      <div key={lesson.id} className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-xl transition-colors">
                        <div className="flex items-center gap-3">
                          {lesson.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-primary" />
                          ) : (
                            <PlayCircle className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className={`text-sm ${lesson.completed ? 'text-text-secondary' : 'font-medium'}`}>{lesson.title}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Empty spacer for layout balance with floating card */}
        <div className="hidden lg:block w-[400px] shrink-0" />
      </AppContainer>
    </div>
  );
}