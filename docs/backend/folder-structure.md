# NestJS Backend Folder Structure

This document outlines the standard folder architecture for the future NestJS backend of the Masarak platform. The architecture follows a modular, feature-driven approach (Domain-Driven Design inspired) to keep the codebase scalable, maintainable, and highly decoupled.

## Core Principles

- **Feature Modules**: Each domain feature (e.g., Auth, Users, Courses) gets its own module.
- **Separation of Concerns**: Controllers handle HTTP logic, Services handle business logic, Repositories (Prisma) handle data access.
- **Shared Utilities**: Common components, guards, decorators, and interceptors go into a shared core directory.
- **DTOs & Entities**: Data Transfer Objects (Validation/Input) and Entities (Output/Serialization) are co-located within their feature module.

## Directory Tree

```text
src/
├── main.ts                       # Application entry point
├── app.module.ts                 # Root module
├── prisma/
│   ├── prisma.service.ts         # Prisma Client instantiation
│   └── prisma.module.ts          # Global Prisma module
├── common/                       # Shared across all modules
│   ├── decorators/               # Custom decorators (@User, @Roles)
│   ├── filters/                  # Global Exception Filters (HttpException)
│   ├── guards/                   # Global Guards (JwtAuthGuard, RolesGuard)
│   ├── interceptors/             # Global Interceptors (Response Transform)
│   ├── middleware/               # Express/Fastify Middlewares
│   └── utils/                    # Helper functions (Hash, Pagination)
├── config/                       # Configuration modules and environment variables
│   ├── configuration.ts          # Typed configuration objects
│   └── env.validation.ts         # Joi/Zod validation for process.env
├── modules/                      # Feature modules
│   ├── auth/                     # Authentication Module
│   │   ├── dto/                  # LoginDto, RegisterDto
│   │   ├── guards/               # LocalAuthGuard, RefreshTokenGuard
│   │   ├── strategies/           # JwtStrategy, RefreshStrategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/                    # User Management
│   │   ├── dto/                  # UpdateUserDto, CreateUserDto
│   │   ├── entities/             # UserEntity (Serialization)
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── teachers/                 # Teachers Profile & Management
│   ├── courses/                  # Course Content
│   ├── lessons/                  # Lessons & Modules
│   ├── enrollments/              # Course Enrollments
│   ├── assignments/              # Assignments & Submissions
│   ├── exams/                    # Quizzes & Exams
│   ├── payments/                 # Payment intent & History
│   ├── notifications/            # Database, Email, Push
│   ├── uploads/                  # Supabase Storage proxy
│   └── community/                # Forums, Comments, Replies
├── shared/                       # Reusable infrastructure providers (Feature First)
│   ├── cache/                    # Redis distributed caching & interfaces
│   ├── firebase/                 # Firebase Admin SDK (Push, Topics)
│   ├── mail/                     # Email Providers (SMTP, SendGrid, etc.)
│   ├── notifications/            # Notification Providers (Database, FCM)
│   ├── queue/                    # Background Jobs (BullMQ)
│   ├── sms/                      # SMS Providers (Twilio, Unifonic, Infobip)
│   └── storage/                  # File Uploads (Cloudinary, Supabase)
└── types/                        # Global TypeScript definitions
```

## Module Structure Details

For every feature under `src/modules/<feature-name>/`:

- **`<feature-name>.module.ts`**: Encapsulates the feature. Imports `PrismaModule` and any other required modules.
- **`<feature-name>.controller.ts`**: Defines routes (`@Get()`, `@Post()`), handles `@Query()`, `@Body()`, `@Param()`, applies Swagger decorators and validation pipes.
- **`<feature-name>.service.ts`**: Contains pure business logic. Performs database transactions using `PrismaService`.
- **`dto/`**: Contains classes with `class-validator` and `class-transformer` decorators for strict incoming request validation.
- **`entities/`**: Contains classes defining the response shape, potentially stripping out sensitive fields (e.g., passwords) using `@Exclude()` from `class-transformer`.

## Configuration & Environment

Configuration is centralized in `src/config` using `@nestjs/config`. 
It ensures environment variables (Database URL, Supabase keys, JWT Secrets) are validated on startup.

## Testing Structure

- **Unit Tests**: Co-located with their respective files (e.g., `users.service.spec.ts`).
- **E2E Tests**: Located in the root `test/` folder (`test/app.e2e-spec.ts`, `test/auth.e2e-spec.ts`).
