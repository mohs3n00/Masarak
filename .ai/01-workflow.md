# Standard Development Workflow

This workflow is mandatory.

Do not skip any step.

A task is NOT considered complete until every step has been completed.

---

# Phase 1 — Understand the Request

Before writing code:

- Read the entire request carefully.
- Identify the real objective.
- Determine whether the request is a bug fix, feature, refactor, optimization, or investigation.
- Identify any missing information.
- Ask for clarification if required.

Never assume missing details.

---

# Phase 2 — Project Analysis

Before modifying code:

Inspect:

- Existing architecture
- Related modules
- Existing patterns
- Similar implementations
- Dependencies
- Shared components

Understand how the project currently works.

Never implement features blindly.

---

# Phase 3 — Impact Analysis

Before making changes, identify:

Files that will change.

Files that may be affected.

Possible regressions.

Potential security impact.

Performance impact.

UI impact.

Database impact.

Authentication impact.

If the change has a high risk of affecting unrelated functionality, minimize the scope or ask for approval.

---

# Phase 4 — Planning

Before coding:

Create a simple implementation plan.

Break large tasks into smaller steps.

Choose the safest implementation.

Prefer extending existing systems instead of replacing them.

---

# Phase 5 — Implementation

During implementation:

Follow existing architecture.

Follow naming conventions.

Reuse existing utilities.

Reuse existing components.

Avoid duplicated code.

Keep changes as small as possible.

Never rewrite working code without a valid reason.

---

# Phase 6 — Self Review

After implementation:

Review your own code.

Check for:

Logic mistakes

Syntax mistakes

Type errors

Dead code

Unused imports

Unused variables

Duplicate logic

Unsafe operations

Magic numbers

Poor naming

Missing validation

---

# Phase 7 — Regression Review

Before considering the task complete:

Think:

"What existing functionality could this change accidentally break?"

Verify:

Existing pages

Related components

Related APIs

Authentication

Navigation

Forms

Data loading

Permissions

Never introduce regressions.

---

# Phase 8 — Error Handling Review

Verify every new implementation has:

Loading state

Error state

Success state

Empty state (if applicable)

Timeout handling (if applicable)

Network failure handling

Unexpected response handling

Permission failure handling

---

# Phase 9 — Security Review

Before completion verify:

Input validation

Authorization

Authentication

Role checking

Sensitive data protection

File validation

Secure API usage

Injection protection

No exposed secrets

No privilege escalation

If any security issue exists, do not mark the task as complete.

---

# Phase 10 — Performance Review

Check for:

Repeated rendering

Repeated API calls

Heavy computations

Large loops

Inefficient queries

Memory leaks

Blocking operations

Optimize where appropriate.

---

# Phase 11 — UI Review

For UI tasks verify:

Responsive layout

Correct spacing

Consistent typography

Consistent colors

Loading feedback

Empty states

Accessibility

Keyboard usability

No layout shifts

No broken alignment

---

# Phase 12 — Testing

Before completion verify:

Every modified button works.

Every modified form works.

Every modified API works.

Every modified page loads correctly.

Navigation works.

Validation works.

Permissions work.

Error messages work.

Success messages work.

No console errors.

No runtime errors.

No obvious edge cases are broken.

---

# Phase 13 — Final Verification

Before responding:

Ask yourself:

Did I solve the requested problem?

Did I avoid unnecessary changes?

Did I preserve existing behavior?

Did I follow project conventions?

Did I introduce technical debt?

Would I confidently deploy this to production?

If the answer is "No" to any question, continue improving before responding.

---

# Phase 14 — Completion Rules

Never say:

"Done"

"Fixed"

"Completed"

Unless the implementation has been reviewed according to this workflow.

If something could not be verified, explicitly state:

- What was implemented.
- What could not be verified.
- What should be tested manually.

Never pretend verification has occurred when it has not.

---

# Golden Principle

Think.

Inspect.

Plan.

Implement.

Review.

Verify.

Only then consider the task complete.