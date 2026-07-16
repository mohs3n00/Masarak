# 11. UI States

Robust mobile applications must explicitly design for all UI states. We expect the Flutter app to handle these seamlessly for every API-driven screen.

## 1. Initial / Loading State
- Do NOT use generic circular progress indicators `CircularProgressIndicator` for full-screen loading.
- **Requirement**: Implement **Shimmer/Skeleton Loaders** for all primary screens (Home, Feed, Course Details).
- Skeletons should visually match the expected loaded UI geometry (e.g., a grid of gray boxes mimicking course cards).

## 2. Empty State
When an API returns an empty array `[]` (e.g., No Search Results, Empty Cart, No Enrollments):
- Do NOT show a blank screen.
- **Requirement**: Show an illustration/icon, a title ("It's empty here!"), a subtitle explaining why, and a **Call to Action (CTA)** button (e.g., "Explore Courses", "Clear Filters").

## 3. Error State
When an API request fails:
- **Partial Failure** (e.g., failure loading a specific widget on Home): Show a small inline error widget with a retry button instead of failing the whole screen.
- **Full Screen Failure**: Show an Error Illustration, the error message, and a prominent "Retry" button.

## 4. Success / Populated State
- Data is loaded successfully.
- Ensure graceful rendering with explicit image placeholders (`CachedNetworkImage` with placeholder widget).
- Apply fade-in transitions when images finish loading to prevent jarring pop-ins.

## 5. Offline State
- Track connectivity locally. 
- Show a dismissible bottom banner when offline.
- Allow viewing downloaded PDFs or Videos if DRM/local caching allows. Disable "Purchase" or "Comment" buttons.

## 6. Pagination States (Infinite Scroll)
For feeds and lists (e.g., Community, Course Search):
- **Loading More**: Show a loader at the absolute bottom of the `ListView`/`GridView`.
- **End of List**: Show a subtle text "You have reached the end" or simply remove the loader.
