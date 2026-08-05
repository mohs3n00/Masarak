# Reverse-Engineered Design System & Technical Architecture: Bassthalk (بسطتهالك)

This document provides a technical reverse-engineering of the design system powering [Bassthalk](https://bassthalk.com), including the main landing page, the [Bassthalk Login Portal](https://bassthalk.com/login), and the [Bassthalk Courses Platform](https://courses.bassthalk.com/).

It is structured as a single implementation specification and tokenized blueprint designed for automated consumption by AI coding agents and frontend engineers.

---

## 1. Complete Design Philosophy

* **RTL-Native Ergonomics:** Built ground-up for Arabic script, defaulting to right-to-left (`dir="rtl"`) text alignment, flex directions, grid flows, and animation origins.
* **Modular Card Architecture:** All primary content units (Teachers, Courses, Subjects, Steps, Forms) are encapsulated inside elevated, white surface containers with rounded corners (`16px` to `24px`).
* **High-Contrast Progressional Hierarchy:** Strong visual contrast guides students from top-level announcements -> sticky navbar -> hero headline -> filter controls -> actionable teacher/course cards -> high-conversion primary CTAs.
* **Approachable Academic Energy:** Combines academic structure with vibrant primary blues (`#2563EB`) and supportive emerald (`#10B981`) / amber (`#F59E0B`) accents to reduce study-related friction.

---

## 2. Visual Language

* **Primary Visual Tone:** Clean EdTech web application with soft card surfaces, rounded edges, and clear section contrast against a slate page background (`#F8FAFC`).
* **Directionality:** Native Right-to-Left (RTL) reading flow. Icons, directional indicators, and modal slide-ins operate in reverse horizontal axis relative to LTR designs.
* **Surface Hierarchy:** Page Canvas (`#F8FAFC`) -> Floating Card Surface (`#FFFFFF`) -> Sub-surface Tint / Badge (`#EFF6FF` / `#F1F5F9`).

---

## 3. Layout System

* **Root Direction:** `html[dir="rtl"]`
* **Page Wrapper:** `min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900`
* **Outer Container Widths:**
* Screen Maximum: `max-w-7xl` (`1280px`) with responsive horizontal padding (`px-4 sm:px-6 lg:px-8`).
* Focused Content Width: `max-w-5xl` (`1024px`) for feature step walkthroughs.
* Form / Auth Container: `max-w-md` (`448px`) centered vertically and horizontally.



---

## 4. Grid System

* **12-Column Responsive Layout Grid:**
* **Desktop (`≥1024px`):** 12-column flex/grid layout with `24px` (`gap-6`) or `32px` (`gap-8`) gaps.
* **Tablet (`768px - 1023px`):** 2-column card grid (`grid-cols-2 gap-6`).
* **Mobile (`<768px`):** 1-column stacked flow (`grid-cols-1 gap-4`).


* **Card Grid Allocations:**
* Teacher Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6`
* Subject Grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5`
* How-It-Works Flow: `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4`



---

## 5. Responsive Rules

| Breakpoint Prefix | Min Width | Container Padding | Layout Modifications |
| --- | --- | --- | --- |
| **Mobile Default** | `0px` | `px-4` (`16px`) | Stacked single column, mobile nav drawer toggle, smaller heading sizes |
| `sm` | `640px` | `px-6` (`24px`) | 2-column card grids, horizontal button groups |
| `md` | `768px` | `px-6` (`24px`) | Desktop menu options visible, 2 to 3-column feature grids |
| `lg` | `1024px` | `px-8` (`32px`) | Full desktop navigation, 3-column subject grids, multi-column footer |
| `xl` | `1280px` | `px-8` (`32px`) | 4-column teacher grids, maximum container width capped at `1280px` |

---

## 6. Typography Scale

Optimized for Arabic typography (Cairo / Alexandria / Tajawal / Readex Pro) requiring larger line-heights (`1.6` to `1.8`) to prevent Arabic character descenders and diacritics from overlapping.

```css
:root {
  --font-family-primary: 'Cairo', 'Alexandria', 'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-extrabold: 800;
}

```

| Type Scale Token | Font Size (rem / px) | Line Height | Weight | Mobile Spec | Usage |
| --- | --- | --- | --- | --- | --- |
| `text-display` | `3.00rem` (48px) | `1.30` | `800` | `2.25rem` (36px) | Hero section headline |
| `text-h1` | `2.25rem` (36px) | `1.35` | `700` | `1.75rem` (28px) | Main section titles |
| `text-h2` | `1.50rem` (24px) | `1.40` | `700` | `1.25rem` (20px) | Card headers, Form headings |
| `text-h3` | `1.25rem` (20px) | `1.45` | `600` | `1.125rem` (18px) | Teacher names, Sub-sections |
| `text-body-lg` | `1.125rem` (18px) | `1.75` | `400`/`500` | `1.00rem` (16px) | Hero subtitles, body leads |
| `text-body` | `1.00rem` (16px) | `1.65` | `400` | `0.875rem` (14px) | Standard paragraph text, Input fields |
| `text-body-sm` | `0.875rem` (14px) | `1.60` | `500` | `0.8125rem` (13px) | Secondary labels, Meta tags, Help text |
| `text-caption` | `0.75rem` (12px) | `1.50` | `500` | `0.75rem` (12px) | Badges, Footer subtext, Tooltips |

---

## 7. Color Tokens

```css
:root {
  /* Brand Primary */
  --color-primary-50:  #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB; /* Main Primary Action Color */
  --color-primary-700: #1D4ED8; /* Hover Primary State */
  --color-primary-800: #1E40AF; /* Active / Pressed State */

  /* Brand Secondary / Emerald */
  --color-secondary-50:  #ECFDF5;
  --color-secondary-100: #D1FAE5;
  --color-secondary-500: #10B981;
  --color-secondary-600: #059669;

  /* Neutrals & Surfaces */
  --color-slate-50:  #F8FAFC; /* Main Page Background */
  --color-slate-100: #F1F5F9; /* Sub-surface / Input Background */
  --color-slate-200: #E2E8F0; /* Standard Border Color */
  --color-slate-300: #CBD5E1; /* Input Border Color */
  --color-slate-400: #94A3B8; /* Muted Icon / Placeholder */
  --color-slate-500: #64748B; /* Secondary Subtitle Text */
  --color-slate-700: #334155; /* Body Text Color */
  --color-slate-900: #0F172A; /* Main Heading Text Color */
  --color-surface-white: #FFFFFF; /* Card & Modal Background */

  /* Alert & Feedback */
  --color-amber-100: #FEF3C7; /* Notice Banner Background */
  --color-amber-300: #FCD34D; /* Notice Banner Border */
  --color-amber-800: #92400E; /* Notice Banner Text */
  --color-red-500:   #EF4444; /* Error State */
  --color-red-50:    #FEE2E2; /* Error Background Tint */
}

```

---

## 8. Radius Tokens

```css
:root {
  --radius-sm:   0.375rem; /* 6px  - Small badges */
  --radius-md:   0.500rem; /* 8px  - Tags & Dropdown items */
  --radius-lg:   0.750rem; /* 12px - Buttons, Inputs, Selects */
  --radius-xl:   1.000rem; /* 16px - Cards, Dialogs, Avatars */
  --radius-2xl:  1.500rem; /* 24px - Hero Cards, Container Sections */
  --radius-full: 9999px;   /* Pills & Circular Avatars */
}

```

---

## 9. Elevation Tokens

```css
:root {
  --z-index-negative: -1;
  --z-index-base: 0;
  --z-index-card: 1;
  --z-index-dropdown: 10;
  --z-index-sticky: 50;
  --z-index-modal-backdrop: 100;
  --z-index-modal: 110;
  --z-index-toast: 120;
}

```

---

## 10. Shadow Tokens

```css
:root {
  /* Level 1: Standard Card Base */
  --shadow-card: 0px 1px 3px 0px rgba(15, 23, 42, 0.05), 0px 1px 2px -1px rgba(15, 23, 42, 0.05);

  /* Level 2: Card Hover State & Navbar Scroll */
  --shadow-card-hover: 0px 10px 15px -3px rgba(15, 23, 42, 0.08), 0px 4px 6px -4px rgba(15, 23, 42, 0.03);

  /* Level 3: Dropdowns & Modals */
  --shadow-floating: 0px 20px 25px -5px rgba(15, 23, 42, 0.15), 0px 8px 10px -6px rgba(15, 23, 42, 0.1);
}

```

---

## 11. Spacing Tokens

Base 4px system with 8px step alignment.

```css
:root {
  --space-1:  0.25rem;  /* 4px  */
  --space-2:  0.50rem;  /* 8px  */
  --space-3:  0.75rem;  /* 12px */
  --space-4:  1.00rem;  /* 16px */
  --space-5:  1.25rem;  /* 20px */
  --space-6:  1.50rem;  /* 24px */
  --space-8:  2.00rem;  /* 32px */
  --space-10: 2.50rem;  /* 40px */
  --space-12: 3.00rem;  /* 48px */
  --space-16: 4.00rem;  /* 64px */
  --space-20: 5.00rem;  /* 80px */
  --space-24: 6.00rem;  /* 96px */
}

```

---

## 12. Motion Tokens

```css
:root {
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --duration-fast: 150ms;
  --duration-normal: 200ms;
  --duration-slow: 300ms;
}

```

---

## 13. Component Inventory

1. `AnnouncementBar`: Notice banner for operational alerts.
2. `Navbar`: Header with logo, nav links, inline search, and login/signup buttons.
3. `HeroSection`: Centered/split headline, subtitle, primary conversion CTA.
4. `TeacherCard`: Teacher avatar, subject title, name, and profile link.
5. `TeacherGrid`: Container with Grade and Track filter dropdowns.
6. `SubjectCard`: Subject title, grade tag, teacher/course stats.
7. `SubjectGrid`: 3-column responsive subject grid.
8. `HowItWorksStep`: Step number badge, title, detailed description.
9. `RecruitmentBanner`: CTA section encouraging teacher applications.
10. `LoginFormCard`: Authentication card with phone and password inputs.
11. `PhoneConfirmationModal`: Modal dialog confirming mobile phone number.
12. `Button`: Primary, Secondary, Ghost, Outline, and Icon button components.
13. `FormInput`: Label, text/tel/password input field, focus rings, error messages.
14. `Badge`: Pill tag for grade and subject indicators.
15. `Footer`: 3-column dark layout with links, copyright, and social icons.

---

## 14. Navbar Specification

* **Position:** Sticky (`sticky top-0 z-50`)
* **Background:** Frosted glass effect (`bg-white/90 backdrop-blur-md border-b border-slate-200/80`)
* **Height:** `72px` (`h-18` / `py-3`)
* **Padding:** `px-4 sm:px-6 lg:px-8`
* **Elements (RTL Flow):**
1. Right: Brand Logo image + Name ("بسطتهالك").
2. Center: Search Bar (`bg-slate-100 rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-slate-500 w-64`).
3. Left: Action Buttons: "انشاء حساب جديد" (Secondary button), "تسجيل الدخول" (Primary button).



---

## 15. Hero Specification

* **Container:** `max-w-7xl mx-auto px-4 py-12 md:py-20 text-center`
* **Main Headline:** `text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6`
* **Highlight Color:** Words "منصة متكاملة" wrapped in `text-primary-600`.
* **Subtitle:** `text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8`
* **Primary CTA:** `px-8 py-4 bg-primary-600 text-white font-bold text-lg rounded-2xl shadow-md hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200` ("ابدأ رحلتك")

---

## 16. Teacher Card Specification

* **Dimensions:** Self-stretching grid card, min-height `260px`, padding `20px` (`p-5`).
* **Background & Surface:** `#FFFFFF`, `border border-slate-200`, `rounded-2xl` (`16px`), `shadow-card`.
* **Hover Effect:** `hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-200 transition-all duration-200`
* **Internal Structure (Centered Flex Stack):**
* Avatar: `w-24 h-24 rounded-full border-2 border-primary-100 object-cover bg-slate-100 mb-3`
* Teacher Name: `text-lg font-bold text-slate-900 mb-1`
* Subject Badge: `inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-4`
* Profile Link: `w-full mt-auto py-2 px-4 bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl hover:bg-primary-600 hover:text-white transition-colors duration-200`



---

## 17. Course Card Specification

* **Dimensions:** Aspect ratio 16:9 thumbnail area, total card padding `16px`.
* **Background & Surface:** White surface (`#FFFFFF`), `border border-slate-200`, `rounded-2xl`, `shadow-card`.
* **Metadata Group:** Title (`text-base font-bold text-slate-900`), Teacher Name (`text-sm text-slate-600`), Price/Subscription Badge (`bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-lg`).

---

## 18. Subject Card Specification

* **Dimensions:** Grid item, padding `20px` (`p-5`).
* **Container:** `#FFFFFF`, `border border-slate-200`, `rounded-2xl`, `shadow-card`.
* **Internal Grid Layout:**
* Top Row: Subject Name (`text-lg font-bold text-slate-900`), Grade Tag (`3ث` / `bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md`).
* Middle Stats Row: "المدرسين: X" | "الكورسات: Y" (`text-sm text-slate-500 flex justify-between my-3`).
* Bottom Action: "اعرف أكثر" (`text-sm font-semibold text-primary-600 flex items-center gap-1 hover:gap-2 transition-all`).



---

## 19. Login Page Specification

* **Page Background:** `bg-slate-50 min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-6`
* **Card Container:** `max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-card`
* **Card Header:** Title "أهلاً بك مجدداً!" (`text-2xl font-bold text-slate-900 text-center mb-2`), Subtitle "ادخل علي حسابك بإدخال رقم الهاتف و كلمة المرور" (`text-sm text-slate-500 text-center mb-8`).
* **Inputs Stack:** Phone Number (`type="tel"`), Password (`type="password"`).
* **Links:** "هل نسيت كلمة السر؟ اضغط هنا" (`text-sm text-primary-600 hover:underline`).
* **Submit CTA:** `w-full py-3.5 bg-primary-600 text-white font-bold text-base rounded-xl shadow-sm hover:bg-primary-700 transition-all` ("تسجيل الدخول").
* **Footer Link:** "لا يوجد لديك حساب؟ انشئ حسابك الآن !" (`text-center text-sm text-slate-600 mt-6`).

---

## 20. Buttons Specification

### Primary

* Class: `bg-primary-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-primary-700 active:bg-primary-800 focus:ring-2 focus:ring-primary-500/30 transition-all duration-200`

### Secondary

* Class: `bg-primary-50 text-primary-700 font-bold px-5 py-2.5 rounded-xl border border-primary-200 hover:bg-primary-100 transition-all duration-200`

### Ghost / Outline

* Class: `bg-transparent text-slate-700 font-semibold px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 transition-all duration-200`

---

## 21. Forms Specification

* **Label:** `block text-right text-sm font-semibold text-slate-700 mb-2`
* **Input Container:** `w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl transition-all duration-200`
* **Focus Indicator:** `focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20`
* **Error State:** `border-red-500 ring-2 ring-red-500/20`
* **Error Message Text:** `text-xs text-red-600 mt-1.5 font-medium text-right`

---

## 22. Dialog Specification

* **Overlay / Backdrop:** `fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-100 flex items-center justify-center p-4`
* **Dialog Container:** `bg-white rounded-3xl max-w-lg w-full p-6 shadow-floating z-110 text-right`
* **Header Title:** `text-xl font-bold text-slate-900 mb-2`
* **Action Buttons:** Flex row-reverse gap-3 (`Button Primary` + `Button Secondary`).

---

## 23. Empty States

* **Container:** `bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center my-6`
* **Icon:** `w-12 h-12 text-slate-400 mx-auto mb-3`
* **Text:** `text-base font-semibold text-slate-600` ("سيتم اضافه المحاضرات قريبًا...")

---

## 24. Loading States

* **Skeleton Card:** `bg-slate-200 animate-pulse rounded-2xl h-64 w-full`
* **Skeleton Text Line:** `bg-slate-200 animate-pulse rounded-md h-4 w-3/4 mb-2`

---

## 25. Footer Specification

* **Background:** `#0F172A` (Slate 900)
* **Text Color:** `#94A3B8` (Slate 400)
* **Heading Color:** `#FFFFFF` (Font weight bold, `text-lg mb-4`)
* **Padding:** `py-12 md:py-16 px-4 sm:px-6 lg:px-8`
* **Layout:** `grid grid-cols-1 md:grid-cols-3 gap-8 text-right`
* Col 1: Logo + Mission statement ("تم صنع هذه المنصة بهدف تهيئة الطالب لـ كامل جوانب الثانوية العامة و ما بعدها").
* Col 2: Site Pages ("الرئيسية", "المساعدة", "انشاء حساب جديد", "تسجيل الدخول").
* Col 3: Social Media Links ("فيسبوك", "انستجرام", "تيك توك", "يوتيوب").



---

## 26. Icon System

* **Library:** Lucide Icons / Heroicons (RTL compatible)
* **Stroke Width:** `2px` (`stroke-width="2"`)
* **Standard Sizes:**
* Small: `16px` (`w-4 h-4`)
* Medium: `20px` (`w-5 h-5`)
* Large: `24px` (`w-6 h-6`)


* **Icon Container Tint:** `p-2.5 bg-primary-50 text-primary-600 rounded-xl`

---

## 27. Illustration Style

* Vector flat style with subtle gradient accents.
* Character figures depict high school students and teachers in clean digital environments.
* Theme harmonization: Main blues mixed with warm gold/yellow and muted mint backgrounds.

---

## 28. Accessibility Rules

* Minimum contrast ratio `4.5:1` for standard text against white cards.
* Focus outlines on all interactive elements (`focus:ring-2 focus:ring-primary-500/30`).
* Explicit ARIA labels on icon-only buttons (`aria-label="Open main menu"`).
* Native RTL handling (`dir="rtl"`) ensuring screen readers parse Arabic sentences in correct reading order.

---

## 29. Tailwind CSS Design Tokens

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'Alexandria', 'Tajawal', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
        },
        secondary: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          700: '#334155',
          900: '#0F172A',
        },
      },
      borderRadius: {
        'xl': '0.75rem',  // 12px
        '2xl': '1rem',    // 16px
        '3xl': '1.5rem',  // 24px
      },
      boxShadow: {
        'card': '0px 1px 3px 0px rgba(15, 23, 42, 0.05), 0px 1px 2px -1px rgba(15, 23, 42, 0.05)',
        'card-hover': '0px 10px 15px -3px rgba(15, 23, 42, 0.08), 0px 4px 6px -4px rgba(15, 23, 42, 0.03)',
        'floating': '0px 25px 50px -12px rgba(15, 23, 42, 0.25)',
      },
    },
  },
  plugins: [],
};

