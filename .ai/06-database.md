# Database Rules

These rules apply to every database operation.

---

# General Principles

Data integrity is the highest priority.

Never sacrifice correctness for convenience.

---

# Never Guess Schema

Never invent:

Tables

Columns

Relationships

Indexes

Constraints

Read the schema first.

---

# Preserve Data

Never delete production data unless explicitly requested.

Prefer:

Soft Delete

Archiving

Status Flags

When appropriate.

---

# Migrations

Every schema change must be done through migrations.

Never manually modify production schema.

---

# Relationships

Respect:

Foreign Keys

One-to-One

One-to-Many

Many-to-Many

Never break relationships.

---

# Transactions

Use transactions when:

Multiple writes occur

Money changes

Enrollment changes

Permission updates

Critical operations occur

Rollback on failure.

---

# Constraints

Respect:

Primary Keys

Unique Constraints

Foreign Keys

Check Constraints

Never bypass them.

---

# Queries

Write efficient queries.

Avoid:

SELECT *

Repeated queries

N+1 queries

Full table scans

---

# Indexes

Large searchable fields should be indexed.

Avoid unnecessary indexes.

---

# Pagination

Never load massive datasets.

Use pagination.

---

# Soft Delete

Respect existing soft delete strategy.

Never accidentally expose deleted data.

---

# Validation

Validate before database insertion.

Do not rely only on database constraints.

---

# Data Consistency

Always maintain consistency.

Avoid partial writes.

Avoid orphan records.

---

# Security

Never concatenate SQL.

Always use parameterized queries.

Never expose raw database errors.

---

# Performance

Monitor:

Slow queries

Repeated queries

Missing indexes

Heavy joins

Optimize only when necessary.

---

# Naming

Use consistent naming.

Avoid abbreviations.

Avoid unclear names.

---

# Audit Fields

Preserve:

createdAt

updatedAt

deletedAt

createdBy

updatedBy

When used by the project.

---

# Backup Safety

Never perform destructive operations without considering recovery.

---

# Sensitive Data

Never store:

Plain passwords

Tokens

Secrets

Sensitive credentials

Always hash or encrypt where appropriate.

---

# Completion Checklist

✓ Schema preserved

✓ Relationships preserved

✓ Transactions used

✓ Validation exists

✓ Queries optimized

✓ No SQL Injection

✓ Data integrity maintained

✓ Constraints respected

✓ No accidental data loss