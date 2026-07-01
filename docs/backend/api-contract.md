# Backend API Contract

This document provides the REST API specifications for the Masarak backend. It is designed to be implemented in NestJS.

## Response Standards

**Success Response (200 OK / 201 Created)**
```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "total": 50 } // For paginated endpoints
}
```

**Error Response (4xx / 5xx)**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid token"
  }
}
```

**Validation Response (422 Unprocessable Entity)**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## 1. Authentication (`/auth`)

### `POST /auth/login`
- **Auth**: Public
- **Body**: `{ "email": "user@example.com", "password": "Password123!" }`
- **Response**: `200 OK` `{ "user": {...}, "tokens": { "accessToken": "...", "refreshToken": "..." } }`
- **Errors**: `401 Unauthorized`, `422 Validation`

### `POST /auth/register`
- **Auth**: Public
- **Body**: `{ "email": "...", "password": "...", "name": "...", "role": "STUDENT" }`
- **Response**: `201 Created`
- **Errors**: `409 Conflict (Email exists)`

### `POST /auth/logout`
- **Auth**: Bearer Token
- **Response**: `200 OK`

### `POST /auth/refresh`
- **Auth**: Refresh Token (Cookie/Body)
- **Response**: `200 OK` (Returns new `accessToken` and `refreshToken`)

### `POST /auth/forgot-password`
- **Auth**: Public
- **Body**: `{ "email": "..." }`
- **Response**: `200 OK` (Always returns success to prevent email enumeration)

### `POST /auth/reset-password`
- **Auth**: Public
- **Body**: `{ "token": "...", "newPassword": "..." }`
- **Response**: `200 OK`

### `POST /auth/verify-email`
- **Auth**: Public
- **Body**: `{ "token": "..." }`
- **Response**: `200 OK`

---

## 2. Users (`/users`)

### `GET /users/me`
- **Auth**: Bearer Token
- **Response**: `200 OK` Returns current user profile.

### `PATCH /users/me`
- **Auth**: Bearer Token
- **Body**: `{ "name": "New Name", "bio": "..." }`
- **Response**: `200 OK`

### `PATCH /users/avatar`
- **Auth**: Bearer Token
- **Body**: `{ "fileKey": "avatars/uuid.png" }`
- **Response**: `200 OK`

---

## 3. Teachers (`/teachers`)

### `GET /teachers`
- **Auth**: Public (Supports Pagination `?page=1&limit=10`)
- **Response**: `200 OK` Returns list of public teacher profiles.

### `GET /teachers/:id`
- **Auth**: Public
- **Response**: `200 OK`

### `PATCH /teachers/profile`
- **Auth**: Bearer Token (`TEACHER` only)
- **Body**: `{ "title": "...", "qualifications": "..." }`
- **Response**: `200 OK`

---

## 4. Courses (`/courses`)

### `GET /courses`
- **Auth**: Public (Filters: `?teacherId=...&search=...&sort=price`)
- **Response**: `200 OK` Paginated course list.

### `GET /courses/:slug`
- **Auth**: Public
- **Response**: `200 OK` Course details, modules, and free preview lessons.

### `POST /courses`
- **Auth**: Bearer Token (`TEACHER`, `ADMIN`)
- **Body**: `{ "title": "...", "description": "...", "price": 100 }`
- **Response**: `201 Created`

### `PATCH /courses/:id`
- **Auth**: Bearer Token (Owner or Admin)
- **Body**: Partial course data.
- **Response**: `200 OK`

### `DELETE /courses/:id`
- **Auth**: Bearer Token (Owner or Admin)
- **Response**: `200 OK`

---

## 5. Lessons & Content (`/lessons`)

### `GET /courses/:courseId/modules`
- **Auth**: Public (Returns locked status for non-enrolled)

### `POST /courses/:courseId/modules`
- **Auth**: Bearer Token (Owner)
- **Body**: `{ "title": "Module 1", "order": 1 }`

### `POST /modules/:moduleId/lessons`
- **Auth**: Bearer Token (Owner)
- **Body**: `{ "title": "...", "type": "VIDEO", "videoUrl": "...", "isFreePreview": false }`
- **Response**: `201 Created`

### `GET /lessons/:id`
- **Auth**: Bearer Token (Enrolled Students or Owner)
- **Response**: `200 OK` Returns full lesson content and video URLs.

---

## 6. Exams & Assignments (`/exams`, `/assignments`)

### `POST /lessons/:id/exam`
- **Auth**: Bearer Token (Owner)
- **Body**: `{ "passingScore": 50, "questions": [...] }`

### `POST /exams/:id/submit`
- **Auth**: Bearer Token (Enrolled Student)
- **Body**: `{ "answers": [{ "questionId": "...", "choiceId": "..." }] }`
- **Response**: `200 OK` Returns score.

### `POST /lessons/:id/assignment`
- **Auth**: Bearer Token (Owner)
- **Body**: `{ "description": "...", "dueDate": "..." }`

### `POST /assignments/:id/submit`
- **Auth**: Bearer Token (Enrolled Student)
- **Body**: `{ "fileKey": "...", "textResponse": "..." }`

### `PATCH /submissions/:id/grade`
- **Auth**: Bearer Token (Owner)
- **Body**: `{ "score": 90, "feedback": "Great job" }`

---

## 7. Community & Comments (`/comments`)

### `GET /lessons/:id/comments`
- **Auth**: Bearer Token
- **Response**: `200 OK` Paginated comments and nested replies.

### `POST /lessons/:id/comments`
- **Auth**: Bearer Token
- **Body**: `{ "content": "...", "parentId": null }`

### `DELETE /comments/:id`
- **Auth**: Bearer Token (Comment Owner or Admin)

---

## 8. Payments & Enrollments (`/payments`)

### `POST /payments/checkout`
- **Auth**: Bearer Token (Student)
- **Body**: `{ "courseId": "..." }`
- **Response**: `200 OK` Returns `checkoutUrl` and `paymentId`.

### `POST /payments/apply-coupon`
- **Auth**: Bearer Token
- **Body**: `{ "courseId": "...", "code": "..." }`
- **Response**: `200 OK` Returns new discounted price.

### `POST /payments/webhook`
- **Auth**: Webhook Signature from Provider
- **Response**: `200 OK` (Updates payment status and creates Enrollment).

### `GET /enrollments/me`
- **Auth**: Bearer Token
- **Response**: `200 OK` List of user's purchased/enrolled courses.

---

## 9. Admin & Dashboard (`/admin`)

### `GET /admin/stats`
- **Auth**: Bearer Token (`ADMIN`)
- **Response**: `200 OK` Total users, revenue, active courses.

### `GET /admin/users`
- **Auth**: Bearer Token (`ADMIN`)

### `PATCH /admin/users/:id/ban`
- **Auth**: Bearer Token (`ADMIN`)

---

## 10. Notifications (`/notifications`)

### `GET /notifications`
- **Auth**: Bearer Token
- **Response**: `200 OK` Paginated unread/read notifications.

### `PATCH /notifications/read-all`
- **Auth**: Bearer Token
- **Response**: `200 OK`

### `POST /users/me/fcm-token`
- **Auth**: Bearer Token
- **Body**: `{ "token": "..." }`
- **Response**: `200 OK`

---

## 11. Reports & Settings

### `POST /reports`
- **Auth**: Bearer Token
- **Body**: `{ "reason": "SPAM", "entityType": "COMMENT", "entityId": "..." }`
- **Response**: `201 Created`

### `GET /settings/platform`
- **Auth**: Public
- **Response**: `200 OK` Global platform settings (e.g., Contact Email, Maintenance Mode).
