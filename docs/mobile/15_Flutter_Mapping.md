# 15. Flutter Strategy & Mapping

This document maps the existing Web features and Backend APIs directly to Flutter packages and strategies.

## 1. Network & API Layer
- **Web App**: Uses Axios / Fetch / React Query.
- **Flutter Mapping**: `dio` combined with `retrofit` or `http`.
- **Reason**: `dio` provides excellent interceptors for automatic JWT refreshing and global error handling, which is essential for the Masarak authentication lifecycle.

## 2. State Management
- **Web App**: Uses Zustand and React Context.
- **Flutter Mapping**: `flutter_riverpod` or `bloc` (See [17. State Management](./17_State_Management.md)).
- **Reason**: Both offer predictable, testable state handling crucial for an application with complex states (like an active exam timer or a media player).

## 3. Local Storage & Caching
- **Web App**: LocalStorage / SessionStorage.
- **Flutter Mapping**: `flutter_secure_storage` (for JWTs), `shared_preferences` (for Theme/Language), and `hive` or `sqflite` (for caching Course Syllabuses or Community feeds for offline viewing).
- **Reason**: Security. JWTs must be encrypted on the device.

## 4. Video Playback & DRM
- **Flutter Mapping**: `video_player` (core), wrapped with `chewie` or a custom UI. To prevent screen recording (DRM protection): `screen_protector`.
- **Reason**: Intellectual property protection for premium courses is mandatory.

## 5. Routing & Deep Linking
- **Web App**: Next.js App Router (`/path/[id]`).
- **Flutter Mapping**: `go_router`.
- **Reason**: `go_router` perfectly mirrors the URL-based routing approach of Next.js, making deep linking (e.g., `masarak.com/course/123`) trivial to handle in Flutter.

## 6. Real-time Features (If any)
- **Web App**: Server-Sent Events (SSE) for AI Chat, or WebSockets.
- **Flutter Mapping**: `web_socket_channel` or dedicated SSE packages.

## 7. Localization (Arabic & English)
- **Flutter Mapping**: `flutter_localizations` with `.arb` files or packages like `easy_localization`.
- **Reason**: Masarak is primarily Arabic. The app must support complete RTL layout flipping seamlessly.

## 8. Analytics & Crash Reporting
- **Flutter Mapping**: `firebase_crashlytics`, `firebase_analytics`.
- **Reason**: Essential for tracking user journeys and catching unhandled exceptions in production.
