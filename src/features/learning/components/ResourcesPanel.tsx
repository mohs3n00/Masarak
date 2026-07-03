'use client';

import React, { useState } from 'react';
import { LessonMedia } from '@/types/models';
import { FileText, Download, Link as LinkIcon, Image as ImageIcon, Archive } from 'lucide-react';

interface ResourcesPanelProps {
  resources: LessonMedia[];
  onSelectResource: (resource: LessonMedia) => void;
  activeResourceId?: string | number;
}

export function ResourcesPanel({ resources, onSelectResource, activeResourceId }: ResourcesPanelProps) {
  const getIconForType = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="w-5 h-5 text-error" />;
      case 'IMAGE': return <ImageIcon className="w-5 h-5 text-info" />;
      case 'ZIP': return <Archive className="w-5 h-5 text-warning" />;
      case 'LINK': return <LinkIcon className="w-5 h-5 text-success" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  if (resources.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden mt-6">
      <div className="bg-muted px-4 py-3 border-b border-border">
        <h3 className="font-bold text-foreground">المرفقات والمصادر</h3>
      </div>
      <div className="divide-y divide-border">
        {resources.map((res) => (
          <div 
            key={res.id}
            onClick={() => onSelectResource(res)}
            className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-muted/50 ${activeResourceId === res.id ? 'bg-primary/5 border-r-4 border-r-primary' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-background rounded-lg shadow-sm border border-border">
                {getIconForType(res.type)}
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-foreground">{res.title}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {res.type} {res.sizeBytes ? `• ${formatSize(res.sizeBytes)}` : ''}
                </span>
              </div>
            </div>

            {res.type === 'ZIP' || res.type === 'DOCUMENT' ? (
              <a 
                href={res.url} 
                download 
                onClick={(e) => e.stopPropagation()}
                className="p-2 text-muted-foreground hover:text-primary transition-colors hover:bg-primary/10 rounded-full"
                title="تحميل المرفق"
              >
                <Download className="w-5 h-5" />
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
