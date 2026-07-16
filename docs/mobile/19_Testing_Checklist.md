# 19. Testing Checklist

Before submitting the Flutter application to the App Store or Google Play, the QA team must pass this exhaustive checklist tailored to Masarak's specific logic.

## 1. Authentication & Security
- [ ] Register with valid data -> Expect OTP flow.
- [ ] Register with existing email -> Expect validation error.
- [ ] Login with invalid credentials -> Expect error.
- [ ] Wait for Access Token to expire (or mock it) -> Verify interceptor transparently refreshes the token without logging the user out.
- [ ] Change password on Device A -> Verify Device B is logged out upon next API request.

## 2. Payments & Enrollment
- [ ] Purchase a paid course via credit card -> Verify success and immediate access.
- [ ] Cancel payment mid-flow -> Verify app handles cancellation gracefully (no crash).
- [ ] Apply a 100% discount coupon -> Verify payment gateway is skipped and course is enrolled instantly.
- [ ] Enroll in a free course -> Verify instant access.

## 3. Video Player & Media
- [ ] Play a video -> Verify it tracks progress and saves to the backend.
- [ ] Rotate device to landscape -> Verify fullscreen video behavior.
- [ ] Attempt to take a screenshot during a video -> Verify DRM blocks the screenshot (Android) or blacks it out (iOS).
- [ ] View a PDF -> Verify smooth scrolling.

## 4. Exam Engine
- [ ] Start an exam -> Verify timer begins.
- [ ] Put the app in the background for 10 seconds, then return -> Verify anti-cheat logic triggers (warning or submission).
- [ ] Wait for timer to hit 0:00 -> Verify exam auto-submits.
- [ ] Answer all questions and submit -> Verify score matches expected.

## 5. Offline & Edge Cases
- [ ] Turn off Wi-Fi/Data -> Launch app -> Verify "Offline" banner appears.
- [ ] Attempt to submit a community post while offline -> Verify button is disabled or request is queued.
- [ ] Navigate to a deeply nested screen, turn off internet -> Verify gracefully handles `SocketException`.

## 6. Community
- [ ] Scroll community feed -> Verify pagination loads more posts smoothly without jumping.
- [ ] React to a post -> Verify optimistic UI updates immediately, before API responds.
