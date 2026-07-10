'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Files, BookOpen, Save } from 'lucide-react';
import { LessonMedia } from '@/types/models';
import { ResourcesPanel } from './ResourcesPanel';
import { apiClient } from '@/shared/api/api.client';
import dynamic from 'next/dynamic';

const MasarakPdfViewer = dynamic(
  () => import('@/features/media/components/PdfViewer/MasarakPdfViewer').then((mod) => mod.MasarakPdfViewer),
  { ssr: false, loading: () => <div className="w-full h-[600px] flex items-center justify-center bg-muted animate-pulse rounded-xl text-muted-foreground">جاري التحميل...</div> }
);

interface LessonTabsProps {
  lessonId?: string;
  resources: LessonMedia[];
  onSelectResource: (resource: LessonMedia) => void;
}

export function LessonTabs({ lessonId, resources, onSelectResource }: LessonTabsProps) {
  const pdfResources = resources.filter(r => r.type === 'PDF');
  const otherResources = resources.filter(r => r.type !== 'PDF' && r.type !== 'VIDEO');

  // Notes State
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('notes');

  // Load note on mount
  useEffect(() => {
    if (!lessonId) return;
    
    // Reset state when switching lessons
    setNoteContent('');
    setLastSaved(null);
    setIsSaving(false);
    
    // Set initial active tab based on resources
    if (pdfResources.length > 0) {
      setActiveTab('pdf');
    } else if (otherResources.length > 0) {
      setActiveTab('files');
    } else {
      setActiveTab('notes');
    }

    let isMounted = true;
    apiClient.get(`/student/lessons/${lessonId}/note`)
      .then((res) => {
        if (isMounted && res.data?.content) {
          setNoteContent(res.data.content);
        }
      })
      .catch((err) => {
        if (err.response?.status !== 404) {
          console.error("Error loading note:", err);
        }
      });
      
    return () => { isMounted = false; };
  }, [lessonId]);

  // Handle note change with debounce save
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setNoteContent(newContent);
    setIsSaving(true);

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (!lessonId) return;
      apiClient.post(`/student/lessons/${lessonId}/note`, { content: newContent })
        .then(() => {
          setLastSaved(new Date());
          setIsSaving(false);
        })
        .catch((err) => {
          console.error("Error saving note:", err);
          setIsSaving(false);
        });
    }, 1500); // Save after 1.5s of typing stop
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start h-auto p-0 bg-muted/30 border-b border-border rounded-none flex-wrap">
          {otherResources.length > 0 && (
            <TabsTrigger 
              value="files" 
              className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
            >
              <Files className="w-4 h-4" />
              <span>المرفقات</span>
            </TabsTrigger>
          )}
          
          {pdfResources.length > 0 && (
            <TabsTrigger 
              value="pdf" 
              className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>المذكرة (PDF)</span>
            </TabsTrigger>
          )}

          <TabsTrigger 
            value="notes" 
            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>ملاحظاتي</span>
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          {otherResources.length > 0 && (
            <TabsContent value="files" className="mt-0 outline-none">
              <div className="-mt-6">
                <ResourcesPanel resources={otherResources} onSelectResource={onSelectResource} />
              </div>
            </TabsContent>
          )}

          {pdfResources.length > 0 && (
            <TabsContent value="pdf" className="mt-0 outline-none">
              <div className="flex flex-col gap-8">
                {pdfResources.map(pdf => (
                  <div key={pdf.id}>
                    <h3 className="font-bold text-lg mb-4">{pdf.title}</h3>
                    <MasarakPdfViewer url={pdf.url} className="h-[700px] w-full" />
                  </div>
                ))}
              </div>
            </TabsContent>
          )}

          <TabsContent value="notes" className="mt-0 outline-none">
             <div className="flex flex-col gap-4">
                <textarea 
                  value={noteContent}
                  onChange={handleNoteChange}
                  className="w-full h-40 bg-muted/50 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" 
                  placeholder="اكتب ملاحظاتك هنا أثناء المشاهدة... (سيتم حفظها تلقائياً)"
                />
                
                <div className="flex justify-end items-center text-xs text-muted-foreground gap-2">
                  {isSaving ? (
                    <span className="flex items-center gap-1 animate-pulse">
                      <Save className="w-3 h-3" /> جاري الحفظ...
                    </span>
                  ) : lastSaved ? (
                    <span className="flex items-center gap-1 text-primary">
                      <Save className="w-3 h-3" /> تم الحفظ في {lastSaved.toLocaleTimeString('ar-EG')}
                    </span>
                  ) : null}
                </div>
             </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
