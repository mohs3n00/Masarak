# 07. Authentication

Masarak uses a custom, highly secure JWT-based authentication system managed entirely by the NestJS backend. No third-party auth services (like Firebase Auth or Supabase) are used for user identity.

## Authentication Lifecycle

### 1. Registration & OTP
- User creates an account (`POST /auth/register`).
- The backend creates the user in the database with `isActive = true` but `emailVerified = false` (or phoneVerified).
- An OTP is generated and sent via SMS/Email.
- Flutter App must navigate to the Verification screen and submit `POST /auth/verify-otp`.
- Upon successful verification, the backend issues JWT tokens.

### 2. Login Flow
- Flutter calls `POST /auth/login`.
- **Response Structure**:
  ```json
  {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "user": { "id": "...", "role": "STUDENT" }
  }
  ```
- **Action**: Store both tokens securely using `flutter_secure_storage`.

### 3. Token Lifecycle & Refresh Logic
- **Access Token**: Short-lived (typically 15-60 minutes).
- **Refresh Token**: Long-lived (e.g., 7-30 days), stored in the `Session` table in PostgreSQL.
- **Refresh Flow**:
  - When the Access Token expires, API calls will return `401 Unauthorized`.
  - The Flutter app's `Dio` interceptor must catch the `401`, pause outgoing requests, and call `POST /auth/refresh` using the Refresh Token.
  - If successful, update local storage and retry the failed requests.
  - If the Refresh Token is expired or revoked (returns 401), force the user to log out and return to the Login screen.

### 4. Logout
- Call `POST /auth/logout` to invalidate the refresh token in the database.
- Clear `flutter_secure_storage`.
- Route user to `/login`.

### 5. Multi-Device Sessions
- The `Session` table tracks `deviceFingerprint` and `fcmToken`.
- Users can be logged in on multiple devices. 
- If a user changes their password, all existing sessions (Refresh Tokens) are revoked.

### 6. First Login Behavior
- When a user logs in for the very first time, the `requiresPasswordChange` flag may be true (if an admin created the account).
- In this case, intercept the flow and force navigation to `/change-password` before allowing access to the Home screen.
