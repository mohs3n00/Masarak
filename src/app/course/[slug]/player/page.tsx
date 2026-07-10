'use client';

import React, { useState } from 'react';
import { studentMockData } from '@/lib/mock-data/student-dashboard';
import { PlayCircle, CheckCircle2, Circle, Clock, FileText, Download, Bookmark, MessageSquare, ChevronLeft, Maximize, Settings, Volume2 } from 'lucide-react';
import Link from 'next/link';

export default function CoursePlayerPage() {
  const data = studentMockData.courseDetails;
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'downloads' | 'qa'>('overview');

  return (
    <div className="flex flex-col lg:flex-row h-screen max-h-screen bg-background overflow-hidden -m-6 sm:-m-8">
      {/* LEFT: Main Player Area */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
          <Link href={`/dashboard/student/course/${data.id}`} className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-5 h-5" /> Back to Course
          </Link>
          <div className="text-sm font-bold truncate px-4">{data.title}</div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold hover:bg-primary/20 transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Mark Complete
          </button>
        </div>

        {/* Video Player Mock */}
        <div className="w-full aspect-video bg-black relative flex items-center justify-center shrink-0 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
          <div className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center text-primary-foreground shadow-xl cursor-pointer hover:scale-110 transition-transform">
            <PlayCircle className="w-10 h-10 ml-1" />
          </div>

          {/* Player Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex items-center gap-4">
              <PlayCircle className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
              <Volume2 className="w-6 h-6 cursor-pointer hover:text-primary transition-colors" />
              <span className="text-sm font-medium">04:20 / 25:10</span>
            </div>
            <div className="flex items-center gap-4">
              <Settings className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
              <Maximize className="w-5 h-5 cursor-pointer hover:text-primary transition-colors" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-primary relative" style={{ width: '15%' }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm scale-0 group-hover:scale-100 transition-transform" />
            </div>
          </div>
        </div>

        {/* Player Tabs */}
        <div className="flex px-8 pt-6 border-b border-border bg-card shrink-0 gap-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'notes', label: 'My Notes' },
            { id: 'downloads', label: 'Downloads' },
            { id: 'qa', label: 'Q&A' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'notes' | 'downloads' | 'qa')}
              className={`pb-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 flex-1">
          {activeTab === 'overview' && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold font-heading mb-4">Differentiation Rules</h2>
              <p className="text-text-secondary leading-relaxed mb-8">
                In this lesson, we will cover the core differentiation rules including the power rule, product rule, and quotient rule. We will solve several examples to master these techniques which are essential for the rest of the calculus course.
              </p>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-muted/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {data.teacher.avatar ? (
                  <img src={data.teacher.avatar} alt={data.teacher.name} className="w-12 h-12 rounded-full border border-border object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center bg-muted text-muted-foreground">
                    <span className="font-bold text-xs">{data.teacher.name.substring(0, 2)}</span>
                  </div>
                )}
                <div>
                  <div className="font-bold">{data.teacher.name}</div>
                  <div className="text-xs text-muted-foreground">{data.teacher.role}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="max-w-3xl">
              <div className="flex gap-4 mb-6">
                <input type="text" placeholder="Add a note at 04:20..." className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-primary/90 transition-colors">Save</button>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-border/50 bg-muted/20 flex gap-4">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold shrink-0 h-fit">02:15</span>
                  <p className="text-sm">Power rule only applies to polynomial terms. Don&apos;t forget!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.attachments.map(att => (
                <div key={att.id} className="p-4 rounded-2xl border border-border/50 flex items-center justify-between hover:border-primary/30 transition-colors group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm leading-tight">{att.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{att.size}</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'qa' && (
            <div className="max-w-3xl flex flex-col items-center justify-center py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-bold text-lg mb-2">No questions yet</h3>
              <p className="text-sm text-text-secondary mb-6">Be the first to ask a question about this lesson.</p>
              <button className="px-6 py-2.5 rounded-full border border-border font-bold text-sm hover:bg-muted transition-colors">Ask a Question</button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Sidebar Curriculum */}
      <div className="w-full lg:w-80 xl:w-96 border-l border-border bg-card flex flex-col shrink-0 h-[50vh] lg:h-full">
        <div className="p-4 border-b border-border shrink-0">
          <h2 className="font-bold font-heading text-lg mb-2">Course Curriculum</h2>
          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
            <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${data.progress}%` }} />
            </div>
            <span>{data.progress}%</span>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {data.sections.map((section, idx) => (
            <div key={section.id} className="border-b border-border/50 last:border-0">
              <div className="p-4 bg-muted/30 font-bold text-sm flex items-center justify-between">
                {section.title}
                <span className="text-xs font-medium text-muted-foreground">{section.lessons.filter(l => l.completed).length}/{section.lessons.length}</span>
              </div>
              <div>
                {section.lessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    className={`flex items-start gap-3 p-4 border-l-2 transition-colors cursor-pointer ${lesson.isCurrent ? 'border-primary bg-primary/5' : 'border-transparent hover:bg-muted/50'} ${lesson.locked ? 'opacity-50 pointer-events-none' : ''}`}
                  >
                    <div className="mt-0.5">
                      {lesson.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : lesson.isCurrent ? (
                        <PlayCircle className="w-5 h-5 text-primary" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`text-sm ${lesson.isCurrent ? 'font-bold text-foreground' : 'font-medium text-text-secondary'}`}>
                        {lesson.title}
                      </span>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {lesson.duration}</span>
                        {lesson.type === 'quiz' && <span className="bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Quiz</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
