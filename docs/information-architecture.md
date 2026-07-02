# Masarak Platform — Information Architecture

**Target Audience:** Egyptian High School Students (Thanawya Amma)
**Direction:** RTL (Arabic-first)
**Platform Roles:** Visitor, Student, Teacher, Admin

---

## 1. Route Map

```
/                              ← Landing Page (Public)
/courses                       ← Course Catalog (Public)
/course/[slug]                 ← Course Detail (Public)
/teachers                      ← Teachers List (Public)
/teachers/[id]                 ← Teacher Profile (Public)
/community                     ← Community Feed (Student only)
/community/post/[id]           ← Single Post
/become-a-teacher              ← Teacher Landing Page (Public)
/search                        ← Global Search (Public)

── Auth ──────────────────────────────────────────────────────
/login                         ← Phone + Password Login
/choose-account                ← Choose Student / Teacher
/register/student              ← Multi-step Student Registration
/register/teacher              ← Multi-step Teacher Registration (7 steps)
/forgot-password               ← Enter phone for reset
/verify-phone                  ← OTP Input
/reset-password                ← Enter new password
/success                       ← Post-action success screen
/session-expired               ← Session expired notice

── Student Dashboard ─────────────────────────────────────────
/dashboard/student             ← Home / Progress Overview
/dashboard/student/courses     ← My Enrolled Courses
/dashboard/student/course/[id] ← Video Player + Learning Interface
/dashboard/student/wishlist    ← Saved Courses
/dashboard/student/bookmarks   ← Bookmarked Lessons
/dashboard/student/notes       ← My Notes
/dashboard/student/certificates← My Certificates
/dashboard/student/downloads   ← Downloaded Materials
/dashboard/student/calendar    ← Schedule
/dashboard/student/notifications← Notifications
/dashboard/student/profile     ← Edit Profile
/dashboard/student/settings    ← Account Settings

── Teacher Dashboard ─────────────────────────────────────────
/dashboard/teacher             ← Home / Stats Overview
/dashboard/teacher/courses     ← My Courses
/dashboard/teacher/courses/create ← Create New Course
/dashboard/teacher/students    ← My Students
/dashboard/teacher/analytics   ← Course Analytics
/dashboard/teacher/revenue     ← Revenue Report
/dashboard/teacher/wallet      ← Wallet + Payouts
/dashboard/teacher/payouts     ← Payout Requests
/dashboard/teacher/reviews     ← Course Reviews
/dashboard/teacher/announcements ← Announcements
/dashboard/teacher/calendar    ← Schedule
/dashboard/teacher/profile     ← Edit Teacher Profile
/dashboard/teacher/settings    ← Account Settings

── Admin Dashboard ───────────────────────────────────────────
/dashboard/admin               ← Platform Overview
/dashboard/admin/users         ← All Users
/dashboard/admin/students      ← Students Management
/dashboard/admin/teachers      ← Teachers Management + Approval Queue
/dashboard/admin/courses       ← Courses Management
/dashboard/admin/categories    ← Categories & Subjects
/dashboard/admin/academic      ← Academic Year / Grade / Track Config
/dashboard/admin/orders        ← Orders & Purchases
/dashboard/admin/payments      ← Payment Management
/dashboard/admin/coupons       ← Coupons & Discounts
/dashboard/admin/analytics     ← Platform Analytics
/dashboard/admin/reports       ← Reports
/dashboard/admin/support       ← Support Tickets
/dashboard/admin/flags         ← Content Flags / Reports
/dashboard/admin/notifications ← Broadcast Notifications
/dashboard/admin/media         ← Media Library
/dashboard/admin/audit         ← Audit Log
/dashboard/admin/settings      ← Platform Settings

── Utility Pages ─────────────────────────────────────────────
/unauthorized                  ← 403 Access Denied
/maintenance                   ← Maintenance Mode
/coming-soon                   ← Feature Coming Soon
/settings                      ← Quick Settings
```

---

## 2. Navigation Structure

### Main Navbar (Public — all users)
| Label | Route | Auth Required |
|---|---|---|
| الرئيسية | / | No |
| الكورسات | /courses | No |
| المعلمون | /teachers | No |
| المجتمع | /community | Yes (Student) |

**Right side — Guest:** `تسجيل الدخول → /login` | `إنشاء حساب → /choose-account`
**Right side — Logged In:** Avatar Menu + Notifications + Theme Toggle + Lang Toggle (Icon-only, animated)

### Student Dashboard Sidebar
```
الرئيسية          /dashboard/student
كورساتي           /dashboard/student/courses
قائمة الأمنيات    /dashboard/student/wishlist
ملاحظاتي          /dashboard/student/notes
الإنجازات         /dashboard/student/certificates
الجدول            /dashboard/student/calendar
الإشعارات         /dashboard/student/notifications
──────────────────────
ملفي الشخصي      /dashboard/student/profile
الإعدادات         /dashboard/student/settings
```

