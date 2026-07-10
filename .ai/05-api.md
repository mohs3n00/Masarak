# API Development Standards

This document defines the required standards for all APIs.

---

# API Principles

Every API must be:

- Predictable
- Consistent
- Secure
- Versionable
- Backward Compatible
- Well Structured

Never design APIs differently without approval.

---

# Never Invent APIs

Never assume:

- Endpoints
- Request bodies
- Query parameters
- Response fields
- Headers
- Authentication methods

Inspect existing APIs first.

If unavailable, ask.

---

# REST Standards

Use nouns instead of verbs.

Good:

GET /courses

POST /courses

DELETE /courses/{id}

Bad:

/getCourses

/createCourse

/deleteCourse

---

# HTTP Methods

GET → Read

POST → Create

PUT → Replace

PATCH → Partial Update

DELETE → Remove

Never misuse HTTP methods.

---

# Status Codes

Always return appropriate status codes.

Examples:

200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

429 Too Many Requests

500 Internal Server Error

---

# Response Structure

Responses must remain consistent.

Do not randomly rename properties.

Do not randomly change nesting.

---

# Validation

Validate:

Body

Params

Query

Headers

Files

Never trust the client.

---

# Pagination

Large collections must support pagination.

Never return thousands of records by default.

---

# Filtering

Filtering must be:

Validated

Indexed when possible

Safe

Predictable

---

# Searching

Searching must:

Support pagination

Prevent abuse

Handle empty searches

Handle no results

---

# Sorting

Sorting fields must be validated.

Never allow arbitrary SQL sorting.

---

# API Versioning

Avoid breaking changes.

If breaking changes are necessary:

Version the API.

Document the change.

Maintain old versions when required.

---

# Error Responses

Every error response should be:

Consistent

Human-readable

Machine-readable

Never expose stack traces.

---

# Timeouts

Handle:

Slow APIs

Timeouts

Retries

Graceful failures

---

# Authentication

Protected endpoints must verify authentication.

Never trust client identity.

---

# Authorization

Always verify permissions.

Never expose data across users.

---

# Rate Limiting

Protect:

Login

Register

OTP

Password Reset

Search

Uploads

Public APIs

---

# Security Headers

Ensure secure headers are preserved.

---

# Logging

Log failures.

Never log:

Passwords

Tokens

Secrets

Sensitive data

---

# Documentation

Every endpoint should clearly define:

Purpose

Authentication

Parameters

Responses

Errors

Permissions

---

# API Completion Checklist

✓ Endpoint follows REST

✓ Validation exists

✓ Authentication verified

✓ Authorization verified

✓ Correct status codes

✓ Consistent responses

✓ Error handling

✓ Pagination

✓ Filtering

✓ Security verified

✓ Backward compatibility maintained