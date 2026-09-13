# Between Us — Backend

> Who Can You Trust?

This is the backend API and real-time game server for **Between Us**, built with NestJS for the [Lethal Hive](https://lethalhive.com) platform. It handles authentication, player and staff flows, lobby and game orchestration, MongoDB persistence, Redis queues/cache, and Socket.IO communication for multiplayer gameplay.

## Features

- User and staff authentication with Clerk integration and JWT
- MongoDB-backed models for users, players, words, categories, lobby data, and game state
- Redis-based cache and BullMQ queue processing for background work
- Real-time game server with Socket.IO gateways and lobby orchestration
- Swagger / Scalar API documentation
- Internationalization support with locale-aware responses
- Role-based access and custom guards

## Tech Stack

- NestJS
- TypeScript
- MongoDB + Mongoose
- Redis + BullMQ
- Socket.IO
- Clerk
- Swagger / Scalar

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm or pnpm
- MongoDB instance running
- Redis instance running

## Getting Started

### 1) Install dependencies

```bash
git clone https://github.com/Lethal-Hive/between-us-backend.git
cd between-us-backend
npm install
```

### 2) Configure environment variables

Copy the example file and update the values for your local environment:

```bash
cp .env.example .env
```

| Variable                                 | Description                                                        |
| ---------------------------------------- | ------------------------------------------------------------------ |
| `APP_NAME`                               | Application name.                                                  |
| `APP_NODE_ENV`                           | Runtime environment such as`development`, `production`, or `test`. |
| `APP_LANGUAGE`                           | Default application language.                                      |
| `APP_TIMEZONE`                           | Default timezone, for example`Africa/Cairo`.                       |
| `CORS_ENABLED`                           | Enables or disables CORS.                                          |
| `CORS_ALLOWED_ORIGINS`                   | List of allowed frontend origins.                                  |
| `SWAGGER_API_NAME`                       | Swagger API name.                                                  |
| `SWAGGER_API_VERSION`                    | Swagger API version.                                               |
| `SWAGGER_API_SECOND_SERVER_URL`          | Secondary server URL for documentation.                            |
| `SWAGGER_API_ROUTE`                      | Route used for the API docs, such as`/api-docs`.                   |
| `SWAGGER_API_TAB_NAME`                   | Label displayed in the Swagger UI tab.                             |
| `USE_DOCUMENTATION`                      | Documentation engine, typically`SCALAR`.                           |
| `APP_PORT`                               | HTTP port for the backend.                                         |
| `SOCKET_PORT`                            | Port used by the Socket.IO server.                                 |
| `API_PREFIX`                             | API route prefix, such as`v`.                                      |
| `API_VERSION`                            | API version number.                                                |
| `DATABASE_URI`                           | MongoDB connection string.                                         |
| `REDIS_PORT`                             | Redis port.                                                        |
| `USER_AUTH_JWT_SECRET`                   | JWT secret for user authentication.                                |
| `USER_AUTH_JWT_ACCESS_TOKEN_EXPIRATION`  | Expiration time for user access tokens.                            |
| `CLERK_PUBLISHABLE_KEY`                  | Public Clerk key.                                                  |
| `CLERK_SECRET_KEY`                       | Secret Clerk key.                                                  |
| `CLERK_WEBHOOK_SECRET`                   | Clerk webhook verification secret.                                 |
| `STAFF_AUTH_JWT_SECRET`                  | JWT secret for staff authentication.                               |
| `STAFF_AUTH_JWT_ACCESS_TOKEN_EXPIRATION` | Expiration time for staff access tokens.                           |

> ⚠️ Never commit a real `.env` file. Keep only the template in `.env.example`.

## Running the project

### Development mode

```bash
npm run start:dev
```

### Production build

```bash
npm run build
npm run start:prod
```

### Tests

```bash
npm test
npm run test:watch
npm run test:cov
npm run test:e2e
```

## API Documentation

Swagger / Scalar docs are enabled through the application configuration. Once the app is running, open the route defined in `SWAGGER_API_ROUTE` (default: `/api-docs`).

## Project Structure

```text
src/
  app/
    auth/         # Auth flows and JWT/Clerk integration
    user/         # User domain logic
    staff/        # Staff/admin domain logic
    word/         # Word-related business logic
    category/     # Category management
    game/         # Game logic and WebSocket gateway
    player/       # Player entity and game participant logic
    lobby/        # Lobby queue and room orchestration
  common/         # Shared utilities, guards, i18n, interceptors, cache, swagger
  configs/        # Application and database config
  constants/      # App-wide constants
  decorators/     # Custom decorators
  guards/         # Auth and role guards
  middleware/     # Express middleware
  providers/      # External service providers
  utils/          # Helper utilities
  main.ts         # App bootstrap
```

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
