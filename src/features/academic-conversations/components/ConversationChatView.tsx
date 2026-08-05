'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AcademicConversation, AcademicMessage } from '../types';
import { ConversationsApi } from '../api/conversations.api';
import { Send, Loader2, Paperclip, X, Image as ImageIcon } from 'lucide-react';
import { ImageUploader } from '@/shared/components/ui/ImageUploader';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useSocket } from '../hooks/useSocket';
import { toast } from 'sonner';
import { useCallback } from 'react';

interface ConversationChatViewProps {
  conversationId: string;
  readOnly?: boolean;
}

export function ConversationChatView({ conversationId, readOnly = false }: ConversationChatViewProps) {
  const [conversation, setConversation] = useState<AcademicConversation | null>(null);
  const [messages, setMessages] = useState<AcademicMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const currentUser = useAuthStore(s => s.user);
  const token = useAuthStore(s => s.accessToken);
  const socket = useSocket(token || '');

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = (data: AcademicMessage) => {
      if (data.conversationId === conversationId) {
        setMessages(prev => {
          if (prev.find(m => m.id === data.id)) return prev;
          return [...prev, data];
        });
        setTimeout(scrollToBottom, 100);
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, conversationId, scrollToBottom]);

  const loadConversation = async () => {
    try {
      const res = await ConversationsApi.getConversation(conversationId);
      setConversation(res.data);
      if (res.data.messages) {
        setMessages(res.data.messages);
      }
      setIsLoading(false);
      setTimeout(scrollToBottom, 100);
    } catch (e: any) {
      if (e?.status !== 404) {
        console.error('Failed to load conversation:', e);
      }
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    setIsSending(true);
    try {
      const res = await ConversationsApi.sendMessage(conversationId, {
        content: inputValue || 'تم إرسال مرفق',
        attachments,
      });
      // Do not append manually, wait for the socket event to prevent duplicate messages if possible,
      // or append and rely on deduplication in the socket handler.
      setMessages(prev => {
        if (prev.find(m => m.id === res.data.id)) return prev;
        return [...prev, res.data];
      });
      setInputValue('');
      setAttachments([]);
      setShowUploader(false);
      setTimeout(scrollToBottom, 100);
    } catch (e) {
      console.error(e);
      toast.error('فشل إرسال الرسالة');
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary/50" /></div>;
  }

  if (!conversation) {
    return <div className="h-full flex items-center justify-center text-muted-foreground">حدث خطأ في تحميل المحادثة</div>;
  }

  return (
    <div className="flex flex-col h-full bg-background" dir="rtl">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser?.id;
          
          return (
            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                
                <div 
                  className={`p-3 rounded-2xl ${
                    isMe 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  
                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2">
                      {msg.attachments.map(att => (
                        att.type === 'IMAGE' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={att.id} src={att.url} alt="مرفق" className="rounded-xl max-h-48 object-cover border border-black/10" />
                        ) : (
                          <a key={att.id} href={att.url} target="_blank" rel="noreferrer" className="text-xs underline flex items-center gap-1">
                            <Paperclip className="w-3 h-3" /> تحميل المرفق
                          </a>
                        )
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 mt-1 mx-1">
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(msg.sentAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {msg.metadata?.videoTimestamp !== undefined && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-sm">
                      الدقيقة {Math.floor(msg.metadata.videoTimestamp / 60)}:{(msg.metadata.videoTimestamp % 60).toString().padStart(2, '0')}
                    </span>
                  )}
                </div>
                
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!readOnly && (
        <div className="p-4 border-t border-border bg-card">
        
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-3">
            {attachments.map((att, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={att.url} alt="مرفق" className="w-16 h-16 object-cover rounded-lg border border-border" />
                <button 
                  onClick={() => setAttachments(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Uploader */}
        {showUploader && (
          <div className="mb-3 p-3 bg-muted/50 rounded-xl border border-border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-muted-foreground">رفع صورة</span>
              <button onClick={() => setShowUploader(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
            </div>
            <ImageUploader
              folder="masarak/attachments"
              aspectRatio="video"
              onUploadSuccess={(res) => {
                setAttachments(prev => [...prev, {
                  url: res.url,
                  type: 'IMAGE',
                  name: res.publicId,
                  mimeType: `image/${res.format || 'jpeg'}`,
                  sizeBytes: 0
                }]);
                setShowUploader(false);
              }}
            />
          </div>
        )}

        <div className="flex gap-2 items-end">
          <button 
            onClick={() => setShowUploader(!showUploader)}
            className="p-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors shrink-0 mb-1"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          
          <textarea 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 bg-muted/50 border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none max-h-32 min-h-[44px] overflow-hidden"
            rows={1}
          />
          
          <button 
            onClick={handleSend}
            disabled={isSending || (!inputValue.trim() && attachments.length === 0)}
            className="p-3 bg-primary text-primary-foreground rounded-xl shadow-md hover:shadow-lg disabled:opacity-50 transition-all shrink-0 mb-1"
          >
            {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 rtl:-scale-x-100" />}
          </button>
        </div>
        </div>
      )}
    </div>
  );
}
