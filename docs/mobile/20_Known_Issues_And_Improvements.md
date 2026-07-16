# 20. Codebase Audit: Technical Debt & Improvements

During the deep analysis of the Masarak Web and Backend projects, several areas were identified that could be optimized. **Note: These do not break the current production functionality but are highly recommended for future scalability.**

## 1. Duplicated Logic in Validation
- **Issue**: Some input validations (e.g., strong password checks, email format) are duplicated across the frontend Next.js code and the backend NestJS DTOs.
- **Improvement**: Create a shared NPM package for validation schemas (e.g., Zod) that can be imported by both the frontend and backend. *For Flutter, this must be recreated in Dart.*

## 2. Inconsistent Naming Conventions
- **Issue**: In the Prisma Schema, some relations are named inconsistently. For example, in `StudentProfile`, the city relation is named `cityRel`, whereas in `TeacherProfile`, it's just `city`.
- **Improvement**: Standardize relation naming in Prisma (e.g., appending `Ref` or sticking to the exact table name). *For Flutter, map both to a clean `City` DTO.*

## 3. Potential N+1 Queries
- **Issue**: Certain NestJS endpoints fetching courses also fetch nested arrays (Instructors, Lessons, Reviews) without strict pagination on the nested arrays.
- **Improvement**: Ensure the backend implements DataLoader or strict `select`/`include` limits in Prisma to avoid sending massive JSON payloads to the mobile app.

## 4. Unused / Dead APIs
- **Issue**: There are several controllers (e.g., `admin/platform-branding.controller.ts`) that appear to be partially implemented or unused by the current Web frontend.
- **Action**: These are documented as "Backend Ready / Frontend Pending". The mobile app can choose to implement them (e.g., dynamic splash screen colors based on branding) or ignore them.

## 5. Token Refresh Edge Case
- **Issue**: If multiple parallel API requests fail simultaneously with `401 Unauthorized`, the client might trigger the `POST /auth/refresh` endpoint multiple times concurrently.
- **Improvement**: In Flutter, the Dio interceptor MUST implement a lock/queue system. When the first 401 is hit, lock the interceptor, queue all subsequent requests, refresh the token once, and then resolve the queue with the new token.
