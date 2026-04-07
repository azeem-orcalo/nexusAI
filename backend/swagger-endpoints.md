# NexusAI API Endpoints

## Swagger

- UI: `/docs`
- JSON: `/docs-json`

## Auth

- `POST /api/auth/sign-up`
- `POST /api/auth/sign-in`
- `GET /api/auth/me`

## Models

- `GET /api/models`
- `GET /api/models/featured`
- `GET /api/models/providers`
- `GET /api/models/:id`
- `GET /api/models/:id/reviews`
- `POST /api/models/compare`

## Agents

- `POST /api/agents`
- `GET /api/agents`
- `GET /api/agents/templates`
- `GET /api/agents/:id`
- `PATCH /api/agents/:id`
- `DELETE /api/agents/:id`
- `POST /api/agents/:id/deploy`

## Dashboard

- `GET /api/dashboard/overview`
- `GET /api/dashboard/usage`
- `GET /api/dashboard/agents/:id/performance`

## Discover

- `GET /api/discover/onboarding`
- `POST /api/discover/recommendations`
- `GET /api/discover/quick-actions`
- `GET /api/discover/chat-hub`
- `GET /api/discover/home-workflows`
- `GET /api/discover/home-use-cases`
- `GET /api/discover/research-feed`

## Chat

- `GET /api/chat/history`
- `DELETE /api/chat/history`
- `POST /api/chat/respond`
- `POST /api/chat/messages`

## Account

- `GET /api/account/settings`
- `PATCH /api/account/settings`
- `GET /api/account/api-keys`
- `POST /api/account/api-keys`
- `DELETE /api/account/api-keys/:id`
