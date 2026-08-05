'use client';

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { visit } from 'unist-util-visit';
import 'katex/dist/katex.min.css';

type BlockType =
  | 'definition' | 'law' | 'formula' | 'example' | 'note'
  | 'warning' | 'experiment' | 'exam_tip' | 'mistake' | 'summary' | 'text';

// Keyword lists for each block type (Arabic text as runtime strings)
const BLOCK_KEYWORDS: { type: BlockType; keys: string[] }[] = [
  { type: 'definition', keys: ['تعريف:', 'تعريف :', 'التعريف:'] },
  { type: 'law',        keys: ['قانون:', 'قانون :', 'القانون:', 'نظرية:', 'النظرية:'] },
  { type: 'formula',    keys: ['معادلة:', 'المعادلة:', 'صيغة:', 'قانون رياضي:'] },
  { type: 'example',    keys: ['مثال:', 'مثال :', 'مثال تطبيقي:'] },
  { type: 'note',       keys: ['ملاحظة:', 'ملحوظة:', 'تنبيه:', 'انتبه:'] },
  { type: 'warning',    keys: ['تحذير:', 'خطر:', 'مهم جدا:'] },
  { type: 'experiment', keys: ['تجربة:', 'تجربة عملية:'] },
  { type: 'exam_tip',   keys: ['نصيحة للامتحان:', 'نصيحة امتحانية:', 'هنت للامتحان:'] },
  { type: 'mistake',    keys: ['خطأ شائع:', 'أخطاء شائعة:', 'تجنب:'] },
  { type: 'summary',    keys: ['ملخص:', 'خلاصة:', 'الخلاصة:'] },
];

const CFG: Record<string, { icon: string; label: string; border: string; bg: string; lc: string; ib: string }> = {
  definition: { icon: '\u{1F4D8}', label: 'تعريف',    border: 'border-emerald-400/50', bg: 'bg-emerald-500/5',  lc: 'text-emerald-600', ib: 'bg-emerald-500/10' },
  law:        { icon: '\u2696\uFE0F', label: 'قانون', border: 'border-blue-400/50',    bg: 'bg-blue-500/5',    lc: 'text-blue-600',    ib: 'bg-blue-500/10' },
  formula:    { icon: '\u{1F9EE}', label: 'معادلة',   border: 'border-purple-400/50',  bg: 'bg-purple-500/5',  lc: 'text-purple-600',  ib: 'bg-purple-500/10' },
  example:    { icon: '\u{1F4A1}', label: 'مثال',     border: 'border-amber-400/50',   bg: 'bg-amber-500/5',   lc: 'text-amber-600',   ib: 'bg-amber-500/10' },
  note:       { icon: '\u26A0\uFE0F', label: 'ملاحظة', border: 'border-yellow-400/50', bg: 'bg-yellow-500/5',  lc: 'text-yellow-700',  ib: 'bg-yellow-500/10' },
  warning:    { icon: '\u{1F6A8}', label: 'تحذير',   border: 'border-red-400/50',     bg: 'bg-red-500/5',     lc: 'text-red-600',     ib: 'bg-red-500/10' },
  experiment: { icon: '\u{1F9EA}', label: 'تجربة عملية',    border: 'border-teal-400/50',    bg: 'bg-teal-500/5',    lc: 'text-teal-600',    ib: 'bg-teal-500/10' },
  exam_tip:   { icon: '\u{1F3AF}', label: 'نصيحة للامتحان',    border: 'border-emerald-400/50', bg: 'bg-emerald-500/5', lc: 'text-emerald-700', ib: 'bg-emerald-500/10' },
  mistake:    { icon: '\u274C',    label: 'خطأ شائع',   border: 'border-red-400/50',     bg: 'bg-red-500/5',     lc: 'text-red-600',     ib: 'bg-red-500/10' },
  summary:    { icon: '\u{1F4DD}', label: 'ملخص',    border: 'border-slate-400/50',   bg: 'bg-slate-500/5',   lc: 'text-slate-600',   ib: 'bg-slate-500/10' },
  text:       { icon: '', label: '', border: '', bg: '', lc: '', ib: '' },
};

function fixChemistry(text: string): string {
  const M: Record<string, string> = {
    '0': '\u2080', '1': '\u2081', '2': '\u2082', '3': '\u2083', '4': '\u2084',
    '5': '\u2085', '6': '\u2086', '7': '\u2087', '8': '\u2088', '9': '\u2089',
  };
  return text.replace(/\b[A-Z][a-zA-Z0-9]*\d[a-zA-Z0-9]*\b/g, (m) =>
    m.replace(/\d+/g, (n) => n.split('').map((d) => M[d] ?? d).join(''))
  );
}

