
'use client';

import React, { useState, useEffect } from 'react';
import { ConversationsApi } from '@/features/academic-conversations/api/conversations.api';
import { AcademicConversation } from '@/features/academic-conversations/types';
import { Search, Lock, Unlock, Download, ShieldAlert, BarChart3, Users, BookOpen } from 'lucide-react';

export default function AdminConversationsDashboard() {
  const [conversations, setConversations] = useState<AcademicConversation[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    // In a real app, this would be fetched from the admin endpoints we just created
    // e.g. ConversationsApi.getAdminAnalytics() and ConversationsApi.getAdminConversations()
    
    // Mocking analytics for scaffolding
    setAnalytics({
      totalQuestions: 154,
      avgFirstResponseTime: '14 دقيقة',
      avgCloseTime: 'ساعتين و النصف',
      questionsPerCourse: [
        { courseId: 'c1', title: 'الفيزياء', _count: 45 },
        { courseId: 'c2', title: 'الرياضيات', _count: 32 }
      ],
      activeStudents: [
        { studentId: 's1', name: 'أحمد محمود', _count: 12 },
        { studentId: 's2', name: 'سارة خالد', _count: 9 }
      ],
      lessonQuestions: [
        { lessonSnapshot: 'قوانين نيوتن', _count: 20 },
        { lessonSnapshot: 'التفاضل والتكامل', _count: 15 }
      ]
    });
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-readex">لوحة الإدارة: المحادثات الأكاديمية</h1>
          <p className="text-neutral-500 mt-1">مراقبة، تحليلات، وإدارة (Moderation)</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors">
            <Download size={18} />
            تصدير البيانات
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm font-medium">إجمالي الأسئلة</p>
                <h3 className="text-2xl font-bold mt-1">{analytics.totalQuestions}</h3>
              </div>
              <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <BarChart3 size={20} />
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm font-medium">متوسط أول رد</p>
                <h3 className="text-2xl font-bold mt-1">{analytics.avgFirstResponseTime}</h3>
              </div>
              <div className="p-2 bg-green-500/10 text-green-600 rounded-lg">
                <ClockIcon size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm font-medium">أكثر الدروس أسئلة</p>
                <h3 className="text-lg font-bold mt-1 line-clamp-1">{analytics.lessonQuestions[0]?.lessonSnapshot}</h3>
              </div>
              <div className="p-2 bg-orange-500/10 text-orange-600 rounded-lg">
                <BookOpen size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-5 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-neutral-500 text-sm font-medium">أكثر الطلاب تفاعلاً</p>
                <h3 className="text-lg font-bold mt-1 truncate">{analytics.activeStudents[0]?.name}</h3>
              </div>
              <div className="p-2 bg-purple-500/10 text-purple-600 rounded-lg">
                <Users size={20} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Panel */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800 overflow-hidden mt-6">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900/50">
          <h2 className="font-bold flex items-center gap-2">
            <ShieldAlert size={20} className="text-primary" />
            سجل المراقبة (Audit Log) & المحادثات
          </h2>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="بحث شامل..." 
              className="pl-4 pr-10 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full text-sm outline-none w-64 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="p-12 text-center text-neutral-500">
          <ShieldAlert size={48} className="mx-auto mb-4 opacity-20" />
          <p>لوحة التحكم بالرسائل. من هنا يمكن للإدارة قفل أو إعادة فتح المحادثات للمراقبة.</p>
        </div>
      </div>
    </div>
  );
}

function ClockIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
