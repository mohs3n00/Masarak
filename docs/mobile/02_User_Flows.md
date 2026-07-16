# 02. User Flows

This document details the complete end-to-end workflows for the core features of the Masarak mobile application. It covers both the happy paths and alternative/failure paths.

## 1. Authentication Flow

### Registration (Student)
`Splash Screen` → `Welcome/Onboarding` → `Sign Up Screen`
- User enters Email/Phone, Password, Full Name.
- User submits.
- **Success Path**: 
  - Backend creates a DRAFT user, sends OTP.
  - App navigates to `OTP Verification Screen`.
  - User enters OTP.
  - App sends OTP verification to backend.
  - Backend returns Access & Refresh Tokens.
  - App navigates to `Complete Profile Screen` (Grade, Track, Country, City).
  - App navigates to `Main Navigation (Home)`.
- **Failure Paths**:
  - Email/Phone already exists -> Show Toast/Snackbar.
  - Weak Password -> Show inline validation.
  - Invalid OTP -> Shake animation, clear input, show error.
  - OTP Expired -> Show "Resend OTP" button.

### Login
`Splash Screen` → `Login Screen`
- User enters Email/Phone and Password.
- **Success Path**:
  - Backend returns Tokens.
  - App routes based on Role:
    - If `STUDENT` -> `Student Dashboard / Home`.
    - If `TEACHER` -> `Teacher Dashboard`.
- **Failure Paths**:
  - Invalid credentials -> Show error text under fields.
  - Account locked (Too many failed attempts) -> Show dialog "Account Locked for X minutes".
  - Account unverified -> Navigate to `OTP Verification Screen`.

## 2. Browsing & Search Flow (Discovery)

`Home Screen` → `Search Bar / Filters`
- User clicks "Categories" or "Academic Stage".
- App fetches Stages -> Levels -> Departments -> Branches.
- User selects "Secondary" -> "Grade 12" -> "Science" -> "Physics".
- App navigates to `Search Results Screen`.
- User taps a Course Card.
- App navigates to `Course Details Screen` (Unenrolled state).

## 3. Enrollment & Checkout Flow

`Course Details Screen`
- User clicks "Enroll Now" or "Add to Cart".
- **Free Course Path**:
  - Direct API call to `POST /enrollment`.
  - Success Dialog -> Navigate to `Course Player Screen`.
- **Paid Course Path**:
  - Navigate to `Cart Screen`.
  - User enters Coupon (optional). App verifies coupon.
  - User clicks "Proceed to Checkout".
  - Navigate to `Checkout/Payment Screen`.
  - Select Payment Method (Card, Wallet, Apple/Google Pay).
  - Process Payment via WebView or Native SDK.
  - **Success**: Navigate to `Payment Success Screen` -> `Course Player Screen`.
  - **Failure**: Navigate to `Payment Failed Screen` -> Show Retry button.

## 4. Course Consumption Flow (Course Player)

`Course Player Screen`
- Displays Course Outline (Sections -> Lessons) in a bottom sheet or side drawer.
- User selects a Video Lesson.
- Native Video Player loads.
- **Progress Tracking**:
  - App sends periodic heartbeat API calls (`POST /progress`) to save watch time.
- **Completion**:
  - Video ends -> API marks lesson as `COMPLETED`.
  - Auto-play next lesson.
- **Attachments**:
  - User taps "Resources" tab.
  - Selects PDF.
  - App downloads file and opens in `PDF Viewer Screen`.

## 5. Exam & Assessment Flow

`Course Player Screen` -> Selects an "Exam" lesson.
- App navigates to `Exam Intro Screen` (Shows instructions, duration, passing score).
- User clicks "Start Exam".
- App calls `POST /exam/session/start`.
- Navigate to `Active Exam Screen`.
- **During Exam**:
  - Timer runs natively.
  - User answers MCQ/True-False questions.
  - App saves answers locally (or sends periodic sync).
- **Submission**:
  - User clicks "Submit" OR Timer expires.
  - App calls `POST /exam/session/submit`.
  - Navigate to `Exam Results Screen` (Score, Pass/Fail status, Correct Answers).

## 6. Community Flow

`Main Navigation` -> `Community Tab`
- App fetches feed.
- User clicks "Write Post".
- Navigate to `Create Post Screen`.
- User types text, attaches image (optional).
- Clicks "Post".
- **Success**: Post appears at the top of the feed (optimistic UI update).
- **Interaction**:
  - User long-presses to "React" (Like, Love, Celebrate).
  - User clicks "Comment" -> Opens `Comments Bottom Sheet`.

## 7. Teacher Specific Flow: Course Management

`Teacher Dashboard` -> `My Courses`
- User clicks "Create Course".
- `Create Course Wizard`:
  - Step 1: Basic Info (Title, Description, Price).
  - Step 2: Taxonomy (Stage, Level, Subject).
  - Step 3: Media (Upload Thumbnail via Image Picker).
  - Step 4: Sections & Lessons builder.
- Teacher clicks "Submit for Review".
- Course status changes to `UNDER_REVIEW`. Admin must approve it.

## 8. Notifications Flow

`Any Screen` (Foreground) or Background
- Push Notification arrives (FCM).
- User taps Notification.
- App routes to specific deep link based on payload:
  - If `type === 'ASSIGNMENT_GRADED'` -> Open `Assignment Details Screen`.
  - If `type === 'COURSE_UPDATE'` -> Open `Course Details Screen`.

## 9. Profile & Settings Flow

`Main Navigation` -> `Profile Tab`
- User clicks "Edit Profile".
- Navigate to `Edit Profile Screen`.
- Changes Avatar (Image Picker -> Crop -> Upload).
- Updates Bio/Name.
- Clicks "Save" -> Updates backend -> Returns to Profile Tab.

## 10. Offline / Error Recovery Flow

`Any Screen fetching data`
- **Offline Path**:
  - App detects no internet via Connectivity Plus.
  - Shows `No Connection` global overlay or inline error state.
  - If data is cached (e.g., Hive/Sqflite), show cached data with a "Offline Mode" banner.
- **API Error Path**:
  - API returns 500.
  - App shows Snackbar "Something went wrong".
  - Shows "Retry" button on the screen body.