```

---

## 30. CSS Variables

```css
/* globals.css */
@layer base {
  :root {
    --bg-page: #F8FAFC;
    --bg-surface: #FFFFFF;
    --text-heading: #0F172A;
    --text-body: #334155;
    --text-muted: #64748B;
    --primary-main: #2563EB;
    --primary-hover: #1D4ED8;
    --border-color: #E2E8F0;
  }

  body {
    background-color: var(--bg-page);
    color: var(--text-body);
    font-family: 'Cairo', 'Alexandria', sans-serif;
    direction: rtl;
    text-align: right;
  }
}

```

---

## 31. React Component Architecture

```
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── FormInput.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── layout/
│   │   ├── AnnouncementBar.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── cards/
│       ├── TeacherCard.tsx
│       ├── SubjectCard.tsx
│       └── HowItWorksStep.tsx
└── pages/
    ├── index.tsx
    └── login.tsx

```

---

## 32. Component-by-Component Implementation Rules

### AnnouncementBar Component

```tsx
import React from 'react';

export const AnnouncementBar = () => (
  <div className="bg-amber-100 border-b border-amber-300 text-amber-900 text-center py-2 px-4 text-xs sm:text-sm font-medium z-50">
    خلي بالك: بسبب تفعيل التوقيت الشتوي، خيارات الدفع متوقفة مؤقتاً لبعض الوقت.
  </div>
);

