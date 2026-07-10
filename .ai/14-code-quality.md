# Code Quality Rules

Every line of code should improve the project.

Readable code is more valuable than clever code.

---

# General Principles

Write code for humans first.

Computers are secondary.

Future developers must easily understand your code.

---

# Naming

Names must be:

Clear

Meaningful

Descriptive

Consistent

Avoid abbreviations.

Bad:

x

tmp

abc

Good:

studentProgress

courseEnrollment

paymentStatus

---

# Functions

Functions should:

Have one responsibility.

Be short.

Have descriptive names.

Avoid side effects.

Avoid excessive parameters.

---

# Components

Components should:

Be reusable.

Be independent.

Be predictable.

Avoid duplicated logic.

---

# Classes

Classes should have one responsibility.

Avoid God Classes.

Split large classes.

---

# Files

Prefer smaller files.

Avoid extremely large files.

Group related logic together.

---

# Comments

Comments should explain WHY.

Do not explain obvious code.

Remove outdated comments.

---

# Magic Numbers

Avoid:

2000

999

123

Use named constants.

---

# Duplication

Never duplicate business logic.

Extract reusable functions.

---

# Architecture

Respect existing architecture.

Do not introduce a second architecture.

---

# Imports

Remove:

Unused imports

Duplicate imports

Circular imports

---

# Dependencies

Avoid unnecessary packages.

Prefer native APIs when possible.

---

# Error Handling

Never ignore errors.

Never leave empty catch blocks.

---

# Formatting

Keep formatting consistent.

Never mix coding styles.

---

# Readability

Prefer clarity over cleverness.

Code should explain itself.

---

# Refactoring

Only refactor when:

It improves maintainability.

It does not break behavior.

It has clear value.

---

# Technical Debt

Avoid introducing technical debt.

If unavoidable:

Document it.

Keep it minimal.

---

# Code Smells

Avoid:

Long methods

Large classes

Deep nesting

Duplicated logic

Dead code

Unused variables

Unused functions

Hidden side effects

---

# SOLID

Respect SOLID principles whenever appropriate.

---

# DRY

Do not repeat yourself.

---

# KISS

Keep solutions simple.

---

# YAGNI

Do not implement features that are not currently needed.

---

# Final Review

Before completion verify:

✓ Readable

✓ Maintainable

✓ Reusable

✓ No duplication

✓ Proper naming

✓ No dead code

✓ No unused imports

✓ No unnecessary complexity

✓ Production ready