'use client';

import { useApi } from '@/lib/providers/ApiProvider';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { DataStateWrapper } from '@/features/student-experience/components/DataStateWrapper';
import { PlayCircle, FileText, FileQuestion, Download, Star, Info, CheckCircle2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function CourseDetailsPreview() {
  const { dataState } = useApi();
  const course = dataState === 'empty' ? null : studentMockData.courseDetails;

  return (
    <div className="max-w-7xl mx-auto w-full flex flex-col gap-6 relative">
      <DataStateWrapper emptyMessage="Course not found or you do not have access.">
        {course && (
          <>
            {/* Hero Section */}
            <div className="bg-card border border-border rounded-3xl overflow-hidden relative isolate">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent pointer-events-none" />
              <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-start relative z-10">
                <div className="flex-1 flex flex-col gap-4">
                  <h1 className="text-3xl md:text-4xl font-heading font-bold">{course.title}</h1>
                  <p className="text-text-secondary leading-relaxed max-w-2xl">{course.description}</p>
                  
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full border border-border">
                      <img src={course.teacher.avatar} alt={course.teacher.name} className="w-8 h-8 rounded-full ring-2 ring-primary/20" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold leading-none">{course.teacher.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="w-full md:w-72 bg-background border border-border rounded-2xl p-6 shrink-0 shadow-sm">
                  <div className="text-sm text-text-secondary mb-2 flex justify-between">
                    <span>Course Progress</span>
                    <span className="font-bold text-foreground">{course.progress}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden mb-6">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${course.progress}%` }} />
                  </div>
                  <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary-hover transition-colors shadow-primary/25 shadow-lg flex justify-center items-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    Resume Learning
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Main Content (Syllabus) */}
              <div className="flex-1 flex flex-col gap-8 w-full">
                <section>
                  <h2 className="text-2xl font-bold mb-4 font-heading">Course Syllabus</h2>
                  <div className="flex flex-col gap-4">
                    {course.sections.map(section => (
                      <div key={section.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-4 bg-muted/30 font-bold text-lg border-b border-border flex justify-between items-center">
                          {section.title}
                          <span className="text-xs font-normal text-text-secondary bg-background px-2 py-1 rounded border border-border">
                            {section.lessons.length} Lessons
                          </span>
                        </div>
                        <div className="flex flex-col divide-y divide-border/50">
                          {section.lessons.map(lesson => (
                            <div key={lesson.id} className={cn(
                              "p-4 flex items-center justify-between transition-colors",
                              lesson.isCurrent ? "bg-primary/5" : "hover:bg-muted/30"
                            )}>
                              <div className="flex items-center gap-4">
                                {lesson.completed ? (
                                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                ) : lesson.locked ? (
                                  <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                                ) : lesson.type === 'video' ? (
                                  <PlayCircle className="w-5 h-5 text-blue-500 shrink-0" />
                                ) : (
                                  <FileQuestion className="w-5 h-5 text-orange-500 shrink-0" />
                                )}
                                
                                <span className={cn(
                                  "font-medium",
                                  lesson.completed ? "text-text-secondary" : lesson.locked ? "text-muted-foreground" : "text-foreground",
                                  lesson.isCurrent && "font-bold text-primary"
                                )}>
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="text-sm text-text-secondary font-mono bg-muted px-2 py-0.5 rounded">
                                {lesson.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sticky Sidebar */}
              <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0 lg:sticky top-24">
                
                {/* Requirements */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" /> Requirements
                  </h3>
                  <ul className="list-disc pl-5 text-sm text-text-secondary flex flex-col gap-2">
                    {course.requirements.map((req, i) => <li key={i}>{req}</li>)}
                  </ul>
                </div>

                {/* Attachments */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Download className="w-5 h-5 text-primary" /> Attachments
                  </h3>
                  <div className="flex flex-col gap-3">
                    {course.attachments.map(att => (
                      <button key={att.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">{att.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{att.size}</span>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}
      </DataStateWrapper>
    </div>
  );
}
