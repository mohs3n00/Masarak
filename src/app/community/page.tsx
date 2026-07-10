'use client';

import React, { useState, useEffect } from 'react';
import { AppContainer } from "@/shared/layouts/Containers";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/atoms/Avatar";
import { Button } from "@/shared/components/atoms/Button";
import { Input } from "@/shared/components/atoms/Input";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from '@/shared/api/api.client';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from 'sonner';

export default function CommunityPage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await apiClient.get('/community/feed');
      setPosts(res.data);
    } catch (error: any) {
      if (error?.status !== 401) {
        console.error("Failed to fetch posts:", error?.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    if (!user) {
      toast.error('يجب تسجيل الدخول أولاً');
      window.location.href = '/auth/login';
      return;
    }
    
    setIsSubmitting(true);
    try {
      await apiClient.post('/community/posts', { content });
      setContent('');
      toast.success('تم النشر بنجاح');
      fetchPosts();
    } catch (error) {
      toast.error('حدث خطأ أثناء النشر');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [activeCommentPost, setActiveCommentPost] = useState<string | null>(null);
  const [commentContent, setCommentContent] = useState('');

  const handleLike = async (postId: string) => {
    if (!user) return toast.error('يجب تسجيل الدخول أولاً');
    try {
      // Optimistic update
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const isLiked = p.reactions?.some((r: any) => r.userId === user.id);
          const newCount = isLiked ? Math.max(0, p._count.reactions - 1) : p._count.reactions + 1;
          const newReactions = isLiked 
            ? p.reactions.filter((r: any) => r.userId !== user.id)
            : [...(p.reactions || []), { userId: user.id, type: 'LIKE' }];
          return { ...p, _count: { ...p._count, reactions: newCount }, reactions: newReactions };
        }
        return p;
      }));
      await apiClient.post(`/community/posts/${postId}/like`);
    } catch (e) {
      toast.error('حدث خطأ');
      fetchPosts(); // Revert on failure
    }
  };

  const handleComment = async (postId: string) => {
    if (!commentContent.trim()) return;
    if (!user) return toast.error('يجب تسجيل الدخول أولاً');
    try {
      const res = await apiClient.post(`/community/posts/${postId}/comments`, { content: commentContent });
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return { 
            ...p, 
            _count: { ...p._count, comments: p._count.comments + 1 },
            comments: [...(p.comments || []), res.data]
          };
        }
        return p;
      }));
      setCommentContent('');
      setActiveCommentPost(null);
      toast.success('تمت إضافة التعليق');
    } catch (e) {
      toast.error('حدث خطأ أثناء إضافة التعليق');
    }
  };

  return (
    <div className="w-full bg-background min-h-screen pb-20 pt-8 md:pt-12">
      <AppContainer>
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed */}
          <div className="flex-1 space-y-6">
            
            {/* Create Post */}
            <div className="bg-card border border-border/60 rounded-2xl p-4 shadow-sm">
              <div className="flex gap-4 mb-4">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-primary/10 text-primary">{user?.name?.charAt(0) || 'أ'}</AvatarFallback>
                </Avatar>
                <textarea 
                  placeholder="شارك أفكارك، اسأل سؤالاً، أو ابدأ نقاشاً..." 
                  className="w-full bg-transparent border-none focus:ring-0 resize-none h-12 pt-3 text-[15px] outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-1">
                </div>
                <Button 
                  className="rounded-full px-6 font-bold" 
                  onClick={handlePost}
                  disabled={isSubmitting || !content.trim()}
                >
                  {isSubmitting ? 'جاري النشر...' : 'نشر'}
                </Button>
              </div>
            </div>

            {/* Feed Posts */}
            {loading ? (
               <div className="space-y-6">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
                     <div className="flex items-center gap-3 mb-4">
                       <Skeleton className="w-12 h-12 rounded-full" />
                       <div className="space-y-2">
                         <Skeleton className="h-4 w-[150px]" />
                         <Skeleton className="h-3 w-[100px]" />
                       </div>
                     </div>
                     <Skeleton className="h-4 w-full mb-2" />
                     <Skeleton className="h-4 w-[90%] mb-2" />
                     <Skeleton className="h-4 w-[80%] mb-4" />
                     <div className="flex gap-4">
                       <Skeleton className="h-5 w-[50px]" />
                       <Skeleton className="h-5 w-[50px]" />
                     </div>
                   </div>
                 ))}
               </div>
            ) : posts.length === 0 ? (
               <div className="bg-card border border-border/60 rounded-2xl p-8 text-center text-muted-foreground shadow-sm">
                 لا توجد منشورات بعد، كن أول من ينشر!
               </div>
            ) : posts.map((post) => {
              const isLiked = post.reactions?.some((r: any) => r.userId === user?.id);
              
              return (
              <div key={post.id} className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border border-border">
                      {post.author?.avatarUrl && <AvatarImage src={post.author.avatarUrl} />}
                      <AvatarFallback>{post.author?.name?.charAt(0) || 'م'}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold text-[15px] text-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                        {post.author?.name || 'مستخدم غير معروف'}
                        {post.author?.role === 'ADMIN' && (
                          <span className="bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 rounded font-bold">ADMIN</span>
                        )}
                        {post.author?.role === 'TEACHER' && (
                          <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold">TEACHER</span>
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  {(post.authorId === user?.id || user?.role === 'ADMIN') && (
                    <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full w-8 h-8">
                      <MoreHorizontal className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                
                <p className="text-[15px] text-foreground/90 leading-relaxed mb-4 whitespace-pre-wrap">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 pt-4 border-t border-border/40 text-muted-foreground">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-red-500' : 'hover:text-primary'}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500' : 'group-hover:fill-primary/20'}`} />
                    <span className="text-sm font-bold">{post._count?.reactions || 0}</span>
                  </button>
                  <button 
                    onClick={() => setActiveCommentPost(activeCommentPost === post.id ? null : post.id)}
                    className="flex items-center gap-2 hover:text-primary transition-colors group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:fill-primary/20" />
                    <span className="text-sm font-bold">{post._count?.comments || 0}</span>
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentPost === post.id && (
                  <div className="mt-4 pt-4 border-t border-border/30 space-y-4">
                    {post.comments?.map((comment: any) => (
                      <div key={comment.id} className="flex gap-3 bg-muted/20 p-3 rounded-xl">
                        <Avatar className="w-8 h-8 shrink-0">
                          <AvatarFallback className="text-xs">{comment.author?.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-sm">{comment.author?.name}</span>
                            {comment.author?.role === 'ADMIN' && (
                              <span className="bg-red-500/10 text-red-500 text-[10px] px-1.5 py-0.5 rounded font-bold ml-1">ADMIN</span>
                            )}
                            {comment.author?.role === 'TEACHER' && (
                              <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold ml-1">TEACHER</span>
                            )}
                            <span className="text-[10px] text-muted-foreground mr-1">
                              {new Date(comment.createdAt).toLocaleDateString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80">{comment.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex gap-2 mt-2">
                      <Input 
                        placeholder="اكتب تعليقاً..." 
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        className="h-9"
                        onKeyDown={(e) => e.key === 'Enter' && handleComment(post.id)}
                      />
                      <Button size="sm" onClick={() => handleComment(post.id)} disabled={!commentContent.trim()}>إرسال</Button>
                    </div>
                  </div>
                )}
              </div>
            )})}

          </div>
        </div>
      </AppContainer>
    </div>
  );
}