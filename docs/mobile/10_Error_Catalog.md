# 10. Error Catalog

The backend standardizes error responses. The Flutter application must interpret these HTTP status codes and provide localized, user-friendly messages.

## Standard Error Response Format
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```

## Global Interceptors (Dio/HTTP)

1. **`400 Bad Request`**: Validation failed.
   - **Action**: Extract `message` array and display inline or via Toast.
2. **`401 Unauthorized`**: JWT Access Token expired or missing.
   - **Action**: Pause queue, hit `/auth/refresh`. If refresh fails, clear storage and route to `/login`.
3. **`403 Forbidden`**: User lacks required permissions (e.g., Student trying to access Teacher routes).
   - **Action**: Show an Access Denied overlay. Navigate user back to a safe route.
4. **`404 Not Found`**: Resource doesn't exist (e.g., Course deleted).
   - **Action**: Display generic Empty State: "The requested item could not be found."
5. **`409 Conflict`**: e.g., User already registered, or already enrolled.
   - **Action**: Inform the user.
6. **`429 Too Many Requests`**: Rate limiting hit.
   - **Action**: "Please wait a moment before trying again."
7. **`500 Internal Server Error`**: Unhandled backend exception.
   - **Action**: Generic "Something went wrong on our end. Please try again later." Do NOT show the raw error to the user.

## Common Edge Cases
- **No Internet Connection**: Implement a global connectivity listener using `connectivity_plus`. Show a permanent banner "No Internet Connection" if offline. Block POST requests until connection restores.
- **Timeout Exception**: If a request takes > 15 seconds. Action: "Request timed out. Please check your connection."
