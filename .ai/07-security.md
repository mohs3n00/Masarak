# Security Rules

Security has the highest priority.

Never trade security for convenience.

If a requested implementation introduces a security vulnerability, stop and explain the risk before continuing.

---

# General Principles

Assume:

- Every request can be malicious.
- Every client can be compromised.
- Every input is untrusted.
- Every uploaded file is dangerous.
- Every external service can fail.

Write defensive code.

---

# Input Validation

Validate:

- Request body
- URL parameters
- Query parameters
- Headers
- Cookies
- Uploaded files

Reject invalid input immediately.

---

# SQL Injection

Never build SQL queries using string concatenation.

Always use:

- Parameterized queries
- Prepared statements
- ORM query builders

Never trust user input.

---

# NoSQL Injection

Validate all NoSQL filters.

Prevent operator injection.

Never pass raw objects directly into database queries.

---

# XSS

Escape output.

Sanitize HTML.

Never trust rich text.

Never render user HTML without sanitization.

Validate markdown rendering.

---

# CSRF

Protect all state-changing requests.

Use CSRF protection when applicable.

Never rely only on cookies.

---

# IDOR

Always verify ownership.

Never expose resources only by ID.

Every protected resource must verify:

- User ownership
- Organization
- Role
- Permission

---

# Broken Access Control

Every protected endpoint must verify:

Authentication

Authorization

Ownership

Role

Permission

Never trust the frontend.

---

# Authentication

Verify every protected request.

Reject expired tokens.

Reject malformed tokens.

Never bypass authentication.

---

# Authorization

Authentication alone is not enough.

Always verify permissions.

Least privilege principle must be followed.

---

# Session Security

Sessions must:

Expire correctly.

Be invalidated after logout.

Be protected from fixation.

Never expose session identifiers.

---

# Password Security

Never store plain passwords.

Always hash passwords.

Never log passwords.

Never expose passwords.

---

# Secrets

Never hardcode:

API keys

Secrets

Database passwords

JWT secrets

Encryption keys

Always use environment variables.

---

# Sensitive Data

Never expose:

Internal IDs

Secrets

Private information

Internal errors

Tokens

Passwords

Payment information

---

# File Upload

Validate:

Extension

MIME Type

Size

Filename

Content

Reject executable files.

Generate secure filenames.

Store outside public directories when appropriate.

---

# Path Traversal

Never trust file paths.

Normalize paths.

Prevent "../" attacks.

Restrict filesystem access.

---

# SSRF

Never trust external URLs.

Validate hosts.

Whitelist when possible.

Prevent internal network access.

---

# Command Injection

Never execute shell commands with user input.

Sanitize arguments.

Prefer safe APIs.

---

# Open Redirect

Validate redirect destinations.

Never redirect to arbitrary user-provided URLs.

---

# Clickjacking

Enable frame protection.

Prevent unauthorized iframe embedding.

---

# CORS

Never use "*"

Allow only trusted origins.

Limit methods.

Limit headers.

---

# Rate Limiting

Protect:

Login

Register

Forgot Password

OTP

Search

Public APIs

Uploads

Payment

---

# Brute Force Protection

Limit login attempts.

Delay repeated failures.

Lock temporarily when appropriate.

Log suspicious behavior.

---

# DoS Protection

Avoid expensive operations.

Limit payload size.

Limit request frequency.

Validate uploads.

---

# Logging

Log:

Authentication failures

Permission failures

Unexpected exceptions

Suspicious activity

Never log:

Passwords

Tokens

Secrets

Private data

---

# Error Messages

Errors must never expose:

Stack traces

SQL queries

File paths

Internal implementation

Framework internals

---

# Encryption

Encrypt sensitive data when required.

Use strong algorithms.

Never implement custom encryption.

---

# Security Headers

Verify secure headers exist.

Avoid exposing server information.

---

# Dependencies

Do not install unknown packages.

Prefer trusted maintained libraries.

Avoid abandoned packages.

---

# Production

Before deployment verify:

No debug mode

No development secrets

No test accounts

No exposed admin endpoints

No default passwords

No temporary APIs

---

# Security Checklist

✓ SQL Injection protected

✓ NoSQL Injection protected

✓ XSS protected

✓ CSRF protected

✓ IDOR protected

✓ SSRF protected

✓ Command Injection protected

✓ File Upload secured

✓ Secrets protected

✓ Authentication verified

✓ Authorization verified

✓ Rate limiting considered

✓ Secure logging

✓ Safe error messages

✓ Production ready