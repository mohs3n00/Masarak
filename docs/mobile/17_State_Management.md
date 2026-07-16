# 17. State Management

Due to the dynamic nature of Masarak (Exams with timers, Video playback progress, Real-time community feed), a robust state management solution is required.

## Recommended Solution: Riverpod (or BLoC)
We recommend **Riverpod** (`flutter_riverpod`) due to its compile-time safety and excellent caching/invalidation mechanics. Alternatively, **flutter_bloc** is acceptable if the team is more experienced with it.

### 1. Global States (App-wide)
These states must be accessible from anywhere in the app.
- **`AuthProvider`**: Manages `isAuthenticated`, `currentUser` (including Role), and token refreshing logic.
- **`ThemeProvider`**: Manages Dark/Light mode preferences.
- **`ConnectivityProvider`**: Listens to internet connection status and broadcasts it to the UI.

### 2. Feature-Specific States
- **`CourseDetailsProvider`**: Fetches and caches a specific course.
- **`CommunityFeedProvider`**: Manages pagination (cursor/offset), appending new posts when scrolling, and optimistic updates when reacting/commenting.
- **`CartProvider`**: Manages the local state of the user's cart before checkout.

### 3. Complex Ephemeral States
Some screens have highly complex, short-lived states that require precise handling.
- **`ExamSessionNotifier`**:
  - **Responsibilities**: 
    - Managing the countdown timer.
    - Storing user's selected answers locally.
    - Automatically submitting the exam when the timer hits 0.
    - Warning the user if they attempt to pop the route.
- **`VideoPlayerNotifier`**:
  - **Responsibilities**:
    - Tracking the current video timestamp.
    - Firing a heartbeat API request every X seconds to save progress (`POST /progress`).
    - Handling video buffering states.

## State Invalidation Strategy
When an action occurs that modifies data globally, relevant providers must be invalidated to trigger a re-fetch.
- **Example**: If a user updates their avatar in `ProfileScreen`, invalidate the `currentUserProvider` so the `Home` tab's top bar updates instantly.
- **Example**: If a user submits an exam, invalidate the `CourseProgressProvider` to unlock the next lesson.
