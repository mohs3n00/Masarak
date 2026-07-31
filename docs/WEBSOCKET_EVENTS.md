
# WebSocket Events

**Namespace**: `/academic-chat`
**Authentication**: Requires `Bearer <JWT>` in the `auth.token` handshake payload.

## Client -> Server (Emits)
- **`authenticate`**: Sends JWT (if not provided in handshake).
- **`join_conversation`**: Joins a specific conversation room for typing indicators.
- **`leave_conversation`**: Leaves a room.
- **`typing_start`**: Broadcasts typing status.
- **`typing_stop`**: Broadcasts stop typing status.

## Server -> Client (Listens)
- **`new_message`**: Received when a new message is sent in any of the user's conversations.
- **`message_updated`**: Received when a message is edited or status changes (Delivered/Seen).
- **`conversation_updated`**: Received when conversation status changes (e.g., OPEN to ANSWERED).
