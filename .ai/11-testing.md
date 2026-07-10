# Testing Rules

Testing is mandatory.

A feature is not complete until it has been verified.

Never claim a task is finished without performing a structured review.

---

# General Principles

Assume every change can break existing functionality.

Every implementation must be verified.

---

# Regression Testing

After every modification, verify:

- Existing features still work.
- Existing pages still load.
- Existing APIs still respond correctly.
- Existing forms still submit correctly.
- Existing authentication still works.
- Existing authorization still works.

Never introduce regressions.

---

# Functional Testing

Verify that:

Every button works.

Every form works.

Every modal works.

Every dialog works.

Every dropdown works.

Every search works.

Every filter works.

Every pagination works.

Every upload works.

Every download works.

Every navigation link works.

---

# CRUD Testing

For every CRUD feature verify:

Create

Read

Update

Delete

Validation

Permissions

Error handling

Loading states

Success states

---

# UI Testing

Verify:

Responsive layout

Alignment

Spacing

Typography

Colors

Icons

Animations

Dark mode (if supported)

Accessibility

---

# API Testing

Verify:

Correct endpoint

Correct method

Correct payload

Correct response

Error responses

Unauthorized requests

Permission failures

Invalid input

Timeout behavior

---

# Authentication Testing

Verify:

Login

Logout

Session expiration

JWT validation

Role protection

Permission protection

Password reset

Email verification

---

# Database Testing

Verify:

Correct inserts

Correct updates

Correct deletes

Transactions

Relationships

Constraints

No duplicate records

No orphan records

---

# Error Testing

Test:

Invalid input

Empty input

Unexpected input

Large input

Network failure

Server failure

Unauthorized requests

Forbidden requests

404 responses

500 responses

---

# Browser Testing

Verify:

Console contains no errors.

Console contains no warnings introduced by the new code.

No hydration errors.

No runtime exceptions.

---

# Performance Testing

Check for:

Repeated requests

Large payloads

Slow rendering

Slow queries

Memory leaks

Blocking operations

---

# Edge Cases

Always consider:

Empty datasets

Maximum values

Minimum values

Null values

Slow internet

Offline mode

Expired sessions

Concurrent requests

---

# Production Verification

Before deployment verify:

Build succeeds.

Lint succeeds.

Type checking succeeds.

No critical warnings.

Environment variables exist.

No debug code remains.

---

# Completion Rule

A task is NOT complete unless the required testing for that task has been performed.

Never claim successful implementation without verification.

---

# Testing Checklist

✓ Functionality verified

✓ Regression checked

✓ API verified

✓ UI verified

✓ Authentication verified

✓ Authorization verified

✓ Performance reviewed

✓ No console errors

✓ No runtime errors

✓ Production ready