### Teacher Dashboard Sidebar
```
الرئيسية          /dashboard/teacher
كورساتي           /dashboard/teacher/courses
طلابي             /dashboard/teacher/students
الإحصائيات        /dashboard/teacher/analytics
الأرباح           /dashboard/teacher/revenue
المحفظة           /dashboard/teacher/wallet
التقييمات         /dashboard/teacher/reviews
الإشعارات         /dashboard/teacher/announcements
──────────────────────
ملفي الشخصي      /dashboard/teacher/profile
الإعدادات         /dashboard/teacher/settings
```

### Admin Dashboard Sidebar
```
نظرة عامة        /dashboard/admin
المستخدمون        /dashboard/admin/users
الطلاب            /dashboard/admin/students
المعلمون          /dashboard/admin/teachers
الكورسات          /dashboard/admin/courses
التصنيفات         /dashboard/admin/categories
الطلبات           /dashboard/admin/orders
المدفوعات         /dashboard/admin/payments
الكوبونات         /dashboard/admin/coupons
التقارير          /dashboard/admin/analytics
الدعم             /dashboard/admin/support
الإعدادات         /dashboard/admin/settings
```

---

## 3. User Flows

### 3.1 Student Registration (3 Steps)
```
/choose-account → اختيار طالب
  ↓
/register/student
  Step 1: بيانات الهوية
    • الاسم الأول / الثاني / الثالث / الرابع
    • رقم الهاتف (مصري)
    • رقم هاتف ولي الأمر
    • كلمة المرور + تأكيدها
  Step 2: البيانات الدراسية
    • المحافظة → المدينة / الحي
    • الصف (أولى / ثانية / ثالثة ثانوي)
    • الشعبة (علوم / أدبي / رياضة)
    • المدرسة (اختياري)
  Step 3: مراجعة + الموافقة على الشروط
  ↓
/verify-phone → OTP عبر SMS
  ↓
/dashboard/student
```

### 3.2 Teacher Registration (7 Steps)
```
/choose-account → اختيار معلم
  ↓
/register/teacher
  Step 1: البيانات الشخصية (الاسم الرباعي، تاريخ الميلاد، النوع)
  Step 2: بيانات التواصل (هاتف، بريد، كلمة مرور)
  Step 3: بيانات التدريس (مادة، مرحلة، خبرة، نبذة)
  Step 4: التحقق من الهوية (الرقم القومي 14 رقم + صورة البطاقة)
  Step 5: رفع المستندات (المؤهل + شهادات اختيارية)
  Step 6: مراجعة الطلب (عرض كل البيانات)
  Step 7: تم الإرسال — في انتظار المراجعة
  ↓
[Admin يراجع ويوافق من /dashboard/admin/teachers]
  ↓
/dashboard/teacher (بعد الموافقة)
```

### 3.3 Login Flow
```
/login
  ↓ (phone + password)
  → نجح → redirect based on role
  → فشل → error message inline (no redirect)
  → نسيت كلمة المرور؟ → /forgot-password
```

### 3.4 Forgot Password
```
/forgot-password → (رقم الهاتف)
  ↓
/verify-phone → (OTP)
  ↓
/reset-password → (كلمة مرور جديدة + تأكيد)
  ↓
/login (+ success toast)
```

### 3.5 Student Learning Flow
```
/courses → /course/[slug]
  ↓ (اشترك / مجاناً)
/dashboard/student/course/[id]
  • Video Player
  • Playlist sidebar
  • إكمال الدرس
  • ملاحظات / ملفات / تعليقات
  ↓ (100% completion)
شهادة إتمام → /dashboard/student/certificates
```

---

## 4. Breadcrumb Strategy

Breadcrumbs shown for routes deeper than 2 levels.

| Pattern | Example |
|---|---|
| [القسم] > [الصفحة] | الكورسات > تفاصيل الكورس |
| [Dashboard] > [قسم] > [عنوان] | لوحة التحكم > كورساتي > مشاهدة |
| [Admin] > [قسم] > [العنصر] | الإدارة > المعلمون > أحمد محمد |

**No breadcrumbs on:** Auth pages, Landing page, Courses list, Teachers list.

---

## 5. Role-Based Routing After Login

| Role | Status | Redirect |
|---|---|---|
| STUDENT | Any | /dashboard/student |
| TEACHER | APPROVED | /dashboard/teacher |
| TEACHER | PENDING | /success (awaiting approval) |
| ADMIN | Any | /dashboard/admin |

---

## 6. Dead Routes Inventory

Routes in navigation that need pages or redirects:
- `/categories` → Redirect to `/courses?filter=categories`
- `/about`, `/blog`, `/careers`, `/contact` → `/coming-soon`
- `/support`, `/status`, `/privacy`, `/terms`, `/cookies` → Stub static pages

---

## 7. Pages to Remove / Clean Up

- `/profile` (generic) → redirect to role-based dashboard profile
- `/design-review/[...slug]` → dev-only, not for production
- `/components-preview` → dev-only, not for production
- Duplicate footer links pointing to non-existent pages → fix or disable