// Custom remark plugin to turn specific paragraphs into styled cards
function remarkEducationalBlocks() {
  return (tree: any) => {
    visit(tree, 'paragraph', (node: any) => {
      if (!node.children || node.children.length === 0) return;
      const firstChild = node.children[0];
      
      if (firstChild.type === 'text') {
        const text = firstChild.value.trim();
        // Remove emoji if it exists at the start
        const stripped = text.replace(/^\p{Emoji}\s*/u, '').trim();
        
        for (const { type, keys } of BLOCK_KEYWORDS) {
          const kw = keys.find((k) => stripped.startsWith(k));
          if (kw) {
            // Transform paragraph into a div with educational block data
            node.data = node.data || {};
            node.data.hName = 'div';
            node.data.hProperties = {
              className: `educational-block block-${type}`,
              'data-block-type': type,
            };
            
            // Remove the keyword from the text node
            const index = firstChild.value.indexOf(kw);
            if (index !== -1) {
              const newValue = firstChild.value.slice(index + kw.length).trim();
              if (newValue) {
                  firstChild.value = newValue;
              } else {
                  node.children.shift(); // Remove the text node entirely if it's empty
              }
            }
            break;
          }
        }
      }
    });
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MD: Record<string, React.ComponentType<any>> = {
  h1: ({ children }) => <h1 className="text-xl sm:text-2xl font-black text-primary mt-8 mb-4 border-b border-border pb-2" dir="auto">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg sm:text-xl font-bold text-foreground mt-6 mb-3" dir="auto">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base sm:text-lg font-semibold text-foreground/90 mt-5 mb-2" dir="auto">{children}</h3>,
  h4: ({ children }) => <h4 className="text-sm sm:text-base font-semibold text-foreground/80 mt-4 mb-2" dir="auto">{children}</h4>,
  p:  ({ children }) => <p className="text-sm leading-[1.9] md:leading-loose text-foreground mb-4 break-words" dir="auto">{children}</p>,
  ul: ({ children }) => <ul className="space-y-3 my-5 list-disc list-outside ps-6" dir="auto">{children}</ul>,
  ol: ({ children }) => <ol className="space-y-3 my-5 list-decimal list-outside ps-6 font-medium" dir="auto">{children}</ol>,
  li: ({ children }) => <li className="text-sm text-foreground leading-[1.9] md:leading-loose" dir="auto">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-s-4 border-primary/40 bg-primary/5 ps-4 py-3 my-4 rounded-lg text-sm text-muted-foreground italic" dir="auto">
      {children}
    </blockquote>
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  code: ({ node: _n, inline, children }: any) =>
    inline
      ? <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-[13px] text-foreground mx-1" dir="ltr">{children}</code>
      : <pre className="my-4 p-4 rounded-xl bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono leading-relaxed" dir="ltr"><code>{children}</code></pre>,
  table:  ({ children }) => <div className="my-4 overflow-x-auto rounded-xl border border-border" dir="auto"><table className="w-full text-sm">{children}</table></div>,
  thead:  ({ children }) => <thead className="bg-muted/80 text-foreground font-bold">{children}</thead>,
  tr:     ({ children }) => <tr className="border-b border-border hover:bg-muted/30 transition-colors">{children}</tr>,
  th:     ({ children }) => <th className="px-4 py-3 font-semibold border-s border-border/50 first:border-s-0">{children}</th>,
  td:     ({ children }) => <td className="px-4 py-3 border-s border-border/50 first:border-s-0">{children}</td>,
  strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-2 hover:no-underline text-sm font-medium mx-1" dir="auto">
      {children}
    </a>
  ),
  hr: () => <hr className="my-6 border-border" />,
  div: ({ node, className, 'data-block-type': blockType, children, ...props }: any) => {
    if (blockType && CFG[blockType]) {
      const cfg = CFG[blockType];
      return (
        <div className={`my-5 rounded-2xl border ${cfg.border} ${cfg.bg} overflow-hidden shadow-sm`} dir="auto">
          <div className={`flex items-center gap-2.5 px-4 py-2.5 border-b ${cfg.border} bg-white/50 dark:bg-black/20`}>
            <span className={`w-8 h-8 rounded-lg ${cfg.ib} flex items-center justify-center text-lg shadow-sm`}>{cfg.icon}</span>
            <span className={`font-bold text-sm ${cfg.lc}`}>{cfg.label}</span>
          </div>
          <div className={`px-4 py-3 text-sm leading-relaxed ${blockType === 'formula' ? 'text-center text-lg' : ''}`}>
            {children}
          </div>
        </div>
      );
    }
    return <div className={className} dir="auto" {...props}>{children}</div>;
  }
};

export function AiAnswerRenderer({ content, compact = false }: { content: string; compact?: boolean }) {
  const processedContent = useMemo(() => fixChemistry(content), [content]);
  return (
    <div className={`ai-answer ${compact ? 'text-xs' : 'text-sm'}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath, remarkEducationalBlocks]} 
        rehypePlugins={[rehypeKatex]} 
        components={MD}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}

