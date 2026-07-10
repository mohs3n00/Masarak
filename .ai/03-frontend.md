# Frontend Development Rules

These rules apply to every frontend task.

Failure to follow these rules means the task is incomplete.

---

# General Principles

Frontend code must be:

- Clean
- Predictable
- Reusable
- Responsive
- Accessible
- Maintainable
- Production-ready

Never write temporary UI code.

---

# Before Writing UI

Before creating or modifying any page:

- Read related components.
- Read shared UI components.
- Read existing layouts.
- Read routing structure.
- Read styling conventions.

Never create a completely different style unless explicitly requested.

---

# Respect Existing Design

Always preserve:

Typography

Spacing

Colors

Animations

Component style

Border radius

Icons

Dark mode support

Theme consistency

Never redesign existing pages without approval.

---

# Component Rules

Prefer reusable components.

Avoid duplicated UI.

Keep components focused on one responsibility.

Extract repeated UI into shared components.

Do not create huge components.

Prefer composition over duplication.

---

# Page Rules

Every page must have:

Loading State

Empty State

Error State

Success State (when applicable)

Permission State (if protected)

Offline State (if applicable)

Never leave blank screens.

---

# Form Rules

Every form must:

Validate before submit.

Prevent duplicate submissions.

Disable submit while loading.

Display validation errors clearly.

Handle API failures gracefully.

Restore submit button after failure.

Never allow invalid data to be submitted.

---

# Button Rules

Every button must:

Have a clear action.

Provide loading feedback.

Prevent multiple clicks.

Be disabled when necessary.

Display meaningful text.

Never create buttons that appear clickable but do nothing.

---

# API Integration Rules

Never assume API responses.

Always handle:

Loading

Success

Failure

Unexpected response

Empty response

Unauthorized response

Timeout

Network failure

Do not crash if the backend changes unexpectedly.

---

# State Management

Keep state as local as possible.

Avoid unnecessary global state.

Remove unused state.

Avoid deeply nested state.

Never mutate state directly.

---

# Rendering Rules

Avoid unnecessary re-renders.

Avoid expensive calculations inside rendering.

Memoize only when necessary.

Do not optimize prematurely.

---

# Responsive Design

Every page must support:

Desktop

Laptop

Tablet

Mobile

Never assume screen size.

Never use fixed widths unless necessary.

Test layouts mentally for different screen sizes.

---

# Accessibility

Use semantic HTML.

Provide labels.

Provide alt text.

Support keyboard navigation.

Maintain sufficient color contrast.

Never rely only on color to communicate meaning.

---

# Navigation

Verify:

All links work.

All buttons navigate correctly.

Back navigation works.

Protected routes remain protected.

404 handling exists.

No broken navigation.

---

# Error Messages

Messages should:

Explain the problem.

Suggest the next step.

Avoid technical jargon for end users.

Never expose stack traces.

---

# Notifications

Use notifications only when meaningful.

Avoid excessive alerts.

Success messages should be short.

Error messages should help users recover.

---

# Performance

Lazy load when appropriate.

Avoid unnecessary API requests.

Avoid rendering hidden components.

Avoid large component trees.

Optimize images.

Use pagination for large datasets.

---

# File Upload

Validate:

File type

File size

Upload progress

Upload failure

Cancellation

Retry

Never trust client-side validation alone.

---

# Images

Optimize images.

Lazy load large images.

Handle broken images gracefully.

Always provide fallback behavior.

---

# Tables

Large tables must support:

Pagination

Sorting

Filtering

Searching

Loading

Empty state

Error state

---

# Search

Search should:

Debounce input when appropriate.

Handle empty queries.

Handle no results.

Avoid excessive requests.

---

# Modals

Every modal must:

Trap focus.

Close correctly.

Support Escape key.

Prevent background interaction.

Restore focus after closing.

---

# Dialogs

Destructive actions must require confirmation.

Never delete immediately without confirmation.

---

# Loading

Never freeze the UI.

Always provide visible feedback.

Use skeletons or loaders where appropriate.

---

# Console

Before considering the task complete:

No Console Errors

No Console Warnings caused by new code

No React Errors

No Hydration Errors

No Runtime Exceptions

---

# Completion Checklist

Before finishing verify:

✓ UI matches existing design

✓ Responsive

✓ No broken buttons

✓ No broken forms

✓ API integration works

✓ Loading handled

✓ Errors handled

✓ Empty states handled

✓ No obvious accessibility issues

✓ No console errors

✓ No duplicated components

✓ No unnecessary complexity

Only then is the frontend task considered complete.