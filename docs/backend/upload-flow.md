# Upload Flow (Supabase Storage)

This document outlines the architecture and flow for handling file uploads (images, PDFs, videos, attachments) in the Masarak backend.

## Infrastructure
- **Storage Provider**: Supabase Storage (S3-compatible).
- **Backend Role**: Presigned URL generation and secure validation.
- **Frontend Role**: Direct-to-Supabase upload (saves backend bandwidth and prevents bottlenecks).

---

## Buckets Structure

| Bucket Name | Accessibility | Purpose |
| :--- | :--- | :--- |
| `avatars` | Public | User profile images. |
| `course-thumbnails` | Public | Course cover images. |
| `lesson-resources` | Private | PDFs, attachments, private video files. |
| `submissions` | Private | Student assignment submissions. |

---

## Upload Architecture Flow

To minimize server load and handle large files (like videos) efficiently, we will use a **Pre-signed URL (Direct Upload)** strategy.

### Step 1: Client Requests Upload URL
1. The client selects a file to upload.
2. The client calls `POST /uploads/presigned-url` with metadata (e.g., `filename`, `fileType`, `bucket`, `size`).
3. The NestJS backend authenticates the user and validates:
   - Does the user have permission to upload to this bucket?
   - Is the file size within limits?
   - Is the MIME type allowed?
4. The backend generates a temporary **Pre-signed Upload URL** using the Supabase Admin SDK.
5. The backend returns the URL and a generated `fileKey` to the client.

### Step 2: Client Uploads Directly
1. The frontend uses `axios` or `fetch` to `PUT` the file directly to the Supabase Pre-signed URL.
2. The file bypasses the NestJS backend entirely, allowing massive scalability for video uploads.

### Step 3: Client Confirms Upload
1. Once the client receives a 200 OK from Supabase, it calls the relevant backend API to save the record.
   - Example: `PATCH /users/me/avatar` with the `fileKey`.
   - Example: `POST /lessons/:id/files` with the `fileKey`.
2. The backend confirms the file exists in Supabase Storage.
3. The backend updates the PostgreSQL database to link the file.

---

## Endpoint Contracts

### 1. Generate Presigned URL

**Endpoint:** `POST /uploads/presigned-url`
**Authorization:** `Bearer Token` (Required)

**Request Body:**
```json
{
  "bucket": "lesson-resources",
  "filename": "chapter-1-notes.pdf",
  "contentType": "application/pdf",
  "sizeBytes": 2048576,
  "context": {
    "type": "LESSON_ATTACHMENT",
    "courseId": "uuid",
    "lessonId": "uuid"
  }
}
```

**Validation Rules:**
- `bucket`: Must be a valid predefined bucket.
- `contentType`: Must match allowed MIME types per bucket context.
- `sizeBytes`: Must not exceed max limits (e.g., 5MB for images, 1GB for videos).
- **Authorization**: If `bucket` is `lesson-resources`, verify `req.user.role === 'TEACHER'` and `req.user.id` owns the `courseId`.

**Response (200 OK):**
```json
{
  "uploadUrl": "https://[project_ref].supabase.co/storage/v1/object/upload/sign/lesson-resources/temp-uuid-chapter-1-notes.pdf?token=...",
  "fileKey": "lesson-resources/temp-uuid-chapter-1-notes.pdf",
  "expiresIn": 3600
}
```

---

## Private File Retrieval Flow

Public files (`avatars`, `course-thumbnails`) are accessed via public Supabase CDN URLs.
Private files (`lesson-resources`, `submissions`) require access control.

**Endpoint:** `GET /uploads/signed-url`
**Authorization:** `Bearer Token` (Required)

**Query Parameters:**
- `fileKey`: The full path of the file in storage.

**Flow:**
1. Backend checks if `req.user` has access to the resource tied to `fileKey`.
   - Example: If the file is a lesson resource, check if the student is enrolled in the course.
2. Backend generates a download Pre-signed URL via Supabase.
3. Returns URL to client for secure downloading/streaming.
