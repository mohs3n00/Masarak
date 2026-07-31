
'use client';

import React, { useState, useEffect } from 'react';
import { ConversationsApi } from '@/features/academic-conversations/api/conversations.api';
import { AcademicConversation } from '@/features/academic-conversations/types';
import { MessageCircle, Clock, CheckCircle, Archive } from 'lucide-react';
import { SplitViewLayout } from '@/features/academic-conversations/components/SplitViewLayout';
import { ConversationChatView } from '@/features/academic-conversations/components/ConversationChatView';

export default function StudentInboxPage() {
  const [conversations, setConversations] = useState<AcademicConversation[]>([]);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'ANSWERED' | 'ARCHIVED'>('OPEN');
  const [selectedConversation, setSelectedConversation] = useState<AcademicConversation | null>(null);

  useEffect(() => {
    loadConversations();
  }, [activeTab]);

  const loadConversations = async () => {
    try {
      const res = await ConversationsApi.getConversations({ status: activeTab });
      setConversations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden m-4 shadow-sm">
      
      {/* Conversation List Panel (Right) */}
      <div className="w-1/3 max-w-[350px] min-w-[280px] flex flex-col border-l border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 shrink-0">
        
        {/* Header & Filters */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 sticky top-0 z-10">
          <h2 className="text-xl font-bold mb-3">الأسئلة والمحادثات</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button 
              onClick={() => setActiveTab('OPEN')}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === 'OPEN' ? 'bg-primary text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'}`}
            >
              في انتظار الرد
            </button>
            <button 
              onClick={() => setActiveTab('ANSWERED')}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === 'ANSWERED' ? 'bg-green-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'}`}
            >
              تمت الإجابة
            </button>
            <button 
              onClick={() => setActiveTab('ARCHIVED')}
              className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${activeTab === 'ARCHIVED' ? 'bg-neutral-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300'}`}
            >
              الأرشيف
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-neutral-400 p-6 text-center">
              <MessageCircle size={40} className="mb-3 opacity-20" />
              <p className="text-sm">لا توجد رسائل حالياً</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {conversations.map(conv => (
                <div 
                  key={conv.id} 
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors group border-l-4 ${selectedConversation?.id === conv.id ? 'bg-primary/5 border-primary' : 'hover:bg-neutral-100 dark:hover:bg-neutral-800/50 border-transparent'}`}
                >
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0 font-bold text-sm">
                    {conv.teacher?.name?.[0] || 'م'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className={`text-sm truncate ${conv.unreadStudentCount > 0 ? 'font-bold text-neutral-900 dark:text-white' : 'font-semibold text-neutral-700 dark:text-neutral-300'}`}>
                        {conv.teacher?.name || 'مدرس مجهول'}
                      </h4>
                      <span className="text-[10px] text-neutral-400 shrink-0">
                        {new Date(conv.lastMessageAt || conv.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-primary mb-1 truncate">
                      {conv.course?.title || 'كورس غير معروف'}
                    </div>
                    <p className={`text-xs truncate ${conv.unreadStudentCount > 0 ? 'text-neutral-800 dark:text-neutral-200 font-medium' : 'text-neutral-500'}`}>
                      {conv.lessonSnapshot ? `بخصوص: ${conv.lessonSnapshot}` : 'استفسار عام'}
                    </p>
                  </div>
                  {conv.unreadStudentCount > 0 && (
                    <div className="w-2.5 h-2.5 bg-red-500 rounded-full self-center shrink-0 shadow-sm shadow-red-500/50"></div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat/Context Panel (Left) */}
      <div className="flex-1 bg-white dark:bg-neutral-950 relative overflow-hidden flex flex-col">
        {selectedConversation ? (
          <SplitViewLayout 
            conversation={selectedConversation}
            onClose={() => setSelectedConversation(null)}
            renderChat={<ConversationChatView conversationId={selectedConversation.id} />}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 bg-neutral-50 dark:bg-neutral-950">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-6">
              <MessageCircle size={48} className="text-neutral-300 dark:text-neutral-700" />
            </div>
            <h3 className="text-xl font-bold text-neutral-600 dark:text-neutral-400 mb-2">الأسئلة والمحادثات</h3>
            <p className="text-sm">اختر محادثة من القائمة لعرض الردود والمتابعة</p>
          </div>
        )}
      </div>

    </div>
  );
}
