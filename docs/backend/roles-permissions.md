# Roles & Permissions Matrix

This document defines the Role-Based Access Control (RBAC) architecture for the Masarak platform. The system restricts access to endpoints and database operations based on the user's role.

## Defined Roles

The platform recognizes 4 primary roles:

1. **VISITOR** (Unauthenticated Guest)
2. **STUDENT** (Authenticated Learner)
3. **TEACHER** (Authenticated Instructor / Course Creator)
4. **ADMIN** (System Administrator)

---

## Permissions Matrix

| Feature / Action | VISITOR | STUDENT | TEACHER | ADMIN | Notes |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Authentication** |
| Register / Login | ✅ | ❌ | ❌ | ❌ | Authenticated users cannot register again. |
| Refresh Token | ❌ | ✅ | ✅ | ✅ | |
| **Users** |
| View Own Profile | ❌ | ✅ | ✅ | ✅ | |
| Update Own Profile | ❌ | ✅ | ✅ | ✅ | |
| View Any User | ❌ | ❌ | ❌ | ✅ | Admins have full read access to users. |
| Ban/Delete User | ❌ | ❌ | ❌ | ✅ | |
| **Teachers** |
| View Public Teacher Profile| ✅ | ✅ | ✅ | ✅ | |
| Update Teacher Profile | ❌ | ❌ | ✅ (Self) | ✅ | Teachers can update their own bio/qualifications. |
| **Courses** |
| List Public Courses | ✅ | ✅ | ✅ | ✅ | |
| View Course Details | ✅ | ✅ | ✅ | ✅ | Non-enrolled users see preview only. |
| Create Course | ❌ | ❌ | ✅ | ✅ | Teachers create their own courses. |
| Update Course | ❌ | ❌ | ✅ (Owner)| ✅ | |
| Delete Course | ❌ | ❌ | ✅ (Owner)| ✅ | |
| **Lessons & Content** |
| View Lesson List | ✅ | ✅ | ✅ | ✅ | Non-enrolled users see locked states. |
| Watch/View Content | ❌ | ✅ (Enrolled)| ✅ (Owner)| ✅ | |
| Create Lesson | ❌ | ❌ | ✅ (Owner)| ✅ | |
| Update/Delete Lesson | ❌ | ❌ | ✅ (Owner)| ✅ | |
| **Enrollments** |
| Enroll in Free Course | ❌ | ✅ | ❌ | ✅ | Teachers don't enroll; Admins can force-enroll. |
| Purchase Paid Course | ❌ | ✅ | ❌ | ✅ | |
| View Enrolled Students | ❌ | ❌ | ✅ (Owner)| ✅ | Teachers see students in their courses. |
| **Exams & Assignments** |
| Take Exam | ❌ | ✅ (Enrolled)| ❌ | ❌ | |
| Submit Assignment | ❌ | ✅ (Enrolled)| ❌ | ❌ | |
| Create Exam/Assignment | ❌ | ❌ | ✅ (Owner)| ✅ | |
| Grade Assignment | ❌ | ❌ | ✅ (Owner)| ✅ | |
| **Community / Comments** |
| Read Comments | ✅ | ✅ | ✅ | ✅ | |
| Post Comment | ❌ | ✅ | ✅ | ✅ | |
| Edit/Delete Comment | ❌ | ✅ (Self) | ✅ (Self) | ✅ | |
| **Payments & Finance** |
| View Own Transactions | ❌ | ✅ | ❌ | ❌ | |
| View Teacher Earnings | ❌ | ❌ | ✅ (Self) | ✅ | |
| Manage Subscriptions | ❌ | ✅ | ❌ | ✅ | |
| Generate Coupons | ❌ | ❌ | ✅ (Owner)| ✅ | |
| **System Settings** |
| View Platform Stats | ❌ | ❌ | ❌ | ✅ | |
| Manage Settings | ❌ | ❌ | ❌ | ✅ | |

---

## Technical Implementation Notes (NestJS)

### 1. The `@Roles()` Decorator
Used to attach required roles to specific route handlers.

```typescript
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
```

### 2. `JwtAuthGuard`
Always runs first. Verifies the JWT signature, checks expiration, and injects `req.user`.
If no valid token, returns `401 Unauthorized`.

### 3. `RolesGuard`
Runs after `JwtAuthGuard`. 
Reads the required roles using `Reflector`.
Compares required roles against `req.user.role`.
If role mismatch, returns `403 Forbidden`.

### 4. Ownership Checks (Resource-Level Access)
For actions like `Update Course` or `Delete Lesson`, role-based checks aren't enough (a teacher shouldn't edit another teacher's course).
This must be enforced at the service level:
```typescript
const course = await this.prisma.course.findUnique({ where: { id: courseId } });
if (course.teacherId !== req.user.id && req.user.role !== 'ADMIN') {
  throw new ForbiddenException('You do not own this course.');
}
```
