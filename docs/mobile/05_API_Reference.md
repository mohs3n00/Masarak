# 05. API Reference

Masarak uses a NestJS backend equipped with Swagger for OpenAPI specification.
Instead of manually listing hundreds of endpoints, we have generated the complete **OpenAPI / Swagger JSON Specification** for you.

## 🔗 Swagger Specification
You can find the full API collection in the file:
`docs/mobile/swagger.json`

This file contains EVERY endpoint including:
- HTTP Method & URL
- Required Headers (Authorization)
- Query Parameters & Path Variables
- Request Body (DTOs)
- Validation Rules
- Success and Failure Responses

### How to use it in Flutter
1. Import `swagger.json` into Postman, Insomnia, or Bruno to generate a complete collection.
2. Use tools like `openapi_generator` or `swagger_dart_code_generator` to automatically generate Dart DTOs and API Service classes.

---

## High-Level API Domains

Here is the breakdown of what each controller provides:

### 1. Authentication & Users (`/auth`, `/users`)
- `POST /auth/register` (Registers a user, assigns roles).
- `POST /auth/login` (Returns JWT access & refresh tokens).
- `POST /auth/verify-otp`
- `GET /users/me` (Returns the current authenticated user profile based on role).

### 2. Academic Taxonomy (`/academic/*`)
- `/academic/structure/stages`, `levels`, `departments` (Get hierarchical education tracks).
- `/academic/subjects` (Get subjects like Physics, Math).

### 3. Courses (`/courses`, `/teacher/courses`)
- `GET /public/courses` (Discover courses with pagination & filtering).
- `GET /courses/:id/content` (Get videos, PDFs, and exams for enrolled students).
- `POST /teacher/courses` (Teacher course creation).

### 4. Exam Engine (`/exams`, `/teacher/courses/:id/lessons/:id/exam`)
- `POST /exams/session/start` (Initializes an exam session and starts timer).
- `POST /exams/session/submit` (Submits answers for auto-grading).

### 5. Community (`/community`)
- `GET /community/feed` (Paginated social feed).
- `POST /community/posts` (Create post).
- `POST /community/posts/:id/react` (Like, Love, etc.).

### 6. E-Commerce (`/student/checkout`, `/payments`, `/teacher/coupons`)
- `POST /student/checkout/process` (Initiates Paymob/Tap payment).
- `POST /teacher/coupons` (Generates discount codes).

---

## Standard Headers
Every authenticated request requires:
```json
{
  "Authorization": "Bearer <JWT_ACCESS_TOKEN>",
  "Accept-Language": "ar" // or "en"
}
```

## Standard Pagination
Endpoints that return lists use standard pagination queries:
- `?page=1`
- `?limit=10`
- `?search=keyword`

Response Format:
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "lastPage": 15
  }
}
```
