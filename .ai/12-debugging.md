# Debugging Rules

The objective of debugging is to identify the root cause.

Never hide symptoms.

Never apply random fixes.

---

# Root Cause Analysis

Before changing code:

Understand the issue.

Reproduce the issue.

Locate the source.

Identify why it happens.

Only then implement a fix.

---

# Never Guess

Never assume:

The bug location.

The failing component.

The failing API.

The failing database query.

Always verify.

---

# Investigation Process

1. Reproduce the issue.

2. Inspect related code.

3. Trace execution.

4. Review logs.

5. Identify root cause.

6. Implement minimal fix.

7. Verify.

---

# Minimal Changes

Do not rewrite unrelated code.

Fix only what is necessary.

Avoid introducing new behavior.

---

# Logging

Use logging only for investigation.

Remove temporary debugging logs before completion.

Never expose sensitive information.

---

# Error Messages

Read the full error.

Understand the stack trace.

Never ignore warnings.

Never suppress errors without understanding them.

---

# Frontend Debugging

Inspect:

Component state

Props

Hooks

Rendering

Network requests

Browser console

Event handlers

Routing

---

# Backend Debugging

Inspect:

Logs

Controllers

Services

Repositories

Authentication

Authorization

Database queries

Transactions

External APIs

---

# Database Debugging

Inspect:

Schema

Relationships

Indexes

Constraints

Transactions

Slow queries

Migration history

---

# API Debugging

Verify:

Request

Headers

Authentication

Payload

Validation

Response

Status code

Error body

---

# Security Issues

If the bug involves security:

Prioritize security over convenience.

Never bypass security mechanisms just to make the feature work.

---

# Performance Issues

Measure before optimizing.

Avoid guessing performance bottlenecks.

---

# Regression Prevention

After fixing a bug:

Verify similar functionality.

Verify related pages.

Verify related APIs.

Verify permissions.

Ensure no new issue was introduced.

---

# Completion Rule

Never say:

"The bug is fixed"

Unless:

The root cause has been identified.

The fix has been verified.

Regression has been reviewed.

---

# Debugging Checklist

✓ Root cause identified

✓ Minimal fix applied

✓ Regression reviewed

✓ Related functionality verified

✓ Temporary logs removed

✓ No sensitive data exposed

✓ Production safe