```

### TeacherCard Component

```tsx
import React from 'react';

interface TeacherProps {
  name: string;
  subject: string;
  imageUrl?: string;
}

export const TeacherCard: React.FC<TeacherProps> = ({ name, subject, imageUrl }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-blue-200 transition-all duration-200 flex flex-col items-center text-center">
    <div className="w-24 h-24 rounded-full bg-slate-100 overflow-hidden mb-3 border-2 border-blue-100 flex items-center justify-center">
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="text-2xl font-bold text-slate-400">{name.charAt(0)}</span>
      )}
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-1">{name}</h3>
    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-4">
      {subject}
    </span>
    <button className="w-full mt-auto py-2 px-4 bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl hover:bg-blue-600 hover:text-white transition-colors duration-200">
      عرض الكورسات
    </button>
  </div>
);

```

---

## 33. Pixel Measurements Summary

* Hero Title: `48px` (Desktop) / `36px` (Mobile)
* Button Vertical Padding: `12px` (`py-3`) or `14px` (`py-3.5`)
* Button Horizontal Padding: `20px` (`px-5`) or `24px` (`px-6`)
* Card Internal Padding: `20px` (`p-5`) or `24px` (`p-6`)
* Card Border Radius: `16px` (`rounded-2xl`)
* Container Max Width: `1280px` (`max-w-7xl`)
* Form Container Max Width: `448px` (`max-w-md`)

---

## 34. Responsive Measurements

* Mobile Margin/Padding Standard: `16px` (`px-4`, `py-8`)
* Tablet Margin/Padding Standard: `24px` (`px-6`, `py-12`)
* Desktop Margin/Padding Standard: `32px` (`px-8`, `py-16`)

---

## 35. Spacing Measurements

* Element-to-Element Gap: `8px` (`gap-2`) or `12px` (`gap-3`)
* Form Input Stack Gap: `16px` (`mb-4`)
* Section-to-Section Gap: `64px` (`py-16`) to `96px` (`py-24`)

---

## 36. Hover Effects

* Cards: `-translate-y-1` (`-4px` elevation lift) + shadow expansion to `shadow-card-hover`.
* Primary Buttons: Background tint shift to `--color-primary-700` (`#1D4ED8`) + `scale-[1.01]`.
* Links: Underline appearance + color shift to `#1D4ED8`.

