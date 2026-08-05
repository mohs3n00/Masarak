'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, PlusCircle, Users, Flame, Sparkles, BookOpen, CheckCircle2,
  TrendingUp, Globe, Compass, Atom, Calculator, FlaskConical, Dna,
  Languages, Laptop, Heart, MessageSquare, Clock, UserCheck,
  UserPlus, GraduationCap, Layers, Star, ArrowLeft, ChevronLeft,
  ChevronDown, ChevronUp, Menu, X, Loader2, Bookmark, Crown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createCommunityApi } from '@/features/community/services/community-api.service';
import { CommunitySpace } from '@/features/community/types';
import { CreateCommunityWizard } from '@/features/community/components/CreateCommunityWizard';
import { useCommunityStore } from '@/features/community/store/community.store';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast } from 'sonner';
import { AppContainer } from '@/shared/layouts/Containers';

// ─── Constants ────────────────────────────────────────────────────────────────

// Category enum values as stored in Appwrite — must match backend exactly
const GRADE_CATEGORIES: Record<number, string> = {
  1: 'SECONDARY_GRADE_1',
  2: 'SECONDARY_GRADE_2',
  3: 'SECONDARY_GRADE_3',
};

const GRADE_LABELS: Record<number, string> = {
  1: 'الصف الأول الثانوي',
  2: 'الصف الثاني الثانوي',
  3: 'الصف الثالث الثانوي',
};

const SUBJECTS = [
  { key: 'physics',   label: 'الفيزياء',           icon: Atom,         tags: ['physics','فيزياء','physical','فيز'] },
  { key: 'chemistry', label: 'الكيمياء',            icon: FlaskConical, tags: ['chemistry','كيمياء','chem','كيم'] },
  { key: 'math',      label: 'الرياضيات',           icon: Calculator,  tags: ['math','رياضيات','mathematics','maths','رياض'] },
  { key: 'biology',   label: 'الأحياء',             icon: Dna,          tags: ['biology','أحياء','bio','حياء'] },
  { key: 'arabic',    label: 'اللغة العربية',        icon: Languages,   tags: ['arabic','عربي','عرب','arab'] },
  { key: 'english',   label: 'اللغة الإنجليزية',    icon: Globe,       tags: ['english','إنجليزي','eng','إنجليز'] },
  { key: 'geology',   label: 'الجيولوجيا',          icon: Layers,      tags: ['geology','جيولوجيا','geo'] },
  { key: 'history',   label: 'التاريخ',             icon: BookOpen,    tags: ['history','تاريخ','hist'] },
  { key: 'cs',        label: 'علوم الحاسب',          icon: Laptop,      tags: ['cs','computer','حاسب','programming','كمبيوتر'] },
] as const;

function matchSubject(space: CommunitySpace): string | null {
  const hay = [space.name, space.slug, ...(space.tags || []), space.subject || ''].join(' ').toLowerCase();
  for (const s of SUBJECTS) {
    if (s.tags.some(t => hay.includes(t.toLowerCase()))) return s.key;
  }
  return null;
}

