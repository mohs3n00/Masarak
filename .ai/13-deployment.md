# Deployment Rules

Deployment is the final stage of software development.

Nothing should be deployed unless it passes all verification steps.

Deployment must always prioritize stability over speed.

---

# Deployment Principles

Every deployment must be:

Repeatable

Predictable

Recoverable

Traceable

Safe

---

# Environment Separation

Never mix environments.

Maintain separate:

Development

Testing

Staging

Production

Never deploy development configuration to production.

---

# Environment Variables

Never hardcode:

Passwords

API Keys

Secrets

Database URLs

JWT Secrets

Payment Keys

Cloud Credentials

Always use environment variables.

---

# Production Configuration

Before deployment verify:

Correct API URLs

Correct Database

Correct Storage

Correct Payment Keys

Correct Authentication Settings

Correct Domain

Correct SSL

---

# Build Verification

Deployment is forbidden if:

Build fails

Lint fails

Type checking fails

Dependency installation fails

---

# Security Review

Verify:

No exposed secrets

No debug endpoints

No test accounts

No development credentials

No console debugging

No sensitive logs

---

# Dependency Review

Remove:

Unused packages

Deprecated packages

Unsafe packages

Install only trusted dependencies.

---

# Database

Never deploy schema changes without migrations.

Always backup production data before destructive operations.

Verify migrations before deployment.

---

# API

Verify:

API availability

Authentication

Authorization

Rate limiting

Health checks

---

# Frontend

Verify:

No broken pages

No broken routing

No broken navigation

Responsive layout

Correct assets

No missing images

No console errors

---

# Backend

Verify:

Services start successfully.

Health checks pass.

No runtime exceptions.

Logs are clean.

No critical warnings.

---

# Performance

Review:

Startup time

Memory usage

Response time

Slow queries

CPU usage

---

# Monitoring

Production should monitor:

Errors

Performance

Availability

Memory

CPU

Slow APIs

Slow Queries

---

# Rollback

Every deployment must have a rollback strategy.

Never deploy without recovery options.

---

# Deployment Checklist

✓ Build passed

✓ Lint passed

✓ Type check passed

✓ Tests passed

✓ Security reviewed

✓ Secrets protected

✓ Environment verified

✓ Database verified

✓ APIs verified

✓ Monitoring enabled

✓ Rollback available