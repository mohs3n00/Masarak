
'use client';

import React, { useState } from 'react';
import { X, PlayCircle, FileText, Trash2 } from 'lucide-react';
import { AcademicConversation } from '../types';
import { MasarakPlayer } from '@/features/media/components/VideoPlayer/MasarakPlayer';

interface SplitViewLayoutProps {
  conversation: AcademicConversation;
  onClose: () => void;
  renderChat: React.ReactNode;
  onDelete?: () => void;
}

export function SplitViewLayout({ conversation, onClose, renderChat, onDelete }: SplitViewLayoutProps) {
  const [showRightPanel, setShowRightPanel] = useState(false);

  const hasMediaContext = conversation.contextType === 'VIDEO' || conversation.contextType === 'PDF';
  
  const videoInfo = conversation.lesson?.videos?.find(v => v.id === conversation.videoId) || conversation.lesson?.videos?.[0];
  const videoUrl = videoInfo?.videoUrl;

  return (
    <div className="flex h-full bg-white dark:bg-neutral-900 overflow-hidden relative">
      
      {/* Left Panel: Chat (Always visible) */}
      <div className={`flex-1 flex flex-col h-full border-r border-neutral-200 dark:border-neutral-800 transition-all duration-300 ${showRightPanel && hasMediaContext ? 'lg:w-1/2 max-w-[50%]' : 'w-full'}`}>
        <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
              <X size={20} className="text-neutral-500" />
            </button>
            <div>
              <h3 className="font-semibold text-lg">{conversation.student?.name || 'محادثة'}</h3>
              <p className="text-xs text-neutral-500">{conversation.course?.title}</p>
            </div>
          </div>
          
          {hasMediaContext && !showRightPanel && (
            <button 
              onClick={() => setShowRightPanel(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-lg hover:bg-primary/20 transition-colors"
            >
              {conversation.contextType === 'VIDEO' ? <PlayCircle size={16} /> : <FileText size={16} />}
              <span>فتح المحتوى المرفق</span>
            </button>
          )}
          {onDelete && (
            <button 
              onClick={() => {
                if (window.confirm('هل أنت متأكد من حذف هذه المحادثة بالكامل؟')) {
                  onDelete();
                }
              }}
              className="p-2 ml-2 hover:bg-red-50 text-red-500 rounded-full transition-colors"
              title="حذف المحادثة"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-hidden">
          {renderChat}
        </div>
      </div>

      {/* Right Panel: Context Media (Video/PDF) */}
      {hasMediaContext && showRightPanel && (
        <div className="w-1/2 h-full bg-neutral-950 flex flex-col animate-in slide-in-from-right-8 duration-300">
          <div className="h-14 border-b border-neutral-800 flex items-center justify-between px-4 bg-neutral-900 text-neutral-200">
            <div className="flex items-center gap-2 text-sm font-medium">
              {conversation.contextType === 'VIDEO' ? <PlayCircle size={18} className="text-primary" /> : <FileText size={18} className="text-red-500" />}
              <span>{conversation.videoSnapshot || conversation.lessonSnapshot || 'محتوى الدورة'}</span>
              
              {conversation.videoTimestamp !== undefined && (
                <span className="bg-neutral-800 px-2 py-0.5 rounded text-xs ml-2">
                  الدقيقة {Math.floor(conversation.videoTimestamp / 60)}:{(conversation.videoTimestamp % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
            <button 
              onClick={() => setShowRightPanel(false)}
              className="p-1.5 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 relative flex items-center justify-center p-4">
            {conversation.contextType === 'VIDEO' && videoUrl ? (
              <div className="w-full h-auto max-h-[80vh] bg-black rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex items-center justify-center">
                <MasarakPlayer 
                  src={videoUrl}
                  courseName={conversation.course?.title}
                  initialDuration={conversation.videoTimestamp || 0}
                />
              </div>
            ) : conversation.contextType === 'VIDEO' ? (
              <div className="w-full aspect-video bg-black rounded-xl border border-neutral-800 flex items-center justify-center shadow-2xl">
                <div className="text-center text-neutral-500 flex flex-col items-center">
                  <PlayCircle size={48} className="mb-4 opacity-50 text-red-500" />
                  <p>لا يمكن تشغيل الفيديو</p>
                  <p className="text-sm mt-2 opacity-75">الفيديو غير متوفر في قاعدة البيانات أو تم حذفه</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center shadow-2xl overflow-hidden p-4">
                 <div className="w-full h-full border-2 border-dashed border-neutral-700 rounded-lg flex flex-col items-center justify-center text-neutral-500">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>معاينة ملف PDF غير متوفرة حالياً</p>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
