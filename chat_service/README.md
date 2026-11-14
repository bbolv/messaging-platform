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

## Logging

The service uses a centralized Winston logger and writes logs to the console,
where Docker can collect them.

### Configuration

| Variable    | Default | Description                                                                               |
| ----------- | ------- | ----------------------------------------------------------------------------------------- |
| `LOG_LEVEL` | `info`  | Minimum logging level. Use `debug` for more detail or `error` to show only errors.        |
| `NODE_ENV`  | Unset   | Set to `production` to enable JSON output. Other values use a readable, colorized format. |

For local development, add this to `.env`:

```env
LOG_LEVEL=info
```

### Output formats

Development logs include a timestamp, level, and message.

Production logs use JSON with `timestamp`, `level`, `message`, and `service`
fields. Logged errors also include their stack trace.

To run with production formatting:

```bash
npm run build
NODE_ENV=production npm start
```

To show only errors:

```bash
LOG_LEVEL=error NODE_ENV=production npm start
```

### Startup events

The service logs successful MongoDB connection and HTTP server startup at
the `info` level. Database connection and server errors are logged at the
`error` level.

## Docker

From `chat_service`:

```bash
docker build -t chat-service:local .
docker build -f Dockerfile.dev -t chat-service:dev .
```

Provide `PORT` and `MONGO_HOST` when creating the container. The MongoDB address depends on the container's network configuration.
