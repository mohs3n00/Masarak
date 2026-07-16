# 18. Implementation Order

To ensure a smooth, iterative delivery of the Flutter application, the engineering team should follow this phased implementation order.

## Sprint 1: Foundation & Core UI
1. Initialize Flutter project (Clean Architecture setup).
2. Configure Dio, Interceptors, and Secure Storage.
3. Build the Component Library (Buttons, TextFields, Colors, Typography).
4. Implement routing skeleton (`go_router`) with empty screens.

## Sprint 2: Authentication & Onboarding
1. Implement Splash Screen (Token verification logic).
2. Implement Onboarding Carousel.
3. Implement Login & Registration screens (with form validation).
4. Implement OTP Verification.
5. Integrate JWT Refresh logic in the API client.

## Sprint 3: Taxonomy & Discovery (Student Focus)
1. Implement the Main Bottom Navigation Shell.
2. Implement Home Screen (Fetching Stages, Levels, Departments).
3. Implement Search & Filter screens.
4. Implement Public Course Details screen.

## Sprint 4: E-Commerce & Enrollment
1. Implement Cart & Checkout screens.
2. Integrate Payment Gateway (Webview or Native SDK based on Paymob/Tap documentation).
3. Handle Payment Success/Failure deep linking and state updates.

## Sprint 5: The Learning Experience (The Player)
1. Implement the `CoursePlayer` shell.
2. Integrate Video Player (with speed controls and DRM).
3. Implement PDF Viewer.
4. Implement Progress Tracking (Heartbeat API).

## Sprint 6: Exam Engine
1. Implement Exam Intro screen.
2. Build the Active Exam logic (Timer, Auto-submit, Answer state).
3. Implement Exam Results & Feedback screen.

## Sprint 7: Community & Social
1. Implement Community Feed with pagination.
2. Implement Post Creation (with Image Upload).
3. Implement Comments and Reactions.

## Sprint 8: Teacher Role & Polish
1. Implement Teacher Dashboard.
2. Implement Course Creation Wizard (Teacher).
3. Push Notifications integration (Firebase Cloud Messaging).
4. QA, Bug fixing, and Store preparation.
