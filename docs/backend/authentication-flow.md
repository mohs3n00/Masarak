# Authentication Flow & Architecture

This document describes the complete authentication architecture for the Masarak backend using **NestJS**, **JWT (JSON Web Tokens)**, and **PostgreSQL**. 

We do **not** use Supabase Auth. Authentication is handled entirely by the NestJS backend via standard JWT and Refresh Tokens.

---

## Architecture Components

1. **Access Token (JWT)**
   - Short-lived token (e.g., 15 minutes).
   - Passed in the `Authorization: Bearer <token>` header for all protected API requests.
   - Contains minimal payload (`sub` / `userId`, `role`, `email`).
   - Stateless validation (no DB hit required for validation, only signature verification).

2. **Refresh Token**
   - Long-lived token (e.g., 7 days or 30 days).
   - Stored securely in the PostgreSQL database (`User.hashedRefreshToken`).
   - Used to obtain a new Access Token when the old one expires.
   - Passed via a secure `HttpOnly` cookie or tightly controlled client state, depending on frontend strategy (currently managed via client state / axios interceptors).

3. **Guards & Strategies (NestJS Passport)**
   - `LocalStrategy`: Validates email and password on `/auth/login`.
   - `JwtStrategy`: Validates the Access Token on every protected route.
   - `JwtRefreshStrategy`: Validates the Refresh Token when calling `/auth/refresh`.

---

## Detailed Flows

### 1. Registration Flow (`POST /auth/register`)
1. Client sends `email`, `password`, `name`, `role` (STUDENT or TEACHER).
2. Backend validates data (Zod/class-validator).
3. Backend checks if `email` already exists.
4. Backend hashes the `password` using `bcrypt` or `argon2`.
5. Backend creates the User record in PostgreSQL.
6. Backend generates an `emailVerificationToken`.
7. Backend sends an email with the verification link.
8. (Optional) Returns an Access & Refresh token immediately if instant login is allowed, otherwise returns a success message asking to verify.

### 2. Login Flow (`POST /auth/login`)
1. Client sends `email` and `password`.
2. `LocalStrategy` intercepts the request, looks up the user by `email`.
3. Verifies `password` hash against DB.
4. If valid, generates an Access Token and a Refresh Token.
5. Hashes the Refresh Token and stores it in the DB (`hashedRefreshToken` field).
6. Returns `user` object, `accessToken`, and `refreshToken`.

### 3. Protected Route Request (`GET /users/me`)
1. Client sends request with `Authorization: Bearer <Access_Token>`.
2. `JwtAuthGuard` intercepts.
3. Decodes and verifies the JWT signature.
4. Checks if token is expired.
5. Injects `req.user` with payload data.
6. Controller executes logic.

### 4. Refresh Token Flow (`POST /auth/refresh`)
1. Access token expires; Client receives `401 Unauthorized`.
2. Client intercepts the 401 and calls `POST /auth/refresh` sending the `refreshToken`.
3. Backend verifies the `refreshToken` signature.
4. Backend extracts `userId` from the refresh token.
5. Backend looks up the user in DB and compares the provided `refreshToken` with the stored `hashedRefreshToken`.
6. If they match, backend generates a **new** Access Token and a **new** Refresh Token (Rotation).
7. Backend updates the `hashedRefreshToken` in DB.
8. Returns new tokens to client.
9. Client replays the original failed request with the new Access Token.

### 5. Logout Flow (`POST /auth/logout`)
1. Client calls `POST /auth/logout` with `Authorization: Bearer <Access_Token>`.
2. Backend identifies the user from the Access Token.
3. Backend nullifies the `hashedRefreshToken` in the database.
4. Client clears tokens from local storage / cookies.

---

## Forgot & Reset Password Flow

### Forgot Password (`POST /auth/forgot-password`)
1. Client sends `email`.
2. Backend verifies if user exists.
3. Generates a secure, short-lived reset token (stored in DB as hashed `resetPasswordToken` with `resetPasswordExpires`).
4. Sends email to user with a link: `https://domain.com/reset-password?token=...`

### Reset Password (`POST /auth/reset-password`)
1. Client sends `token` and `newPassword`.
2. Backend hashes the received `token` and compares it against DB.
3. Checks if `resetPasswordExpires` is in the future.
4. If valid, hashes the `newPassword` and updates the user record.
5. Clears the `resetPasswordToken` and `resetPasswordExpires` fields.

---

## Security Considerations

- **Password Hashing**: Use `bcrypt` with a minimum cost factor of 10.
- **Refresh Token Rotation**: Every time a refresh token is used, issue a new one and invalidate the old one to detect token theft.
- **JWT Secret**: Use a highly secure, randomly generated string for `JWT_SECRET` and `JWT_REFRESH_SECRET`. Do not expose them.
- **Rate Limiting**: Apply strict rate limiting on `/auth/login`, `/auth/register`, and `/auth/forgot-password` to prevent brute force attacks.
