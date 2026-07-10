'use client';

import React, { useState, useRef, useEffect } from 'react';
import { domToPng } from 'modern-screenshot';
import { Download } from 'lucide-react';
import { Button } from '@/shared/components/atoms/Button';
import { Input } from '@/shared/components/atoms/Input';
import { Textarea } from '@/shared/components/atoms/Textarea';
import { QuestionCardTemplate } from './QuestionCardTemplate';
import { apiClient } from '@/shared/api/api.client';

export function QuestionDesigner() {
  const [question, setQuestion] = useState('ما هي عاصمة مصر؟');
  const [options, setOptions] = useState(['القاهرة', 'الإسكندرية', 'الجيزة', 'أسوان']);
  const [questionNumber, setQuestionNumber] = useState('1');
  const [isExporting, setIsExporting] = useState(false);
  const [brandingConfig, setBrandingConfig] = useState<any[]>([]);
  
  const exportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(0.5);

  // Handle preview scaling to fit screen
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // 1080 is the native width. We want some padding.
        const scale = Math.min(1, (containerWidth - 32) / 1080);
        setPreviewScale(scale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Fetch Platform Branding
    apiClient.get('/public/platform-branding')
      .then(res => {
        if (res.data) setBrandingConfig(res.data);
      })
      .catch(console.error);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExport = async () => {
    if (!exportRef.current) return;
    try {
      setIsExporting(true);
      
      // ROOT FIX for `cssRules` SecurityError:
      // The browser natively throws a DOMException if any script (like modern-screenshot)
      // tries to read `.cssRules` of a cross-origin stylesheet (e.g. Browser Extensions, Google Fonts).
      // To completely prevent this without hiding it in try/catch, we temporarily detach
      // all cross-origin stylesheets from the DOM just before export, and restore them right after.
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const detachedLinks: { node: Element; parent: ParentNode; nextSibling: Node | null }[] = [];
      
      links.forEach(link => {
        const href = (link as HTMLLinkElement).href;
        // If it's a valid URL and doesn't start with our own origin, it's cross-origin!
        if (href && !href.startsWith(window.location.origin) && !href.startsWith('blob:')) {
          if (link.parentNode) {
            detachedLinks.push({ node: link, parent: link.parentNode, nextSibling: link.nextSibling });
            link.parentNode.removeChild(link);
          }
        }
      });

      const dataUrl = await domToPng(exportRef.current, {
        quality: 1,
        backgroundColor: '#ffffff',
        width: 1080,
        height: 1080,
        style: {
          transform: 'none',
        },
      });

      // Restore the detached cross-origin stylesheets
      detachedLinks.forEach(({ node, parent, nextSibling }) => {
        parent.insertBefore(node, nextSibling);
      });
      
      const link = document.createElement('a');
      link.download = `masarak-question-${questionNumber}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[calc(100vh-100px)]">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 flex flex-col gap-6 bg-card p-6 rounded-2xl border border-border shrink-0 h-fit">
        <div>
          <h2 className="text-xl font-bold mb-1">مصمم الأسئلة</h2>
          <p className="text-sm text-muted-foreground">صمم صورة احترافية لسؤالك لنشرها على وسائل التواصل</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">رقم السؤال</label>
            <Input 
              value={questionNumber}
              onChange={(e) => setQuestionNumber(e.target.value)}
              placeholder="مثال: 1"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold">نص السؤال</label>
            <Textarea 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="اكتب السؤال هنا..."
              className="resize-none h-24"
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-bold">الاختيارات</label>
            {options.map((opt, i) => (
              <Input 
                key={i}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                placeholder={`الاختيار ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex gap-3">
          <Button 
            className="flex-1 gap-2 font-bold" 
            size="lg"
            onClick={handleExport}
            loading={isExporting}
          >
            <Download className="w-5 h-5" />
            تحميل PNG
          </Button>
        </div>
      </div>

      {/* Preview Area */}
      <div 
        ref={containerRef}
        className="flex-1 bg-muted/30 rounded-2xl border border-border border-dashed flex items-center justify-center overflow-hidden min-h-[500px]"
      >
        <div 
          className="transition-transform duration-200 origin-center"
          style={{ transform: `scale(${previewScale})` }}
        >
          <div className="shadow-2xl ring-1 ring-black/5 pointer-events-none">
            <QuestionCardTemplate 
              question={question}
              options={options}
              questionNumber={questionNumber}
              brandingConfig={brandingConfig}
            />
          </div>
        </div>
      </div>

      {/* Off-screen actual size template for pristine export */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px' }}>
        <QuestionCardTemplate 
          ref={exportRef}
          question={question}
          options={options}
          questionNumber={questionNumber}
          brandingConfig={brandingConfig}
        />
      </div>
    </div>
  );
}
