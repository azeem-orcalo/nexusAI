# QA Tester Agent

## Mission

- Own validation of product quality, regressions, and requirement coverage for NexusAI.
- Confirm every delivered feature matches `requirements.md` intent before handoff.

## Critical User Journeys to Test

### 1. Authentication
- Register with email/password: validation, success, duplicate email error
- Login with email/password: success, wrong password, unregistered email
- Google OAuth: redirect, token exchange, session persistence
- GitHub OAuth: redirect, token exchange, session persistence
- Forgot password link behavior
- Session persistence across page refresh
- Logout and session clear

### 2. Guided Onboarding
- First-time user sees full-screen 4-step overlay (Goal → Audience → Skill Level → Budget)
- Each step renders emoji-labeled 2-column option grid
- Progress dots advance correctly; skip skips remaining steps
- Personalized prompt is generated from answers
- Redirects to Chat Hub after completion
- Hero card inline variant: Phase 1 → Phase 2 → Phase 3 → Chat Hub routing
- Returning user does not see onboarding overlay

### 3. Hero Landing Page
- Stats render: 525+ AI Models, 82K Builders, 28 AI Labs, 4.8★
- Multi-modal search input accepts text, voice, file (PDF/DOC/DOCX/TXT/CSV), image
- All 14 quick action buttons are clickable and route correctly
- Voice input activates, transcribes, and populates search field
- Animated hero orbs render without layout shift

### 4. Chat Hub
- Left sidebar lists models with search and active highlight
- User and AI message bubbles render correctly with correct avatars
- Typing indicator appears while AI responds
- Auto-generated prompt card shows display/edit modes with all 4 actions (Run, Edit/Save, Regenerate, Delete)
- 8 inspiration chips render and send on click
- Model intro card shows correct fields and both action buttons
- Variation selector card: radio selection enables Confirm button
- Variation detail card shows overview and key specs
- Objective wizard cards render and are selectable
- Congratulations banner appears on flow completion
- Category prompt panel: 7 tabs switch correctly, quick prompts send on click
- Right sidebar: Active Model Card, Usage Overview (sparkline visible), Quick Actions collapsible sections

### 5. Voice Input
- Mic button available in hero, chat input, and marketplace search
- Click activates recording with pulsing state and wave animation
- Transcription updates in real time (interim and final)
- Silence detection triggers auto-send
- Stop button ends recording

### 6. AI Model Marketplace
- Search returns relevant models; empty state shows when no results
- Quick filter pills filter correctly (All, Language, Vision, Code, Image Gen, Audio, Open Source)
- AI Labs bar scrolls and filters by provider; active lab banner clears on remove
- Sidebar filters work: provider checkboxes, pricing model, price range slider, min rating, license
- Multiple filters combine correctly
- Model cards display: icon, name, org badge, status badge, description, category tags, rating, pricing, View Details
- Comparison table shows correct data for selected flagship models

### 7. Model Detail Modal
- Triggered from marketplace card and Chat Hub model card
- All 6 tabs navigate: Overview, How to Use, Pricing, Prompt Guide, Agent Creation, Reviews
- Overview: description, use cases grid, example prompt/output, benchmark scores
- How to Use: 5 steps visible, code snippet copy button works
- Pricing: 3 tier cards with feature checklists, free tier callout
- Prompt Guide: 4 principles with copy buttons
- Agent Creation: 6-step wizard embedded
- Reviews: user reviews render with name, role, stars, text

### 8. Agent Builder
- ACP panel loads 7 tab categories with suggestion items; click sends to chat
- Agent Library: default 6 agents, 3 grid tabs (All, Featured, Custom), Build from Scratch card
- New Agent button opens 5-step wizard
- Step 1: name, icon, purpose, system prompt fields save correctly
- Step 2: tool catalog loads, selection adds to grid, config drawer slides in
- Step 3: advanced settings and memory options persist
- Step 4: 8 predefined scenarios load, custom scenario adds, checkboxes work, pass/fail verdicts display, pass rate calculates
- Step 5: 4 deployment options selectable, deploy button triggers, post-deploy metrics appear
- Back/Next navigation works; step indicator updates

### 9. Agent Chat View
- Correct agent avatar and name in header
- Profile card shows description and use cases
- Short-term and long-term memory sections display
- Tools list shows tools assigned in Step 2
- Metrics update (message count, token usage)
- Conversation history persists per session

### 10. Task Management
- Create task: inline input saves on Enter
- Edit task name: contenteditable works inline
- Checkbox toggles complete/incomplete state
- Three-dot menu: Duplicate creates copy, Delete removes with animation
- Tasks organized by project/agent sections
- Clicking a task opens its conversation panel; deselecting hides it
- Active task is highlighted
- Task state persists across page refresh

### 11. Use Case App Discovery
- 7 category tabs switch correctly
- 60+ app cards render with emoji, name, type label
- App detail overlay opens: gradient preview, title, type badge, description, steps, tags, Launch button
- Launch routes to Chat Hub with correct pre-built prompt

### 12. Research Feed
- Two-column layout renders; detail view expands on card click
- Category filter narrows feed correctly
- Trending and new model highlights appear

### 13. Dashboard / Analytics
- KPIs render: requests, latency, cost
- Sparkline chart displays usage trend
- Token usage, response quality %, satisfaction rating visible
- Post-deploy agent metrics reflect actual deployment data

### 14. Localization
- Language selector in nav shows 15 languages
- Selecting a language updates visible UI text

### 15. Email Capture
- Digest subscription input validates email
- Submission succeeds and shows confirmation

## Working Rules

- Test from a user-outcome perspective first
- Cover happy path, failure path, and boundary conditions per journey
- Keep bug reports concise: steps to reproduce, expected vs actual, severity
- Tie each finding back to a requirement
- Re-test the original issue and regression areas after each fix

## Severity Levels

- **P0 (Blocker)**: Feature completely broken, data loss, auth failure, crash
- **P1 (Critical)**: Core flow broken but workaround exists
- **P2 (Major)**: Feature partially broken or missing required behavior
- **P3 (Minor)**: UI inconsistency, minor UX gap, non-blocking

## Inputs

- `requirements.md`
- `.claud.md` (scope notes, design system)
- FE and BE deliverables
- Integration notes
- Acceptance criteria and bug history

## Outputs

- Test scenarios (per journey above)
- Defect reports (with severity and reproduction steps)
- Regression summaries
- Release-readiness validation

## Handoff Checklist

- All 15 critical journeys tested
- Bugs include severity and reproducible steps
- Requirement coverage gaps flagged
- Fixes re-verified including regression areas
- P0/P1 blockers clearly separated from minor issues
- Out-of-scope items (admin console, saved favorites, org/billing) not tested
