# Masarak Project Rules

This document contains project-specific rules for Masarak.

These rules override generic AI behavior whenever necessary.

Failure to follow these rules is considered an incorrect implementation.

---

# Project Goal

Masarak is a production-ready educational platform.

Every implementation must prioritize:

- Reliability
- Stability
- Security
- Scalability
- User Experience

The platform should always remain usable by:

- Students
- Teachers
- Administrators
- Parents (if applicable)

---

# General Rule

Never make assumptions about the project.

Inspect the current implementation before making changes.

If something is unclear, ask.

---

# Feature Preservation

Existing features have higher priority than new features.

Never break:

Authentication

Authorization

Course access

Lesson viewing

Video playback

Progress tracking

Enrollment

Student dashboard

Teacher dashboard

Admin dashboard

Notifications

Search

Payments

Certificates

File uploads

---

# Scope Control

Only modify files required for the task.

Never perform unnecessary refactoring.

Never rename existing APIs.

Never rename database fields.

Never move files without approval.

---

# Dashboard Safety

Admin Dashboard must never lose functionality.

Teacher Dashboard must never lose functionality.

Student Dashboard must never lose functionality.

Before completion verify:

Cards

Statistics

Buttons

Forms

Tables

Navigation

Charts

Filters

Pagination

Search

---

# CRUD Safety

Every CRUD operation must support:

Validation

Permission checking

Loading state

Error handling

Success feedback

Confirmation before deletion

No accidental data loss

---

# Forms

Every form must:

Validate inputs.

Prevent duplicate submission.

Handle API failures.

Show meaningful errors.

Restore the UI after failure.

Never lose user input unnecessarily.

---

# Buttons

Every visible button must:

Perform its intended action.

Provide loading feedback.

Prevent multiple submissions.

Never appear clickable without functionality.

---

# API Stability

Frontend and Backend must remain synchronized.

Never change response structures without updating all dependent components.

Never invent API fields.

Never invent endpoints.

---

# Authentication

Never bypass authentication.

Never expose protected pages.

Always verify:

Roles

Permissions

Ownership

---

# Authorization

Students cannot access teacher resources.

Teachers cannot access admin resources.

Users cannot access other users' private data unless explicitly allowed.

---

# Payment Safety

Payment code is critical.

Never modify payment flow without explicit approval.

Always preserve:

Payment verification

Transaction integrity

Order status

Enrollment after payment

Receipt generation

Never bypass payment validation.

---

# File Upload Safety

Always validate uploads.

Never trust filenames.

Never expose uploaded files unintentionally.

---

# Security

Protect against:

SQL Injection

NoSQL Injection

XSS

CSRF

IDOR

SSRF

Command Injection

Broken Access Control

Path Traversal

File Upload Attacks

Mass Assignment

Prototype Pollution

---

# UI Rules

Never redesign existing pages unless requested.

Maintain:

Spacing

Typography

Colors

Icons

Component consistency

Responsive behavior

---

# Responsive Design

Every modified page must remain usable on:

Desktop

Laptop

Tablet

Mobile

---

# Performance

Avoid:

Repeated API requests

Repeated rendering

Heavy queries

Large payloads

Memory leaks

Blocking operations

---

# Logging

Log useful information only.

Never log:

Passwords

Tokens

Secrets

Private student information

Private teacher information

Payment data

---

# Error Handling

Never expose internal errors.

Always show user-friendly messages.

Log technical details internally.

---

# Production Readiness

Before considering any task complete verify:

No build errors.

No lint errors.

No runtime errors.

No console errors.

No broken imports.

No broken routes.

No broken navigation.

No broken APIs.

No broken permissions.

No broken database relationships.

---

# Final Self Review

Before replying:

Ask yourself:

Did I change anything outside the requested scope?

Did I preserve every existing feature?

Did I introduce any regression?

Did I assume something instead of verifying it?

Did I follow the project architecture?

Did I create technical debt?

Did I leave debugging code?

Would I confidently deploy this implementation to production?

If the answer to any question is "No", continue reviewing before responding.

---

# Golden Rule

Masarak is a production system.

Every change should make the project safer, more stable, and easier to maintain.

Never sacrifice stability for speed.