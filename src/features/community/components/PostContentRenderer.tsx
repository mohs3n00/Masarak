'use client';

import React from 'react';
import { Link as LinkIcon, ExternalLink } from 'lucide-react';

interface PostContentRendererProps {
  content: string;
  isComment?: boolean;
  className?: string;
}

export function PostContentRenderer({ content, isComment = false, className = '' }: PostContentRendererProps) {
  if (!content) return null;

  // Separate attached link if present, regardless of preceding whitespace or newlines
  const attachmentMarker = '🔗 رابط مرفق: ';
  const markerIndex = content.indexOf(attachmentMarker);
  
  let mainText = content;
  let attachedLink: string | null = null;

  if (markerIndex !== -1) {
    mainText = content.slice(0, markerIndex).trim();
    attachedLink = content.slice(markerIndex + attachmentMarker.length).trim();
  }

  // Regex to detect HTTP/HTTPS URLs within standard paragraph text
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const renderLinkifiedText = (text: string) => {
    if (!text) return null;
    const parts = text.split(urlRegex);
    return (
      <span className="whitespace-pre-line leading-relaxed break-words">
        {parts.map((part, index) => {
          if (part.match(urlRegex)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 underline underline-offset-4 font-semibold break-all dir-ltr mx-0.5 transition-colors"
                onClick={(e) => e.stopPropagation()}
                title="اضغط لفتح الرابط في نافذة جديدة"
              >
                <span>{part}</span>
                <ExternalLink className="w-3.5 h-3.5 inline shrink-0" />
              </a>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Main Text Content (with auto-linkified URLs) */}
      {mainText && (
        <div className={isComment ? "text-sm text-muted-foreground" : "text-sm sm:text-base text-foreground"}>
          {renderLinkifiedText(mainText)}
        </div>
      )}

      {/* Interactive Attached Link Card */}
      {attachedLink && (
        <a
          href={attachedLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/40 hover:bg-primary/5 border border-border/80 hover:border-primary/40 transition-all duration-300 group shadow-sm hover:shadow-md cursor-pointer text-decoration-none"
          title="اضغط للانتقال للمستند أو الرابط المرفق مباشرة"
        >
          <div className="flex items-center gap-3.5 min-w-0 flex-1">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-xs">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                <span>رابط مرفق خارجي</span>
                <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full">(اضغط للفتح المباشر 🚀)</span>
              </div>
              <span className="text-xs text-muted-foreground truncate dir-ltr text-left font-mono mt-1 group-hover:text-foreground transition-colors">
                {attachedLink}
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 shrink-0 ml-2 transition-all">
            <ExternalLink className="w-4 h-4 transform group-hover:scale-110 transition-transform" />
          </div>
        </a>
      )}
    </div>
  );
}
