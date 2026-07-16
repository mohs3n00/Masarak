# 08. Business Rules

This document outlines the strict business rules dictated by the backend domain logic. The Flutter app must respect these rules visually (e.g., hiding buttons) and gracefully handle errors if they are violated.

## 1. Role-Based Permissions

### STUDENT
- **Can**: Browse published courses, add to cart, purchase, view enrolled content, take exams, submit assignments, post in community.
- **Cannot**: View draft courses, create courses, edit lessons, view other students' grades.

### TEACHER
- **Can**: Create courses, create lessons (Video, PDF, Exam), grade their own students, view their analytics, create coupons for their courses.
- **Cannot**: Approve their own courses for publishing, manage global taxonomy, access courses owned by other teachers.

### ADMIN
- **Can**: Approve/Reject courses, manage global taxonomy (Stages, Levels), moderate community posts, view all platform financial reports.

## 2. Course Visibility & Enrollment Rules
- **Draft Status**: Courses with `status = DRAFT` or `UNDER_REVIEW` are hidden from students. They only appear in the Teacher's dashboard.
- **Access Type**:
  - `FREE`: Bypasses cart; `POST /enrollment` grants instant access.
  - `PAID`: Requires a successful `Order` and `Payment` to grant enrollment.
- **Prerequisites**: A student cannot enroll in Course B if Course A is set as a prerequisite and hasn't been completed. The UI must show a locked state.

## 3. Exam & Assessment Rules
- **Attempts Limit**: If `attemptsLimit` is > 0, the student cannot start the exam if they have reached the limit. The UI must disable the "Start Exam" button.
- **Passing Score**: Auto-calculated upon submission. If the student fails, and attempts remain, they can retry.
- **Anti-Cheat**: If the user leaves the `Active Exam Screen` (e.g., puts the app in the background), the Flutter app should record a warning or auto-submit based on backend configuration.

## 4. Payment & Coupon Rules
- Coupons can be `PERCENTAGE` or `FIXED`.
- Coupons are specific to a `courseId` or `global`.
- If a total cart value reaches 0 after a coupon, the payment gateway is bypassed, and the enrollment is instantly granted.

## 5. File Upload Restrictions
- **Profile Images**: Max 5MB, format: JPEG, PNG.
- **Assignments**: Max 20MB, format: PDF, DOCX, ZIP.
- **Videos**: Uploaded via Teacher dashboard. Chunked uploading is required for files > 100MB.
