# AI Model Playground (NestJS)

Minimal NestJS project that demonstrates integration with OpenAI-style agents, per-user conversation caching, and token-based auth via Clerk.

## Quick links

- Project manifest: [package.json](package.json)
- App entry: [src/main.ts](src/main.ts)
- Application module: [`AppModule`](src/app.module.ts) ([src/app.module.ts](src/app.module.ts))
- Controller handling AI endpoints: [`AppController`](src/app.controller.ts) ([src/app.controller.ts](src/app.controller.ts))
- Agent provider: [`AgentProvider`](src/ai/agents.provider.ts) ([src/ai/agents.provider.ts](src/ai/agents.provider.ts))
- AI base class: [`AIService`](src/ai/agent.ts) ([src/ai/agent.ts](src/ai/agent.ts))
- Caching helper: [`CacheProvider`](src/cache/cache-provider.ts) ([src/cache/cache-provider.ts](src/cache/cache-provider.ts))
- Auth guard: [`AuthGuard`](src/oauth/gaurd/auth-gaurd.ts) ([src/oauth/gaurd/auth-gaurd.ts](src/oauth/gaurd/auth-gaurd.ts))
- Clerk client provider: [`ClerkClientProvider`](src/oauth/gaurd/clerk-provider.ts) ([src/oauth/gaurd/clerk-provider.ts](src/oauth/gaurd/clerk-provider.ts))
- E2E test example: [test/app.e2e-spec.ts](test/app.e2e-spec.ts)
- Example env: [.env.example](.env.example)

## Requirements

- Node.js (recommended 18+)
- npm

## Install

```bash
npm install
```
Environment

Copy the example env and provide your Clerk keys (or other secrets):

cp [.env.example](http://_vscodecontentref_/0) .env
# then fill CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY

Development

Start the server in watch mode:

npm run start:dev

Default listen port is controlled by $PORT (fallback 3001).
CORS is enabled and pre-configured in src/main.ts.
Production
Build then run:

npm run build
npm run start:prod

API (important endpoints)
All endpoints require a Clerk token via the Authorization header: Authorization: Bearer <token> (handled by AuthGuard).

POST /ai/stream

Body: { model: "GPT5" | "GPT5mini", prompt: string }
Streams model tokens as Server-Sent Events (SSE). Conversation history is stored per user and model via CacheProvider.
GET /ai/history/:model

Returns cached conversation for the current user and specified model.
GET /ai/newChat

Clears cached history for the current user.
Refer to AppController for detailed behavior and token-cost reporting.


Architecture notes
AI integrations subclass AIService. Example providers are registered in AppModule.
Discovery-based provider registration is used: AgentProvider enumerates registered providers at startup.
Conversations are cached per-user with a TTL (configured in the CacheModule in AppModule).
Authentication is implemented with Clerk via ClerkClientProvider and enforced with AuthGuard.
Useful scripts
See package.json for all scripts (build, lint, test, start, etc.).

Contributing
Follow linting rules: npm run lint
Format with Prettier: npm run format
License
Project is currently unlicensed (see package.json).


Linked files and symbols referenced above:
- [package.json](http://_vscodecontentref_/1)  
- [AppModule](http://_vscodecontentref_/2) (src/app.module.ts)  
- [main.ts](http://_vscodecontentref_/3)  
- [AppController](http://_vscodecontentref_/4) (src/app.controller.ts)  
- [AgentProvider](http://_vscodecontentref_/5) (src/ai/agents.provider.ts)  
- [AIService](http://_vscodecontentref_/6) (src/ai/agent.ts)  
- [CacheProvider](http://_vscodecontentref_/7) (src/cache/cache-provider.ts)  
- [AuthGuard](http://_vscodecontentref_/8) (src/oauth/gaurd/auth-gaurd.ts)  
- [ClerkClientProvider](http://_vscodecontentref_/9) (src/oauth/gaurd/clerk-provider.ts)  
- [app.e2e-spec.ts](http://_vscodecontentref_/10)  
- [.env.example](http://_vscodecontentref_/11)