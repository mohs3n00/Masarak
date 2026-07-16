# 14. Component Library

To ensure consistency and speed up development, the Flutter team must build a reusable custom component library before building full screens.

## 1. Core Atoms
- **`MasarakButton`**: A wrapper around `ElevatedButton`/`OutlinedButton` supporting loading states (shows a spinner inside the button), disabled states, and dynamic colors.
- **`MasarakTextField`**: A wrapper around `TextFormField`. Handles standardized border radius, error text styling, and trailing icons (e.g., toggle password visibility).
- **`MasarakAvatar`**: A circular image widget using `CachedNetworkImage` with fallback initials or an icon.
- **`MasarakBadge`**: Used for tags like "New", "Bestseller", or "Live".

## 2. Molecules
- **`CourseCard`**: Used in lists and grids. Displays thumbnail, title, instructor name, rating, and price. Must handle tap navigation.
- **`LessonTile`**: A `ListTile` showing lesson type (Video/PDF/Exam icon), title, duration, and a lock icon if not accessible.
- **`PostCard`**: Used in the Community feed. Displays author avatar, name, time, post content, and reaction/comment action bar.
- **`ReviewTile`**: Shows student avatar, star rating, and text.

## 3. Organisms
- **`CartSummaryCard`**: Displays subtotal, coupon input row, and checkout button.
- **`EmptyStateWidget`**: Reusable widget for empty screens (SVG illustration + Title + Subtitle + Action Button).
- **`ErrorStateWidget`**: Similar to empty state, but for API failures, with a "Retry" button.
- **`ShimmerGrid` / `ShimmerList`**: Reusable loading skeletons.

## Best Practices
- Place all these components inside `lib/presentation/widgets/`.
- Use `Theme.of(context)` to style them rather than hardcoded colors.
- Ensure all custom widgets expose `Key? key` and necessary callbacks (`VoidCallback onTap`).

## Related Documents
- [13. Design System](./13_Design_System.md)
