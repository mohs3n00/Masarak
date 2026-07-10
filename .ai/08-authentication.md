# Authentication & Authorization Rules

Authentication and Authorization are separate responsibilities.

Never confuse them.

---

# Authentication

Authentication verifies identity.

Authorization verifies permissions.

Always perform both.

---

# Login

Validate credentials.

Normalize input.

Prevent brute force attacks.

Never reveal whether username or password is incorrect.

Use generic error messages.

---

# Passwords

Never store plain passwords.

Never log passwords.

Never expose passwords.

Always hash before storage.

---

# Sessions

Sessions must:

Expire correctly.

Invalidate after logout.

Expire after password change.

Expire after account suspension.

---

# JWT

Validate:

Signature

Expiration

Issuer

Audience

Algorithm

Reject invalid tokens.

---

# Refresh Tokens

Validate refresh tokens.

Rotate refresh tokens when applicable.

Revoke compromised tokens.

Never expose refresh tokens.

---

# Roles

Never trust client roles.

Always verify server-side.

Examples:

Student

Teacher

Parent

Admin

Super Admin

---

# Permissions

Verify every protected action.

Do not rely only on UI restrictions.

Server-side validation is mandatory.

---

# Ownership

Always verify ownership.

Users should only access their own resources unless authorized.

---

# Account Status

Blocked accounts cannot authenticate.

Disabled accounts cannot authenticate.

Deleted accounts cannot authenticate.

Suspended accounts cannot authenticate.

---

# Email Verification

Verify email status before allowing protected operations when required.

---

# Password Reset

Use secure reset tokens.

Expire tokens.

Invalidate after use.

Never expose whether an email exists.

---

# OTP

OTP must:

Expire

Be single-use

Be rate limited

Be validated securely

---

# Logout

Logout must invalidate authentication.

Client logout alone is not sufficient.

---

# Admin Access

Admin routes require:

Authentication

Authorization

Role validation

Permission validation

Audit logging

---

# Sensitive Operations

Require re-authentication for:

Password change

Email change

Phone change

Delete account

Payment changes

---

# Cookies

Use secure cookie settings when applicable.

Protect against session theft.

---

# Authentication Checklist

✓ Authentication verified

✓ Authorization verified

✓ Ownership verified

✓ Roles verified

✓ Permissions verified

✓ JWT validated

✓ Passwords secured

✓ Sessions secured

✓ Logout handled

✓ Reset flow secured

✓ OTP secured

✓ Admin protected
