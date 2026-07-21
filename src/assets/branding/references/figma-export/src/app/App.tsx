import { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import logoLight from "@/imports/Artboard_1.png";
import logoIcon from "@/imports/Artboard_2.png";
import logoDark from "@/imports/Artboard_4.png";
import {
  BookOpen, Users, Star, Play, ChevronLeft, ChevronRight,
  Menu, X, Sun, Moon, Search, Bell, ArrowLeft, ArrowRight,
  CheckCircle, Trophy, TrendingUp, Layers, Zap, Globe,
  MessageSquare, Download, Clock, Award, BarChart2,
  Shield, Heart, Bookmark, ChevronDown
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type View = "landing" | "student" | "teacher" | "course";

// ─── Data ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 1, name: "الرياضيات", nameEn: "Mathematics", icon: "📐", count: 142, color: "#e8fdf2" },
  { id: 2, name: "اللغة العربية", nameEn: "Arabic Language", icon: "✍️", count: 98, color: "#fdf8e8" },
  { id: 3, name: "الفيزياء", nameEn: "Physics", icon: "⚛️", count: 76, color: "#e8f0fd" },
  { id: 4, name: "الكيمياء", nameEn: "Chemistry", icon: "🧪", count: 65, color: "#fde8f0" },
  { id: 5, name: "الأحياء", nameEn: "Biology", icon: "🔬", count: 54, color: "#fdf5e8" },
  { id: 6, name: "اللغة الإنجليزية", nameEn: "English", icon: "🌍", count: 120, color: "#e8fdfd" },
];

const COURSES = [
  {
    id: 1, title: "رياضيات الثانوية العامة — الشامل", teacher: "أ. محمد حسام",
    teacherAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format",
    rating: 4.9, students: 12400, price: 299, originalPrice: 499,
    thumb: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=225&fit=crop&auto=format",
    badge: "الأكثر مبيعاً", category: "الرياضيات", lessons: 84, hours: 62,
  },
  {
    id: 2, title: "فيزياء متقدمة — الثانوية العامة", teacher: "د. سارة الجمال",
    teacherAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    rating: 4.8, students: 8750, price: 249, originalPrice: 399,
    thumb: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=225&fit=crop&auto=format",
    badge: "جديد", category: "الفيزياء", lessons: 72, hours: 54,
  },
  {
    id: 3, title: "تأسيس في اللغة العربية والنحو", teacher: "أ. عمر فاروق",
    teacherAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&auto=format",
    rating: 4.9, students: 15600, price: 199, originalPrice: 349,
    thumb: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=225&fit=crop&auto=format",
    badge: "الأكثر تقييماً", category: "اللغة العربية", lessons: 96, hours: 72,
  },
  {
    id: 4, title: "كيمياء عضوية شاملة", teacher: "د. نور الهدى",
    teacherAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&auto=format",
    rating: 4.7, students: 6200, price: 279, originalPrice: 450,
    thumb: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=225&fit=crop&auto=format",
    badge: null, category: "الكيمياء", lessons: 68, hours: 48,
  },
];

const TEACHERS = [
  {
    id: 1, name: "أ. محمد حسام", subject: "الرياضيات",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
    students: 45200, courses: 8, rating: 4.9, verified: true,
  },
  {
    id: 2, name: "د. سارة الجمال", subject: "الفيزياء",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&auto=format",
    students: 32800, courses: 6, rating: 4.8, verified: true,
  },
  {
    id: 3, name: "أ. عمر فاروق", subject: "اللغة العربية",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&auto=format",
    students: 58100, courses: 10, rating: 4.9, verified: true,
  },
  {
    id: 4, name: "د. نور الهدى", subject: "الكيمياء",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format",
    students: 21400, courses: 5, rating: 4.7, verified: true,
  },
];

const TESTIMONIALS = [
  {
    id: 1, name: "يوسف أحمد", grade: "طالب ثانوية — القاهرة",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=80&h=80&fit=crop&auto=format",
    text: "منصة مسارك غيّرت مستواي الدراسي بشكل كامل. الشرح واضح ومرتّب، وأقدر أراجع في أي وقت. حصلت على 98% في الرياضيات بعد ما كنت بخاف منها.",
    rating: 5,
  },
  {
    id: 2, name: "ريم محمد", grade: "طالبة ثانوية — الإسكندرية",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format",
    text: "أفضل منصة تعليمية جربتها. المدرسون محترفون والمحتوى منظّم جداً. التواصل مع المدرس سهل وسريع. أنصح كل طالب يستخدمها.",
    rating: 5,
  },
  {
    id: 3, name: "كريم سالم", grade: "طالب إعدادي — الجيزة",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&auto=format",
    text: "منذ ما اشتركت في مسارك، مستواي اتحسّن بشكل ملحوظ. الامتحانات والواجبات بتساعدني أذاكر صح وأتأكد إني فاهم.",
    rating: 5,
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "سجّل حسابك", desc: "أنشئ حسابك خلال دقيقة واحدة مجاناً واختر نوع حسابك — طالب أو مدرّس.", icon: Users },
  { step: "02", title: "اختر كورساتك", desc: "تصفّح مئات الكورسات من أفضل المدرّسين وابحث حسب المادة أو المرحلة.", icon: Search },
  { step: "03", title: "ابدأ التعلّم", desc: "شاهد الدروس في أي وقت ومن أي مكان، وتفاعل مع المدرّس والطلاب الآخرين.", icon: Play },
  { step: "04", title: "احصل على شهادتك", desc: "اجتز الامتحانات وأكمل الكورس واحصل على شهادة معتمدة من مسارك.", icon: Award },
];

const STATS = [
  { value: "120,000+", label: "طالب مسجّل" },
  { value: "850+", label: "مدرّس معتمد" },
  { value: "4,200+", label: "كورس متاح" },
  { value: "98%", label: "نسبة الرضا" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={s <= Math.round(rating) ? "#00EA7A" : "none"} stroke={s <= Math.round(rating) ? "#00EA7A" : "#d1d5db"} strokeWidth="2">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

// ─── Logo SVG (inline recreation from brand images) ───────────────────────────
function MasarakLogo({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <div className="flex items-center gap-3" dir="rtl">
      <div className="shrink-0" style={{ width: compact ? 32 : 40, height: compact ? 32 : 40 }}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect width="100" height="100" rx="20" fill="#00EA7A" />
          <path d="M20 75 C20 75, 20 30, 20 28 Q20 22 28 20 L55 20 Q62 20 65 26 L82 22" stroke={dark ? "#020202" : "white"} strokeWidth="6" strokeLinecap="round" fill="none" />
          <path d="M20 75 L62 38" stroke={dark ? "#020202" : "white"} strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M20 75 L75 55 Q82 52 82 44 L82 22" stroke={dark ? "#020202" : "white"} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      {!compact && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold text-xl tracking-tight ${dark ? "text-white" : "text-foreground"}`} style={{ fontFamily: "'Cairo', sans-serif" }}>مسارك</span>
          <span className={`text-xs ${dark ? "text-white/60" : "text-muted-foreground"}`} style={{ fontFamily: "'Cairo', sans-serif" }}>منصة تعليمية</span>
        </div>
      )}
    </div>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navbar({ dark, setDark, onNavigate, currentView }: {
  dark: boolean; setDark: (v: boolean) => void;
  onNavigate: (v: View) => void; currentView: View;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "الكورسات", href: "#courses" },
    { label: "المدرّسون", href: "#teachers" },
    { label: "التسعير", href: "#pricing" },
    { label: "من نحن", href: "#about" },
  ];

  return (
    <header
      dir="rtl"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: 72 }}>
        <button onClick={() => onNavigate("landing")} className="shrink-0">
          <MasarakLogo dark={dark} />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontFamily: "'Cairo', sans-serif" }}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={() => setDark(!dark)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors">
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => onNavigate("student")}
            className="hidden md:block text-sm font-semibold px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            تسجيل الدخول
          </button>
          <button
            onClick={() => onNavigate("student")}
            className="hidden md:flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif" }}>
            ابدأ مجاناً
          </button>
          <button className="md:hidden w-9 h-9 rounded-full flex items-center justify-center hover:bg-muted" onClick={() => setOpen(!open)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border px-6 py-4 flex flex-col gap-4">
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)}
              className="text-sm font-medium py-2" style={{ fontFamily: "'Cairo', sans-serif" }}>{l.label}</a>
          ))}
          <button onClick={() => { onNavigate("student"); setOpen(false); }}
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif" }}>
            ابدأ مجاناً
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section dir="rtl" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-6 overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-[0.07]" style={{ background: "#00EA7A", filter: "blur(100px)" }} />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: "#00EA7A", filter: "blur(80px)" }} />
      </div>

      {/* Badge */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card mb-8 text-sm font-semibold"
        style={{ fontFamily: "'Cairo', sans-serif" }}>
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: "#00EA7A" }} />
        <span className="text-muted-foreground">منصة <span style={{ color: "#00EA7A" }}>مسارك</span> — الأولى في مصر والعالم العربي</span>
      </div>

      {/* Headline */}
      <h1 className="text-center font-extrabold leading-tight mb-6 max-w-4xl"
        style={{ fontFamily: "'Cairo', sans-serif", fontSize: "clamp(2.4rem, 6vw, 5rem)", lineHeight: 1.15 }}>
        تعلّم من أفضل المدرّسين<br />
        <span style={{ color: "#00EA7A" }}>في مكانك وبوقتك</span>
      </h1>

      <p className="text-center text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed"
        style={{ fontFamily: "'Cairo', sans-serif" }}>
        منصة تعليمية متكاملة تجمعك بأفضل مدرّسي مصر والعالم العربي. كورسات موثوقة، امتحانات تفاعلية، وشهادات معتمدة.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <button
          onClick={() => onNavigate("student")}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.03] active:scale-[0.98] shadow-lg"
          style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif", boxShadow: "0 4px 32px rgba(0,234,122,0.3)" }}>
          ابدأ التعلّم مجاناً
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() => onNavigate("course")}
          className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border border-border hover:bg-muted transition-all"
          style={{ fontFamily: "'Cairo', sans-serif" }}>
          <Play size={16} className="fill-current" />
          شاهد كيف يعمل
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-3xl font-extrabold mb-1" style={{ fontFamily: "'Cairo', sans-serif", color: "#00EA7A" }}>{s.value}</div>
            <div className="text-sm text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Hero visual cards */}
      <div className="mt-20 w-full max-w-5xl">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-card">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=500&fit=crop&auto=format"
            alt="طلاب يتعلمون على منصة مسارك"
            className="w-full h-64 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Floating card */}
          <div className="absolute bottom-6 right-6 bg-card rounded-2xl p-4 shadow-xl border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#00EA7A" }}>
              <TrendingUp size={18} color="#020202" />
            </div>
            <div dir="rtl">
              <div className="text-sm font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>تحسّن مستواك</div>
              <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>+40% من طلابنا حسّنوا درجاتهم</div>
            </div>
          </div>

          {/* Floating card 2 */}
          <div className="absolute top-6 left-6 bg-card rounded-2xl p-4 shadow-xl border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#e8fdf2" }}>
              <Trophy size={18} style={{ color: "#00EA7A" }} />
            </div>
            <div dir="rtl">
              <div className="text-sm font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>شهادة معتمدة</div>
              <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>عند إتمام كل كورس</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────
