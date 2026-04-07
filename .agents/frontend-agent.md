# Frontend Agent

## Mission

- Own the React and Tailwind user experience for NexusAI.
- Translate product requirements into responsive, accessible, typed UI.

## Stack

- React (functional components only)
- Tailwind CSS
- TypeScript

## Design System Tokens

- **Fonts**: Syne (headings), Instrument Sans (body)
- **Accent**: `#C8622A` (orange)
- **Backgrounds**: `#F4F2EE` (primary), `#ECEAE4` (secondary), `#E4E1D8` (tertiary)
- **Text**: `#1C1A16` (primary), `#5A5750` (secondary), `#9E9B93` (tertiary)
- **Colors**: Blue `#1E4DA8`, Teal `#0A5E49`, Amber `#8A5A00`, Rose `#9B2042`, Green `#2E9E5B`
- **Border radius**: 8px (sm), 12px (default), 20px (lg), 28px (xl)
- **Status badges**: NEW (teal), HOT (orange), OPEN SOURCE (blue), BETA (amber)
- **Responsive**: Mobile-first; sidebars collapse at 768px

## Screens and Components to Build

### Authentication
- Login/Signup modal: branded left panel + form panel, tab switcher, email/password fields, forgot password, Google OAuth button, GitHub OAuth button

### Hero Landing Page
- Animated hero with floating orb background
- Stats bar: 525+ AI Models, 82K Builders, 28 AI Labs, 4.8★
- Multi-modal search input: text, voice, file attachment (PDF/DOC/DOCX/TXT/CSV), image upload
- 14-button quick action grid
- Featured models section

### Guided Onboarding
- Full-screen overlay for first-time users
- 4-step card flow: Goal → Audience → Skill Level → Budget
- Emoji-labeled option buttons in 2-column grid per step
- Progress dots and skip button
- Hero card inline variant: Phase 1 (welcome + orbs) → Phase 2 (inline questions) → Phase 3 (building prompt animation)
- Live model count indicator (347 models)

### Chat Hub
- Left sidebar (252px): model list, search, active model highlight
- Central chat: user bubbles (dark, right-aligned, "U" avatar), AI bubbles (white, left-aligned, "✦" avatar), typing indicator, message metadata
- Auto-generated prompt card: display/edit mode toggle, Run/Edit/Save/Regenerate/Delete actions
- Inspiration chips (8 clickable suggestions)
- Model intro card: icon, name, org, status badge, description, rating/pricing/versions stats, View Details + Proceed buttons
- Variation selector card: radio list with name/tag/context/price/badge, Confirm button
- Variation detail card: overview, key specs, latest update, key benefits
- Objective wizard cards: Quality/Speed/Cost/Balanced, Context length, Tools/function calling
- Congratulations banner
- Category prompt panel: 7 tabs, 2-column quick prompt grid per tab
- Right sidebar (272px): Active Model Card, Usage Overview (requests/latency/cost + sparkline), Quick Actions in 3 collapsible sections (Navigation & Tools, Create & Generate, Analyze & Write)

### Voice Input
- Mic button with active pulsing state (hero, chat input, marketplace)
- Voice wave animation while recording
- Real-time transcription display
- Stop recording button

### AI Model Marketplace
- Search bar with voice, file, image upload
- Quick filter pills: All, Language, Vision, Code, Image Gen, Audio, Open Source
- AI Labs horizontal scrollable pill bar + active lab banner
- Sidebar filters (220px): Provider, Pricing Model, Price slider, Min Rating, License, Quick Guides, "Need help choosing?" CTA
- Responsive model card grid (minmax 290px): icon, name, org badge, status badge, description, category tags (color-coded), rating, pricing, View Details button
- Empty state component
- Comparison table: side-by-side columns for flagship models (context, pricing, multimodal, speed, use case)

### Model Detail Modal
- 6-tab navigation: Overview, How to Use, Pricing, Prompt Guide, Agent Creation, Reviews
- Overview: description, input/output capabilities, use cases grid, example prompt/output, benchmark scores (MMLU, HumanEval, MATH, Rating)
- How to Use: 5-step guide, Quick Start code snippet with copy button
- Pricing: 3 tier cards (Pay-per-use, Pro, Enterprise), feature checklists, free tier callout
- Prompt Guide: 4 principles with code boxes and copy buttons
- Agent Creation: embedded 6-step wizard
- Reviews: user reviews with name, role, star rating, text

### Agent Builder
- ACP panel: tab-based suggested questions (Use Cases, Build a Business, Help me Learn, Monitor, Research, Create Content, Analyze & Research)
- Agent Library: left inline sidebar, grid with tabs (All, Featured, Custom), 6 default agent cards, Build from Scratch card, New Agent button
- 5-step wizard:
  - Step 1 Basics: name, icon, purpose, system prompt editor
  - Step 2 Tools: tool catalog browser, selection grid, config drawer (right slide-out), tool count bar
  - Step 3 Config: advanced settings, memory setup
  - Step 4 Testing: 8 predefined scenarios, custom scenario input, checkbox selection, pass/fail verdicts, pass rate progress bar, overall verdict
  - Step 5 Deploy: API Endpoint, Embed Widget, Slack Bot, WhatsApp/SMS cards, deploy button, post-deploy metrics
- Back/Next navigation with step progress indicator

### Agent Chat View
- Per-agent chat interface: avatar, name header
- Agent profile card: description, use cases
- Short-term and long-term memory tracking display
- Tools list for active agent
- Metrics: message count, token usage
- Conversation history per session

### Task Management (within Agents View)
- Inline task list with create input, contenteditable name, checkbox toggle
- Context menu (three-dot): duplicate, delete (with animation)
- Task sections organized by project/agent
- Per-task conversation panel (show/hide on selection)
- Active task highlighting

### Use Case App Discovery
- 7-category grid tabs (Use Cases, Build a Business, Learn, Monitor, Research, Create, Analyze)
- App cards: emoji, name, type label
- App detail overlay: gradient preview, title, type badge, description, step-by-step guide, tags, Launch button

### Research Feed
- Two-column layout: feed list (left), detail view (right, expandable)
- Research cards: date, title, summary
- Category filter
- Trending/new model highlights

### Localization
- Language selector dropdown in top nav (15 languages)

### Email Capture
- Weekly digest subscription CTA component

## Working Rules

- Use functional components only
- Type props, state, hooks, API responses, and form models
- Keep components small and composable
- Extract shared UI patterns instead of duplicating markup
- Separate presentation from data-fetching and domain logic
- Favor accessible forms, semantic HTML, and responsive layouts
- Cover all states: loading, success, empty, error

## Inputs

- `requirements.md`
- `.claud.md` (design tokens, scope notes)
- Shared API contracts from Integration Agent

## Outputs

- Frontend pages and components
- Typed view models and prop interfaces
- Reusable Tailwind patterns
- UI integration notes for API dependencies

## Handoff Checklist

- UI matches requirement intent
- All states covered: loading, success, empty, error
- Types defined for all public interfaces
- Reusable logic extracted
- Integration assumptions documented for the Integration Agent
