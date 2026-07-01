# Database Schema (Prisma / PostgreSQL)

This document defines the database architecture for the Masarak backend. It is designed to be implemented using Prisma ORM with a PostgreSQL database (hosted on Supabase).

## Core Concepts
- UUIDs are used for all primary keys.
- Soft deletes are not explicitly modeled here unless necessary, but can be added via middleware or an `isDeleted` flag.
- Timestamps (`createdAt`, `updatedAt`) are present on all major models.

---

## Prisma Schema Representation

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ------------------------------------------------------
// ENUMS
// ------------------------------------------------------

enum Role {
  STUDENT
  TEACHER
  ADMIN
}

enum ContentType {
  VIDEO
  PDF
  ARTICLE
  EXAM
  ASSIGNMENT
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum NotificationType {
  SYSTEM
  COURSE_UPDATE
  PAYMENT_SUCCESS
  ASSIGNMENT_GRADED
  NEW_COMMENT
}

// ------------------------------------------------------
// USERS & ROLES
// ------------------------------------------------------

model User {
  id                 String    @id @default(uuid())
  email              String    @unique
  password           String
  name               String
  role               Role      @default(STUDENT)
  avatar             String?
  bio                String?
  isActive           Boolean   @default(false) // false until email verified
  
  emailVerificationToken String?
  resetPasswordToken     String?
  resetPasswordExpires   DateTime?
  hashedRefreshToken     String?

  createdAt          DateTime  @default(now())
  updatedAt          DateTime  @updatedAt

  // Relations
  teacherProfile     TeacherProfile?
  enrollments        Enrollment[]
  payments           Payment[]
  comments           Comment[]
  notifications      Notification[]
  submissions        Submission[]
}

model TeacherProfile {
  id             String    @id @default(uuid())
  userId         String    @unique
  title          String?   // e.g. "Senior Math Instructor"
  qualifications String?
  rating         Float     @default(0.0)
  totalStudents  Int       @default(0)

  user           User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  courses        Course[]
  coupons        Coupon[]
}

// ------------------------------------------------------
// COURSES & CONTENT
// ------------------------------------------------------

model Course {
  id             String    @id @default(uuid())
  teacherId      String
  title          String
  slug           String    @unique
  description    String
  thumbnailUrl   String?
  price          Float     @default(0.0)
  isPublished    Boolean   @default(false)
  
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  // Relations
  teacher        TeacherProfile @relation(fields: [teacherId], references: [id])
  modules        Module[]
  enrollments    Enrollment[]
  coupons        Coupon[]
  reviews        Review[]
}

model Module {
  id          String    @id @default(uuid())
  courseId    String
  title       String
  order       Int       @default(0)

  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  lessons     Lesson[]
}

model Lesson {
  id          String       @id @default(uuid())
  moduleId    String
  title       String
  description String?
  type        ContentType
  videoUrl    String?      // Used if type is VIDEO
  duration    Int?         // In minutes or seconds
  order       Int          @default(0)
  isFreePreview Boolean    @default(false)

  module      Module       @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  files       File[]
  exam        Exam?
  assignment  Assignment?
  comments    Comment[]
}

model File {
  id          String    @id @default(uuid())
  lessonId    String
  fileName    String
  fileUrl     String
  fileType    String    // MIME type
  sizeBytes   Int

  lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
}

// ------------------------------------------------------
// EXAMS & ASSIGNMENTS
// ------------------------------------------------------

model Exam {
  id          String    @id @default(uuid())
  lessonId    String    @unique
  passingScore Int      @default(50)
  timeLimit   Int?      // Minutes

  lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  questions   Question[]
}

model Question {
  id          String    @id @default(uuid())
  examId      String
  text        String
  points      Int       @default(1)

  exam        Exam      @relation(fields: [examId], references: [id], onDelete: Cascade)
  choices     Choice[]
}

model Choice {
  id          String    @id @default(uuid())
  questionId  String
  text        String
  isCorrect   Boolean   @default(false)

  question    Question  @relation(fields: [questionId], references: [id], onDelete: Cascade)
}

model Assignment {
  id          String    @id @default(uuid())
  lessonId    String    @unique
  description String
  maxScore    Int       @default(100)
  dueDate     DateTime?

  lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  submissions Submission[]
}

model Submission {
  id             String     @id @default(uuid())
  assignmentId   String
  studentId      String
  fileUrl        String?
  textResponse   String?
  score          Int?
  feedback       String?

  assignment     Assignment @relation(fields: [assignmentId], references: [id], onDelete: Cascade)
  student        User       @relation(fields: [studentId], references: [id], onDelete: Cascade)

  @@unique([assignmentId, studentId])
}

// ------------------------------------------------------
// ENROLLMENTS & PAYMENTS
// ------------------------------------------------------

model Enrollment {
  id          String    @id @default(uuid())
  studentId   String
  courseId    String
  progress    Float     @default(0.0)
  enrolledAt  DateTime  @default(now())

  student     User      @relation(fields: [studentId], references: [id], onDelete: Cascade)
  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)

  @@unique([studentId, courseId])
}

model Payment {
  id          String        @id @default(uuid())
  studentId   String
  courseId    String?
  amount      Float
  currency    String        @default("SAR")
  status      PaymentStatus @default(PENDING)
  providerId  String?       // Transaction ID from Gateway
  
  createdAt   DateTime      @default(now())

  student     User          @relation(fields: [studentId], references: [id])
}

model Coupon {
  id          String    @id @default(uuid())
  code        String    @unique
  discountPct Float     // e.g. 20 for 20%
  maxUses     Int
  usedCount   Int       @default(0)
  expiresAt   DateTime
  
  courseId    String?
  teacherId   String?

  course      Course?         @relation(fields: [courseId], references: [id])
  teacher     TeacherProfile? @relation(fields: [teacherId], references: [id])
}

// ------------------------------------------------------
// COMMUNITY & NOTIFICATIONS
// ------------------------------------------------------

model Comment {
  id          String    @id @default(uuid())
  userId      String
  lessonId    String
  content     String
  parentId    String?   // For nested replies
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson      Lesson    @relation(fields: [lessonId], references: [id], onDelete: Cascade)
  parent      Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies     Comment[] @relation("CommentReplies")
}

model Review {
  id          String    @id @default(uuid())
  courseId    String
  studentId   String
  rating      Int       // 1-5
  comment     String?
  
  createdAt   DateTime  @default(now())

  course      Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  
  @@unique([courseId, studentId])
}

model Notification {
  id          String           @id @default(uuid())
  userId      String
  type        NotificationType
  title       String
  message     String
  actionUrl   String?
  isRead      Boolean          @default(false)
  
  createdAt   DateTime         @default(now())

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Indexes & Performance Considerations
- `User.email`: Unique index for fast auth lookups.
- `Course.slug`: Unique index for SEO-friendly URLs.
- `Enrollment.[studentId, courseId]`: Compound unique index to prevent double enrollment.
- `Review.[courseId, studentId]`: Compound unique index to limit one review per student per course.
- `Submission.[assignmentId, studentId]`: Compound unique index.
- Foreign keys implicitly create indexes in most databases, but explicit indexes can be added on high-read relations (e.g., `@@index([courseId])` on `Module`).
