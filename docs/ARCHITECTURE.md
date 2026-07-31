
# Masarak Architecture

## Overview
Masarak is a modern e-learning platform built with a decoupled architecture.
- **Frontend**: Next.js (App Router, TailwindCSS, Zustand)
- **Backend**: NestJS (REST + WebSockets)
- **Database**: PostgreSQL (managed via Prisma ORM)
- **Real-time**: Socket.io

## Monorepo Structure
- `/src`: Frontend Next.js application
- `/backend`: NestJS application
- `/docs`: Project documentation

## Clean Architecture (Backend)
The backend follows NestJS modular architecture. Each feature is encapsulated in a module (e.g., `AcademicConversationsModule`).
- **Controllers**: Handle HTTP requests.
- **Gateways**: Handle WebSocket events.
- **Services**: Contain business logic.
- **Guards**: Enforce authentication (`JwtAuthGuard`) and authorization (`RolesGuard`).

## Event-Driven Design
To prevent circular dependencies, cross-module communication is handled via `@nestjs/event-emitter`.
For example, when a message is sent in `ConversationsService`, an event is emitted and caught by `ConversationsGateway` to broadcast to connected clients.
