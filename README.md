# AI Model Playground (NestJS)

A minimal NestJS project demonstrating integration with OpenAI Agents, per-user conversation caching, and token-based authentication via Clerk.

---

## Project Features

- **OpenAI Agent Integration:**  
  Uses the `@openai/agents` package to run AI models (e.g., GPT5, GPT5mini) with built-in observability features such as streaming, logging, and tracing.
- **Per-User Conversation Caching:**  
  Stores and retrieves chat history for each user and model using a cache provider with a 30-minute TTL.
- **Token-Based Authentication:**  
  Secures endpoints using Clerk tokens and a custom NestJS AuthGuard.
- **Server-Sent Events (SSE):**  
  Streams AI responses to the client in real time.
- **Extensible Architecture:**  
  Easily add new AI models or providers by implementing the `AIService` interface.

---

## Used OpenAI Agent Features

- **Streaming:**  
  Supports streaming responses from the agent for real-time token delivery.
- **Observability:**  
  The agent provides built-in observability, including logging, tracing, and error reporting for each run.
- **Flexible Agent Configuration:**  
  Agents can be configured with custom instructions and reused across requests for efficiency.

---

## Quick Links

- [package.json](package.json) – Project manifest
- [src/main.ts](src/main.ts) – App entry
- [src/app.module.ts](src/app.module.ts) – Application module
- [src/app.controller.ts](src/app.controller.ts) – Controller handling AI endpoints
- [src/ai/agents.provider.ts](src/ai/agents.provider.ts) – Agent provider
- [src/ai/agent.ts](src/ai/agent.ts) – AI base class
- [src/cache/cache-provider.ts](src/cache/cache-provider.ts) – Caching helper
- [src/oauth/gaurd/auth-gaurd.ts](src/oauth/gaurd/auth-gaurd.ts) – Auth guard
- [src/oauth/gaurd/clerk-provider.ts](src/oauth/gaurd/clerk-provider.ts) – Clerk client provider
- [test/app.e2e-spec.ts](test/app.e2e-spec.ts) – E2E test example
- [.env.example](.env.example) – Example env

---

## Requirements

- Node.js (18+ recommended)
- npm

---

## Installation

```bash
npm install
```

### Environment Setup

Copy the example env file and provide your Clerk keys:

```bash
cp .env.example .env
# Then fill CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY
```

---

## Development

Start the server in watch mode:

```bash
npm run start:dev
```

- Default port: `$PORT` (fallback 3001)
- CORS enabled in `src/main.ts`

### Production

Build and run:

```bash
npm run build
npm run start:prod
```

---

## API Endpoints

All endpoints require a Clerk token in the Authorization header:

```
Authorization: Bearer <token>
```

- **POST /ai/stream**  
  Body: `{ model: "GPT5" | "GPT5mini", prompt: string }`  
  Streams model tokens as SSE. Conversation history is stored per user and model.

- **GET /ai/history/:model**  
  Returns cached conversation for the current user and specified model.

- **GET /ai/newChat**  
  Clears cached history for the current user.

See `src/app.controller.ts` for details.

---

## Architecture Notes

- **AIService Interface:**  
  All AI providers implement a minimal interface for easy extension.
- **AgentProvider:**  
  Discovers and registers available AI agents at startup.
- **CacheProvider:**  
  Handles per-user, per-model chat history with a 30-minute TTL.
- **AuthGuard & ClerkClientProvider:**  
  Enforces authentication using Clerk tokens.

---

## Useful Scripts

See `package.json` for all scripts.

- Lint:
  ```bash
  npm run lint
  ```
- Format:
  ```bash
  npm run format
  ```
- Test:
  ```bash
  npm run test
  ```
- E2E Test:
  ```bash
  npm run test:e2e
  ```

---

## License

Project is currently unlicensed (see `package.json`).
