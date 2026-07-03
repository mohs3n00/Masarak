'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FileText, Files, PenTool, FileQuestion, BookOpen, MessageCircle } from 'lucide-react';
import { LessonMedia } from '@/types/models';
import { ResourcesPanel } from './ResourcesPanel';
import { MasarakPdfViewer } from '@/features/media/components/PdfViewer/MasarakPdfViewer';

interface LessonTabsProps {
  resources: LessonMedia[];
  onSelectResource: (resource: LessonMedia) => void;
}

export function LessonTabs({ resources, onSelectResource }: LessonTabsProps) {
  const pdfResources = resources.filter(r => r.type === 'PDF');
  const otherResources = resources.filter(r => r.type !== 'PDF' && r.type !== 'VIDEO');

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="w-full justify-start h-auto p-0 bg-muted/30 border-b border-border rounded-none flex-wrap">
          <TabsTrigger 
            value="files" 
            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
          >
            <Files className="w-4 h-4" />
            <span>المرفقات</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="pdf" 
            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>المذكرة (PDF)</span>
          </TabsTrigger>

          <TabsTrigger 
            value="homework" 
            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            <span>الواجب</span>
          </TabsTrigger>

          <TabsTrigger 
            value="quiz" 
            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
          >
            <FileQuestion className="w-4 h-4" />
            <span>اختبار الحصة</span>
          </TabsTrigger>

          <TabsTrigger 
            value="notes" 
            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>ملاحظاتي</span>
          </TabsTrigger>

          <TabsTrigger 
            value="discussion" 
            className="rounded-none data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-6 py-4 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>النقاشات</span>
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="files" className="mt-0 outline-none">
            {otherResources.length > 0 ? (
              <div className="-mt-6">
                 {/* Reusing ResourcesPanel but stripping the top border/title since we are in a tab */}
                <ResourcesPanel resources={otherResources} onSelectResource={onSelectResource} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12">
                لا توجد مرفقات إضافية لهذه المحاضرة.
              </div>
            )}
          </TabsContent>

          <TabsContent value="pdf" className="mt-0 outline-none">
             {pdfResources.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {pdfResources.map(pdf => (
                    <div key={pdf.id}>
                      <h3 className="font-bold text-lg mb-4">{pdf.title}</h3>
                      <MasarakPdfViewer url={pdf.url} className="h-[700px] w-full" />
                    </div>
                  ))}
                </div>
             ) : (
               <div className="text-center text-muted-foreground py-12">
                 لا يوجد ملف PDF مرفق لهذه المحاضرة.
               </div>
             )}
          </TabsContent>

          <TabsContent value="homework" className="mt-0 outline-none">
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
               <PenTool className="w-12 h-12 text-muted-foreground/30" />
               <p>سيتم فتح الواجب بعد إكمال مشاهدة الفيديو.</p>
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-0 outline-none">
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
               <FileQuestion className="w-12 h-12 text-muted-foreground/30" />
               <p>اختبار الحصة غير متاح حالياً.</p>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-0 outline-none">
             <div className="flex flex-col gap-4">
                <textarea 
                  className="w-full h-40 bg-muted/50 border border-border rounded-xl p-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" 
                  placeholder="اكتب ملاحظاتك هنا أثناء المشاهدة... (سيتم حفظها تلقائياً)"
                ></textarea>
             </div>
          </TabsContent>

          <TabsContent value="discussion" className="mt-0 outline-none">
             <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
               <MessageCircle className="w-12 h-12 text-muted-foreground/30" />
               <p>قسم النقاشات والأسئلة قريباً.</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
