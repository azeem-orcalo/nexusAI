# Backend Agent

## Mission

- Own the NestJS backend and MongoDB data layer for NexusAI.
- Deliver clean, typed APIs and reusable business logic.

## Stack

- NestJS
- MongoDB
- TypeScript

## Modules to Implement

### Auth Module
- Register, login, logout endpoints
- Google OAuth and GitHub OAuth (Passport.js strategies)
- JWT session management and persistent auth state
- Password validation, forgot password flow
- Guards and decorators for protected routes

### User Module
- User profile schema: name, email, avatar, provider, onboarding state, language preference
- Onboarding state persistence (goal, audience, skill level, budget answers)
- Language preference storage

### Onboarding Module
- Save and retrieve 4-step onboarding answers (Goal, Audience, Skill Level, Budget)
- Generate personalized prompt from onboarding state
- Mark onboarding as complete per user

### Models Module
- Model schema: id, name, org, description, category tags, status badge, provider, pricing model, price per 1M tokens, rating, review count, context window, speed, multimodal support, license, input/output types, use cases, benchmark scores (MMLU, HumanEval, MATH), versions, latest update date
- CRUD endpoints for models (read-only for users; seeded/admin-managed data)
- Search: full-text across name, description, org
- Filter: provider, pricing model, max price, min rating, license, category, AI lab
- Comparison endpoint: return multiple models by ID for side-by-side view
- Model detail endpoint: full schema including how-to guide, pricing tiers, prompt guide principles, reviews
- Seed 525+ models including GPT-5.4, Claude Opus 4.6, Gemini 3.1 Pro, Grok-4, DeepSeek-V3, Llama 4, Qwen3, Mistral, Nemotron, GLM-5, Kimi-K2, and others

### Marketplace Module
- Quick filter pills endpoint (category aggregation)
- AI Labs list endpoint (distinct providers)
- Featured models endpoint
- Trending / newly released models endpoint

### Agent Module
- Agent schema: id, owner, name, icon, purpose, system prompt, tools[], config (memory settings, advanced), status, deployment options, metrics
- CRUD: create, read, update, delete agent
- Tool catalog: list available tools with name, description, config schema
- Agent testing: save test scenarios, record pass/fail results, calculate pass rate
- Deployment: store deployment type (API, embed, Slack, WhatsApp) and generate endpoint/config per type
- Post-deploy metrics: request count, latency, cost

### Task Module
- Task schema: id, agentId, ownerId, name, completed, createdAt
- CRUD: create, read, update (name, complete toggle), delete, duplicate
- Per-task conversation thread: messages linked to taskId + agentId

### Chat Module
- Conversation schema: id, userId, agentId, taskId (optional), messages[]
- Message schema: role (user/ai), content, modelId, timestamp, tokens
- Store and retrieve conversation history per session
- Model recommendation logic based on onboarding state and query

### Research Feed Module
- Research item schema: id, date, title, summary, category, modelRef (optional)
- List with category filter
- Trending and newly released highlights

### Usage / Dashboard Module
- Per-user usage tracking: request count, average latency, daily cost, token usage, satisfaction rating
- Sparkline data (time-series usage per day)
- Response quality percentage
- Post-deployment agent metrics aggregation

### Voice Input
- No dedicated backend module; Speech Recognition API is client-side
- Backend receives final transcribed text as regular chat input

### Localization
- Accept and store language preference on user profile
- Return UI locale keys if server-side i18n is needed

### Email Capture Module
- Digest subscription schema: email, subscribedAt
- Subscribe endpoint with email validation

## Working Rules

- Keep controllers thin and services focused
- Type DTOs, entities, query params, payloads, and responses
- Reuse shared domain logic instead of duplicating behavior
- Validate all external inputs at API boundaries
- Keep persistence concerns separate from business rules
- Return predictable error formats: `{ statusCode, message, error }`
- Use NestJS pipes for DTO validation (class-validator)
- Use indexes on frequently queried fields (provider, category, rating, ownerId)

## Inputs

- `requirements.md`
- `.claud.md` (scope notes, module list)
- Integration feedback and QA findings

## Outputs

- NestJS modules, controllers, and services
- MongoDB schemas and repository patterns
- Typed DTOs and response contracts
- API usage notes and edge-case handling details

## Handoff Checklist

- API contracts are documented and typed
- Validation covers create, update, filter, and auth flows
- Errors are consistent and testable
- Shared logic is centralized
- Integration Agent has clear payload examples and assumptions
