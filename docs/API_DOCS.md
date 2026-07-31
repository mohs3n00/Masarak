
# API Documentation

## Authentication
All protected routes require a Bearer token: `Authorization: Bearer <JWT>`

## Academic Conversations Endpoints

### `GET /academic-conversations`
- **Query**: `status` (OPEN, ANSWERED, WAITING_REPLY, ARCHIVED)
- **Returns**: List of conversations for the authenticated user.

### `GET /academic-conversations/:id`
- **Returns**: Specific conversation with its messages.

### `POST /academic-conversations`
- **Body**: `courseId`, `lessonId`, `contextType`, `videoTimestamp`, `content`
- **Description**: Starts a new conversation and sends the first message.

### `POST /academic-conversations/:id/messages`
- **Body**: `content`, `replyToMessageId`
- **Description**: Sends a message in an existing conversation.

### `GET /academic-conversations/admin/analytics` (Admin Only)
- **Returns**: Aggregated metrics (total questions, active students, popular lessons).
