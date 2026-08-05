'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  MessageSquare,
  FileText,
  Pin,
  Image as ImageIcon,
  Info,
  Search,
  Send,
  ThumbsUp,
  Share2,
  Bookmark,
  Flag,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck,
  Plus,
  Download,
  Paperclip,
  UserCheck,
  UserPlus,
  Loader2,
  ArrowRight,
  Bot,
  HelpCircle,
  Trophy,
  BookOpen,
  Check,
  MoreVertical,
  X,
  Copy,
  Camera,
  ArrowDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { createCommunityApi } from '@/features/community/services/community-api.service';
import { toast } from 'sonner';
import { AiAnswerRenderer } from '@/features/community/components/AiAnswerRenderer';
import { PostContentRenderer } from '@/features/community/components/PostContentRenderer';
import {
  CommunitySpace,
  CommunityPost,
  CommunityComment,
  PostType,
  ReactionType,
} from '@/features/community/types';
import { useCommunityStore } from '@/features/community/store/community.store';
import { useAuthStore } from '@/features/auth/store/auth.store';

export default function SingleCommunityPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [space, setSpace] = useState<CommunitySpace | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [postFilter, setPostFilter] = useState<'ALL' | 'TEACHER' | 'LINKS' | 'QUESTIONS' | 'UNANSWERED'>('ALL');
  const [activeReactionsMap, setActiveReactionsMap] = useState<Record<string, boolean>>({});
  const { isJoined: checkIsJoined, toggleJoinSpace, isSaved, toggleSavePost, setSavedPosts, getUserReaction, setUserReaction } = useCommunityStore();
  
  const [isJoining, setIsJoining] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToLatestMessage = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  useEffect(() => {
    if (!loading && posts.length > 0) {
      const timer = setTimeout(() => {
        scrollToLatestMessage();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, posts.length]);

  const handleToggleJoin = async () => {
    if (!space) return;
    const api = createCommunityApi();
    try {
      setIsJoining(true);
      if (checkIsJoined(space.id)) {
        await api.leaveSpace(space.id);
      } else {
        await api.joinSpace(space.id);
      }
      toggleJoinSpace(space.id);
      toast.success(checkIsJoined(space.id) ? 'تم مغادرة المجتمع' : 'تم الانضمام بنجاح');
    } catch (err) {
      toast.error('حدث خطأ أثناء تغيير حالة الانضمام');
    } finally {
      setIsJoining(false);
    }
  };
  const isJoined = space ? checkIsJoined(space.id) : false;
  const user = useAuthStore((s) => s.user);

  // Admin Cover / Avatar Management States
  const canEditSpace = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.id === space?.createdById;
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !space) return;
    const api = createCommunityApi();
    try {
      setUploadingCover(true);
      toast.loading('جاري رفع وثبيت الغلاف في Appwrite Storage...', { id: 'upload-cover' });
      const updatedSpace = await api.uploadSpaceCover(space.id, file);
      setSpace(updatedSpace);
      toast.success('تم تغيير وتثبيت غلاف المجتمع بنجاح على Appwrite Storage!', { id: 'upload-cover' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'حدث خطأ أثناء رفع صورة الغلاف على Appwrite', { id: 'upload-cover' });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !space) return;
    const api = createCommunityApi();
    try {
      setUploadingAvatar(true);
      toast.loading('جاري رفع وثبيت صورة المجتمع في Appwrite Storage...', { id: 'upload-avatar' });
      const updatedSpace = await api.uploadSpaceAvatar(space.id, file);
      setSpace(updatedSpace);
      toast.success('تم تغيير صورة المجتمع بنجاح على Appwrite Storage!', { id: 'upload-avatar' });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'حدث خطأ أثناء رفع صورة المجتمع على Appwrite', { id: 'upload-avatar' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Post Creator State
  const [postType, setPostType] = useState<PostType>('QUESTION');
  const [newPostContent, setNewPostContent] = useState('');
  const [linkAttachment, setLinkAttachment] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [posting, setPosting] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<CommunityPost[]>([]);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  // Ask AI Assistant state (inline in composer)
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [askingAi, setAskingAi] = useState(false);

  // Community AI Chat Widget state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'bot'; text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Comments state map: postId -> list of comments
  const [commentsMap, setCommentsMap] = useState<Record<string, CommunityComment[]>>({});
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  const fetchSpaceAndPosts = React.useCallback(async () => {
    try {
      setLoading(true);
      const api = createCommunityApi();
      const sp = await api.getSpaceBySlug(slug);
      setSpace(sp);

      const feedRes = await api.getFeed(sp.id);
      setPosts(feedRes.data || []);
      setNextCursor(feedRes.cursor || null);
    } catch (err) {
      console.error('Failed to load space:', err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadMorePosts = async () => {
    if (!nextCursor || loadingMore || !space) return;
    try {
      setLoadingMore(true);
      const api = createCommunityApi();
      const feedRes = await api.getFeed(space.id, nextCursor);
      setPosts(prev => [...prev, ...(feedRes.data || [])]);
      setNextCursor(feedRes.cursor || null);
    } catch (err) {
      console.error('Failed to load more posts:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (slug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchSpaceAndPosts();
    }
  }, [slug, fetchSpaceAndPosts]);

  useEffect(() => {
    // Initial fetch of saved bookmarks for cross-device sync
    const fetchBookmarks = async () => {
      try {
        const api = createCommunityApi();
        const saved = await api.getBookmarks();
        if (saved && Array.isArray(saved)) {
          setSavedPosts(saved.map(p => p.id));
        }
      } catch (err) {
        console.error('Failed to sync bookmarks', err);
      }
    };
    fetchBookmarks();
  }, [setSavedPosts]);

  const handleAskAiFirst = async () => {
    if (!newPostContent.trim()) return;
    try {
      setAskingAi(true);
      setAiAnswer(null);

      const res = await fetch('/api/community/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: newPostContent,
          communitySlug: space?.slug,
          communityCategory: space?.category
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        setAiAnswer(data.error || 'حدث خطأ في الاتصال بالذكاء الاصطناعي. حاول مرة أخرى.');
      } else {
        setAiAnswer(data.answer);
      }
    } catch (err) {
      console.error('Failed to fetch AI response:', err);
      setAiAnswer('حدث خطأ في الاتصال بالشبكة. تأكد من اتصالك بالإنترنت.');
    } finally {
      setAskingAi(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);
    try {
      const res = await fetch('/api/community/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          communitySlug: space?.slug,
          communityCategory: space?.category,
          conversationHistory: chatMessages.slice(-6).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: 'bot', text: data.answer || data.error || 'مش قادر أرد دلوقتي، جرب تاني.' }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'bot', text: 'فيه مشكلة في الاتصال، حاول تاني.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const performDuplicateCheck = async () => {
    if (!space) return;
    const hasContent = newPostContent.trim() || linkAttachment.trim();
    if (!hasContent) {
      toast.error('يرجى كتابة محتوى أو إرفاق رابط للمنشور أولاً');
      return;
    }
    if (postType !== 'QUESTION' || !newPostContent.trim()) {
      await proceedWithCreatePost();
      return;
    }
    try {
      setPosting(true);
      const api = createCommunityApi();
      const searchRes = await api.search(newPostContent, space.id, undefined, 3).catch(() => ({ data: [] }));
      if (searchRes.data && searchRes.data.length > 0) {
        setDuplicateCheckResult(searchRes.data);
        setShowDuplicateDialog(true);
        setPosting(false);
      } else {
        await proceedWithCreatePost();
      }
    } catch (err) {
      console.error('Failed duplicate check:', err);
      await proceedWithCreatePost();
    }
  };

  const proceedWithCreatePost = async () => {
    if (!space) return;
    const trimmedContent = newPostContent.trim();
    const trimmedLink = linkAttachment.trim();
    if (!trimmedContent && !trimmedLink) {
      toast.error('لا يمكن نشر منشور فارغ، يرجى إدخال نص أو رابط');
      return;
    }
    try {
      setPosting(true);
      const api = createCommunityApi();
      let finalContent = trimmedContent;
      if (trimmedLink) {
        finalContent = finalContent ? `${finalContent}\n\n🔗 رابط مرفق: ${trimmedLink}` : `🔗 رابط مرفق: ${trimmedLink}`;
      }

      const post = await api.createPost({
        spaceId: space.id,
        content: finalContent,
        postType,
        isQuestion: postType === 'QUESTION',
        authorName: user?.name || undefined,
        authorRole: user?.role || undefined,
      });
      setPosts([post, ...posts]);
      setNewPostContent('');
      setLinkAttachment('');
      setShowLinkInput(false);
      setAiAnswer(null);
      setShowDuplicateDialog(false);
      setDuplicateCheckResult([]);
      setIsComposerOpen(false);
      toast.success('تم نشر المنشور للمجتمع بنجاح!');
    } catch (err: any) {
      console.error('Failed to create post:', err);
      toast.error(err?.message || 'تعذر نشر المنشور، يرجى المحاولة مرة أخرى');
    } finally {
      setPosting(false);
    }
  };

  const handleToggleReaction = async (postId: string, emoji: string = '👍') => {
    try {
      const api = createCommunityApi();
      const currentReaction = getUserReaction(postId);

      let delta = 0;
      let newReaction: string | null = emoji;

      if (currentReaction === emoji) {
        // Toggle OFF (remove reaction)
        newReaction = null;
        delta = -1;
      } else if (!currentReaction) {
        // Adding new reaction for the first time
        delta = 1;
      } else {
        // Switching from one reaction emoji to another (count stays the same)
        delta = 0;
      }

      setUserReaction(postId, newReaction);

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== postId) return p;
          const currentCount = p.reactionsCount || 0;
          const nextCount = Math.max(0, currentCount + delta);
          return { ...p, reactionsCount: nextCount };
        })
      );

      await api.toggleReaction('post', postId, emoji);
    } catch (err) {
      console.error('Failed reaction:', err);
    }
  };

  const fetchComments = async (postId: string) => {
    if (commentsMap[postId]) {
      setActiveCommentPostId(activeCommentPostId === postId ? null : postId);
      return;
    }
    
    try {
      const api = createCommunityApi();
      const res = await api.getComments(postId);
      setCommentsMap((prev) => ({ ...prev, [postId]: res.data || [] }));
      setActiveCommentPostId(postId);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleAddComment = async (postId: string, parentId?: string) => {
    const text = replyInputMap[parentId || postId];
    if (!text || !text.trim()) return;

    try {
      const api = createCommunityApi();
      const newComment = await api.createComment(postId, { 
        content: text, 
        parentId,
        authorName: user?.name || undefined,
        authorRole: user?.role || undefined,
      });
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), newComment],
      }));
      setReplyInputMap((prev) => ({ ...prev, [parentId || postId]: '' }));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p)),
      );
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const handleMarkAccepted = async (postId: string, commentId: string) => {
    try {
      const api = createCommunityApi();
      await api.markAcceptedAnswer(commentId);
      setCommentsMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] || []).map((c) =>
          c.id === commentId ? { ...c, isAccepted: true } : { ...c, isAccepted: false },
        ),
      }));
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, isAnswered: true, acceptedCommentId: commentId } : p)),
      );
    } catch (err) {
      console.error('Failed to accept answer:', err);
    }
  };

  const handleToggleSave = async (postId: string) => {
    try {
      const api = createCommunityApi();
      const currentlySaved = isSaved(postId);
      toggleSavePost(postId); // Optimistic UI update

      if (currentlySaved) {
        await api.unbookmarkPost(postId);
        toast.success('تم إزالة المنشور من المحفوظات');
      } else {
        await api.bookmarkPost(postId);
        toast.success('تم حفظ المنشور بنجاح');
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
      toggleSavePost(postId); // Revert on failure
      toast.error('حدث خطأ أثناء حفظ المنشور');
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const shareUrl = `${window.location.origin}/community/${slug}#post-${postId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
      toast.success('تم نسخ رابط المنشور بنجاح');
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      toast.error('لم نتمكن من نسخ الرابط');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!space || Array.isArray(space) || !space.name) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 gap-4 dir-rtl text-right">
        <h2 className="text-xl font-bold">المجتمع غير موجود أو تم تعديل رابطه</h2>
        <Button onClick={() => router.push('/community')}>العودة لصفحة المجتمعات</Button>
      </div>
    );
  }

  const displayMembersCount = (space.createdById === 'SYSTEM' || space.type === 'DEFAULT_ACADEMIC') && space.membersCount === 1 ? 0 : (space.membersCount ?? 0);

  const filteredPosts = posts.filter(post => {
    if (postFilter === 'QUESTIONS') return post.postType === 'QUESTION' || post.isQuestion;
    if (postFilter === 'UNANSWERED') return (post.postType === 'QUESTION' || post.isQuestion) && !post.isAnswered;
    if (postFilter === 'TEACHER') return post.authorRole === 'TEACHER';
    if (postFilter === 'LINKS') return post.content.includes('http') || post.content.includes('رابط مرفق');
    return true;
  });

  return (
    <>
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 dir-rtl text-right">
      {/* App Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={() => router.push('/community')} className="rounded-full shrink-0">
              <ArrowRight className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center border border-primary/20 overflow-hidden shrink-0">
              {space.avatarUrl ? <img src={space.avatarUrl} alt={space.name} className="w-full h-full object-cover" /> : (space?.name || 'مجتمع').substring(0, 2)}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm sm:text-base text-foreground leading-tight truncate">{space?.name || 'مجتمع'}</span>
              <span className="text-[11px] text-muted-foreground truncate">{displayMembersCount} عضو</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={handleToggleJoin}
              disabled={isJoining}
              size="sm"
              variant={isJoined ? "outline" : "primary"}
              className={`rounded-xl text-xs px-3 h-9 hidden sm:flex ${isJoined ? 'hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' : ''}`}
            >
              {isJoining ? 'جاري...' : (isJoined ? 'منضم' : 'انضمام')}
            </Button>
            <Sheet>
              <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground rounded-xl shrink-0 h-10 w-10">
                <Info className="w-5 h-5" />
              </SheetTrigger>
              <SheetContent side="left" className="dir-rtl w-[300px] sm:w-[400px] flex flex-col p-0">
                <SheetHeader className="px-6 pt-6 pb-2">
                  <SheetTitle>معلومات المجتمع</SheetTitle>
                </SheetHeader>
                <div className="space-y-6 px-6 pb-6 overflow-y-auto flex-1">
                  {space.coverUrl && (
                    <div className="w-full h-32 rounded-xl overflow-hidden mb-4">
                      <img src={space.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{space.name}</h3>
                    <Badge 
                      variant="outline" 
                      className="font-mono text-xs cursor-pointer hover:bg-muted transition-colors flex items-center gap-2 w-fit"
                      onClick={() => {
                        navigator.clipboard.writeText(space.communityId);
                        toast.success('تم نسخ معرف المجتمع');
                      }}
                    >
                      {space.communityId}
                      <Copy className="w-3 h-3" />
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{space.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-foreground">{displayMembersCount}</div>
                      <div className="text-xs text-muted-foreground">عضو</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-xl text-center">
                      <div className="text-2xl font-bold text-foreground">{posts.length}</div>
                      <div className="text-xs text-muted-foreground">مشاركة</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-bold text-sm">قوانين المجتمع</h4>
                    <ul className="text-xs text-muted-foreground space-y-2">
                      <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> الالتزام بالاحترام المتبادل.</li>
                      <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> يمنع رفع الملفات المباشرة، استخدم الروابط.</li>
                      <li className="flex gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" /> الأسئلة يجب أن تكون في سياق المادة.</li>
                    </ul>
                  </div>
                  
                  <Button
                    onClick={handleToggleJoin}
                    variant={isJoined ? "outline" : "primary"}
                    className={`w-full rounded-xl mt-4 ${isJoined ? 'text-red-500 border-red-500/30 hover:bg-red-500/10' : ''}`}
                  >
                    {isJoined ? 'مغادرة المجتمع' : 'انضمام للمجتمع'}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Mobile Filters Scroll */}
        <div className="container max-w-3xl mx-auto px-4 sm:px-6 flex items-center gap-2 overflow-x-auto scrollbar-none pb-3">
          <Button variant={postFilter === 'ALL' ? 'primary' : 'outline'} onClick={() => setPostFilter('ALL')} className={`rounded-xl text-xs h-8 whitespace-nowrap shrink-0 ${postFilter === 'ALL' ? 'bg-primary/10 text-primary border-primary/20 shadow-none' : ''}`}>الكل</Button>
          <Button variant={postFilter === 'TEACHER' ? 'primary' : 'outline'} onClick={() => setPostFilter('TEACHER')} className={`rounded-xl text-xs h-8 whitespace-nowrap shrink-0 ${postFilter === 'TEACHER' ? 'bg-primary/10 text-primary border-primary/20 shadow-none' : ''}`}>المحاضرين</Button>
          <Button variant={postFilter === 'LINKS' ? 'primary' : 'outline'} onClick={() => setPostFilter('LINKS')} className={`rounded-xl text-xs h-8 whitespace-nowrap shrink-0 ${postFilter === 'LINKS' ? 'bg-primary/10 text-primary border-primary/20 shadow-none' : ''}`}>روابط</Button>
          <Button variant={postFilter === 'QUESTIONS' ? 'primary' : 'outline'} onClick={() => setPostFilter('QUESTIONS')} className={`rounded-xl text-xs h-8 whitespace-nowrap shrink-0 ${postFilter === 'QUESTIONS' ? 'bg-primary/10 text-primary border-primary/20 shadow-none' : ''}`}>الأسئلة</Button>
        </div>
      </div>

      <div className="container max-w-3xl mx-auto px-4 sm:px-6 pt-4">
        {/* Community Hero & Cover Banner (Admin Appwrite Control) */}
        <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-primary/90 to-slate-900 shadow-xl mb-6 border border-border/60">
          <div className="h-44 sm:h-52 w-full relative overflow-hidden bg-slate-950/50">
            {space.coverUrl ? (
              <img src={space.coverUrl} alt={space.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-slate-900 to-slate-950 flex items-center justify-center">
                <span className="text-4xl sm:text-6xl font-black text-white/10 select-none tracking-wider">{space.name}</span>
              </div>
            )}

            {/* Admin Cover Upload Button */}
            {canEditSpace && (
              <label className="absolute top-4 left-4 z-10 cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95">
                {uploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5 text-primary" />}
                <span>تغيير الغلاف</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingCover}
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
          </div>

          {/* Avatar and Space Details overlay */}
          <div className="relative -mt-12 px-6 pb-6 flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-right">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-slate-900 border-4 border-background shadow-2xl overflow-hidden flex items-center justify-center text-primary font-bold text-3xl">
                {space.avatarUrl ? (
                  <img src={space.avatarUrl} alt={space.name} className="w-full h-full object-cover" />
                ) : (
                  (space?.name || 'مجتمع').substring(0, 2)
                )}
              </div>
              {/* Admin Avatar Upload Button */}
              {canEditSpace && (
                <label className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white cursor-pointer transition-opacity backdrop-blur-sm border-4 border-transparent z-10">
                  {uploadingAvatar ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Camera className="w-6 h-6 text-primary" />}
                  <span className="text-[10px] font-semibold">تغيير الشعار</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingAvatar}
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1 space-y-1 text-white">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{space.name}</h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-primary/20 text-primary-foreground border border-primary/30 font-semibold backdrop-blur-sm">
                  {space.category || 'تعليمي'}
                </span>
                {canEditSpace && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                    لوحة تحكم المشرف (Admin)
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-300 max-w-xl line-clamp-2 leading-relaxed">{space.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Feed */}
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Post Composer Trigger & Dialog */}
            {isJoined ? (
              <div className="p-4 rounded-2xl bg-card border border-border shadow-card flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                  {user?.name ? (user.name || 'أنا').substring(0, 2) : 'انا'}
                </div>
                <Dialog open={isComposerOpen} onOpenChange={setIsComposerOpen}>
                  <DialogTrigger className="flex-1 h-11 px-4 rounded-xl bg-muted/50 hover:bg-muted border border-transparent hover:border-border text-right text-muted-foreground text-sm transition-all text-ellipsis whitespace-nowrap overflow-hidden cursor-text">
                    بم تفكر؟ اطرح سؤالاً أو شارك معلومة...
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] p-0 gap-0 overflow-hidden dir-rtl rounded-3xl">
                    <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
                      <DialogTitle className="text-right flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        إنشاء منشور جديد
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                      <Textarea
                        placeholder="اكتب سؤالك الأكاديمي بالتفصيل لتتمكن من الحصول على إجابة، أو شارك رابطاً مفيداً..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={5}
                        className="rounded-xl text-sm resize-none bg-transparent border-none focus-visible:ring-0 px-0 placeholder:text-muted-foreground/60 text-base"
                        autoFocus
                      />

                      {/* AI Assistant Preview Box */}
                      {aiAnswer && (
                        <div className="rounded-xl border border-indigo-500/20 overflow-hidden animate-in fade-in">
                          <div className="font-bold flex items-center gap-1.5 text-indigo-500 px-4 py-2.5 bg-indigo-500/10 border-b border-indigo-500/20 text-xs">
                            <Bot className="w-4 h-4" />
                            إجابة المساعد الذكي
                          </div>
                          <div className="p-5 max-h-[450px] overflow-y-auto">
                            <AiAnswerRenderer content={aiAnswer} compact />
                          </div>
                        </div>
                      )}

                      {/* Link Attachment Box */}
                      {showLinkInput && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 p-3 rounded-xl bg-muted/50 border border-border">
                          <Paperclip className="w-4 h-4 text-muted-foreground shrink-0" />
                          <Input 
                            placeholder="ضع الرابط هنا (Drive, YouTube, إلخ)..."
                            value={linkAttachment}
                            onChange={(e) => setLinkAttachment(e.target.value)}
                            className="h-9 text-xs rounded-xl flex-1 bg-transparent border-transparent focus-visible:ring-0 focus-visible:bg-background"
                            dir="ltr"
                          />
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 p-0 rounded-xl hover:bg-destructive/10 hover:text-destructive shrink-0"
                            onClick={() => {
                              setShowLinkInput(false);
                              setLinkAttachment('');
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                      {postType === 'QUESTION' && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={handleAskAiFirst}
                          disabled={askingAi || !newPostContent.trim()}
                          className="rounded-xl text-xs gap-1.5 h-9 border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10"
                        >
                          {askingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />}
                          اسأل الذكاء الاصطناعي أولاً
                        </Button>
                      )}

                      <div className="flex items-center gap-2 mr-auto">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowLinkInput(true)}
                          className="rounded-xl text-xs gap-1.5 h-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                        >
                          <Paperclip className="w-3.5 h-3.5" />
                          إرفاق رابط
                        </Button>
                        <Button
                          onClick={performDuplicateCheck}
                          disabled={posting || (!newPostContent.trim() && !linkAttachment.trim())}
                          size="sm"
                          className="rounded-xl gap-1.5 px-6 h-9 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                        >
                          {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          نشر للمجتمع
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Duplicate Check Dialog */}
                <Dialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
                  <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden dir-rtl rounded-3xl">
                    <DialogHeader className="px-6 py-4 border-b border-border bg-amber-500/10">
                      <DialogTitle className="text-right flex items-center gap-2 text-amber-600">
                        <MessageSquare className="w-5 h-5" />
                        عذراً، هل هذا هو سؤالك؟
                      </DialogTitle>
                    </DialogHeader>
                    <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                      <p className="text-sm text-muted-foreground">
                        وجدنا أسئلة مشابهة جداً لسؤالك في المجتمع. ربما تجد إجابتك فيها مباشرة دون الحاجة لانتظار إجابة جديدة!
                      </p>
                      <div className="space-y-3">
                        {duplicateCheckResult.map((dup) => (
                          <div key={dup.id} className="p-3 rounded-xl bg-muted/50 border border-border text-sm flex flex-col gap-2 cursor-pointer hover:bg-muted transition-colors">
                            <span className="font-semibold line-clamp-2">{dup.content}</span>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span>{dup.commentsCount || 0} تعليق</span>
                              {dup.isAnswered && <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3"/> مجاب</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowDuplicateDialog(false)}
                        className="rounded-xl text-xs h-9 text-muted-foreground hover:bg-muted"
                      >
                        إلغاء النشر
                      </Button>
                      <Button
                        onClick={proceedWithCreatePost}
                        disabled={posting}
                        className="rounded-xl px-6 h-9 font-bold bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'لا، سؤال مختلف. استمر بالنشر'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-card border border-border shadow-card flex flex-col items-center justify-center text-center space-y-3 opacity-80">
                <UserPlus className="w-10 h-10 text-muted-foreground" />
                <p className="text-muted-foreground font-semibold">يجب الانضمام للمجتمع أولاً لتتمكن من إضافة منشورات أو طرح أسئلة.</p>
              </div>
            )}

            {/* Feed Items */}
            {filteredPosts.length === 0 ? (
              <div className="p-8 rounded-2xl bg-card border border-border shadow-card text-center text-muted-foreground">
                لا توجد منشورات تطابق الفلتر المحدد.
              </div>
            ) : null}
            {filteredPosts.map((post) => {
              // 1. If authorId matches current user, use their actual name
              // 2. Otherwise use the post's authorName
              // 3. Fallback to 'طالب'
              let rawName = 'طالب';
              if (post.authorId === user?.id && user?.name) {
                rawName = user.name;
              } else if (post.authorName && post.authorName.trim().toLowerCase() !== 'user') {
                rawName = post.authorName;
              }
              
              const displayName = post.authorRole === 'TEACHER' ? rawName : rawName.split(' ').slice(0, 2).join(' ');
              
              const getPostTypeLabel = () => {
                const type = post.postType || (post.isQuestion ? 'QUESTION' : 'DISCUSSION');
                if (type === 'QUESTION') return 'سؤال دراسي';
                if (type === 'DISCUSSION') return 'مناقشة عامة';
                if (type === 'RESOURCE') return 'مورد تعليمي';
                if (type === 'NOTE') return 'ملاحظة';
                return 'مشاركة';
              };
              
              return (
              <div key={post.id} className="p-6 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 space-y-4">
                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                      {(displayName || 'مستخدم').substring(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{displayName}</span>
                        {post.authorRole === 'TEACHER' && (
                          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-[10px] gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-500" /> محاضر موثق
                          </Badge>
                        )}
                        {post.authorId === space.createdById && (
                          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] gap-1">
                            <Award className="w-3 h-3 text-primary" /> مؤسس المجتمع
                          </Badge>
                        )}
                      </div>
                        <span className="text-[11px] text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-medium">
                        {getPostTypeLabel()}
                      </Badge>
                      {post.isAnswered && (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs gap-1">
                          <Check className="w-3 h-3" /> تم الإجابة
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <PostContentRenderer content={post.content} />

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground relative">
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Reaction Button & Picker */}
                    <div className="relative group">
                      {(() => {
                        const activeEmoji = getUserReaction(post.id);
                        return (
                          <>
                            {activeEmoji ? (
                              <button
                                onClick={() => handleToggleReaction(post.id, activeEmoji)}
                                className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-full bg-primary/15 text-primary border border-primary/30 shadow-2xs font-medium text-xs hover:bg-primary/20 transition-all active:scale-95"
                              >
                                <span className="text-base leading-none">{activeEmoji}</span>
                                <span className="font-semibold text-foreground">
                                  {(post.reactionsCount || 0) > 0 ? post.reactionsCount : 1}
                                </span>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleToggleReaction(post.id, '👍')}
                                className="flex items-center gap-1.5 py-1.5 px-2.5 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-all active:scale-95 border border-transparent"
                              >
                                <ThumbsUp className="w-4 h-4 transition-transform group-hover:-rotate-12" />
                                <span className="font-medium">
                                  {(post.reactionsCount || 0) > 0 ? post.reactionsCount : 'إعجاب'}
                                </span>
                              </button>
                            )}

                            {/* Hover Reaction Menu (WhatsApp style) with zero dead zone bridge */}
                            <div className="absolute bottom-[calc(100%-8px)] right-0 pb-2.5 hidden group-hover:flex items-center z-50">
                              <div className="flex items-center gap-1 p-1.5 rounded-full bg-background/95 backdrop-blur-md border border-border/80 shadow-xl animate-in zoom-in-90 fade-in duration-200">
                                {['👍', '❤️', '😂', '😮', '😢', '🙏'].map((emoji) => (
                                  <button
                                    key={emoji}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleReaction(post.id, emoji);
                                    }}
                                    className={`w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-lg sm:text-xl transition-all hover:scale-125 hover:bg-muted/80 active:scale-95 ${
                                      activeEmoji === emoji ? 'bg-primary/20 scale-110 ring-1 ring-primary' : ''
                                    }`}
                                    title={`تفاعل بـ ${emoji}`}
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <button
                      onClick={() => fetchComments(post.id)}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors py-1.5 px-2 rounded-lg hover:bg-primary/10"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentsCount || 0} تعليق</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2">
                    <button 
                      onClick={() => handleToggleSave(post.id)}
                      className={`flex items-center gap-1.5 transition-colors py-1.5 px-2 rounded-lg ${isSaved(post.id) ? 'text-primary bg-primary/10' : 'hover:text-primary hover:bg-primary/10'}`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved(post.id) ? 'fill-current' : ''}`} />
                      <span className="hidden sm:inline">{isSaved(post.id) ? 'محفوظ' : 'حفظ'}</span>
                    </button>
                    <button 
                      onClick={() => handleShare(post.id)}
                      className={`flex items-center gap-1.5 transition-colors py-1.5 px-2 rounded-lg ${copiedPostId === post.id ? 'text-emerald-500 bg-emerald-500/10' : 'hover:text-primary hover:bg-primary/10'}`}
                    >
                      {copiedPostId === post.id ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copiedPostId === post.id ? 'تم النسخ' : 'مشاركة'}</span>
                    </button>
                  </div>
                </div>

                  {/* Comments & Accepted Answers Tree */}
                  {activeCommentPostId === post.id && (
                    <div className="pt-4 border-t border-border mt-4">
                      <div className="space-y-4 pl-2 pr-2 border-r-2 border-border/50 mr-2">
                        {(commentsMap[post.id] || []).map((cmt) => (
                          <div
                            key={cmt.id}
                            className={`p-4 rounded-xl text-xs space-y-2 border relative transition-colors ${
                              cmt.isAccepted
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-foreground shadow-sm'
                                : cmt.isTeacherAnswer
                                ? 'bg-amber-500/10 border-amber-500/30 text-foreground'
                                : 'bg-card border-border text-foreground hover:bg-muted/30 shadow-sm'
                            }`}
                          >
                            {/* Thread Connector */}
                            <div className="absolute w-4 h-px bg-border/80 top-6 -right-[18px]" />
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-[10px] shrink-0">
                                  {cmt.authorName ? (cmt.authorName || 'ع').substring(0, 2) : 'ع'}
                                </div>
                                <span className="font-bold text-[13px]">
                                  {cmt.authorName 
                                    ? (cmt.isTeacherAnswer ? cmt.authorName : cmt.authorName.split(' ').slice(0, 2).join(' '))
                                    : 'عضو'
                                  }
                                </span>
                                {cmt.isTeacherAnswer && (
                                  <Badge className="bg-amber-500/20 text-amber-600 text-[9px] gap-1 px-1.5 py-0">
                                    <ShieldCheck className="w-3 h-3 text-amber-500" /> إجابة محاضر
                                  </Badge>
                                )}
                              </div>

                              {cmt.isAccepted ? (
                                <Badge className="bg-emerald-600 text-white text-[10px] gap-1 px-1.5 py-0 shadow-sm">
                                  <Check className="w-3 h-3" /> إجابة معتمدة
                                </Badge>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleMarkAccepted(post.id, cmt.id)}
                                  className="h-6 text-[10px] text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 px-2 rounded-lg"
                                >
                                  اعتماد كإجابة
                                </Button>
                              )}
                            </div>
                            <PostContentRenderer content={cmt.content} isComment className="pl-2 pt-1" />
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Input
                          placeholder="اكتب تعليقك أو إجابتك..."
                          value={replyInputMap[post.id] || ''}
                          onChange={(e) =>
                            setReplyInputMap({ ...replyInputMap, [post.id]: e.target.value })
                          }
                          onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                          className="h-9 rounded-xl text-xs flex-1"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleAddComment(post.id)}
                          className="h-9 px-4 rounded-xl text-xs"
                        >
                          إجابة
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {/* Infinite Scroll Trigger */}
            {nextCursor && (
              <div className="flex justify-center py-6">
                <Button 
                  variant="outline" 
                  className="rounded-xl border-dashed"
                  onClick={loadMorePosts}
                  disabled={loadingMore}
                >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {loadingMore ? 'جاري التحميل...' : 'عرض المزيد'}
                </Button>
              </div>
            )}
            
            {/* Scroll Anchor for Latest Message / Bottom of Feed */}
            <div ref={messagesEndRef} className="h-4 w-full" />
          </div>


        </div>
      </div>
    </div>

      {/* ── Floating Scroll to Latest Message Button (Bottom Right) ── */}
      {posts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
          <button
            onClick={scrollToLatestMessage}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-900 dark:bg-amber-500 text-white font-bold text-xs shadow-2xl backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 group"
            title="الانتقال لآخر محادثة / رسالة"
          >
            <ArrowDown className="w-4 h-4 text-amber-400 dark:text-slate-950 animate-bounce" />
            <span>آخر محادثة</span>
          </button>
        </div>
      )}

      {/* ── Floating AI Chat Widget ── */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-3" dir="rtl">
        {/* Chat Panel */}
        {isChatOpen && (
          <div className="w-[340px] sm:w-[380px] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary/10 to-indigo-500/10 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm text-foreground">مساعد {space?.name || 'المجتمع'}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
                    متاح دايماً
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[340px] scrollbar-none">
              {chatMessages.length === 0 && (
                <div className="text-center py-6 space-y-2">
                  <div className="text-3xl">🤖</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    أهلاً يا بطل! أنا المساعد الذكي لمجتمع{' '}
                    <span className="font-semibold text-foreground">{space?.name}</span>.
                    <br />اسألني أي سؤال في المادة وهرد عليك على طول 🎯
                  </p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-foreground rounded-tl-sm p-0 overflow-hidden'
                    }`}
                  >
                    {msg.role === 'bot'
                      ? <div className="px-3 py-2"><AiAnswerRenderer content={msg.text} compact /></div>
                      : msg.text
                    }
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-sm px-3 py-2 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-border bg-muted/30 flex items-center gap-2">
              <Input
                placeholder="اسأل أي سؤال في المادة..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                className="flex-1 h-9 rounded-xl text-xs bg-background border-border focus-visible:ring-1"
                dir="rtl"
              />
              <Button
                size="sm"
                onClick={handleChatSend}
                disabled={chatLoading || !chatInput.trim()}
                className="h-9 w-9 p-0 rounded-xl bg-primary hover:bg-primary/90 shrink-0"
              >
                {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => {
            setIsChatOpen(prev => !prev);
            if (!isChatOpen && chatMessages.length === 0) {
              // no-op, greeting shown inline
            }
          }}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
            isChatOpen
              ? 'bg-muted border border-border text-muted-foreground'
              : 'bg-primary text-primary-foreground shadow-primary/30'
          }`}
        >
          {isChatOpen ? <X className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
        </button>
      </div>
    </>
  );
}
