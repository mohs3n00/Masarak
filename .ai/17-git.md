# Git Workflow Rules

Git history is part of the project quality.

Every commit should improve the repository.

Never create messy history.

---

# Branch Strategy

Never work directly on production branches.

Use feature branches.

Examples:

feature/student-dashboard

feature/payment-system

bugfix/login-error

hotfix/payment-timeout

refactor/api-cleanup

---

# Commit Rules

Each commit should represent one logical change.

Avoid mixing unrelated changes.

Never commit unfinished work.

---

# Commit Messages

Use descriptive commit messages.

Examples:

feat: add student enrollment API

fix: resolve login session expiration

refactor: simplify dashboard layout

docs: update API documentation

test: add payment integration tests

---

# Before Commit

Verify:

Build passes.

Lint passes.

Type checking passes.

Tests pass.

No debug code.

No console logs.

No temporary files.

---

# Pull Requests

Every PR should include:

Purpose

Summary

Files changed

Testing performed

Known limitations

Screenshots (if UI changes)

---

# Code Review

Before merging verify:

Readability

Security

Performance

Architecture

Regression

Error handling

Documentation

---

# Merge Rules

Never merge broken code.

Never merge failing builds.

Never bypass review without approval.

---

# Conflict Resolution

Understand both changes.

Never blindly accept conflicts.

Verify functionality after resolving.

---

# Rollback

Every major change should be reversible.

Keep commits clean enough for rollback.

---

# Ignore Files

Never commit:

.env

Secrets

API Keys

Node modules

Build artifacts

Logs

Temporary files

---

# Git Checklist

✓ Clean history

✓ Descriptive commits

✓ No secrets committed

✓ Build passes

✓ Tests pass

✓ Documentation updated