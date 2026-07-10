# Final Development Checklist

A task is NOT complete until every applicable checkpoint has been reviewed.

Never skip this checklist.

---

# 1. Requirement Review

□ Fully understood the user's request.

□ No assumptions were made.

□ Missing information was requested when necessary.

□ The requested scope was respected.

□ No unrelated changes were introduced.

---

# 2. Architecture

□ Existing architecture respected.

□ Existing folder structure preserved.

□ Existing naming conventions preserved.

□ Existing patterns followed.

□ No unnecessary abstractions introduced.

---

# 3. Frontend

□ Responsive on Desktop.

□ Responsive on Laptop.

□ Responsive on Tablet.

□ Responsive on Mobile.

□ Buttons work.

□ Forms work.

□ Links work.

□ Navigation works.

□ Loading state exists.

□ Empty state exists.

□ Error state exists.

□ Success state exists.

□ UI consistency preserved.

□ No broken layouts.

□ No overflow issues.

□ Accessibility considered.

□ Keyboard navigation works.

□ No visual regressions.

---

# 4. Backend

□ Business logic preserved.

□ Validation implemented.

□ Error handling implemented.

□ API contract preserved.

□ Authorization checked.

□ Authentication checked.

□ No unnecessary queries.

□ No duplicated logic.

---

# 5. API

□ Correct HTTP method.

□ Correct status codes.

□ Consistent response structure.

□ Request validation.

□ Error responses implemented.

□ Pagination supported if needed.

□ Filtering supported if needed.

□ Searching supported if needed.

---

# 6. Database

□ Schema preserved.

□ Relationships preserved.

□ Transactions used where required.

□ No accidental data loss.

□ Constraints respected.

□ Queries optimized.

□ No SQL Injection risk.

---

# 7. Security

□ SQL Injection protected.

□ NoSQL Injection protected.

□ XSS protected.

□ CSRF protected.

□ IDOR protected.

□ SSRF protected.

□ Command Injection protected.

□ File Upload secured.

□ Secrets protected.

□ Authentication verified.

□ Authorization verified.

□ Ownership verified.

□ Sensitive data protected.

□ Safe logging.

---

# 8. Authentication

□ Login verified.

□ Logout verified.

□ Session handling verified.

□ JWT validated.

□ Refresh tokens handled correctly.

□ Roles verified.

□ Permissions verified.

□ Password reset protected.

□ OTP protected (if applicable).

---

# 9. Performance

□ No unnecessary rendering.

□ No unnecessary API calls.

□ No N+1 queries.

□ Queries optimized.

□ Images optimized.

□ Memory usage reviewed.

□ Heavy operations optimized.

---

# 10. Error Handling

□ Friendly error messages.

□ No stack traces exposed.

□ Resources cleaned up.

□ Transactions rolled back.

□ Retry strategy considered.

□ User input preserved when appropriate.

---

# 11. Documentation

□ Documentation updated.

□ README updated (if needed).

□ API documentation updated.

□ Complex logic documented.

---

# 12. Git

□ No temporary files.

□ No debug code.

□ No console logs.

□ Clean commit.

□ Descriptive commit message.

□ No secrets committed.

---

# 13. Testing

□ CRUD tested.

□ Forms tested.

□ Buttons tested.

□ Navigation tested.

□ API tested.

□ Authentication tested.

□ Authorization tested.

□ Edge cases reviewed.

□ Regression reviewed.

---

# 14. Browser Review

□ No Console Errors.

□ No Console Warnings introduced.

□ No Runtime Errors.

□ No Hydration Errors.

□ No Broken Assets.

---

# 15. Production Review

□ Build passes.

□ Lint passes.

□ Type checking passes.

□ Environment variables verified.

□ No development configuration.

□ Monitoring ready.

□ Rollback possible.

---

# 16. AI Self Review

Before responding, answer these questions:

□ Did I understand the request correctly?

□ Did I inspect the project before editing?

□ Did I avoid assumptions?

□ Did I preserve existing functionality?

□ Did I avoid unnecessary changes?

□ Did I avoid introducing technical debt?

□ Did I avoid breaking APIs?

□ Did I avoid breaking UI?

□ Did I review security implications?

□ Did I review performance implications?

□ Would I approve this Pull Request as a Senior Engineer?

If any answer is "No", continue working before responding.

---

# Final Completion Rule

Never respond with:

- Done
- Fixed
- Completed
- Finished

unless all applicable checklist items have been reviewed.

If verification was not possible, explicitly state:

- What was implemented.
- What could not be verified.
- What still requires manual testing.

Honesty is mandatory.

---

# Golden Principle

Think first.

Inspect second.

Implement third.

Review fourth.

Verify fifth.

Only then declare the task complete.