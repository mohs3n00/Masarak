# Notifications Architecture & Flow

This document outlines the design for the notifications system within the Masarak backend. The system is designed to be multi-channel (In-App Database, Push Notifications, Email) and highly scalable.

## Architecture Concept

The notifications module operates on an event-driven architecture using **NestJS EventEmitter** or a Message Queue (like Redis BullMQ) to ensure background processing doesn't block HTTP responses.

### The Notification Service
Acts as the central orchestrator. When an event occurs (e.g., "Course Published", "Assignment Graded"), a domain service fires an event. The Notification Service listens to these events and dispatches them to the appropriate channels based on user preferences.

---

## Notification Channels

### 1. Database (In-App) Notifications
- **Storage**: Stored in the PostgreSQL `Notification` table.
- **Usage**: Displayed in the top navigation bell icon in the web/mobile app.
- **Data Shape**:
  - `id`: UUID
  - `userId`: The recipient.
  - `type`: e.g., `COURSE_UPDATE`, `NEW_COMMENT`, `PAYMENT_SUCCESS`.
  - `title`: Short title.
  - `message`: Detailed description.
  - `actionUrl`: Deep link to redirect the user when clicked.
  - `isRead`: Boolean flag.
  - `createdAt`: Timestamp.

### 2. Push Notifications
- **Provider**: Firebase Cloud Messaging (FCM).
- **Setup**: Users register their device FCM tokens via `POST /users/me/fcm-token`. Tokens are stored in a `UserDevice` table or JSON array on the `User` record.
- **Flow**: Background worker sends payloads to FCM targeting specific device tokens.

### 3. Email Notifications
- **Provider**: AWS SES, SendGrid, or Resend.
- **Templates**: HTML templates compiled using Handlebars (HBS) or React Email.
- **Usage**: Critical alerts, marketing, receipts, and offline engagement (e.g., "You have 3 unread messages").

---

## Event Examples

| Trigger Event | Audience | Channels Used |
| :--- | :--- | :--- |
| **User Registered** | Single User | Email (Welcome / Verification) |
| **Password Reset Request**| Single User | Email |
| **Course Published** | Followers/Students | DB, Push, Email (Digest) |
| **Assignment Graded** | Single Student | DB, Push, Email |
| **New Comment Reply** | Original Commenter| DB, Push |
| **Payment Successful** | Payer | DB, Email (Receipt) |

---

## Workflow Implementation (NestJS)

1. **Triggering the Event**:
   Inside `AssignmentsService.grade()`:
   ```typescript
   this.eventEmitter.emit('assignment.graded', {
     studentId: submission.studentId,
     grade: newGrade,
     courseName: course.title
   });
   ```

2. **Listening to the Event**:
   Inside `NotificationsListener`:
   ```typescript
   @OnEvent('assignment.graded')
   handleAssignmentGradedEvent(payload: AssignmentGradedEvent) {
     this.notificationsService.dispatch({
       userId: payload.studentId,
       type: 'ASSIGNMENT_GRADED',
       title: 'تم تصحيح الواجب',
       message: `تم رصد درجتك في مقرر ${payload.courseName}.`,
       channels: ['DATABASE', 'PUSH', 'EMAIL'] // Falls back to user settings
     });
   }
   ```

3. **Dispatching**:
   The `NotificationsService` inspects the user's notification preferences from the DB. If they opted out of Emails for grades, it skips the Email channel. It then sends tasks to respective queues.

---

## Endpoints (User Facing)

- `GET /notifications` - Fetch paginated list of user's DB notifications.
- `PATCH /notifications/:id/read` - Mark a specific notification as read.
- `PATCH /notifications/read-all` - Mark all as read.
- `GET /users/me/notification-settings` - Fetch preferences.
- `PATCH /users/me/notification-settings` - Update preferences.
- `POST /users/me/fcm-token` - Register a new device for Push Notifications.