---

## 37. Active Effects

* Buttons: Scale compression `active:scale-95` / `active:translate-y-0`.
* Inputs: Outer ring expansion `ring-2 ring-primary-500/20`.

---

## 38. Focus Effects

* Outline reset: `outline-none`
* Border Highlight: `border-primary-600`
* Ring Halo: `ring-2 ring-primary-500/20`

---

## 39. Animation Timing

* Fast Micro-interactions (Button clicks, focus rings): `150ms ease-out`
* Standard Transitions (Card hover lifts, color shifts): `200ms cubic-bezier(0.4, 0, 0.2, 1)`
* Modal Backdrop & Slide-ins: `300ms ease-out`

---

## 40. Exact Implementation Recommendations

1. Always set `<html dir="rtl" lang="ar">`.
2. Import Google Fonts Cairo & Alexandria at document root.
3. Ensure all card surfaces are pure white (`#FFFFFF`) placed against a slate page background (`#F8FAFC`).
4. Keep Arabic paragraph line height at `leading-relaxed` (`1.65`) or higher.
5. Standardize card corner radii at `16px` (`rounded-2xl`) and inputs/buttons at `12px` (`rounded-xl`).

---

# AI Coding Agent Implementation Guide

This guide contains strict instructions for another AI coding agent to re-style an existing educational web application using the exact visual language of [Bassthalk](https://bassthalk.com).

### Execution Rules for the AI Coding Agent:

1. **Do NOT Modify Functionality:** Retain all existing API calls, state handlers, form submission logic, and routing. Only restyle class names, layouts, colors, and typography.
2. **Directionality Enforcement:** Set root direction to RTL (`dir="rtl"`). Flip all LTR margins (`mr-*` -> `ml-*`), border offsets, and chevron icon orientations.
3. **Apply Font Stack:** Set font family to `'Cairo', 'Alexandria', sans-serif`. Use font weight `700` for headings and `400`/`500` for body text.
4. **Color Application:**
* Page Background: Set main container background to `bg-slate-50`.
* Card Backgrounds: Set card surfaces to `bg-white border border-slate-200 rounded-2xl shadow-card`.
* Primary Buttons: Apply `bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl px-5 py-3 shadow-sm hover:-translate-y-0.5 transition-all`.
* Input Fields: Apply `bg-white text-slate-900 border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20`.


5. **Card Hover Behavior:** Add `hover:-translate-y-1 hover:shadow-card-hover hover:border-primary-200 transition-all duration-200` to all interactive card containers.
6. **Form Layout Restyling:** For login and authentication pages, center the form container inside a card of width `max-w-md w-full bg-white border border-slate-200 rounded-3xl p-8 shadow-card`.