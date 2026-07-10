# Core Rules

These rules are mandatory.

Breaking any rule is considered an incorrect implementation.

---

# Rule 1 — Understand Before Coding

Never start coding immediately.

First:

- Understand the user's request.
- Understand the current implementation.
- Identify affected files.
- Identify dependencies.
- Think before making changes.

---

# Rule 2 — Preserve Existing Functionality

Never break existing features.

New code must coexist with old code.

Backward compatibility is mandatory.

---

# Rule 3 — Scope Discipline

Modify only what is required.

Do not refactor unrelated files.

Do not rename files unnecessarily.

Do not reorganize folders without approval.

---

# Rule 4 — Never Assume

Never invent:

- APIs
- Endpoints
- Database tables
- Database columns
- Environment variables
- Authentication flow
- Business logic
- UI behavior

If something is unknown, inspect the project.

If it still cannot be determined, ask.

---

# Rule 5 — Read Before Writing

Before editing any file:

Read the file.

Understand it.

Understand nearby files.

Understand related components.

Only then modify.

---

# Rule 6 — Small Safe Changes

Prefer multiple small safe changes over one massive rewrite.

Large rewrites require explicit approval.

---

# Rule 7 — Consistency

Follow the existing:

- naming convention
- folder structure
- architecture
- code style
- formatting
- component patterns

Do not mix styles.

---

# Rule 8 — Production Mindset

Write production-ready code.

Never write temporary hacks.

Never leave unfinished implementations.

Never leave TODO comments unless explicitly requested.

---

# Rule 9 — Clean Code

Every implementation must be:

Readable

Maintainable

Predictable

Simple

Reusable

Avoid unnecessary complexity.

---

# Rule 10 — DRY

Do not duplicate logic.

Extract reusable code when appropriate.

---

# Rule 11 — KISS

Prefer the simplest correct implementation.

Do not over-engineer.

---

# Rule 12 — SOLID

Respect SOLID principles whenever applicable.

Especially:

Single Responsibility

Dependency Inversion

Open/Closed Principle

---

# Rule 13 — Defensive Coding

Always assume:

User input is invalid.

Network requests can fail.

Servers can fail.

Files can be missing.

Permissions may be denied.

Code accordingly.

---

# Rule 14 — Validate Everything

Never trust:

Request body

URL parameters

Query parameters

Headers

Cookies

Uploaded files

External APIs

Always validate.

---

# Rule 15 — Error Handling

Every operation that can fail must handle failure gracefully.

Never silently ignore errors.

Never expose internal stack traces to users.

---

# Rule 16 — Logging

Log useful debugging information.

Never log:

Passwords

Tokens

Secrets

Private user data

Sensitive information

---

# Rule 17 — Security First

Security has higher priority than convenience.

If a requested implementation introduces a vulnerability, stop and explain why.

---

# Rule 18 — Performance Awareness

Do not write obviously inefficient code.

Avoid:

N+1 queries

Nested loops on large collections

Repeated database access

Repeated API requests

Memory leaks

---

# Rule 19 — Minimal Dependencies

Do not install new packages unless truly necessary.

Prefer existing project dependencies.

---

# Rule 20 — Think Before Responding

Before replying that a task is complete, verify:

Was everything implemented?

Was existing functionality preserved?

Were obvious edge cases considered?

Is the solution production-ready?

Only then report completion.

Never claim success without verification.