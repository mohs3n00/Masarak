# Backend Development Rules

These rules are mandatory for every backend implementation.

The backend must always prioritize:

- Security
- Reliability
- Maintainability
- Performance
- Backward Compatibility

---

# General Principles

Never implement backend logic without understanding:

- Existing architecture
- Data flow
- Business rules
- Database structure
- Authentication flow

Always inspect before modifying.

---

# Preserve Existing APIs

Never break existing API contracts.

Never rename endpoints without approval.

Never remove existing endpoints.

Never change response formats unless explicitly requested.

Backward compatibility is mandatory.

---

# Business Logic

Never hardcode business rules.

Keep business logic separated from controllers.

Controllers should coordinate requests.

Services should contain business logic.

Repositories should handle data access.

Avoid mixing responsibilities.

---

# Input Validation

Validate every incoming request.

Validate:

- Request body
- URL parameters
- Query parameters
- Headers
- Uploaded files

Reject invalid input immediately.

Never trust client validation.

---

# Output Validation

Always return predictable responses.

Avoid exposing internal implementation.

Never leak stack traces.

Never expose database errors directly.

---

# Error Handling

Handle every possible failure.

Return meaningful HTTP status codes.

Return consistent error responses.

Unexpected exceptions must be logged.

Do not silently ignore failures.

---

# Authentication

Never trust client authentication.

Verify every protected request.

Validate tokens.

Check expiration.

Reject invalid sessions.

Never bypass authentication.

---

# Authorization

Authentication is NOT authorization.

Always verify permissions.

Always verify ownership.

Always verify roles.

Never assume access rights.

---

# Database Access

Never access the database directly from controllers.

Always use the project's data layer.

Keep database logic isolated.

Avoid duplicated queries.

---

# Transactions

Use transactions whenever multiple database operations must succeed together.

Never leave partial writes.

Rollback on failure.

---

# API Design

APIs should be:

Predictable

Consistent

Versionable

Documented

Avoid special cases whenever possible.

---

# Response Format

Responses should remain consistent across the project.

Success responses should have predictable structure.

Error responses should have predictable structure.

Never randomly change formats.

---

# File Upload

Always validate:

File type

Extension

MIME type

Maximum size

Storage location

Never trust file names.

Generate secure filenames.

---

# External Services

Always assume external services can fail.

Implement:

Timeouts

Retries when appropriate

Graceful failures

Meaningful logging

Never assume third-party availability.

---

# Logging

Log useful debugging information.

Never log:

Passwords

Tokens

Secrets

Private user information

Payment information

Authentication cookies

---

# Configuration

Never hardcode:

Secrets

Passwords

API keys

Database credentials

Environment-specific values

Always use configuration or environment variables.

---

# Secrets

Never expose secrets in:

Responses

Logs

Errors

Source code

Git history

Documentation

---

# Performance

Avoid:

Repeated database queries

N+1 queries

Full table scans when unnecessary

Large synchronous operations

Unnecessary memory usage

Optimize expensive operations.

---

# Pagination

Never return extremely large datasets.

Support pagination whenever appropriate.

Prefer cursor or offset pagination based on project conventions.

---

# Filtering

Filtering should be:

Validated

Predictable

Indexed when necessary

Safe from injection attacks

---

# Searching

Search should:

Be efficient

Support pagination

Avoid loading unnecessary data

Use indexes when possible

---

# Caching

Cache only when beneficial.

Invalidate cache correctly.

Never return stale sensitive data.

---

# Background Jobs

Long-running operations should not block HTTP requests.

Move expensive work to background jobs when appropriate.

---

# Rate Limiting

Protect sensitive endpoints.

Especially:

Login

Password reset

Verification

OTP

Public APIs

Search endpoints

File uploads

---

# API Stability

Avoid introducing breaking changes.

If breaking changes are required:

Document them.

Version them.

Communicate them.

---

# Defensive Programming

Always assume:

Database failures

Network failures

Invalid input

Unexpected null values

Race conditions

Missing resources

Write resilient code.

---

# Cleanup

Remove:

Unused code

Dead code

Unused imports

Unused dependencies

Temporary debugging code

Console logging

Development-only code

Before considering the task complete.

---

# Code Review Checklist

Before completion verify:

✓ Input validation exists

✓ Authorization verified

✓ Authentication verified

✓ Business rules preserved

✓ API contract preserved

✓ No sensitive data exposed

✓ Errors handled

✓ Logging implemented

✓ Performance considered

✓ No duplicated logic

✓ No obvious security issues

✓ Backward compatibility maintained

Only then is the backend task considered complete.