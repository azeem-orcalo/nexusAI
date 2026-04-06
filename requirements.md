# NexusAI Requirements

## Scope Basis

This document is based on analysis of:

- Local files: `ai-model-hub-v12.html` and `NexusAI-Dashboard-Updated-15.html`
- Live URL: [https://nexusai-db.netlify.app/](https://nexusai-db.netlify.app/)

`NexusAI-Dashboard-Updated-15.html` is the authoritative reference for scope. All features described below are fully functional, not placeholders, unless explicitly noted.

---

## Core Functional Features

### 1. Authentication

- Full Login and Signup modal with branded left panel and form panel
- Tab switcher between Login and Signup
- Email and password fields with validation
- Forgot password link
- Social login: Google OAuth and GitHub OAuth — fully functional
- Session management and persistent login state
- Sign-in and Get Started entry points visible in top navigation

### 2. Guided Onboarding and Discovery

- Full-screen onboarding overlay for first-time users
- 4-step progressive question flow: Goal → Audience → Skill Level → Budget
- Each question card shows emoji-labeled option buttons in a 2-column grid
- Progress dots and skip functionality
- Personalized prompt auto-generation based on onboarding answers
- Redirect to Chat Hub after completion
- Landing page hero search card with inline expandable onboarding
- Phase 1: Welcome message with animated floating orbs
- Phase 2: Step-by-step inline questions within hero card
- Phase 3: "Building prompt" animation before routing to chat
- Live indicator showing model count (347 models, updated daily) on hero card

### 3. Hero Landing Page

- Animated hero section with floating orb background
- Hero stats: 525+ AI Models, 82K Builders, 28 AI Labs, 4.8★ Average Rating
- Multi-modal search input supporting: text, voice conversation, voice typing, file attachment (PDF, DOC, DOCX, TXT, CSV), image upload
- "Let's go" CTA button
- Quick action grid with 14 labeled buttons:
  - Create image, Generate audio, Create video, Create slides/presentation
  - Create infographic, Create quiz, Create flashcards, Create mind map
  - Analyze data, Write content, Code generation, Document analysis
  - Translate, Just exploring
- Featured models section

### 4. Chat Hub

- Left sidebar (252px) with model list, search filtering, and active model highlighting
- Central chat area with user and AI message bubbles
- User messages: dark background, right-aligned with "U" avatar
- AI messages: white background, left-aligned with "✦" avatar
- Typing indicator with animated bouncing dots
- Message metadata showing model name
- Auto-generated pre-populated prompt card from onboarding answers
  - Display mode and edit mode toggle
  - Action buttons: Run, Edit/Save, Regenerate, Delete
- Inspiration chips (8 suggested questions, clickable to send)
- Model intro card displayed in chat after model recommendation
  - Icon, name, organization, status badge, description
  - Stats: Rating, Pricing, Versions
  - Latest update date and review count
  - Buttons: View Details, Proceed with this
- Variation selector card for choosing between model versions
  - Radio button per variation, shows: name, tag, context, price, badge
  - Confirm button appears on selection
- Variation detail card showing: overview, key specs (Context, Speed, Price), latest update, key benefits
- Objective wizard cards for variation selection: Quality/Speed/Cost/Balanced, Context length, Tools/function calling
- Congratulations banner on flow completion
- Category prompt panel below input with 7 tabs:
  - Use cases, Monitor the situation, Create a prototype, Build a business plan
  - Create content, Analyze & research, Learn something
  - 2-column grid of quick prompts under each tab
- Right sidebar (272px):
  - Active Model Card: icon, name, org, live status badge, description, stats grid (Context, Price/1M tokens, Rating), Details and Pricing buttons
  - Usage Overview: Requests count, Average latency, Cost (today), sparkline chart
  - Quick Actions grid in 3 collapsible sections:
    - Navigation & Tools: Browse Marketplace, Build an Agent, How to use Guide, Prompt Engineering, View Pricing, AI Models Analysis
    - Create & Generate: Create image, Generate audio, Create video, Create slides, Create infographs, Create quiz, Create flashcards, Create mind map
    - Analyze & Write: Analyze data, Write content, Code generation, Document analysis, Translate

### 5. Voice Input

- Full Speech Recognition API integration
- Real-time transcription display (interim and final)
- Silence detection with auto-send trigger
- Visual voice wave animation while recording
- Mic button with active pulsing state
- Stop recording button
- Mic button available in hero search, chat input, and marketplace search

### 6. AI Model Marketplace

- Search bar with voice search, file upload, and image upload
- Quick filter pills: All, Language, Vision, Code, Image Gen, Audio, Open Source
- AI Labs filter bar: horizontal scrollable pill buttons by provider
- Active lab banner showing current filter with clear option
- Sidebar filters (220px):
  - Provider: OpenAI, Anthropic, Google, Meta, Mistral, Cohere
  - Pricing Model: Pay-per-use, Subscription, Free tier, Enterprise
  - Max Price per 1M tokens: range slider
  - Min Rating: Any, 4+★, 4.5+★
  - License: Commercial, Open source, Research only
  - Quick Guides: Prompt Tips, Agent Creation, Pricing Comparison
  - "Need help choosing?" CTA card
- Responsive auto-fill model card grid (minmax 290px)
- Model cards: icon, name, org badge, status badge (NEW/HOT/OPEN SOURCE/BETA), description, category tags (color-coded), rating, pricing, View Details button
- Empty-state handling when filters return no results
- Model comparison table: column-view side-by-side comparison of flagship models
  - Comparison dimensions: context window, pricing, multimodal capability, speed, best-fit use case
- 525+ models across providers including GPT-5.4, Claude Opus 4.6, Gemini 3.1 Pro, Grok-4, DeepSeek-V3, Llama 4, Qwen3, Mistral, Nemotron, GLM-5, Kimi-K2, and more

### 7. Model Detail Modal

- Triggered from marketplace card or chat model card
- Tab navigation across 6 panels:

**Overview Tab**
- Full description, input/output capabilities
- Use cases grid (emoji + label)
- Example prompt → output comparison
- Benchmark scores: MMLU, HumanEval, MATH, Rating

**How to Use Tab**
- 5-step integration guide: Get API Access, Choose integration method, Understand input/output formats, Set parameters, Test in Playground
- Quick Start code snippet with copy button

**Pricing Tab**
- 3 pricing tier cards: Pay-per-use, Pro Subscription, Enterprise
- Feature checklists per tier
- Free tier callout

**Prompt Guide Tab**
- 4 prompt engineering principles: Be explicit about format, Assign a role, Chain-of-thought, Few-shot examples
- Each principle has a code box with copy button

**Agent Creation Tab**
- 6-step agent creation wizard embedded in modal

**Reviews Tab**
- User reviews with name, role, star rating, and review text

### 8. Agent Builder and Management

**Agent Computer Panel (ACP)**
- Perplexity-style suggested questions panel in Agents view
- Tab-based categories: Use Cases, Build a Business, Help me Learn, Monitor, Research, Create Content, Analyze & Research
- Icon + text suggestions with hover arrow effects
- Click to send as message to agent chat

**Agent Library**
- Inline left sidebar listing created agents
- Grid view for agent templates with tabs: All, Featured, Custom
- Default agent library: Research Agent, Customer Support Agent, Code Review Agent, Data Analysis Agent, Content Writer Agent, Sales Outreach Agent
- "Build from Scratch" card with dashed border
- Agent cards: icon, name, description, tags, tool count
- "New Agent" button and Create entry point

**Agent Creation Wizard (5-step flow)**
- Step 1 — Basics: Name, icon, purpose, system prompt editor
- Step 2 — Tools: Tool catalog browser, tool selection grid, tool configuration drawer (right slide-out panel), extra tools expansion, tool count bar
- Step 3 — Configuration: Advanced settings, memory setup
- Step 4 — Testing: See Agent Testing below
- Step 5 — Deploy: See Deployment Options below
- Back/Next navigation, step progress indication

**Agent Testing / Playground**
- 8 predefined recommended test scenarios
- Custom test scenario input
- Checkbox selection of scenarios to run
- Agent playground chat interface for manual testing
- Pass/fail verdict per test scenario
- Pass rate percentage with progress bar
- Overall test verdict display

**Agent Deployment Options**
- API Endpoint deployment
- Embed Widget deployment
- Slack Bot deployment
- WhatsApp / SMS via Twilio deployment
- Dashboard metrics display post-deployment
- Deploy button

**Agent Chat View**
- Dedicated chat interface per agent
- Agent avatar and name displayed at top
- Agent profile card with description and use cases
- Short-term and long-term memory tracking display
- Tools list per active agent
- Chat metrics: message count, token usage
- Conversation history per agent session

### 9. Task Management (within Agents View)

- Create new task with inline name input
- Edit task name inline (contenteditable)
- Complete/incomplete toggle via checkbox
- Duplicate task
- Delete task with animation
- Context menu (three-dot icon) per task
- Task list organized by project/agent sections
- Task filtering by project or agent
- Per-task conversation panel: each task has its own chat thread with the assigned agent
- Active task highlighting in list
- Conversation panel shows/hides based on selected task
- Persistent task state

### 10. Use Case App Discovery

- 6 major categories with 10 apps each (60+ total apps):
  - **Use Cases**: Space Timeline, Big Mac Index, Windows 3.1, Art Heist, Stock Tracker, World Map, AI Chatbot, Leaderboard, Kanban, Trivia
  - **Build a Business**: Revenue Dashboard, Invoice Generator, CRM, Email Planner, Pitch Deck, Competitor Analysis, GTM Strategy, Financial Model, Business Plan, Personas
  - **Learn**: ML Concepts, Language Tutor, Science Quiz, Study Planner, Research Reader, Concept Map, Exam Prep, Writing Coach, Textbook Summarizer, Subject Quizzer
  - **Monitor**: News Digest, Market Trends, Website Tracker, Keyword Alerts, Brand Monitor, API Health, Security Dashboard, Trending Topics, KPI Tracker, SEO Rank
  - **Research**: AI Digest, Web Hub, Literature Review, Field Map, Dataset Finder, Fact Checker, Market Research, Report Generator, Paper Explainer, Gap Finder
  - **Create**: Blog Writer, Social Calendar, Video Script, Ad Copy, Email Sequence, Podcast Script, Brand Copywriter, Proposal Writer, Landing Page, Brand Story
  - **Analyze**: Data Insights, Trend Visualizer, Statistical Analysis, Document Parser, Sentiment Analysis, Pattern Finder, Report Generator, Business Insights, KPI Dashboard, Competitor Dashboard
- App card grid with emoji, name, and type label
- App detail overlay:
  - Gradient preview background
  - App title, type badge, description
  - Step-by-step usage guide
  - Tags display
  - Launch button: builds prompt and opens in Chat Hub

### 11. Research Feed / Discover New

- Two-column layout: research feed (left), research detail view (right, expandable)
- Research cards with date, title, and summary
- Category filter options
- Trending and newly released model highlights
- Curated updates from labs and research organizations
- Feed items route users back to chat/discovery experience

### 12. Dashboard and Usage Overview

- Active model panel in right sidebar of Chat Hub
- KPIs: request count, average latency, daily cost
- Sparkline usage trend chart
- Response quality percentage
- Average latency metric
- Token usage tracking
- Satisfaction rating with stars
- Post-deployment agent metrics dashboard

### 13. Localization

- Language selector dropdown in top navigation
- 15 supported languages: English, Arabic, French, German, Spanish, Portuguese, Chinese, Japanese, Korean, Hindi, Urdu, Turkish, Russian, Italian, Dutch
- UI text updates on language selection

### 14. Email Capture / Growth

- Weekly digest subscription CTA
- Messaging around release updates, pricing changes, comparisons, and prompt tips

---

## Functional Modules by Product Pattern

### Auth

- `Fully in scope`
- Login and Signup modal with complete form flows
- Social login: Google OAuth and GitHub OAuth — both fully functional
- Session management and persistent authentication state
- Sign-in and Get Started CTAs in navigation

### CRUD

- `Full scope`
- Create: register account, create agent, create task, create prompt, write test scenario, subscribe to digest
- Read: browse models, read research items, read pricing/reviews/guides, view agent details, view task list
- Update: edit prompt, edit task name inline, change language, adjust filters, configure agent steps, set model variant
- Delete: delete prompt, delete task, clear filters, remove agent

### Dashboard / Analytics

- `Fully present`
- Usage metrics, active model summary, latency, cost, token usage, satisfaction
- Post-deployment agent performance metrics
- Pass rate tracking in agent testing

### Search / Filter / Discovery

- `Core capability`
- Full-text model search, lab filter pills, sidebar faceted filters, category tabs, ACP suggested questions, use case app grid with category tabs

### Agent Management

- `Fully present`
- Complete agent lifecycle: create → configure → test → deploy → monitor
- Task management with per-task agent conversations
- Memory and tool tracking per agent session

### Voice Input

- `Fully present`
- Speech Recognition API, real-time transcription, silence detection, wave animation

### Recommendation Engine

- `Present at UX and logic level`
- Goal/audience/budget-aware model suggestions
- Personalized prompt generation from onboarding state

### Content / Feed Management

- `Read-oriented`
- Research/news feed visible; no admin publishing workflow in scope

### Admin / Back Office

- `Not in scope`

---

## High-Level User Stories in MoSCoW Priority

### Must Have

- As a new user, I want to register an account or sign in with Google or GitHub so that I can access the platform with minimal friction.
- As a new user, I want to answer a few guided onboarding questions so that I get personalized AI model recommendations without needing technical knowledge.
- As a user, I want to search and filter AI models by category, provider, pricing, rating, and license so that I can quickly narrow down the best options.
- As a user, I want to view detailed information about each model so that I can understand capabilities, pricing, context size, and suitable use cases.
- As a user, I want side-by-side model comparisons so that I can make informed decisions between alternatives.
- As a user, I want the Chat Hub to recommend models based on my goals so that I can discover relevant tools faster.
- As a user, I want prompt guidance for each model so that I can use the selected model effectively from the start.
- As a user, I want to create an AI agent using a 5-step wizard (Basics, Tools, Config, Test, Deploy) so that I can operationalize a model for a real workflow.
- As a user, I want to deploy my agent via API, embed widget, Slack bot, or WhatsApp so that I can integrate it into existing systems.
- As a user, I want to test my agent with predefined and custom scenarios so that I can validate it before deploying.
- As a user, I want to use voice input so that I can interact with the platform hands-free with real-time transcription.
- As a user, I want to manage tasks within the Agents view so that I can track work and maintain per-task conversations with my agent.
- As a user, I want to see usage metrics such as request count, latency, and cost so that I can understand operational performance.
- As a user, I want to browse 60+ use case apps across 6 categories so that I can launch common workflows instantly.

### Should Have

- As a user, I want model-specific agent creation guides so that I can configure tools, memory, and deployment with less guesswork.
- As a user, I want to edit, regenerate, or delete an auto-generated prompt so that I can refine the output before using it.
- As a user, I want to browse models by AI lab and by use case so that I can discover options from different angles.
- As a user, I want to view reviews and ratings so that I can assess model quality and trustworthiness.
- As a user, I want a research/news feed of model launches and papers so that I can stay current on the AI ecosystem.
- As a user, I want the interface available in my language so that I can navigate the product more comfortably.
- As a user, I want to see per-agent memory (short-term and long-term) and tool usage so that I can understand and monitor agent behavior.
- As a returning user, I want the system to preserve my current context or selected model so that I can continue exploring without restarting.
- As a user, I want benchmark scores (MMLU, HumanEval, MATH) in the model detail view so that I can evaluate model capability objectively.

### Could Have

- As a user, I want budget-oriented browsing paths so that I can find models within free, low-cost, mid-range, or premium tiers.
- As a user, I want curated quick-start journeys by task type so that I can jump into common use cases immediately.
- As a user, I want to subscribe to a weekly digest so that I can receive model updates, pricing changes, and prompt tips.
- As a user, I want richer trend signals and benchmark summaries so that I can understand what is gaining momentum.

### Won't Have for Now

- As an administrator, I want a back-office console to manage models, providers, reviews, and editorial content.
- As a provider, I want to submit or manage my own model listing.
- As a team owner, I want organization, billing, permissions, and role-based access control.
- As a user, I want persistent saved lists, favorites, or collections.

---

## Design System Reference

- **Typography**: Syne (headings), Instrument Sans (body)
- **Accent color**: #C8622A (orange)
- **Background**: #F4F2EE (primary), #ECEAE4 (secondary), #E4E1D8 (tertiary)
- **Text**: #1C1A16 (primary), #5A5750 (secondary), #9E9B93 (tertiary)
- **Additional colors**: Blue #1E4DA8, Teal #0A5E49, Amber #8A5A00, Rose #9B2042, Green #2E9E5B
- **Border radius**: 8px (sm), 12px (default), 20px (lg), 28px (xl)
- **Shadows**: Three levels — shadow, shadow-md, shadow-lg
- **Status badges**: NEW (teal), HOT (orange), OPEN SOURCE (blue), BETA (amber)
- **Responsive breakpoints**: Mobile-first; sidebar and right panel collapse at 768px

---

## Notes

- `NexusAI-Dashboard-Updated-15.html` is the authoritative design reference. All features in this document are derived from it and are expected to be fully functional.
- Auth (Google + GitHub OAuth) is fully in scope and must be implemented end-to-end.
- Voice input is a Must Have — Speech Recognition API integration is required.
- Task management is part of the Agents view and must support per-task agent conversations.
- Use case app grid (60+ apps, 6 categories) is fully in scope with detail overlays and launch-to-chat routing.
- Agent testing and deployment (API, Slack, WhatsApp, embed widget) are fully in scope.
- Agent memory tracking and tool display are required in the Agent Chat View.
 