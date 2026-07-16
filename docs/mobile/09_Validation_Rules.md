# 09. Validation Rules

To minimize API round-trips and provide a fast user experience, Flutter must implement these validation rules locally (client-side) using forms (e.g., `FormBuilder` or standard `TextFormField`).

## 1. Authentication Validations
- **Email**: Must match standard regex (e.g., `^[a-zA-Z0-O._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$`).
- **Phone Number**: Must contain 10-15 digits. Support international formats but prioritize local formats based on `Country` selection.
- **Password**: Minimum 8 characters. Must contain at least 1 uppercase letter, 1 number, and 1 special character.
- **OTP**: Exactly 6 numeric digits.

## 2. Profile Validations
- **Names (First, Middle, Last, Family)**: Required. Minimum 2 characters. Must not contain numbers or special characters.
- **Bio**: Optional. Max 500 characters.

## 3. Teacher Validations (Course Creation)
- **Course Title**: Required. Min 10 characters, Max 100.
- **Course Description**: Required. Min 50 characters.
- **Price**: Must be a positive number. Max two decimal places.
- **Thumbnail Image**: Required before submitting for review.

## 4. Community Post Validations
- **Post Content**: Required. Min 1 character, Max 2000 characters.
- **Comments**: Required. Max 500 characters.

## 5. Exam Submissions
- **Time Limits**: If `durationMin` is reached, local validation must trigger an automatic form submission.

## Standard Error Presentation
- **Inline Errors**: Display directly below the corresponding `TextFormField` in red.
- **Global Form Errors**: Display via Snackbar if the form fails to submit (e.g., "Please fix the errors in red before continuing").
