# 13. Design System & Theming

This document outlines the visual design language that must be mapped to Flutter's `ThemeData`. Masarak uses a modern, vibrant aesthetic suitable for E-Learning.

## 1. Color Palette

The Flutter app must define an `AppColors` class. Avoid hardcoding `Color(0xFF...)` inside UI widgets.

**Primary Brand Colors:**
- `Primary`: Rich Purple or Deep Blue (Matches Web).
- `Secondary`: Amber / Orange (Used for highlights, buttons, alerts).

**Semantic Colors:**
- `Success`: Green (e.g., Exam Passed, Payment Success).
- `Error`: Red (e.g., Exam Failed, Form Error).
- `Warning`: Yellow/Orange.
- `Info`: Light Blue.

**Neutral Colors (Backgrounds & Text):**
- `Background`: Very light gray / Off-white (for Light mode).
- `Surface`: Pure White (Cards, Bottom Sheets).
- `Text Primary`: Almost black (e.g., `#1A1A1A`).
- `Text Secondary`: Gray (e.g., `#757575`).

## 2. Typography

Masarak is primarily an Arabic platform, but supports English.
- **Font Family**: `Cairo`, `Tajawal`, or `Almarai` (Use Google Fonts package: `google_fonts`).
- **Text Theme**: Map standard Flutter text styles:
  - `displayLarge`: Used for major headers (e.g., Welcome screens).
  - `titleLarge`: Screen titles (AppBar).
  - `bodyLarge`: Primary paragraph text.
  - `labelLarge`: Button text.

## 3. Dark Mode
- The backend `UserPreferences` supports saving the user's theme choice.
- Flutter must implement `ThemeMode.system`, `ThemeMode.light`, and `ThemeMode.dark`.
- Use a dedicated dark palette (e.g., `Background`: `#121212`, `Surface`: `#1E1E1E`, `Text`: `#FFFFFF`).

## 4. Spacing & Shapes
- **Padding/Margin**: Use a standard grid of 4, 8, 16, 24, 32 pixels.
- **Border Radius**: Use rounded corners for a friendly UI.
  - Buttons: 8px to 12px.
  - Cards: 12px to 16px.
  - Bottom Sheets: Top corners 24px.

## Related Documents
- [14. Component Library](./14_Component_Library.md)
- [11. UI States](./11_UI_States.md)