function CategoriesSection() {
  return (
    <section dir="rtl" id="courses" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>تصفّح حسب المادة</p>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>اختر مادتك المفضّلة</h2>
          <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Cairo', sans-serif" }}>مئات الكورسات في كل المواد الدراسية</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <button key={cat.id}
              className="group flex flex-col items-center gap-3 p-5 rounded-2xl border border-border hover:border-[#00EA7A]/40 hover:shadow-md transition-all duration-200 bg-card"
              style={{}}>
              <span className="text-3xl">{cat.icon}</span>
              <div className="text-center">
                <div className="font-bold text-sm mb-1 group-hover:text-[#00EA7A] transition-colors" style={{ fontFamily: "'Cairo', sans-serif" }}>{cat.name}</div>
                <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>{cat.count} كورس</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Courses ──────────────────────────────────────────────────────────────────
function CourseCard({ course, onClick }: { course: typeof COURSES[0]; onClick: () => void }) {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <div dir="rtl" className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer" onClick={onClick}>
      <div className="relative">
        <ImageWithFallback src={course.thumb} alt={course.title} className="w-full aspect-video object-cover" />
        {course.badge && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif" }}>
            {course.badge}
          </span>
        )}
        <button
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
          onClick={(e) => { e.stopPropagation(); setBookmarked(!bookmarked); }}>
          <Bookmark size={14} fill={bookmarked ? "#00EA7A" : "none"} stroke={bookmarked ? "#00EA7A" : "currentColor"} />
        </button>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white/90 items-center justify-center hidden group-hover:flex shadow-lg">
            <Play size={18} className="text-[#020202] mr-0.5" />
          </div>
        </div>
      </div>

      <div className="p-4">
        <span className="text-xs text-muted-foreground font-medium" style={{ fontFamily: "'Cairo', sans-serif" }}>{course.category}</span>
        <h3 className="font-bold text-base mt-1 mb-3 line-clamp-2 leading-snug" style={{ fontFamily: "'Cairo', sans-serif" }}>{course.title}</h3>

        <div className="flex items-center gap-2 mb-3">
          <ImageWithFallback src={course.teacherAvatar} alt={course.teacher} className="w-6 h-6 rounded-full object-cover" />
          <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>{course.teacher}</span>
        </div>

        <div className="flex items-center gap-2 mb-4 text-xs text-muted-foreground">
          <Clock size={12} />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>{course.hours} ساعة</span>
          <span>·</span>
          <BookOpen size={12} />
          <span style={{ fontFamily: "'Cairo', sans-serif" }}>{course.lessons} درس</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={course.rating} />
          <span className="text-sm font-bold">{course.rating}</span>
          <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>({course.students.toLocaleString("ar-EG")})</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-extrabold" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>{course.price} جنيه</span>
            <span className="text-sm line-through text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>{course.originalPrice}</span>
          </div>
          <button className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
            style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif" }}>
            اشتراك
          </button>
        </div>
      </div>
    </div>
  );
}

