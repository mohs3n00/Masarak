'use client';

import React, { useState } from 'react';
import { ConversationsApi } from '../api/conversations.api';
import { X, Send, Paperclip, Loader2, PlayCircle, FileText, HelpCircle, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from '@/shared/components/ui/ImageUploader';
import { ConversationChatView } from './ConversationChatView';
import { toast } from 'sonner';

interface AskTeacherDialogProps {
  courseId: string;
  lessonId?: string;
  videoId?: string;
  teacherId: string;
  contextType: string;
  videoTimestamp?: number;
  pdfPage?: number;
  onClose: () => void;
}

export function AskTeacherDialog({ onClose, ...context }: AskTeacherDialogProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  React.useEffect(() => {
    const checkExisting = async () => {
      try {
        const res = await ConversationsApi.getConversations({
          courseId: context.courseId,
          ...(context.videoId ? { videoId: context.videoId } : {}),
          ...(context.lessonId && !context.videoId ? { lessonId: context.lessonId } : {}),
          ...(context.contextType === 'GENERAL' ? { contextType: 'GENERAL' } : {})
        });
        
        if (res.data && res.data.length > 0) {
          // Open the most recent one
          setActiveConversationId(res.data[0].id);
        }
      } catch (e) {
        console.error('Failed to check existing conversations', e);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkExisting();
  }, [context.courseId, context.videoId, context.lessonId, context.contextType]);

  const handleSend = async () => {
    if (!message.trim() && attachments.length === 0) return;
    setIsLoading(true);
    try {
      const res = await ConversationsApi.createConversation({
        ...context,
        videoTimestamp: context.videoTimestamp ? Math.round(context.videoTimestamp) : undefined,
        initialMessage: message || 'تم إرسال مرفق',
        attachments: attachments,
      });
      toast.success('تم إرسال سؤالك للمعلم بنجاح!', { icon: '📨' });
      setActiveConversationId(res.data.id);
    } catch (e) {
      console.error('Error starting conversation', e);
      toast.error('حدث خطأ أثناء إرسال رسالتك، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const getContextIcon = () => {
    if (context.contextType === 'VIDEO') return <PlayCircle className="w-4 h-4 text-primary" />;
    if (context.contextType === 'PDF') return <FileText className="w-4 h-4 text-primary" />;
    return <HelpCircle className="w-4 h-4 text-primary" />;
  };

  const getContextLabel = () => {
    if (context.contextType === 'VIDEO') {
      const minutes = Math.floor((context.videoTimestamp || 0) / 60);
      const seconds = Math.floor((context.videoTimestamp || 0) % 60);
      return `فيديو (الدقيقة ${minutes}:${seconds.toString().padStart(2, '0')})`;
    }
    if (context.contextType === 'PDF') return `ملف PDF (صفحة ${context.pdfPage})`;
    return 'سؤال عام';
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div 
        className="fixed inset-y-0 left-0 z-[101] w-full sm:w-[450px] bg-card shadow-2xl flex flex-col border-r border-border/50 animate-in slide-in-from-left-full duration-300 ease-out"
        dir="rtl"
      >
        {isChecking ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
          </div>
        ) : activeConversationId ? (
          <>
            <div className="h-16 border-b border-border flex items-center justify-between px-6 bg-muted/10 shrink-0">
               <h3 className="font-bold text-lg text-foreground">محادثة المعلم</h3>
               <button 
                 onClick={onClose} 
                 className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
               >
                 <X className="w-4 h-4" />
               </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <ConversationChatView conversationId={activeConversationId} />
            </div>
          </>
        ) : (
          <>
            {/* Decorative Header */}
        <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-border px-6 py-8">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shadow-inner shadow-primary/20 ring-1 ring-primary/20 shrink-0">
                <span className="text-3xl">💬</span>
              </div>
              <div>
                <h3 className="font-bold text-2xl text-foreground mb-1">سؤال للمعلم</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  سيتم إرفاق جزء المحتوى الحالي تلقائياً لتوضيح السياق
                </p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
          
          {/* Context Preview Bubble */}
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
            <div className="w-10 h-10 rounded-full bg-background shadow-sm flex items-center justify-center border border-border/50 shrink-0">
              {getContextIcon()}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">المحتوى المرفق</span>
              <span className="text-sm font-semibold text-foreground">{getContextLabel()}</span>
            </div>
          </div>

          {/* Text Area */}
          <div className="relative group">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب سؤالك هنا بوضوح وسيقوم المعلم بالرد عليك في أقرب وقت..."
              className="w-full min-h-[140px] p-4 rounded-2xl bg-background border-2 border-border/50 hover:border-primary/30 focus:border-primary outline-none resize-none transition-all duration-300 text-sm leading-relaxed shadow-sm focus:shadow-md"
            />
            
            {/* Attachment Button inside textarea (bottom left) */}
            <button 
              type="button"
              onClick={() => setShowUploader(!showUploader)}
              className={`absolute bottom-3 left-3 p-2 rounded-xl transition-all duration-200 flex items-center gap-2 ${showUploader || attachments.length > 0 ? 'bg-primary/10 text-primary' : 'bg-muted hover:bg-muted-foreground/10 text-muted-foreground hover:text-foreground'}`}
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-xs font-bold">{attachments.length > 0 ? 'تم إرفاق صورة' : 'إرفاق صورة'}</span>
            </button>
          </div>

          {/* Image Uploader */}
          {showUploader && attachments.length === 0 && (
            <div className="animate-in slide-in-from-top-2 duration-300">
              <ImageUploader
                folder="masarak/attachments"
                aspectRatio="video"
                onUploadSuccess={(res) => {
                  setAttachments([{
                    url: res.url,
                    type: 'IMAGE',
                    name: res.publicId,
                    mimeType: `image/${res.format || 'jpeg'}`,
                    sizeBytes: 0
                  }]);
                  toast.success('تم إرفاق الصورة بنجاح');
                }}
              />
            </div>
          )}

          {/* Preview Uploaded Image */}
          {attachments.length > 0 && (
            <div className="relative w-max group animate-in zoom-in duration-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={attachments[0].url} alt="مرفق" className="h-24 w-auto object-cover rounded-xl border border-border shadow-sm" />
              <button 
                onClick={() => setAttachments([])}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:scale-110"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-background/50 backdrop-blur flex justify-end gap-3 mt-auto">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all active:scale-95"
          >
            إلغاء
          </button>
          <button 
            onClick={handleSend}
            disabled={isLoading || (!message.trim() && attachments.length === 0)}
            className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all active:scale-95"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rtl:-scale-x-100" />}
            <span>إرسال السؤال</span>
          </button>
        </div>

          </>
        )}
      </div>
    </>
  );
}
