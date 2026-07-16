# 03. Screen Inventory

This document provides an exhaustive inventory of every screen required in the Flutter application, categorized by module.

---

## 1. Authentication & Onboarding Module

### 1.1 Splash Screen
- **Purpose**: Brand loading, initialization, checking auth state.
- **Route**: `/splash`
- **Required APIs**: None (Local Token Check).
- **Exit Points**: Navigates to `/login`, `/onboarding`, or `/home`.
- **States**: Loading only.

### 1.2 Onboarding Screen
- **Purpose**: Introduce platform features (Carousel of illustrations).
- **Route**: `/onboarding`
- **Exit Points**: Navigates to `/login` or `/register`.

### 1.3 Login Screen
- **Purpose**: User authentication.
- **Route**: `/login`
- **Required APIs**: `POST /auth/login`
- **Required Data**: Email/Phone, Password.
- **States**: Default, Loading (button spinner), Error (invalid credentials).

### 1.4 Registration Screen (Student / Teacher)
- **Purpose**: Create a new account.
- **Route**: `/register`
- **Required APIs**: `POST /auth/register`
- **Required Data**: Role, First Name, Last Name, Email, Phone, Password.
- **Exit Points**: Navigates to `/verify-otp`.

### 1.5 OTP Verification Screen
- **Purpose**: Verify email or phone.
- **Route**: `/verify-otp`
- **Required APIs**: `POST /auth/verify-otp`, `POST /auth/resend-otp`
- **States**: Default, Timer Countdown, Loading, Success, Error (Shake animation).

### 1.6 Forgot Password Screen
- **Purpose**: Request password reset.
- **Route**: `/forgot-password`
- **Required APIs**: `POST /auth/forgot-password`

---

## 2. Core Navigation & Home

### 2.1 Main Skeleton (Bottom Navigation Bar)
- **Tabs**: Home, My Courses, Community, Profile.

### 2.2 Student Home Screen
- **Purpose**: Dashboard for students.
- **Route**: `/home/student`
- **Required APIs**: `GET /student/dashboard`
- **Required Data**: Active enrollments, Resume watching data, Recommended courses, New announcements.
- **States**: Loading Skeleton, Data, Empty (No enrollments).

### 2.3 Teacher Home Screen
- **Purpose**: Dashboard for teachers.
- **Route**: `/home/teacher`
- **Required APIs**: `GET /teacher/dashboard`
- **Required Data**: Total students, Total revenue, Recent reviews, Active courses.

---

## 3. Browsing & Discovery Module

### 3.1 Taxonomy Explorer (Categories)
- **Purpose**: Browse Stage -> Level -> Subject.
- **Route**: `/categories`
- **Required APIs**: `GET /academic/stages`, `GET /academic/levels`, etc.

### 3.2 Search & Filter Screen
- **Purpose**: Search for courses or teachers.
- **Route**: `/search`
- **Required APIs**: `GET /courses?search=x&categoryId=y`
- **States**: Initial, Typing, Loading, Results, Empty State.

### 3.3 Course Details Screen (Public)
- **Purpose**: Marketing page for a course.
- **Route**: `/course/:id`
- **Required APIs**: `GET /courses/:id`
- **Data**: Title, Description, Price, Instructor Info, Reviews, Syllabus Preview.
- **User Interactions**: Play promo video, Add to Cart, Enroll.

### 3.4 Teacher Profile Screen (Public)
- **Purpose**: View instructor details and their courses.
- **Route**: `/teacher/:id`
- **Required APIs**: `GET /teachers/:id`

---

## 4. E-Commerce Module

### 4.1 Cart Screen
- **Purpose**: Review items before purchase.
- **Route**: `/cart`
- **Required APIs**: `GET /cart`, `POST /cart/coupon`
- **States**: Empty Cart, Filled Cart, Applying Coupon.

### 4.2 Checkout Screen
- **Purpose**: Payment gateway integration.
- **Route**: `/checkout`
- **Required APIs**: `POST /payments/initialize`
- **Edge Cases**: Network drop during payment, Payment rejected.

---

## 5. Learning Environment (Player)

### 5.1 Course Player Screen
- **Purpose**: Consume course content.
- **Route**: `/player/:courseId`
- **Required APIs**: `GET /courses/:courseId/content`, `POST /progress/video`
- **UI Components**: Native Video Player, Drawer for Syllabus, Tab View (Overview, Q&A, Resources).
- **Edge Cases**: Video buffering, DRM restrictions (prevent screen capture).

### 5.2 PDF/Document Viewer Screen
- **Purpose**: Read attached course materials.
- **Route**: `/viewer/pdf`
- **Required Data**: PDF URL or local file path.

---

## 6. Exam & Assessment Module

### 6.1 Exam Intro Screen
- **Purpose**: Show rules before starting.
- **Route**: `/exam/:examId/intro`

### 6.2 Active Exam Screen
- **Purpose**: Answer questions with a timer.
- **Route**: `/exam/:examId/active`
- **Required APIs**: `POST /exam/session/start`, `POST /exam/session/submit`
- **States**: Question Navigation, Timer Warning, Offline buffering.
- **Edge Cases**: App goes to background (anti-cheat logic).

### 6.3 Exam Results Screen
- **Purpose**: Show score and feedback.
- **Route**: `/exam/:examId/results`

---

## 7. Community Module

### 7.1 Community Feed Screen
- **Purpose**: Social feed.
- **Route**: `/community/feed`
- **Required APIs**: `GET /community/posts`
- **States**: Pull-to-refresh, Pagination (Infinite Scroll).

### 7.2 Post Details & Comments Screen
- **Purpose**: View a single post and its comments.
- **Route**: `/community/post/:id`

---

## 8. Profile & Settings

### 8.1 My Profile Screen
- **Purpose**: View personal details and stats.
- **Route**: `/profile`

### 8.2 Edit Profile Screen
- **Purpose**: Update information.
- **Required APIs**: `PATCH /users/profile`

### 8.3 Settings Screen
- **Purpose**: App configuration.
- **Interactions**: Change Language (AR/EN), Theme (Dark/Light), Notification Toggles, Logout.
