# Performance Rules

Performance is a feature.

Every implementation should consider speed, scalability, memory usage, and maintainability.

Never optimize blindly.

Measure first whenever possible.

---

# General Principles

Prefer efficient algorithms.

Avoid unnecessary work.

Keep rendering, networking, and database access as lightweight as possible.

---

# Frontend Performance

Avoid unnecessary renders.

Avoid unnecessary state updates.

Avoid deeply nested component trees.

Reuse components.

Split large components.

Lazy load large pages.

Lazy load heavy components.

Optimize images.

Avoid unnecessary animations.

Avoid rendering hidden elements.

---

# Backend Performance

Avoid repeated database queries.

Avoid repeated API requests.

Avoid unnecessary serialization.

Avoid blocking operations.

Use asynchronous operations when appropriate.

---

# Database Performance

Never perform N+1 queries.

Use indexes correctly.

Paginate large datasets.

Limit returned fields.

Avoid SELECT *.

Avoid unnecessary joins.

Optimize slow queries.

---

# API Performance

Return only necessary data.

Support pagination.

Support filtering.

Support searching.

Compress responses when appropriate.

Avoid unnecessary requests.

---

# Caching

Cache only when beneficial.

Invalidate cache correctly.

Never cache sensitive user-specific data incorrectly.

---

# File Handling

Stream large files.

Avoid loading huge files into memory.

Validate uploads before processing.

---

# Memory Usage

Release unused resources.

Avoid memory leaks.

Avoid keeping unnecessary objects alive.

---

# Network

Minimize payload size.

Reduce unnecessary requests.

Batch operations when appropriate.

---

# Images

Compress images.

Use responsive images.

Lazy load when appropriate.

Serve optimized formats when available.

---

# Logging

Avoid excessive logging in production.

Do not log inside tight loops.

---

# Monitoring

Watch for:

Slow APIs

Slow queries

High memory usage

CPU spikes

Error rates

---

# Performance Checklist

✓ No unnecessary renders

✓ No unnecessary API calls

✓ No N+1 queries

✓ Pagination implemented

✓ Images optimized

✓ Memory usage considered

✓ Heavy operations optimized

✓ No obvious bottlenecks