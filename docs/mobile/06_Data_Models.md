# 06. Data Models

This document details the core database models and their relationships, derived directly from the Prisma schema. These models must be translated into Dart classes (DTOs) for the Flutter app.

## 1. User & Roles (`User`)
The central entity in the system.
- **Fields**: `id`, `email`, `phone`, `firstName`, `lastName`, `role`, `avatar`.
- **Roles Enum**: `STUDENT`, `TEACHER`, `ADMIN`, `SUPER_ADMIN`, `CONTENT_MANAGER`, `ASSISTANT_TEACHER`, `PARENT`.
- **Relations**: 
  - 1-to-1 with `StudentProfile`, `TeacherProfile`, `AdminProfile`.
  - 1-to-Many with `Session`, `Otp`, `Device`.

## 2. Academic Taxonomy
A strict hierarchy used for filtering and discovering content.
- **Stage** (e.g., Secondary School)
  - 1-to-Many **Level** (e.g., Grade 12)
- **Department** (e.g., Science)
  - 1-to-Many **Branch** (e.g., Biology)
- **Subject** (e.g., Physics) -> Belongs to Level and optionally Branch.

## 3. Course & Content
- **Course**: 
  - **Fields**: `title`, `slug`, `price`, `type` (RECORDED, LIVE), `status`, `visibility`.
  - **Relations**: `CourseSection`, `CourseInstructor`.
- **CourseSection**: Groups lessons together.
- **Lesson**: 
  - **Type Enum**: `VIDEO`, `PDF`, `ARTICLE`, `EXAM`, `ASSIGNMENT`.
  - **Relations**: `LessonVideo`, `LessonAttachment`, `ExamTemplate`, `Assignment`.

## 4. Exam Engine
- **QuestionBankCategory**: Hierarchical folders for questions.
- **QuestionBankItem**:
  - **Type**: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `SHORT_TEXT`.
  - **Relations**: 1-to-Many `QuestionChoice`.
- **ExamTemplate**: Links to a `Lesson`. Defines rules (Duration, Passing Score, Attempts).
- **ExamSession**: Tracks a student's active exam state.
  - **Relations**: `ExamAnswer` (Tracks selected choice per question).

## 5. E-Commerce
- **Cart** & **CartItem**: Temporary storage for unpaid courses.
- **Order** & **OrderItem**: Finalized purchases.
- **Payment**:
  - **Status**: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`.
- **Coupon**: Used to apply discounts (`PERCENTAGE`, `FIXED`).

## 6. Community
- **CommunityPost**: Authored by User.
- **CommunityComment**: Nested replies (Parent/Child structure).
- **CommunityReaction**: `LIKE`, `LOVE`, `CELEBRATE`, `INSIGHTFUL`.

## Nullable Fields Handling in Flutter
Many fields are nullable (e.g., `avatar`, `bio`). In Dart, these must be explicitly typed as `String?` and safely parsed using `fromJson` to prevent null pointer exceptions during serialization.
