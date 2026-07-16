# 16. Flutter Architecture Recommendation

To manage the massive scope of the Masarak project (E-Learning + E-Commerce + Community + Roles), a structured, scalable architecture is non-negotiable. We strongly recommend **Feature-First Clean Architecture**.

## 1. High-Level Architecture (Feature-First)

Instead of grouping files by type (e.g., all models together, all controllers together), group them by **Feature**.

```
lib/
 ├── core/                    # Shared across the whole app
 │    ├── network/            # Dio client, Interceptors
 │    ├── theme/              # Colors, Fonts (See Design System)
 │    ├── errors/             # Failure models, Exceptions
 │    ├── utils/              # Validators, Formatters
 │    └── widgets/            # Global UI Components (See Component Library)
 │
 ├── features/
 │    ├── auth/               # Feature: Authentication
 │    │    ├── data/          # Repositories, Data Sources, DTOs
 │    │    ├── domain/        # Entities, Use Cases
 │    │    └── presentation/  # UI Screens, Widgets, State (Bloc/Provider)
 │    │
 │    ├── course/             # Feature: Course Discovery & Player
 │    ├── exam/               # Feature: Exam Engine
 │    ├── community/          # Feature: Social Feed
 │    ├── checkout/           # Feature: Cart & Payment
 │    └── profile/            # Feature: User Settings & Stats
 │
 ├── main.dart
 └── app.dart                 # Router and Theme injection
```

## 2. Layers Explained (Clean Architecture)

### A. Data Layer
- **Data Sources**: Makes the actual HTTP calls (`AuthRemoteDataSource`).
- **DTOs (Models)**: Parses JSON into Dart objects (`UserModel.fromJson`).
- **Repositories (Impl)**: Implements the Domain Repository. Handles caching logic (if fetching from API fails, fetch from local DB).

### B. Domain Layer (Pure Dart, No Flutter deps)
- **Entities**: Business logic objects (`User`).
- **Repositories (Interface)**: Abstract class defining what the Data layer must provide.
- **Use Cases**: Specific actions (`LoginUserUseCase`, `SubmitExamUseCase`).

### C. Presentation Layer
- **State Management**: The ViewModel/Controller (e.g., `AuthBloc` or `AuthNotifier`).
- **Screens**: The actual UI (`LoginScreen`).
- **Widgets**: UI components specific only to this feature (`LoginFormWidget`).

## 3. Dependency Injection
Use `get_it` or `riverpod` (which has DI built-in) to inject Use Cases into Blocs/Notifiers, and Repositories into Use Cases. This ensures the app is highly testable.
