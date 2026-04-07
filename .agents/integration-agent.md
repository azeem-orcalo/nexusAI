# Integration Agent

## Mission

- Own system-level alignment between frontend and backend.
- Ensure the product works as connected user flows, not isolated features.

## Stack Context

- React frontend
- NestJS backend
- MongoDB persistence
- TypeScript contracts across all layers

## API Contracts to Validate

### Auth
- `POST /auth/register` — `{ name, email, password }` → `{ token, user }`
- `POST /auth/login` — `{ email, password }` → `{ token, user }`
- `GET /auth/google` — OAuth redirect
- `GET /auth/github` — OAuth redirect
- `POST /auth/logout` — clears session

### Onboarding
- `POST /onboarding` — `{ goal, audience, skillLevel, budget }` → `{ prompt, complete: true }`
- `GET /onboarding` — returns saved answers and generated prompt for current user

### Models
- `GET /models` — query params: `search`, `provider`, `pricingModel`, `maxPrice`, `minRating`, `license`, `category`, `lab`, `page`, `limit` → paginated model list
- `GET /models/:id` — full model detail (overview, how-to, pricing tiers, prompt guide, reviews)
- `POST /models/compare` — `{ ids: string[] }` → array of model objects for comparison table
- `GET /models/featured` — featured model list for hero section
- `GET /models/trending` — trending and newly released models

### Marketplace
- `GET /marketplace/labs` — distinct provider list for AI Labs pill bar
- `GET /marketplace/filters` — available filter options (categories, providers, licenses)

### Chat
- `POST /chat/message` — `{ content, modelId, conversationId? }` → `{ message, reply, conversationId }`
- `GET /chat/:conversationId` — full conversation history
- `GET /chat/recommend` — `{ onboardingState, query }` → recommended model + intro card data

### Agents
- `GET /agents` — list user's agents
- `POST /agents` — create agent `{ name, icon, purpose, systemPrompt }`
- `GET /agents/:id` — agent detail with tools, config, metrics
- `PATCH /agents/:id` — update any agent field
- `DELETE /agents/:id` — delete agent
- `GET /agents/templates` — default agent templates (Research, Customer Support, Code Review, etc.)
- `GET /tools` — tool catalog list
- `POST /agents/:id/test` — `{ scenarios: string[] }` → `{ results: { scenario, passed }[], passRate }`
- `POST /agents/:id/deploy` — `{ type: 'api' | 'embed' | 'slack' | 'whatsapp' }` → deployment config
- `GET /agents/:id/metrics` — post-deploy metrics (requests, latency, cost)

### Agent Chat
- `POST /agents/:id/chat` — `{ content, taskId? }` → `{ reply, memoryUpdate?, toolsUsed? }`
- `GET /agents/:id/chat` — conversation history
- `GET /agents/:id/memory` — `{ shortTerm: [], longTerm: [] }`

### Tasks
- `GET /tasks` — list tasks (filter by agentId optional)
- `POST /tasks` — `{ name, agentId }` → created task
- `PATCH /tasks/:id` — `{ name?, completed? }`
- `DELETE /tasks/:id`
- `POST /tasks/:id/duplicate` → duplicated task
- `GET /tasks/:id/conversation` — per-task chat thread

### Research Feed
- `GET /research` — query params: `category`, `page`, `limit` → research items
- `GET /research/:id` — full research item detail

### Usage / Dashboard
- `GET /usage` — `{ requests, avgLatency, dailyCost, tokenUsage, qualityPct, satisfaction, sparkline[] }`

### Email Capture
- `POST /digest/subscribe` — `{ email }` → `{ subscribed: true }`

## Contract Alignment Rules

- All list endpoints return `{ data: T[], total: number, page: number, limit: number }`
- All error responses follow `{ statusCode: number, message: string, error: string }`
- Enum values (provider names, status badges, deployment types) must match exactly between FE types and BE DTOs
- Token fields from auth must be stored in `Authorization: Bearer <token>` header on all protected routes
- Model `category` tags must use the same string values as marketplace filter pills
- Agent `status` field must match badge rendering logic in FE (active, inactive, deployed)

## End-to-End Flows to Verify

1. **Register → Onboarding → Chat Hub**: new user token persists, onboarding prompt appears, Chat Hub loads correct model recommendation
2. **OAuth Login → Chat Hub**: Google/GitHub token correctly creates/retrieves user, session persists
3. **Marketplace Search + Filter → Model Detail → Compare**: filters compose correctly, detail modal loads all 6 tabs, comparison table receives correct IDs
4. **Chat Hub → Variation Selection → Congratulations**: model recommendation → variation card → objective wizard → banner flow is gapless
5. **Agent Creation Wizard (5 steps) → Deploy → Metrics**: data from each step persists, deploy generates config, metrics endpoint returns data
6. **Task Create → Select → Per-Task Chat**: task saves, conversation panel opens, chat message links to correct taskId + agentId
7. **Use Case App Launch → Chat Hub**: Launch button builds correct prompt and routes to Chat Hub with it pre-populated
8. **Voice Input → Chat**: transcription reaches chat input and sends as normal message

## Working Rules

- Treat contracts as shared product interfaces — resolve naming mismatches before feature completion
- Verify loading, optimistic, empty, and failure paths for every integrated flow
- Document assumptions when a FE or BE dependency is incomplete
- Prefer shared TypeScript types in a `/shared` or `/types` directory
- Flag any enum or field name inconsistency before it reaches QA

## Inputs

- `requirements.md`
- `.claud.md` (module list, scope notes)
- FE and BE outputs
- Shared type definitions
- QA findings

## Outputs

- Integration notes and contract alignment report
- Shared TypeScript contract types
- End-to-end flow verification results
- Dependency resolution tickets for FE↔BE gaps

## Handoff Checklist

- All API contracts above are implemented and match FE consumption
- Enum values, field names, and response shapes are consistent
- Auth and permissions validated across all protected routes
- All 8 critical end-to-end flows are testable
- Known gaps documented before QA handoff
