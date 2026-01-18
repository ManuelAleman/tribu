# Tribu Mobile

React Native mobile app for the Tribu chat application built with Expo.

## Tech Stack

- **Framework:** [Expo](https://expo.dev/) SDK 54
- **Navigation:** [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **Styling:** [NativeWind](https://www.nativewind.dev/) (TailwindCSS for React Native)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) + [TanStack Query](https://tanstack.com/query)
- **Authentication:** [Clerk](https://clerk.com/)
- **Real-time:** [Socket.IO Client](https://socket.io/)
- **Language:** TypeScript

## Project Structure

```
mobile/
├── app/                    # Expo Router screens
│   ├── (auth)/             
│   │   └── index.tsx       
│   ├── (tabs)/             
│   │   ├── index.tsx       
│   │   └── profile.tsx     
│   ├── chat/
│   │   └── [id].tsx        
│   ├── new-chat/
│   │   └── index.tsx       
│   └── _layout.tsx         
├── components/             # Reusable components
│   ├── ChatItem.tsx
│   ├── ChatSkeleton.tsx
│   ├── ErrorState.tsx
│   ├── MessageBubble.tsx
│   ├── MessagesSkeleton.tsx
│   ├── SocketConnection.tsx
│   ├── ThemeSheet.tsx
│   └── UserItem.tsx
├── hooks/                  # Custom hooks
│   ├── useAuth.ts          
│   ├── useChats.ts         
│   ├── useMessages.ts      
│   ├── useSocialAuth.ts    
│   └── useUsers.ts         
├── lib/                    # Utilities
│   ├── axios.ts            
│   ├── colors.ts           
│   ├── menuSettings.ts     
│   └── socket.ts           
├── providers/
│   └── ThemeProvider.tsx   # Theme context
├── types/
│   └── index.ts            
└── assets/                 
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- iOS Simulator (macOS) or Android Emulator
- [Clerk](https://clerk.com/) account

### Installation

```bash
cd mobile
npm install
```

### Environment Variables

Create a `.env` file in the `mobile` directory:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
EXPO_PUBLIC_SOCKET_URL=http://localhost:3000
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
```

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend API URL (include `/api`) |
| `EXPO_PUBLIC_SOCKET_URL` | WebSocket server URL |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |

> **Note:** For physical devices, use your computer's local IP instead of `localhost` (e.g., `http://192.168.1.X:3000`)

### Running the App

Start the development server:
```bash
bunx expo start
```

Run on specific platform:
```bash
# iOS Simulator
bunx expo run:ios

# Android Emulator
bunx expo run:android

```

## Features

### Authentication
- OAuth providers (Google, Apple)

### Chat
- Real-time messaging with Socket.IO
- Typing indicators
- Read receipts
- Online status indicators
- Message timestamps

### UI/UX
- Light and dark theme support
- System theme detection
- Smooth animations with Reanimated
- Loading skeletons
- Error states with retry

## App Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/(auth)` | Authentication screen |
| Chats | `/(tabs)` | List of conversations |
| Profile | `/(tabs)/profile` | User profile and settings |
| Chat | `/chat/[id]` | Conversation view |
| New Chat | `/new-chat` | Select user to start chat |

## Custom Hooks

### `useCurrentUser()`
Get the authenticated user's data.

### `useChats()`
Fetch and manage chat list with automatic updates.

### `useMessages(chatId)`
Fetch messages for a specific chat.

### `useUsers()`
Get list of users to start new conversations.

### `useSocketStore`
Zustand store for Socket.IO connection and real-time state.

```typescript
const { 
  isConnected, 
  onlineUsers, 
  typingUsers,
  sendMessage,
  sendTyping 
} = useSocketStore();
```

## Troubleshooting

### Socket connection issues
- Verify `EXPO_PUBLIC_SOCKET_URL` is correct
- For physical devices, use your computer's IP, not `localhost`
- Check that the backend server is running
