# Chat Service

Chat service built with TypeScript. Requires Node.js 24 and MongoDB.

## Local setup

From `chat_service`:

```bash
npm ci
cp .env.example .env
```

The `.env` file configures:

```env
PORT=3003
MONGO_HOST=127.0.0.1:27017
```

To start MongoDB, run from the repository root:

```bash
docker compose up -d mongo
```

## Development

From `chat_service`:

```bash
npm run dev
```

## Build and start

```bash
npm run build
npm start
```

## Verification

```bash
npm run check
```

Runs linting, formatting checks, compilation, and tests. Tests run against the compiled code in `dist`.

With the server running:

```bash
curl -i http://localhost:3003/health
```

Returns HTTP 200 when MongoDB is connected and HTTP 503 when disconnected.

## Docker

From `chat_service`:

```bash
docker build -t chat-service:local .
docker build -f Dockerfile.dev -t chat-service:dev .
```

Provide `PORT` and `MONGO_HOST` when creating the container. The MongoDB address depends on the container's network configuration.
