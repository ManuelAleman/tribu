# Tribu Backend

REST API and WebSocket server for the Tribu chat application.

## Tech Stack

- **Runtime:** [Bun](https://bun.sh/)
- **Framework:** [Express](https://expressjs.com/) v5
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication:** [Clerk](https://clerk.com/)
- **Real-time:** [Socket.IO](https://socket.io/)
- **Language:** TypeScript

## Project Structure

```
backend/
├── index.ts              # Entry point
├── src/
│   ├── app.ts
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── chatController.ts
│   │   ├── messageController.ts
│   │   └── userController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/
│   │   ├── Chat.ts
│   │   ├── Message.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── chatRoutes.ts
│   │   ├── messageRoutes.ts
│   │   └── userRoutes.ts
│   ├── scripts/
│   │   └── seed.ts       # Database seeding script
│   └── utils/
│       └── socket.ts     # Socket.IO configuration
└── types/
    └── globals.d.ts
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- [Clerk](https://clerk.com/) account

### Installation

```bash
cd backend
bun install
```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tribu
CLERK_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:8081
```

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | Environment (`development` or `production`) |
| `MONGODB_URI` | MongoDB connection string |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `FRONTEND_URL` | Frontend URL for CORS configuration |

### Running the Server

Development mode (with hot reload):
```bash
bun run dev
```

Production mode:
```bash
bun run start
```

## API Endpoints

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/auth/me` | Get current user | Required |
| `POST` | `/api/auth/callback` | Auth callback (creates user if new) | Required |

### Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users` | Get all users (except current) | Required |

### Chats

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/chats` | Get all chats for current user | Required |
| `POST` | `/api/chats/with/:participantId` | Get or create chat with user | Required |
| `POST` | `/api/chats/:chatId/read` | Mark chat as read | Required |

### Messages

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/messages/chat/:chatId` | Get messages for a chat | Required |

## WebSocket Events

### Client to Server

| Event | Payload | Description |
|-------|---------|-------------|
| `join-chat` | `chatId: string` | Join a chat room |
| `leave-chat` | `chatId: string` | Leave a chat room |
| `send-message` | `{ chatId: string, text: string }` | Send a message |
| `typing` | `{ chatId: string, isTyping: boolean }` | Typing indicator |
| `mark-read` | `{ chatId: string }` | Mark messages as read |

### Server to Client

| Event | Payload | Description |
|-------|---------|-------------|
| `online-users` | `{ userIds: string[] }` | List of online users (on connect) |
| `user-online` | `{ userId: string }` | User came online |
| `user-offline` | `{ userId: string }` | User went offline |
| `new-message` | `Message` | New message received |
| `typing` | `{ userId, chatId, isTyping }` | User typing status |
| `messages-read` | `{ chatId, readAt, readBy }` | Messages were read |
| `socket-error` | `{ message: string }` | Error occurred |


## Database Models

### User

```typescript
{
  clerkId: string,
  name: string,
  email: string,
  avatar: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Chat

```typescript
{
  participants: ObjectId[],
  lastMessage: ObjectId,
  lastMessageAt: Date,
  readStatus: Map<string, Date>,
  createdAt: Date,
  updatedAt: Date
}
```

### Message

```typescript
{
  text: string,
  sender: ObjectId,
  chat: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## Scripts

```bash
bun run dev

bun run start

bun run src/scripts/seed.ts
```

## Docker

Build and run with Docker:

```bash
# From the root directory
docker build -t tribu-backend .
docker run -p 3000:3000 --env-file ./backend/.env tribu-backend
```

## Error Handling

All errors are handled by a centralized error handler middleware. In development mode, stack traces are included in error responses.

```json
{
  "message": "Error message",
  "stack": "..."
}
```