function relTime(d?: string) {
  if (!d) return 'نشط مؤخراً';
  const mins = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (mins < 60)  return `منذ ${Math.max(1,mins)} دقيقة`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `منذ ${hrs} ساعة`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'منذ يوم';
  if (days <= 10) return `منذ ${days} أيام`;
  return `منذ ${days} يوماً`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActiveFilter {
  grade: 1 | 2 | 3 | null; // null = discover mode (all communities)
  subject: string | null;
  search: string;
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CommunityDiscoverPage() {
  const [discoverData, setDiscoverData] = useState<{
    trending: CommunitySpace[]; forYou: CommunitySpace[]; new: CommunitySpace[];
    highestGrowth: CommunitySpace[]; mostDiscussed: CommunitySpace[]; recommendedTeachers: CommunitySpace[];
  } | null>(null);
  const [gradeSpaces, setGradeSpaces] = useState<CommunitySpace[]>([]);
  const [searchSpaces, setSearchSpaces] = useState<CommunitySpace[]>([]);
  const [loading, setLoading] = useState(true);

  // Start with null grade = show discover / all communities
  const [filter, setFilter] = useState<ActiveFilter>({ grade: null, subject: null, search: '' });
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [expandedStage, setExpandedStage] = useState(true);
  const { joinedSpaceIds, toggleJoinSpace } = useCommunityStore();
  const user = useAuthStore((s) => s.user);

  // ─── Fetch ──────────────────────────────────────────────────────────────────

  const fetchData = useCallback(async () => {
    setLoading(true);
    const api = createCommunityApi();
    try {
      if (filter.search.trim()) {
        // Search mode — use search param, status=APPROVED always
        const res = await api.getSpaces({ status: 'APPROVED', search: filter.search.trim() });
        setSearchSpaces(Array.isArray(res) ? res : []);
        setGradeSpaces([]);
        setDiscoverData(null);
      } else if (filter.grade !== null) {
        // Grade mode — filter by category (the correct Appwrite field)
        const category = GRADE_CATEGORIES[filter.grade];
        const res = await api.getSpaces({ status: 'APPROVED', category });
        setGradeSpaces(Array.isArray(res) ? res : []);
        setSearchSpaces([]);
        setDiscoverData(null);
      } else {
        // Discover mode — no grade selected, show all via discover endpoint
        // Fallback: if discover fails, load all APPROVED communities
        try {
          const data = await api.discoverSpaces();
          const safeData = (data && !Array.isArray(data)) ? data : null;
          if (
            safeData &&
            (
              (safeData.trending?.length ?? 0) > 0 ||
              (safeData.forYou?.length ?? 0) > 0 ||
              (safeData.new?.length ?? 0) > 0 ||
              (safeData.highestGrowth?.length ?? 0) > 0
            )
          ) {
            setDiscoverData(safeData);
          } else {
            // Discover returned empty — fall back to all APPROVED
            const allRes = await api.getSpaces({ status: 'APPROVED' });
            const all = Array.isArray(allRes) ? allRes : [];
            setDiscoverData({
              trending: all.slice(0, 6),
              forYou: [],
              new: all.slice(6, 12),
              highestGrowth: [],
              mostDiscussed: [],
              recommendedTeachers: [],
            });
          }
        } catch {
          const allRes = await api.getSpaces({ status: 'APPROVED' });
          const all = Array.isArray(allRes) ? allRes : [];
          setDiscoverData({
            trending: all.slice(0, 6),
            forYou: [],
            new: all.slice(6, 12),
            highestGrowth: [],
            mostDiscussed: [],
            recommendedTeachers: [],
          });
        }
        setGradeSpaces([]);
        setSearchSpaces([]);
      }
    } catch {
      setSearchSpaces([]); setGradeSpaces([]);
    } finally {
      setLoading(false);
    }
  }, [filter.grade, filter.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const toggleJoin = async (e: React.MouseEvent, spaceId: string) => {
    e.preventDefault(); e.stopPropagation();
    const isCurrentlyJoined = joinedSpaceIds.includes(spaceId);
    const api = createCommunityApi();
    try {
      if (isCurrentlyJoined) {
        await api.leaveSpace(spaceId);
      } else {
        await api.joinSpace(spaceId);
      }
      toggleJoinSpace(spaceId);
      toast.success(isCurrentlyJoined ? 'تم مغادرة المجتمع' : 'تم الانضمام بنجاح');
    } catch (err: any) {
      console.error('[toggleJoin] Error:', err);
      toast.error('حدث خطأ أثناء تغيير حالة الانضمام');
    }
  };

  // ─── Derived data ────────────────────────────────────────────────────────────

  // Subject grouping of grade spaces (client-side, uses name/slug/subject/tags)
  const subjectCarousels = useMemo(() => {
    if (!gradeSpaces.length) return [];
    const grouped: Record<string, CommunitySpace[]> = {};
    const other: CommunitySpace[] = [];
    const GRADE_CATEGORIES_TO_SHOW = SUBJECTS;
    GRADE_CATEGORIES_TO_SHOW.forEach(c => { grouped[c.key] = []; });

    gradeSpaces.forEach(space => {
      const match = matchSubject(space);
      if (match && grouped[match]) {
        grouped[match].push(space);
      } else {
        other.push(space);
      }
    });

    const result = GRADE_CATEGORIES_TO_SHOW
      .filter(s => grouped[s.key]?.length)
      .map(s => ({ ...s, spaces: grouped[s.key] }));
    if (other.length) (result as any[]).push({ key: 'other', label: 'مواد أخرى', icon: BookOpen, tags: [], spaces: other });
    return result;
  }, [gradeSpaces]);

  const subjectSpaces = useMemo(() => {
    if (!filter.subject || !gradeSpaces.length) return null;
    const subj = SUBJECTS.find(s => s.key === filter.subject);
    if (!subj) return null;
    const filtered = gradeSpaces.filter(sp => matchSubject(sp) === filter.subject);
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    return {
      label: subj.label,
      trending: [...filtered].sort((a,b) => (b.weeklyActivityScore||0)-(a.weeklyActivityScore||0)).slice(0, 6),
      official: filtered.filter(s => s.type === 'DEFAULT_ACADEMIC'),
      fresh: filtered.filter(s => Date.now() - new Date(s.createdAt).getTime() < weekMs * 4),
    };
  }, [filter.subject, gradeSpaces]);

  // All spaces for joined sidebar
  const allKnownSpaces = useMemo(() => {
    const arr = discoverData
      ? [...(discoverData.trending||[]), ...(discoverData.forYou||[]), ...(discoverData.new||[]), ...(discoverData.highestGrowth||[]), ...(discoverData.mostDiscussed||[]), ...(discoverData.recommendedTeachers||[])]
      : gradeSpaces;
    return Array.from(new Map(arr.map(s => [s.slug, s])).values());
  }, [discoverData, gradeSpaces]);

  const joinedList = useMemo(() => {
    return allKnownSpaces.filter(s => 
      joinedSpaceIds.includes(s.id) || 
      joinedSpaceIds.includes(s.slug) || 
      Boolean(user && (s.createdById === user.id || (s.createdByName && s.createdByName === user.name)))
    );
  }, [allKnownSpaces, joinedSpaceIds, user]);

  const myCreatedSpaces = useMemo(() => {
    if (!user) return [];
    return allKnownSpaces.filter(s => s.createdById === user.id || (s.createdByName && s.createdByName === user.name));
  }, [allKnownSpaces, user]);

  // ─── Community Card ──────────────────────────────────────────────────────────

  const renderCard = (space: CommunitySpace) => {
    const SubjMatch = SUBJECTS.find(s => s.tags.some(t => [space.slug, ...(space.tags||[]), space.subject||''].join(' ').toLowerCase().includes(t.toLowerCase())));
    const IconComp = SubjMatch ? SubjMatch.icon : BookOpen;
    const targetSpaceId = space.id || (space as any).$id || space.slug;
    const isCreator = Boolean(user && (space.createdById === user.id || (space.createdByName && space.createdByName === user.name)));
    const isJoined = isCreator || joinedSpaceIds.includes(targetSpaceId) || joinedSpaceIds.includes(space.id) || (!!space.slug && joinedSpaceIds.includes(space.slug));
    return (
      <div key={targetSpaceId}
        className="group relative p-5 rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden">
        <Link href={`/community/${space.slug}`} className="block">
          <div className="relative h-24 -mx-5 -mt-5 mb-4 bg-gradient-to-r from-primary/20 via-primary/10 to-indigo-500/20 overflow-hidden">
            {space.coverUrl && <img src={space.coverUrl} alt={space.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              <Badge variant="outline" className="text-[10px] font-mono bg-background/90 backdrop-blur-md">{space.communityId}</Badge>
              {space.type === 'DEFAULT_ACADEMIC' && (
                <Badge variant="outline" className="text-[10px] bg-primary/90 text-white border-transparent gap-1">
                  <CheckCircle2 className="w-3 h-3" /> رسمي
                </Badge>
              )}
            </div>
          </div>
        </Link>
        <div className="space-y-3">
          <div className="flex items-end justify-between -mt-9 mb-2">
            <Link href={`/community/${space.slug}`}>
              <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xl flex items-center justify-center shadow-lg border-2 border-card overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                {space.avatarUrl ? <img src={space.avatarUrl} alt={space.name} className="w-full h-full object-cover" /> : <IconComp className="w-7 h-7" />}
              </div>
            </Link>
            {isCreator ? (
              <Badge className="h-8 px-3.5 rounded-xl text-xs font-extrabold gap-1.5 z-20 relative bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm flex items-center">
                <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" /> المؤسس والمشرف
              </Badge>
            ) : (
              <Button size="sm" type="button" variant={isJoined ? 'outline' : 'primary'} onClick={(e) => toggleJoin(e, targetSpaceId)}
                className={`h-9 px-4 rounded-xl text-xs font-semibold gap-1.5 z-20 relative ${isJoined ? 'border-emerald-500/30 text-emerald-600 bg-emerald-500/10 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20'}`}>
                {isJoined ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {isJoined ? 'منضم' : 'انضمام'}
              </Button>
            )}
          </div>
          <Link href={`/community/${space.slug}`} className="block space-y-1">
            <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{space.name}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
              {space.description || 'مجتمع أكاديمي لمتابعة الأسئلة والمشاركات التعليمية.'}
            </p>
          </Link>
          <div className="flex flex-wrap gap-1 pt-1">
            {(space.tags || ['مسارك']).slice(0, 3).map(t => (
              <span key={t} className="text-[10px] px-2 py-0.5 rounded-md bg-muted/60 text-muted-foreground">#{t}</span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-foreground"><Users className="w-3.5 h-3.5 text-primary" />{(space.createdById === 'SYSTEM' || space.type === 'DEFAULT_ACADEMIC') && space.membersCount === 1 ? 0 : (space.membersCount ?? 0)}</span>
            <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5 text-emerald-500" />{space.postsCount || 0}</span>
          </div>
          <span className="text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" /> نشط {relTime(space.createdAt)}</span>
        </div>
      </div>
    );
  };

  // ─── Section Header ──────────────────────────────────────────────────────────

  const SH = ({ icon: Icon, title, subtitle, ib, ic }: any) => (
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-2.5 rounded-2xl ${ib} ${ic}`}><Icon className="w-5 h-5" /></div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-foreground">{title}</h2>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  );

  // ─── Loading skeleton ─────────────────────────────────────────────────────────

  const LoadingSkeleton = () => (
    <div className="w-full bg-background min-h-screen pt-32 md:pt-40 pb-24">
      <AppContainer>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 rounded-2xl bg-card border border-border shadow-card animate-pulse p-4 space-y-4">
              <div className="h-20 bg-muted rounded-xl" />
              <div className="h-4 bg-muted rounded-xl w-3/4" />
              <div className="h-3 bg-muted rounded-xl w-1/2" />
            </div>
          ))}
        </div>
      </AppContainer>
    </div>
  );

  // ─── Sidebar ──────────────────────────────────────────────────────────────────

  const Sidebar = () => (
    <div className="space-y-5">
      {/* Academic hierarchy */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-card space-y-3">
        <div className="flex items-center justify-between font-bold text-sm text-foreground">
          <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-primary" />الهيكل الأكاديمي</span>
          <button onClick={() => setExpandedStage(!expandedStage)} className="text-muted-foreground hover:text-foreground">
            {expandedStage ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
        {expandedStage && (
          <div className="space-y-1 text-xs">
            {/* "All communities" option */}
            <button onClick={() => setFilter(f => ({ ...f, grade: null, subject: null }))}
              className={`w-full text-right flex items-center gap-2 p-2.5 rounded-xl transition-colors ${filter.grade === null ? 'bg-primary/10 text-primary font-bold' : 'text-muted-foreground hover:bg-muted/40'}`}>
              <Globe className="w-3.5 h-3.5 shrink-0" />جميع المجتمعات
            </button>
            <div className="p-2.5 rounded-xl bg-muted/30 font-semibold text-foreground flex items-center justify-between mt-1">
              <span>المرحلة الثانوية</span>
              <Badge variant="outline" className="text-[9px]">رسمي</Badge>
            </div>
            <div className="pr-3 space-y-1">
              {([3, 2, 1] as const).map(g => (
                <button key={g} onClick={() => setFilter(f => ({ ...f, grade: g, subject: null }))}
                  className={`w-full text-right flex items-center justify-between p-2 rounded-xl transition-colors ${filter.grade === g ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'}`}>
                  <span>• {GRADE_LABELS[g]}</span>
                  {g === 3 && <Badge variant="outline" className="text-[9px] opacity-70">موصى به</Badge>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subject filter — only when grade is selected and we have data */}
      {filter.grade !== null && subjectCarousels.length > 0 && (
        <div className="p-5 rounded-2xl bg-card border border-border shadow-card space-y-2">
          <div className="font-bold text-sm text-foreground flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" />المواد الدراسية
          </div>
          <div className="space-y-1 text-xs">
            <button onClick={() => setFilter(f => ({ ...f, subject: null }))}
              className={`w-full text-right px-3 py-2 rounded-xl transition-colors flex items-center justify-between ${!filter.subject ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:bg-muted/50'}`}>
              <span>جميع مواد الصف</span>
              <Badge variant="outline" className="text-[9px]">{gradeSpaces.length}</Badge>
            </button>
            {subjectCarousels.map(s => {
              const Icon = s.icon as any;
              return (
                <button key={s.key} onClick={() => setFilter(f => ({ ...f, subject: s.key }))}
                  className={`w-full text-right px-3 py-2 rounded-xl transition-colors flex items-center gap-2 ${filter.subject === s.key ? 'bg-primary text-primary-foreground font-bold' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
                  <Icon className="w-3.5 h-3.5 shrink-0" />{s.label}
                  <Badge variant="outline" className="text-[9px] mr-auto">{s.spaces.length}</Badge>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Joined communities */}
      {joinedList.length > 0 && (
        <div className="p-5 rounded-2xl bg-card border border-border shadow-card space-y-3">
          <div className="font-bold text-sm text-foreground flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />مجتمعاتك
          </div>
          <div className="space-y-1">
            {joinedList.map(sp => {
              const isOwner = Boolean(user && (sp.createdById === user.id || (sp.createdByName && sp.createdByName === user.name)));
              return (
                <Link key={sp.id} href={`/community/${sp.slug}`}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors text-xs">
                  <span className="font-bold text-foreground truncate flex items-center gap-1.5">
                    {isOwner && <span title="أنت المؤسس والمشرف"><Crown className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500/20" /></span>}
                    {sp.name}
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
      {/* Bookmarks */}
      <div className="p-5 rounded-2xl bg-card border border-border shadow-card space-y-3">
        <div className="font-bold text-sm text-foreground flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />المحفوظات
        </div>
        <div className="space-y-1">
          <Link href="/community/bookmarks" className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/50 transition-colors text-xs text-muted-foreground hover:text-foreground">
            <span className="font-bold">تصفح المحفوظات الخاصة بك</span>
            <ChevronLeft className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );

  // ─── Main content ──────────────────────────────────────────────────────────────

  const renderMain = () => {
    if (loading) return <LoadingSkeleton />;

    // Search mode
    if (filter.search.trim()) {
      if (!searchSpaces.length) return (
        <div className="p-12 rounded-2xl bg-card border border-border shadow-card text-center space-y-4">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-bold">لم نجد نتائج لـ "{filter.search}"</h3>
          <Button onClick={() => setIsWizardOpen(true)} className="rounded-xl gap-2">
            <PlusCircle className="w-4 h-4" /> تأسيس مجتمع جديد
          </Button>
        </div>
      );
      return (
        <section className="space-y-4">
          <SH icon={Search} title={`نتائج: "${filter.search}"`} subtitle={`${searchSpaces.length} مجتمع`} ib="bg-primary/10" ic="text-primary" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{searchSpaces.map(renderCard)}</div>
        </section>
      );
    }

    // Grade selected → subject drill-down
    if (filter.grade !== null) {
      const gradeName = GRADE_LABELS[filter.grade];

      // Subject selected
      if (filter.subject && subjectSpaces) {
        const subj = SUBJECTS.find(s => s.key === filter.subject)!;
        const Icon = subj.icon as any;
        return (
          <div className="space-y-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <button onClick={() => setFilter(f => ({ ...f, subject: null }))}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />{gradeName}
              </button>
              <span className="text-muted-foreground">/</span>
              <span className="font-bold text-foreground">{subjectSpaces.label}</span>
            </div>

            {subjectSpaces.trending.length > 0 && (
              <section className="space-y-4">
                <SH icon={Flame} title={`الأكثر نشاطاً في ${subjectSpaces.label}`} subtitle="مرتبة حسب النشاط الأسبوعي" ib="bg-amber-500/10" ic="text-amber-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{subjectSpaces.trending.map(renderCard)}</div>
              </section>
            )}
            {subjectSpaces.official.length > 0 && (
              <section className="space-y-4">
                <SH icon={CheckCircle2} title={`مجتمعات ${subjectSpaces.label} الرسمية`} subtitle="معتمدة من مسارك" ib="bg-primary/10" ic="text-primary" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{subjectSpaces.official.map(renderCard)}</div>
              </section>
            )}
            {subjectSpaces.fresh.length > 0 && (
              <section className="space-y-4">
                <SH icon={Sparkles} title={`أحدث مجتمعات ${subjectSpaces.label}`} subtitle="أُنشئت خلال الشهر الماضي" ib="bg-blue-500/10" ic="text-blue-500" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{subjectSpaces.fresh.map(renderCard)}</div>
              </section>
            )}
            {!subjectSpaces.trending.length && !subjectSpaces.official.length && (
              <div className="p-12 rounded-2xl bg-card border border-border shadow-card text-center space-y-4">
                <Icon className="w-12 h-12 text-muted-foreground mx-auto" />
                <h3 className="text-xl font-bold">لا يوجد مجتمعات {subjectSpaces.label} بعد</h3>
                <Button onClick={() => setIsWizardOpen(true)} className="rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> أسس أول مجتمع</Button>
              </div>
            )}
          </div>
        );
      }

      // Grade without subject — show subject carousels (or all if no subject match)
      if (!gradeSpaces.length) return (
        <div className="p-12 rounded-2xl bg-card border border-border shadow-card text-center space-y-4">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto" />
          <h3 className="text-xl font-bold">لا توجد مجتمعات لـ {gradeName} بعد</h3>
          <p className="text-xs text-muted-foreground">كن أول من يؤسس مجتمع لصفك!</p>
          <Button onClick={() => setIsWizardOpen(true)} className="rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> تأسيس مجتمع</Button>
        </div>
      );

      return (
        <div className="space-y-10">
          <div className="flex items-center gap-3 pb-2 border-b border-border">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg text-foreground">{gradeName}</h2>
            <Badge variant="outline" className="text-xs">{gradeSpaces.length} مجتمع</Badge>
          </div>

          {/* If subjects are grouped, show carousels */}
          {subjectCarousels.length > 0 ? (
            subjectCarousels.map(subj => {
              const Icon = subj.icon as any;
              return (
                <section key={subj.key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-primary/10 text-primary"><Icon className="w-5 h-5" /></div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">مجتمعات {subj.label}</h2>
                        <p className="text-xs text-muted-foreground">{subj.spaces.length} مجتمع متاح</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs gap-1 rounded-xl"
                      onClick={() => setFilter(f => ({ ...f, subject: subj.key }))}>
                      عرض الكل <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {subj.spaces.slice(0, 3).map(renderCard)}
                  </div>
                </section>
              );
            })
          ) : (
            // No subject match — show all grade communities as flat grid
            <section className="space-y-4">
              <SH icon={BookOpen} title={`جميع مجتمعات ${gradeName}`} subtitle="جميع المجتمعات المتاحة" ib="bg-primary/10" ic="text-primary" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{gradeSpaces.map(renderCard)}</div>
            </section>
          )}
        </div>
      );
    }

    // Discover mode — all communities
    if (!discoverData) return (
      <div className="p-12 rounded-2xl bg-card border border-border shadow-card text-center space-y-4">
        <Loader2 className="w-12 h-12 text-muted-foreground mx-auto animate-spin" />
        <h3 className="text-xl font-bold">جاري تحميل المجتمعات...</h3>
      </div>
    );

    const hasSections = (discoverData.trending?.length||0) + (discoverData.forYou?.length||0) + (discoverData.new?.length||0) + (discoverData.highestGrowth?.length||0) + (discoverData.recommendedTeachers?.length||0) > 0;

    if (!hasSections) return (
      <div className="p-12 rounded-2xl bg-card border border-border shadow-card text-center space-y-4">
        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
        <h3 className="text-xl font-bold">لا توجد مجتمعات معتمدة بعد</h3>
        <p className="text-xs text-muted-foreground">اختار صفك الدراسي أو أسس مجتمعك الأول</p>
        <Button onClick={() => setIsWizardOpen(true)} className="rounded-xl gap-2"><PlusCircle className="w-4 h-4" /> تأسيس مجتمع جديد</Button>
      </div>
    );

    return (
      <div className="space-y-12">
        {myCreatedSpaces.length > 0 && (
          <section className="space-y-4">
            <SH icon={Crown} title="المجتمعات التي أنشأتها وتديرها 👑" subtitle="بصفتك مالك ومؤسس هذه المجتمعات الأكاديمية" ib="bg-amber-500/15" ic="text-amber-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{myCreatedSpaces.map(renderCard)}</div>
          </section>
        )}
        {(discoverData.trending?.length||0) > 0 && (
          <section className="space-y-4">
            <SH icon={Flame} title="الأكثر نشاطاً هذا الأسبوع 🔥" subtitle="أعلى المجتمعات تفاعلاً وإجابات" ib="bg-amber-500/10" ic="text-amber-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{discoverData.trending.map(renderCard)}</div>
          </section>
        )}
        {(discoverData.forYou?.length||0) > 0 && (
          <section className="space-y-4">
            <SH icon={Heart} title="المقترحة لك ⭐" subtitle="مجتمعات مخصصة لصفك وموادك" ib="bg-primary/10" ic="text-primary" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{discoverData.forYou.map(renderCard)}</div>
          </section>
        )}
        {(discoverData.highestGrowth?.length||0) > 0 && (
          <section className="space-y-4">
            <SH icon={TrendingUp} title="الأسرع نمواً 🚀" subtitle="مجتمعات تشهد إقبالاً كبيراً" ib="bg-indigo-500/10" ic="text-indigo-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{discoverData.highestGrowth.map(renderCard)}</div>
          </section>
        )}
        {(discoverData.recommendedTeachers?.length||0) > 0 && (
          <section className="space-y-4">
            <SH icon={UserCheck} title="مجتمعات المعلمين 👨‍🏫" subtitle="تواصل مع أفضل المعلمين" ib="bg-emerald-500/10" ic="text-emerald-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{discoverData.recommendedTeachers.map(renderCard)}</div>
          </section>
        )}
        {(discoverData.new?.length||0) > 0 && (
          <section className="space-y-4">
            <SH icon={Sparkles} title="المجتمعات الجديدة 🆕" subtitle="مجتمعات تم اعتمادها حديثاً" ib="bg-blue-500/10" ic="text-blue-500" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{discoverData.new.map(renderCard)}</div>
          </section>
        )}
      </div>
    );
  };

  // ─── Layout ───────────────────────────────────────────────────────────────────

  const totalCount = gradeSpaces.length || searchSpaces.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 dir-rtl text-right">
      {/* Hero */}
      <div className="relative overflow-hidden pt-32 sm:pt-36 md:pt-40 pb-10 border-b border-border/40">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl text-center md:text-right">
              <div className="lg:hidden flex justify-center md:justify-start">
                <Button size="sm" variant="outline" onClick={() => setIsMobileSidebarOpen(true)} className="rounded-xl text-xs gap-1.5">
                  <Menu className="w-4 h-4" /> التصفية
                </Button>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                منصة النقاش والتعاون الأكاديمي التفاعلية
              </h1>
              <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="ابحث باسم المجتمع، المادة، الوسم..."
                    value={filter.search}
                    onChange={e => setFilter(f => ({ ...f, search: e.target.value, grade: null }))}
                    className="pr-10 h-11 rounded-2xl text-xs sm:text-sm bg-background border-border shadow-sm" />
                </div>
                <Button onClick={() => setIsWizardOpen(true)}
                  className="w-full sm:w-auto h-11 px-5 rounded-2xl gap-2 font-semibold text-xs sm:text-sm bg-primary hover:bg-primary/90 shadow-md shadow-primary/25">
                  <PlusCircle className="w-4 h-4" />تأسيس مجتمع جديد
                </Button>
              </div>
              {totalCount > 0 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-background/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border/60">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span><strong className="text-foreground">{totalCount}</strong> مجتمع أكاديمي لـ {filter.grade ? GRADE_LABELS[filter.grade] : ''}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-background p-5 overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <span className="font-bold text-base">التصفية</span>
              <button onClick={() => setIsMobileSidebarOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main layout */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block space-y-6 shrink-0"><Sidebar /></aside>
          <main className="lg:col-span-3 space-y-12">{renderMain()}</main>
        </div>
      </div>

      <CreateCommunityWizard isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} onSuccess={() => fetchData()} />
    </div>
  );
}
