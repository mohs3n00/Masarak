'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Download } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface MasarakPdfViewerProps {
  url: string;
  className?: string;
  onLoadSuccess?: (numPages: number) => void;
}

export function MasarakPdfViewer({ url, className, onLoadSuccess }: MasarakPdfViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [error, setError] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setError(null);
    onLoadSuccess?.(numPages);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF Load Error:', error);
    setError('تعذر تحميل ملف الـ PDF. يرجى التحقق من اتصالك بالإنترنت أو صلاحيات الملف.');
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => 
      Math.min(Math.max(1, prevPageNumber + offset), numPages)
    );
  };

  const changeScale = (offset: number) => {
    setScale(prevScale => Math.min(Math.max(0.5, prevScale + offset), 3.0));
  };

  return (
    <div 
      className={cn("flex flex-col bg-muted/30 border border-border rounded-xl overflow-hidden", className)}
      onContextMenu={(e) => e.preventDefault()} // Prevent easy downloading via right click
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-card border-b border-border shadow-sm">
        <div className="flex items-center gap-2" dir="ltr">
          <Button 
            variant="outline" 
            size="icon-sm" 
            onClick={() => changePage(-1)} 
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium px-2 text-foreground">
            {pageNumber} / {numPages || '-'}
          </span>
          <Button 
            variant="outline" 
            size="icon-sm" 
            onClick={() => changePage(1)} 
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => changeScale(-0.2)} title="تصغير">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs font-mono text-muted-foreground w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button variant="ghost" size="icon-sm" onClick={() => changeScale(0.2)} title="تكبير">
            <ZoomIn className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer" 
            download 
            className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
            title="تنزيل الملف"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto bg-black/5 dark:bg-black/20 relative flex justify-center py-6 custom-scrollbar min-h-[600px]">
        {error ? (
          <div className="text-error font-medium p-6 text-center">{error}</div>
        ) : (
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground h-full absolute inset-0">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span>جاري تحميل الملف...</span>
              </div>
            }
            className="flex flex-col items-center drop-shadow-xl"
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="bg-white"
              loading={
                <div className="w-[600px] h-[800px] bg-white animate-pulse rounded-md" />
              }
            />
          </Document>
        )}
      </div>
    </div>
  );
}
