// src/features/learning/components/AskAiDialog.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, BotMessageSquare, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { AiAnswerRenderer } from '@/features/community/components/AiAnswerRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AskAiDialogProps {
  courseTitle: string;
  lessonTitle: string;
  onClose: () => void;
}

export function AskAiDialog({ courseTitle, lessonTitle, onClose }: AskAiDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `أهلاً بك يا بطل! أنا المساعد الذكي لمسارك. عندك أي سؤال في درس "${lessonTitle}" أو محتاج شرح مبسط لأي جزء؟` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMsg } as Message];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/learning/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          courseTitle,
          lessonTitle,
          history: messages,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'خطأ في الاتصال');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (e: any) {
      console.error(e);
      toast.error('حدث خطأ أثناء الاتصال بالمساعد الذكي.');
      setMessages(prev => [...prev, { role: 'assistant', content: 'للأسف واجهت مشكلة، يرجى المحاولة مرة أخرى لاحقاً.' }]);
    } finally {
      setIsLoading(false);
    }
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
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-surface shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <BotMessageSquare size={20} />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground leading-tight">المساعد الأكاديمي</h2>
              <p className="text-xs text-muted-foreground mt-1">يجيب عن أسئلة المنهج</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white ${msg.role === 'user' ? 'bg-primary' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'}`}>
                {msg.role === 'user' ? <span className="font-bold text-xs">طالب</span> : <BotMessageSquare size={16} />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground rounded-tl-sm' 
                  : 'bg-surface border border-border-subtle text-foreground rounded-tr-sm shadow-sm w-full overflow-hidden'
              }`}>
                {msg.role === 'user' ? (
                  <span className="whitespace-pre-wrap">{msg.content}</span>
                ) : (
                  <AiAnswerRenderer content={msg.content} />
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 shrink-0 flex items-center justify-center text-white">
                <BotMessageSquare size={16} />
              </div>
              <div className="p-4 rounded-2xl rounded-tr-sm bg-surface border border-border-subtle shadow-sm flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">المساعد يكتب... (قد يستغرق بعض الوقت)</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-surface border-t border-border/50 shrink-0">
          <div className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="اكتب سؤالك هنا..."
              className="w-full bg-background border border-border-subtle rounded-full pl-14 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-foreground"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute left-2 w-10 h-10 rounded-full flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
            >
              <Send size={18} className="-mr-1" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
