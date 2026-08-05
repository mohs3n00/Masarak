'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createCommunityApi } from '@/features/community/services/community-api.service';
import { CommunityPost } from '@/features/community/types';
import { ArrowRight, Bookmark, Loader2, Pin, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { PostContentRenderer } from '@/features/community/components/PostContentRenderer';

export default function BookmarksPage() {
  const router = useRouter();
  const user = useAuthStore(state => state.user);
  const [bookmarks, setBookmarks] = useState<CommunityPost[]>([]);
  const [spacesMap, setSpacesMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const api = createCommunityApi();
        const [bookmarksData, spacesData] = await Promise.all([
          api.getBookmarks(),
          api.getSpaces()
        ]);
        
        const sMap: Record<string, string> = {};
        if (spacesData && Array.isArray(spacesData)) {
          spacesData.forEach(s => {
             sMap[s.id] = s.slug;
          });
        }
        setSpacesMap(sMap);
        setBookmarks(bookmarksData || []);
      } catch (err) {
        console.error('Failed to load bookmarks', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 dir-rtl text-right">
      {/* App Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <Button size="icon" variant="ghost" onClick={() => router.back()} className="rounded-full shrink-0">
            <ArrowRight className="w-5 h-5" />
          </Button>
          <div className="flex flex-col flex-1 overflow-hidden">
            <h1 className="font-bold text-lg text-foreground flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-primary" />
              المحفوظات الخاصة
            </h1>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              هذه القائمة خاصة بك ولا تظهر لأحد غيرك
            </span>
          </div>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card border border-border/80 shadow-sm text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
            <Bookmark className="w-12 h-12 text-muted-foreground/30" />
            <p>لا يوجد لديك أي منشورات محفوظة حالياً.</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push('/community')}>
              تصفح المجتمعات
            </Button>
          </div>
        ) : (
          bookmarks.map(post => {
            let rawName = 'طالب';
            if (post.authorId === user?.id && user?.name) {
              rawName = user.name;
            } else if (post.authorName && post.authorName.trim().toLowerCase() !== 'user') {
              rawName = post.authorName;
            }
            const displayName = post.authorRole === 'TEACHER' ? rawName : rawName.split(' ').slice(0, 2).join(' ');

            return (
              <div key={post.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {displayName.substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{displayName}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                </div>

                <PostContentRenderer content={post.content} />

                <div className="pt-3 border-t border-border flex justify-end">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="text-xs hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => {
                      const spaceSlug = (post as any).space?.slug || spacesMap[post.spaceId];
                      if (spaceSlug) {
                        router.push(`/community/${spaceSlug}#post-${post.id}`);
                      } else {
                        // Fallback if space slug is not eagerly loaded
                        router.push(`/community`);
                      }
                    }}
                  >
                    الانتقال للمنشور
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
