# 22. Flutter DTO Mapping

This document maps the core Backend entities (derived from Prisma) to Dart Models (DTOs) with their precise data types and nullability.

> **Tip**: Use `json_serializable` and `freezed` in Flutter to generate `fromJson` and `toJson` methods automatically.

## 1. User Model
Maps to Prisma `User` table.

```dart
@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    required String phone,
    required String firstName,
    required String middleName,
    required String lastName,
    required String familyName,
    required String role, // Enum: STUDENT, TEACHER, ADMIN, etc.
    String? avatar,
    String? bio,
    DateTime? dateOfBirth,
    String? gender, // Enum: MALE, FEMALE
    @Default(true) bool isActive,
    @Default(false) bool emailVerified,
    @Default(false) bool phoneVerified,
    required DateTime createdAt,
    required DateTime updatedAt,
  }) = _UserModel;
}
```

## 2. Course Model
Maps to Prisma `Course` table.

```dart
@freezed
class CourseModel with _$CourseModel {
  const factory CourseModel({
    required String id,
    required String title,
    required String slug,
    required String description,
    String? thumbnailUrl,
    String? bannerUrl,
    required double price,
    double? originalPrice,
    @Default(false) bool isPublished,
    String? categoryId,
    String? subjectId,
    String? difficulty, // Enum
    required String type, // Enum: RECORDED, LIVE, HYBRID
    required String status, // Enum: DRAFT, PUBLISHED
    required String accessType, // Enum: FREE, PAID, SUBSCRIPTION
    List<CourseSectionModel>? sections,
    List<TeacherProfileModel>? instructors,
  }) = _CourseModel;
}
```

## 3. Lesson Model
Maps to Prisma `Lesson` table.

```dart
@freezed
class LessonModel with _$LessonModel {
  const factory LessonModel({
    required String id,
    required String sectionId,
    required String title,
    String? description,
    required String type, // Enum: VIDEO, PDF, ARTICLE, EXAM, ASSIGNMENT
    required int order,
    @Default(false) bool isFreePreview,
    List<LessonVideoModel>? videos,
    List<LessonAttachmentModel>? attachments,
    ExamTemplateModel? examTemplate,
  }) = _LessonModel;
}
```

## 4. Community Post Model
Maps to Prisma `CommunityPost`.

```dart
@freezed
class CommunityPostModel with _$CommunityPostModel {
  const factory CommunityPostModel({
    required String id,
    required String authorId,
    required String content,
    String? imageUrl,
    required String status, // Enum: PUBLISHED, DRAFT
    required DateTime createdAt,
    UserModel? author,
    @Default(0) int likesCount,
    @Default(0) int commentsCount,
  }) = _CommunityPostModel;
}
```

## Notes on Dart Serialization
- **Dates**: Prisma returns ISO-8601 strings. Dart's `DateTime.parse()` handles this natively, but `json_serializable` requires explicit formatting configuration if parsing deeply nested dates.
- **Enums**: Backend enums (like `Role` or `ContentType`) should be mapped to Dart Enums using `@JsonValue()`. If the backend returns a new unmapped enum, Dart will throw an exception unless you provide a fallback value (e.g., `unknown`).
