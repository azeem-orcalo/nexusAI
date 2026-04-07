# NexusAI Skills Guide

## Purpose

- Define shared working skills for an agentic flow app built for NexusAI.
- Keep agents aligned on implementation quality, handoffs, and delivery behavior.

## Core Project Skills

### 1. Requirement Mapping

- Read `requirements.md` before implementation
- Map each task to a user-facing capability
- Preserve MoSCoW priorities when sequencing work
- Flag missing acceptance details early

### 2. Contract-First Development

- Define or confirm request and response types before wiring features
- Share contracts across frontend and backend where practical
- Keep naming stable across DTOs, schemas, and UI models
- Avoid untyped payload assumptions

### 3. Component Reuse

- Build reusable UI primitives and patterns
- Avoid duplicated JSX, styles, and validation logic
- Extract shared utilities when repeated behavior appears

### 4. Service Modularity

- Keep NestJS modules and services focused by domain
- Separate controllers, services, and persistence concerns
- Reuse domain logic instead of duplicating rules across endpoints

### 5. Typed-by-Default Delivery

- Use TypeScript types for everything
- Type component props, hooks, DTOs, entities, service returns, and API clients
- Avoid `any` unless explicitly justified and isolated

### 6. End-to-End Thinking

- Build and validate complete user journeys, not isolated screens or endpoints
- Consider loading, errors, empty states, and permissions as part of feature completion
- Verify frontend and backend assumptions together

### 7. QA-Ready Handoffs

- Deliver features with testable acceptance behavior
- Document known gaps, mocked states, and pending dependencies
- Keep bug reproduction steps simple and deterministic

## Agent Skill Assignment

### FE Agent Skills

- Requirement Mapping
- Component Reuse
- Typed-by-Default Delivery
- End-to-End Thinking

### BE Agent Skills

- Requirement Mapping
- Contract-First Development
- Service Modularity
- Typed-by-Default Delivery

### Integration Agent Skills

- Contract-First Development
- End-to-End Thinking
- QA-Ready Handoffs

### QA Tester Agent Skills

- Requirement Mapping
- End-to-End Thinking
- QA-Ready Handoffs

## Shared Operating Rules

- Keep responses concise.
- Only provide code blocks unless explanation is requested.
- Follow the DRY principle.
- Use functional components for all React UI.
- Keep all deliverables aligned with `requirements.md`.