function CoursesSection({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section dir="rtl" className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>الكورسات المميزة</p>
            <h2 className="text-4xl font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>الأكثر شعبية الآن</h2>
          </div>
          <button className="hidden md:flex items-center gap-2 text-sm font-semibold hover:text-[#00EA7A] transition-colors"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            عرض الكل <ArrowLeft size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COURSES.map((course) => (
            <CourseCard key={course.id} course={course} onClick={() => onNavigate("course")} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  return (
    <section dir="rtl" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>كيف تبدأ؟</p>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>أربع خطوات بسيطة</h2>
          <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Cairo', sans-serif" }}>ابدأ رحلتك التعليمية في دقائق</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.step} className="relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-0 w-full h-px border-t border-dashed border-border" style={{ left: "-50%" }} />
                )}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
                      style={{ background: "#e8fdf2" }}>
                      <Icon size={28} style={{ color: "#00EA7A" }} />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-background"
                      style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif" }}>
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold" style={{ fontFamily: "'Cairo', sans-serif" }}>{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Teachers ─────────────────────────────────────────────────────────────────
function TeachersSection() {
  return (
    <section dir="rtl" id="teachers" className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>نخبة المدرّسين</p>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>تعلّم من الأفضل</h2>
          <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Cairo', sans-serif" }}>مدرّسون معتمدون مع سنوات من الخبرة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEACHERS.map((t) => (
            <div key={t.id} className="group bg-card rounded-2xl border border-border p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative inline-block mb-4">
                <ImageWithFallback src={t.avatar} alt={t.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto ring-4 ring-background group-hover:ring-[#00EA7A]/30 transition-all" />
                {t.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background"
                    style={{ background: "#00EA7A" }}>
                    <CheckCircle size={12} color="#020202" />
                  </div>
                )}
              </div>

              <h3 className="font-bold text-base mb-1" style={{ fontFamily: "'Cairo', sans-serif" }}>{t.name}</h3>
              <p className="text-sm text-muted-foreground mb-3" style={{ fontFamily: "'Cairo', sans-serif" }}>{t.subject}</p>

              <div className="flex items-center justify-center gap-1 mb-4">
                <StarRating rating={t.rating} size={12} />
                <span className="text-xs font-bold">{t.rating}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-muted rounded-xl p-2">
                  <div className="font-bold text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>{(t.students / 1000).toFixed(0)}k</div>
                  <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>طالب</div>
                </div>
                <div className="bg-muted rounded-xl p-2">
                  <div className="font-bold text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>{t.courses}</div>
                  <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>كورس</div>
                </div>
              </div>

              <button className="mt-4 w-full py-2.5 rounded-xl text-sm font-bold border border-border hover:border-[#00EA7A] hover:text-[#00EA7A] transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                عرض الملف
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-4 rounded-2xl font-bold text-sm border border-border hover:bg-muted transition-all inline-flex items-center gap-2"
            style={{ fontFamily: "'Cairo', sans-serif" }}>
            عرض جميع المدرّسين <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Features / Why ───────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Zap, title: "تعلّم بسرعتك", desc: "لا قيود على الوقت. شاهد الدروس متى تريد وكرّرها كم تريد.", color: "#fdf8e8" },
  { icon: Shield, title: "محتوى موثوق", desc: "كل المدرّسين خضعوا لعملية توثيق واعتماد صارمة.", color: "#e8f0fd" },
  { icon: MessageSquare, title: "تواصل مباشر", desc: "تواصل مع مدرّسك وزملائك مباشرة داخل المنصة.", color: "#e8fdf2" },
  { icon: Award, title: "شهادات معتمدة", desc: "احصل على شهادة رسمية عند اجتياز كل كورس بنجاح.", color: "#fde8f0" },
  { icon: BarChart2, title: "تتبّع تقدّمك", desc: "لوحة تحكّم تفصيلية تُظهر لك مستواك وتقدّمك.", color: "#fdf5e8" },
  { icon: Globe, title: "يعمل في كل مكان", desc: "متوفّر على الجوال والكمبيوتر واللوحي بنفس الجودة.", color: "#e8fdfd" },
];

function FeaturesSection() {
  return (
    <section dir="rtl" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>لماذا مسارك؟</p>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>كل ما تحتاجه في مكان واحد</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: f.color }}>
                  <Icon size={22} style={{ color: "#00EA7A" }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'Cairo', sans-serif" }}>{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsSection() {
  const [active, setActive] = useState(0);
  return (
    <section dir="rtl" className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>ماذا يقول طلابنا؟</p>
          <h2 className="text-4xl font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>آراء حقيقية من طلاب حقيقيين</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={t.id}
              className={`bg-card rounded-2xl border p-6 transition-all duration-300 ${i === 1 ? "border-[#00EA7A]/40 shadow-lg shadow-[#00EA7A]/10 scale-[1.02]" : "border-border"}`}>
              <div className="flex items-center gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#00EA7A" stroke="#00EA7A" strokeWidth="2">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                  </svg>
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-6 text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>"{t.text}"</p>
              <div className="flex items-center gap-3">
                <ImageWithFallback src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="font-bold text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>{t.name}</div>
                  <div className="text-xs text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>{t.grade}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: "مجاني", price: "0", period: "", color: "#f5f5f7",
    features: ["وصول لـ 10 كورسات مجانية", "امتحانات تجريبية", "مجتمع الطلاب", "دعم فني أساسي"],
    cta: "ابدأ مجاناً", highlight: false,
  },
  {
    name: "بريميوم", price: "99", period: "/ شهرياً", color: "#00EA7A",
    features: ["وصول غير محدود لجميع الكورسات", "شهادات معتمدة", "تواصل مباشر مع المدرّسين", "تحليلات مفصّلة للتقدّم", "دعم فني على مدار الساعة", "تنزيل المواد للمشاهدة أوفلاين"],
    cta: "اشترك الآن", highlight: true,
  },
  {
    name: "سنوي", price: "799", period: "/ سنوياً", color: "#f5f5f7",
    features: ["كل مميزات البريميوم", "توفير 33%", "أولوية في الدعم الفني", "مكتبة موارد حصرية", "جلسات مراجعة جماعية"],
    cta: "وفّر أكثر", highlight: false,
  },
];

function PricingSection({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section dir="rtl" id="pricing" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>الأسعار</p>
          <h2 className="text-4xl font-extrabold mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>خطط مناسبة لكل طالب</h2>
          <p className="text-muted-foreground text-lg" style={{ fontFamily: "'Cairo', sans-serif" }}>ابدأ مجاناً وأنت ما تخسر شيء</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.name}
              className={`relative bg-card rounded-2xl border p-8 transition-all ${plan.highlight ? "border-[#00EA7A] shadow-2xl shadow-[#00EA7A]/20 scale-105" : "border-border"}`}>
              {plan.highlight && (
                <div className="absolute -top-4 right-1/2 translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold"
                  style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif" }}>
                  الأكثر شعبية
                </div>
              )}

              <h3 className="text-xl font-extrabold mb-2" style={{ fontFamily: "'Cairo', sans-serif" }}>{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black" style={{ fontFamily: "'Cairo', sans-serif", color: plan.highlight ? "#00EA7A" : "inherit" }}>{plan.price}</span>
                {plan.price !== "0" && <span className="text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>جنيه</span>}
                <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>{plan.period}</span>
              </div>

              <ul className="flex flex-col gap-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Cairo', sans-serif" }}>
                    <CheckCircle size={16} style={{ color: "#00EA7A", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onNavigate("student")}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: plan.highlight ? "#00EA7A" : "transparent",
                  color: plan.highlight ? "#020202" : "inherit",
                  border: plan.highlight ? "none" : "2px solid var(--border)",
                  fontFamily: "'Cairo', sans-serif",
                }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Band ─────────────────────────────────────────────────────────────────
function CTASection({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <section dir="rtl" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #020202 0%, #0d1a12 100%)" }}>
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20" style={{ background: "#00EA7A", filter: "blur(100px)" }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10" style={{ background: "#02FF8B", filter: "blur(80px)" }} />
          </div>

          <div className="relative">
            <p className="text-sm font-semibold mb-4" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>انضم لمسارك اليوم</p>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight" style={{ fontFamily: "'Cairo', sans-serif" }}>
              ابدأ رحلتك التعليمية<br />
              <span style={{ color: "#00EA7A" }}>الآن وبشكل مجاني</span>
            </h2>
            <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto" style={{ fontFamily: "'Cairo', sans-serif" }}>
              انضم لأكثر من 120,000 طالب يتعلّمون مع أفضل المدرّسين في العالم العربي.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => onNavigate("student")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.03]"
                style={{ background: "#00EA7A", color: "#020202", fontFamily: "'Cairo', sans-serif" }}>
                سجّل مجاناً الآن <ArrowLeft size={18} />
              </button>
              <button onClick={() => onNavigate("teacher")}
                className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-base border border-white/20 text-white hover:bg-white/10 transition-all"
                style={{ fontFamily: "'Cairo', sans-serif" }}>
                انضم كمدرّس <ArrowLeft size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
const FAQS = [
  { q: "هل مسارك مجاني؟", a: "نعم! يمكنك البدء مجاناً والوصول إلى 10 كورسات كاملة. للوصول الغير محدود، يمكنك الاشتراك بالخطة البريميوم." },
  { q: "كيف أتواصل مع المدرّس؟", a: "يمكنك إرسال رسائل مباشرة للمدرّس داخل المنصة، والمشاركة في منتدى الكورس." },
  { q: "هل الشهادات معتمدة؟", a: "نعم، شهاداتنا صادرة من منصة مسارك وموثّقة بالاسم وتاريخ الإتمام ويمكن مشاركتها." },
  { q: "هل يمكنني مشاهدة الدروس أوفلاين؟", a: "نعم، مشتركو البريميوم يمكنهم تنزيل المواد ومشاهدتها بدون إنترنت." },
  { q: "كيف أنضم كمدرّس؟", a: "سجّل حساباً واختر نوع 'مدرّس'، ثم أكمل ملفك الشخصي وأرسل طلب الانضمام. سيراجع فريقنا طلبك خلال 48 ساعة." },
];

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section dir="rtl" className="py-20 px-6 bg-muted/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold mb-3" style={{ color: "#00EA7A", fontFamily: "'Cairo', sans-serif" }}>الأسئلة الشائعة</p>
          <h2 className="text-4xl font-extrabold" style={{ fontFamily: "'Cairo', sans-serif" }}>هل عندك سؤال؟</h2>
        </div>

        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-right gap-4"
                onClick={() => setOpen(open === i ? null : i)}>
                <span className="font-semibold text-base" style={{ fontFamily: "'Cairo', sans-serif" }}>{faq.q}</span>
                <ChevronDown size={18} className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4"
                  style={{ fontFamily: "'Cairo', sans-serif" }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ dark }: { dark: boolean }) {
  return (
    <footer dir="rtl" className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <MasarakLogo dark={dark} />
            <p className="text-sm text-muted-foreground mt-4 leading-relaxed" style={{ fontFamily: "'Cairo', sans-serif" }}>
              منصة تعليمية متكاملة تجمع أفضل مدرّسي مصر والعالم العربي مع الطلاب في كل مكان.
            </p>
          </div>

          {[
            { title: "المنصة", links: ["الكورسات", "المدرّسون", "التسعير", "المدوّنة"] },
            { title: "الدعم", links: ["مركز المساعدة", "تواصل معنا", "سياسة الخصوصية", "شروط الاستخدام"] },
            { title: "المجتمع", links: ["منتدى الطلاب", "مجموعة فيسبوك", "قناة يوتيوب", "انضم كمدرّس"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-sm mb-4" style={{ fontFamily: "'Cairo', sans-serif" }}>{col.title}</h4>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      style={{ fontFamily: "'Cairo', sans-serif" }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-8 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>
            © 2025 مسارك. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>صنع بـ</span>
            <Heart size={14} style={{ color: "#00EA7A" }} />
            <span className="text-sm text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>في مصر</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Student Dashboard ────────────────────────────────────────────────────────
const STUDENT_COURSES = [
  { id: 1, title: "رياضيات الثانوية العامة", teacher: "أ. محمد حسام", progress: 68, thumb: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=120&h=70&fit=crop&auto=format", lastLesson: "المتتاليات والمتسلسلات", nextLesson: "حساب التفاضل والتكامل" },
  { id: 2, title: "فيزياء الثانوية العامة", teacher: "د. سارة الجمال", progress: 42, thumb: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=120&h=70&fit=crop&auto=format", lastLesson: "قوانين نيوتن", nextLesson: "الطاقة والشغل" },
  { id: 3, title: "اللغة الإنجليزية — المتقدم", teacher: "Mr. Ahmed Samir", progress: 85, thumb: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=120&h=70&fit=crop&auto=format", lastLesson: "Advanced Grammar", nextLesson: "Essay Writing" },
];

function StudentDashboard({ dark, setDark, onNavigate }: { dark: boolean; setDark: (v: boolean) => void; onNavigate: (v: View) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const navItems = [
    { id: "home", label: "الرئيسية", icon: Layers },
    { id: "courses", label: "كورساتي", icon: BookOpen },
    { id: "bookmarks", label: "المحفوظات", icon: Bookmark },
    { id: "achievements", label: "الإنجازات", icon: Trophy },
    { id: "messages", label: "الرسائل", icon: MessageSquare },
    { id: "settings", label: "الإعدادات", icon: Shield },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex bg-background" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-40 w-64 bg-card border-l border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <button onClick={() => onNavigate("landing")}><MasarakLogo dark={dark} compact /></button>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold mb-1 transition-all ${activeTab === item.id ? "text-[#020202]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                style={activeTab === item.id ? { background: "#00EA7A" } : {}}>
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <ImageWithFallback src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=40&h=40&fit=crop&auto=format" alt="الطالب" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <div className="text-sm font-bold">يوسف أحمد</div>
              <div className="text-xs text-muted-foreground">طالب ثانوية</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:mr-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <div className="relative hidden md:block">
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="ابحث عن كورس أو درس..." className="pr-9 pl-4 py-2 text-sm rounded-xl border border-border bg-muted focus:outline-none focus:ring-2 focus:ring-[#00EA7A]/30 w-72" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center relative">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#00EA7A" }} />
            </button>
            <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold mb-1">أهلاً، يوسف! 👋</h1>
            <p className="text-muted-foreground text-sm">واصل رحلتك التعليمية اليوم</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "الكورسات المسجّلة", value: "8", icon: BookOpen, color: "#e8fdf2" },
              { label: "الدروس المكتملة", value: "124", icon: CheckCircle, color: "#e8f0fd" },
              { label: "ساعات التعلّم", value: "47h", icon: Clock, color: "#fdf8e8" },
              { label: "الإنجازات", value: "12", icon: Trophy, color: "#fde8f0" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: s.color }}>
                    <Icon size={18} style={{ color: "#00EA7A" }} />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue learning */}
          <div className="mb-8">
            <h2 className="text-lg font-bold mb-4">تابع من حيث وقفت</h2>
            <div className="flex flex-col gap-4">
              {STUDENT_COURSES.map((c) => (
                <div key={c.id} className="bg-card rounded-2xl border border-border p-4 flex gap-4 items-center cursor-pointer hover:shadow-md transition-all" onClick={() => onNavigate("course")}>
                  <ImageWithFallback src={c.thumb} alt={c.title} className="w-20 h-14 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm mb-1 truncate">{c.title}</div>
                    <div className="text-xs text-muted-foreground mb-2">{c.teacher}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, background: "#00EA7A" }} />
                      </div>
                      <span className="text-xs font-bold text-muted-foreground shrink-0">{c.progress}%</span>
                    </div>
                  </div>
                  <button className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#00EA7A" }}>
                    <Play size={16} color="#020202" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended */}
          <div>
            <h2 className="text-lg font-bold mb-4">كورسات مقترحة لك</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {COURSES.slice(0, 3).map((c) => (
                <CourseCard key={c.id} course={c} onClick={() => onNavigate("course")} />
              ))}
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

// ─── Teacher Dashboard ────────────────────────────────────────────────────────
function TeacherDashboard({ dark, setDark, onNavigate }: { dark: boolean; setDark: (v: boolean) => void; onNavigate: (v: View) => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const navItems = [
    { id: "overview", label: "نظرة عامة", icon: BarChart2 },
    { id: "courses", label: "الكورسات", icon: BookOpen },
    { id: "students", label: "الطلاب", icon: Users },
    { id: "revenue", label: "الإيرادات", icon: TrendingUp },
    { id: "messages", label: "الرسائل", icon: MessageSquare },
    { id: "settings", label: "الإعدادات", icon: Shield },
  ];

  return (
    <div dir="rtl" className="min-h-screen flex bg-background" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <aside className={`fixed inset-y-0 right-0 z-40 w-64 bg-card border-l border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}>
        <div className="flex items-center justify-between p-5 border-b border-border">
          <button onClick={() => onNavigate("landing")}><MasarakLogo dark={dark} compact /></button>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}><X size={18} /></button>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold mb-1 transition-all ${activeTab === item.id ? "text-[#020202]" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                style={activeTab === item.id ? { background: "#00EA7A" } : {}}>
                <Icon size={18} />{item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <ImageWithFallback src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format" alt="المدرّس" className="w-9 h-9 rounded-full object-cover" />
            <div>
              <div className="text-sm font-bold">أ. محمد حسام</div>
              <div className="text-xs text-muted-foreground">مدرّس رياضيات</div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:mr-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="md:hidden w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <h1 className="font-bold text-base">لوحة تحكّم المدرّس</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: "#00EA7A", color: "#020202" }}>
              <BookOpen size={14} /> كورس جديد
            </button>
            <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold mb-1">أهلاً، أستاذ محمد! 👋</h1>
            <p className="text-muted-foreground text-sm">هذا ملخّص أداء كورساتك هذا الشهر</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "إجمالي الطلاب", value: "45,200", icon: Users, delta: "+12%", color: "#e8fdf2" },
              { label: "الإيرادات / شهر", value: "28,500 جنيه", icon: TrendingUp, delta: "+8%", color: "#e8f0fd" },
              { label: "الكورسات النشطة", value: "8", icon: BookOpen, delta: "+1", color: "#fdf8e8" },
              { label: "متوسط التقييم", value: "4.9 ⭐", icon: Star, delta: "ثابت", color: "#fde8f0" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color }}>
                      <Icon size={18} style={{ color: "#00EA7A" }} />
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground">{s.delta}</span>
                  </div>
                  <div className="text-xl font-extrabold mb-1">{s.value}</div>
                  <div className="text-xs text-muted-foreground">{s.label}</div>
                </div>
              );
            })}
          </div>

          {/* Recent courses table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-bold text-base">كورساتك</h2>
              <button className="text-sm font-semibold" style={{ color: "#00EA7A" }}>عرض الكل</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-right px-6 py-3 font-semibold text-muted-foreground">الكورس</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الطلاب</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">التقييم</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الإيراد</th>
                    <th className="text-right px-4 py-3 font-semibold text-muted-foreground">الحالة</th>
                  </tr>
                </thead>
                <tbody>
                  {COURSES.map((c) => (
                    <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <ImageWithFallback src={c.thumb} alt={c.title} className="w-10 h-7 rounded-lg object-cover" />
                          <span className="font-medium truncate max-w-[200px]">{c.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold">{c.students.toLocaleString("ar-EG")}</td>
                      <td className="px-4 py-4"><div className="flex items-center gap-1"><Star size={12} fill="#00EA7A" stroke="#00EA7A" />{c.rating}</div></td>
                      <td className="px-4 py-4 font-semibold" style={{ color: "#00EA7A" }}>{(c.students * c.price * 0.7 / 1000).toFixed(0)}k جنيه</td>
                      <td className="px-4 py-4"><span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: "#e8fdf2", color: "#00b85e" }}>نشط</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}

// ─── Course Detail ────────────────────────────────────────────────────────────
function CourseDetail({ dark, setDark, onNavigate }: { dark: boolean; setDark: (v: boolean) => void; onNavigate: (v: View) => void }) {
  const course = COURSES[0];
  const [activeLesson, setActiveLesson] = useState(0);
  const [tab, setTab] = useState("curriculum");
  const [enrolled, setEnrolled] = useState(false);

  const lessons = [
    { title: "مقدّمة: ما هو حساب التفاضل؟", duration: "12:30", done: true },
    { title: "الحدود والاستمرارية", duration: "24:15", done: true },
    { title: "تعريف المشتقة", duration: "18:40", done: false },
    { title: "قواعد الاشتقاق الأساسية", duration: "31:20", done: false },
    { title: "تطبيقات على قواعد الاشتقاق", duration: "28:00", done: false },
    { title: "قاعدة السلسلة", duration: "22:10", done: false },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-background" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Top bar */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-6 h-16 flex items-center gap-4">
        <button onClick={() => onNavigate("landing")} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowRight size={16} /> العودة
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-sm truncate">{course.title}</h1>
        </div>
        <button onClick={() => setDark(!dark)} className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center">
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Video */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-video mb-6 group">
            <ImageWithFallback src={course.thumb} alt="فيديو الدرس" className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110"
                style={{ background: "#00EA7A" }}>
                <Play size={24} color="#020202" className="mr-[-2px]" />
              </button>
            </div>
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80">
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1 rounded-full bg-white/20">
                  <div className="w-1/3 h-full rounded-full" style={{ background: "#00EA7A" }} />
                </div>
                <span className="text-white/80 text-xs">4:10 / 12:30</span>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-extrabold mb-2">{lessons[activeLesson].title}</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            في هذا الدرس ستتعلّم المفاهيم الأساسية لحساب التفاضل وكيفية تطبيقها في المسائل الرياضية بطريقة مبسّطة وعملية.
          </p>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-muted rounded-xl p-1 w-fit">
            {["curriculum", "description", "reviews"].map((t) => {
              const labels = { curriculum: "المنهج", description: "الوصف", reviews: "التقييمات" };
              return (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {labels[t as keyof typeof labels]}
                </button>
              );
            })}
          </div>

          {tab === "curriculum" && (
            <div className="flex flex-col gap-2">
              {lessons.map((l, i) => (
                <button key={i} onClick={() => setActiveLesson(i)}
                  className={`flex items-center gap-4 p-4 rounded-xl border text-right transition-all ${i === activeLesson ? "border-[#00EA7A]/40 bg-accent" : "border-border hover:bg-muted/40"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${l.done ? "" : "bg-muted"}`}
                    style={l.done ? { background: "#00EA7A" } : {}}>
                    {l.done ? <CheckCircle size={14} color="#020202" /> : <Play size={12} className="text-muted-foreground mr-[-1px]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold truncate ${l.done ? "line-through text-muted-foreground" : ""}`}>{l.title}</div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{l.duration}</span>
                </button>
              ))}
            </div>
          )}

          {tab === "reviews" && (
            <div className="flex flex-col gap-4">
              {TESTIMONIALS.map((t) => (
                <div key={t.id} className="bg-card rounded-2xl border border-border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <ImageWithFallback src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <div className="text-sm font-bold">{t.name}</div>
                      <StarRating rating={t.rating} size={11} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">"{t.text}"</p>
                </div>
              ))}
            </div>
          )}

          {tab === "description" && (
            <div className="text-sm text-muted-foreground leading-relaxed space-y-4">
              <p>هذا الكورس الشامل مصمّم لطلاب الثانوية العامة الذين يريدون إتقان الرياضيات بأفضل طريقة ممكنة. يغطي الكورس جميع المواضيع المقرّرة بأسلوب مبسّط وعملي.</p>
              <div>
                <h3 className="font-bold text-foreground mb-2">ماذا ستتعلّم؟</h3>
                <ul className="flex flex-col gap-2">
                  {["حساب التفاضل والتكامل", "المتتاليات والمتسلسلات", "الجبر المتقدّم", "الهندسة التحليلية", "الاحتمالات والإحصاء"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle size={14} style={{ color: "#00EA7A" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <ImageWithFallback src={course.thumb} alt={course.title} className="w-full aspect-video rounded-xl object-cover mb-5" />

            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold" style={{ color: "#00EA7A" }}>{course.price} جنيه</span>
              <span className="text-sm line-through text-muted-foreground">{course.originalPrice}</span>
              <span className="text-sm font-bold text-red-500">-40%</span>
            </div>

            <p className="text-xs text-muted-foreground mb-5">سينتهي العرض خلال 2 يوم!</p>

            <button
              onClick={() => setEnrolled(!enrolled)}
              className="w-full py-3.5 rounded-2xl font-bold text-base mb-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: enrolled ? "#e8fdf2" : "#00EA7A", color: enrolled ? "#00b85e" : "#020202" }}>
              {enrolled ? "✓ مشترك في الكورس" : "اشترك الآن"}
            </button>

            <button className="w-full py-3 rounded-2xl font-bold text-sm mb-5 border border-border hover:bg-muted transition-all">
              جرّب مجاناً
            </button>

            <div className="flex flex-col gap-3 text-sm">
              {[
                { icon: Clock, label: `${course.hours} ساعة محتوى` },
                { icon: BookOpen, label: `${course.lessons} درس` },
                { icon: Download, label: "مواد قابلة للتنزيل" },
                { icon: Globe, label: "وصول دائم" },
                { icon: Award, label: "شهادة إتمام" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 text-muted-foreground">
                    <Icon size={16} style={{ color: "#00EA7A" }} />
                    {item.label}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 pt-5 border-t border-border">
              <div className="flex items-center gap-3">
                <ImageWithFallback src={course.teacherAvatar} alt={course.teacher} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-bold">{course.teacher}</div>
                  <div className="text-xs text-muted-foreground">المدرّس</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function LandingPage({ dark, setDark, onNavigate }: { dark: boolean; setDark: (v: boolean) => void; onNavigate: (v: View) => void }) {
  return (
    <>
      <Navbar dark={dark} setDark={setDark} onNavigate={onNavigate} currentView="landing" />
      <main>
        <Hero onNavigate={onNavigate} />
        <CategoriesSection />
        <CoursesSection onNavigate={onNavigate} />
        <HowItWorksSection />
        <FeaturesSection />
        <TeachersSection />
        <TestimonialsSection />
        <PricingSection onNavigate={onNavigate} />
        <FAQSection />
        <CTASection onNavigate={onNavigate} />
      </main>
      <Footer dark={dark} />
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<View>("landing");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  const navigate = (v: View) => setView(v);

  return (
    <div style={{ fontFamily: "'Cairo', 'Inter', sans-serif" }}>
      {view === "landing" && <LandingPage dark={dark} setDark={setDark} onNavigate={navigate} />}
      {view === "student" && <StudentDashboard dark={dark} setDark={setDark} onNavigate={navigate} />}
      {view === "teacher" && <TeacherDashboard dark={dark} setDark={setDark} onNavigate={navigate} />}
      {view === "course" && <CourseDetail dark={dark} setDark={setDark} onNavigate={navigate} />}
    </div>
  );
}
