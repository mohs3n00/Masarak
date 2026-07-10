# Error Handling Rules

Errors are expected.

Unhandled errors are unacceptable.

Every operation must fail safely and predictably.

---

# General Principles

Never ignore an error.

Never hide an error.

Never expose internal implementation.

Handle every possible failure.

---

# Fail Gracefully

When an operation fails:

Do not crash.

Keep the application usable.

Provide recovery options.

Log useful information.

---

# User Messages

Users should see:

Clear

Friendly

Actionable

Non-technical

messages.

Never expose:

Stack traces

Database errors

Framework internals

Server paths

Environment variables

---

# Developer Logs

Logs should help debugging.

Include:

Timestamp

Request ID

User ID (if appropriate)

Endpoint

Operation

Exception

Context

Never log:

Passwords

Tokens

Secrets

Payment information

Private personal data

---

# Try / Catch

Use try/catch around operations that may fail.

Examples:

Database

API calls

Authentication

File upload

Email

Payments

Storage

---

# Validation Errors

Return validation errors clearly.

Indicate:

Field

Reason

Expected format

Never expose implementation details.

---

# Network Errors

Handle:

Offline

Timeout

DNS failure

Connection refused

Slow response

Retry only when appropriate.

---

# Database Errors

Handle:

Constraint violations

Missing records

Deadlocks

Connection failures

Timeouts

Transaction failures

Never expose raw SQL errors.

---

# Authentication Errors

Handle:

Expired token

Invalid token

Missing token

Session expired

Unauthorized

Forbidden

---

# API Errors

Verify:

Unexpected response

Missing data

Wrong status code

Malformed JSON

Invalid schema

Gracefully recover whenever possible.

---

# File Errors

Handle:

Missing file

Corrupted file

Large file

Unsupported type

Permission denied

Storage failure

---

# Payment Errors

Always preserve transaction integrity.

Never duplicate payments.

Never lose transaction state.

Never charge twice.

---

# Retry Strategy

Retry only when appropriate.

Examples:

Temporary network failures

Temporary external API failures

Never retry:

Validation failures

Authentication failures

Authorization failures

---

# Cleanup

Release resources after failure.

Rollback transactions.

Remove temporary files.

Close connections.

---

# Recovery

Whenever possible:

Allow retry.

Allow continuation.

Preserve user input.

Prevent data loss.

---

# Monitoring

Unexpected errors should be logged.

Critical errors should trigger monitoring systems.

---

# Error Checklist

✓ Errors handled

✓ Friendly messages

✓ Secure logging

✓ No stack traces

✓ Resources cleaned

✓ Transactions rolled back

✓ Recovery possible

✓ No silent failures