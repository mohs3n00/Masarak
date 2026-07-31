
# Masarak Database Entity Relationship Diagram (ERD)

## Core Entities
- **User**: The central entity (STUDENT, TEACHER, ADMIN).
- **Course**: Contains Sections and Lessons.
- **Lesson**: Can have Videos, PDFs, Exams, Assignments.

## Academic Conversations (Premium Feature)
- **AcademicConversation**: Links a Student, Teacher, Course, and optionally Lesson/Video. Contains context snapshots.
- **AcademicMessage**: Individual chat messages. Supports replies (self-referencing) and soft-deletes.
- **AcademicAttachment**: Files/Images attached to a message.

## Performance
Database is heavily indexed on foreign keys (`courseId`, `studentId`, `teacherId`, `conversationId`, `senderId`) to ensure fast real-time queries.
