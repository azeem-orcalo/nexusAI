"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscoverService = void 0;
const common_1 = require("@nestjs/common");
let DiscoverService = class DiscoverService {
    constructor() {
        this.homeWorkflowCategories = [
            {
                id: "recruiting",
                label: "Recruiting",
                icon: "<>",
                suggestions: [
                    "Monitor job postings at target companies",
                    "Benchmark salary for a specific role",
                    "Build a hiring pipeline tracker",
                    "Research a candidate before an interview",
                    "Build an interactive talent market map"
                ]
            },
            {
                id: "prototype",
                label: "Create a prototype",
                icon: "</>",
                suggestions: [
                    "Create a landing page wireframe",
                    "Draft product copy for a new feature",
                    "Generate a clickable app flow",
                    "Build a waitlist page concept",
                    "Outline MVP screens and states"
                ]
            },
            {
                id: "business",
                label: "Build a business",
                icon: "[]",
                suggestions: [
                    "Create a 30-day GTM plan",
                    "Build a pricing comparison sheet",
                    "Draft a founder pitch outline",
                    "Estimate CAC and retention assumptions",
                    "Summarize competitors and positioning"
                ]
            },
            {
                id: "learn",
                label: "Help me learn",
                icon: "||",
                suggestions: [
                    "Explain AI agents in simple words",
                    "Create a learning roadmap for React",
                    "Teach me prompt engineering basics",
                    "Summarize this topic as flashcards",
                    "Turn notes into a study plan"
                ]
            },
            {
                id: "research",
                label: "Research",
                icon: "o",
                suggestions: [
                    "Compare the best AI models for coding",
                    "Find models for voice-based assistants",
                    "Research new multimodal releases",
                    "Summarize current model tradeoffs",
                    "Build a shortlist by budget and latency"
                ]
            }
        ];
        this.homeUseCaseItems = [
            {
                id: "code-generation",
                title: "Code Generation",
                description: "Claude Opus 4.6, Devstral 2, GPT-5.4, Qwen3-Coder",
                providers: ["Claude Opus 4.6", "Devstral 2", "GPT-5.4", "Qwen3-Coder"],
                actionLabel: "Start building",
                prompt: "Help me build a production-ready code generation workflow for my app.",
                icon: "💻"
            },
            {
                id: "image-generation",
                title: "Image Generation",
                description: "gpt-image-1.5, Grok-Imagine-Pro, Gemini Flash Image",
                providers: ["gpt-image-1.5", "Grok-Imagine-Pro", "Gemini Flash Image"],
                actionLabel: "Create images",
                prompt: "I want to generate product-quality images. Which model and workflow should I use?",
                icon: "🎨"
            },
            {
                id: "ai-agents",
                title: "AI Agents",
                description: "GPT-5.4, Claude Opus 4.6, kimi-k2.5, Grok-4-1",
                providers: ["GPT-5.4", "Claude Opus 4.6", "kimi-k2.5", "Grok-4-1"],
                actionLabel: "Build agents",
                prompt: "Help me design and launch an AI agent for my business workflow.",
                icon: "🤖"
            },
            {
                id: "document-analysis",
                title: "Document Analysis",
                description: "Claude Sonnet 4.6, Gemini 3.1 Pro, Nemotron Ultra",
                providers: ["Claude Sonnet 4.6", "Gemini 3.1 Pro", "Nemotron Ultra"],
                actionLabel: "Analyse docs",
                prompt: "I need to analyze documents and extract the key information step by step.",
                icon: "📄"
            },
            {
                id: "video-generation",
                title: "Video Generation",
                description: "Sora 2 Pro, Veo 3.1, Grok-Imagine-Video",
                providers: ["Sora 2 Pro", "Veo 3.1", "Grok-Imagine-Video"],
                actionLabel: "Create video",
                prompt: "Help me create an AI video generation workflow from prompt to export.",
                icon: "🎬"
            },
            {
                id: "voice-audio",
                title: "Voice & Audio",
                description: "Gemini-TTS, ElevenLabs, Whisper v3",
                providers: ["Gemini-TTS", "ElevenLabs", "Whisper v3"],
                actionLabel: "Add voice",
                prompt: "I want to add voice, transcription, and audio generation to my product.",
                icon: "🔊"
            },
            {
                id: "multilingual",
                title: "Multilingual / Translation",
                description: "Qwen3-Max, Gemini 3.1 Flash-Lite, GLM-4.7",
                providers: ["Qwen3-Max", "Gemini 3.1 Flash-Lite", "GLM-4.7"],
                actionLabel: "Go multilingual",
                prompt: "Help me choose the best multilingual AI workflow for translation and localization.",
                icon: "🌍"
            },
            {
                id: "math-research",
                title: "Math & Research",
                description: "DeepSeek-R1, QwQ-32B, Gemini 3.1 Pro",
                providers: ["DeepSeek-R1", "QwQ-32B", "Gemini 3.1 Pro"],
                actionLabel: "Start researching",
                prompt: "I need a strong research and math reasoning setup. What should I use?",
                icon: "🔢"
            }
        ];
        this.researchFeedItems = [
            {
                id: "res_001",
                title: "Gemini 2.5 Pro achieves new SOTA on reasoning benchmarks",
                summary: "Scores 83.2% on AIME 2025 math competition, outperforming prior reasoning-focused systems.",
                provider: "Google DeepMind",
                category: "Reasoning",
                publishedAt: "2026-03-26",
                overview: "Google DeepMind's Gemini 2.5 Pro set a new state-of-the-art across multiple reasoning benchmarks. The paper highlights stronger iterative thought refinement, better long-context reasoning, and improved math performance on multi-step tasks.",
                metrics: [
                    { label: "AIME 2025 score", value: "83.2%" },
                    { label: "vs prior SOTA", value: "+6.4%" },
                    { label: "Context window", value: "5M ctx" }
                ],
                findings: [
                    "New iterative thought refinement improves backtracking on multi-step math tasks.",
                    "Top-tier performance across MATH, HumanEval, and MMLU-style reasoning evaluations.",
                    "Larger gains appear on prompts that require 10 or more reasoning steps.",
                    "Long-context performance remained stable while chain-of-thought depth increased."
                ],
                modelsReferenced: ["Gemini 2.5 Pro", "GPT-5", "Claude Opus 4.6", "o3"]
            },
            {
                id: "res_002",
                title: "Scaling laws for multimodal models show new empirical findings",
                summary: "Research reveals unexpected scaling dynamics when combining vision and language-heavy training.",
                provider: "MIT CSAIL",
                category: "Multimodal",
                publishedAt: "2026-03-22",
                overview: "A new multimodal scaling study suggests balanced vision-language curricula outperform pure token scaling after a certain threshold. The authors also report more robust transfer to grounded reasoning tasks.",
                metrics: [
                    { label: "Transfer gain", value: "+18%" },
                    { label: "Data efficiency", value: "1.6x" },
                    { label: "Benchmarks", value: "12 suites" }
                ],
                findings: [
                    "Balanced image-text sampling improves downstream transfer over text-only scaling.",
                    "Grounded benchmarks benefit more than generic captioning tasks.",
                    "Synthetic visual instruction data becomes less useful after medium-scale training.",
                    "Alignment quality drops when vision tokens dominate late-stage training."
                ],
                modelsReferenced: ["GPT-4o", "Gemini 2.5 Flash", "Claude Sonnet 4.6"]
            },
            {
                id: "res_003",
                title: "Constitutional AI v2 improves alignment through iterative refinement",
                summary: "A new methodology reduces harmful outputs while preserving task performance on broad eval sets.",
                provider: "Anthropic",
                category: "Alignment",
                publishedAt: "2026-03-18",
                overview: "Anthropic's updated alignment process layers self-critique, policy rehearsal, and refusal calibration to reduce harmful outputs without shrinking model usefulness on common enterprise tasks.",
                metrics: [
                    { label: "Harm reduction", value: "-40%" },
                    { label: "Task retention", value: "96%" },
                    { label: "Policy rounds", value: "8" }
                ],
                findings: [
                    "Refusal quality improved most on ambiguous jailbreak-style prompts.",
                    "Benign customer-support and writing tasks retained high completion rates.",
                    "Iterative refinement cut over-refusal compared to previous policy tuning.",
                    "The strongest gains came from targeted edge-case rehearsal."
                ],
                modelsReferenced: ["Claude Opus 4.6", "Claude Sonnet 4.6"]
            },
            {
                id: "res_004",
                title: "Llama 4 Scout and Maverick launch with native multimodal grounding",
                summary: "Meta introduces new open-weight systems with stronger image-text grounding and tool-use hooks.",
                provider: "Meta AI",
                category: "Open Weights",
                publishedAt: "2026-03-15",
                overview: "Meta's latest open-weight release focuses on native multimodal understanding, broader context support, and easier tool orchestration for agent builders who need self-hostable systems.",
                metrics: [
                    { label: "Training tokens", value: "17T" },
                    { label: "Context window", value: "1M" },
                    { label: "Tool latency", value: "-22%" }
                ],
                findings: [
                    "Grounded understanding improved across chart, diagram, and screenshot tasks.",
                    "Tool-call planning is more stable in longer agent loops.",
                    "Open-weight deployment remains a strong advantage for regulated environments.",
                    "Cost-efficiency looks especially competitive for multimodal assistants."
                ],
                modelsReferenced: ["Llama 4 Scout", "Llama 4 Maverick", "DeepSeek-VL"]
            },
            {
                id: "res_005",
                title: "Long-context recall benchmark highlights degradation beyond 1M tokens",
                summary: "New evaluation compares retrieval accuracy at extreme context windows across frontier labs.",
                provider: "Stanford NLP",
                category: "Efficiency",
                publishedAt: "2026-03-10",
                overview: "A long-context benchmark from Stanford NLP compares retrieval fidelity, citation precision, and reasoning consistency past the one-million-token mark. Most models showed uneven recall at the far end of the window.",
                metrics: [
                    { label: "Max eval length", value: "1.2M" },
                    { label: "Recall drop", value: "-14%" },
                    { label: "Labs compared", value: "7" }
                ],
                findings: [
                    "Most systems retrieve middle-window facts more reliably than tail-window facts.",
                    "Citation precision drops before raw recall begins to degrade.",
                    "Chunked retrieval pipelines still outperform brute-force context stuffing.",
                    "Reasoning quality weakens faster than exact lookup in very large contexts."
                ],
                modelsReferenced: ["GPT-5", "Gemini 2.5 Pro", "Claude Opus 4.6", "o4-mini"]
            },
            {
                id: "res_006",
                title: "DeepSeek open-weight update narrows cost gap for reasoning workloads",
                summary: "The latest release focuses on lower inference cost while preserving competitive benchmark quality.",
                provider: "DeepSeek",
                category: "Open Weights",
                publishedAt: "2026-03-05",
                overview: "DeepSeek's latest open-weight update reduces inference overhead and improves structured reasoning stability. The result is a more attractive profile for teams optimizing self-hosted copilots and internal research assistants.",
                metrics: [
                    { label: "Cost delta", value: "-31%" },
                    { label: "Reasoning gain", value: "+7%" },
                    { label: "Deployment modes", value: "4" }
                ],
                findings: [
                    "Inference cost dropped sharply in long-chain reasoning traces.",
                    "Structured outputs became more consistent under schema constraints.",
                    "Self-hosted teams gain better price-performance without large quality loss.",
                    "Latency remains slightly behind top proprietary labs on tool-heavy tasks."
                ],
                modelsReferenced: ["DeepSeek R2", "DeepSeek VLM", "Qwen 3"]
            }
        ];
    }
    onboarding() {
        return {
            steps: [
                "Select your goal",
                "Choose a budget or use case",
                "Review recommended models"
            ]
        };
    }
    recommend(payload) {
        return {
            goal: payload.goal,
            recommendations: [
                { modelId: "gpt-5", reason: "Best for complex agent reasoning" },
                { modelId: "gpt-4o", reason: "Strong multimodal balance" }
            ]
        };
    }
    quickActions() {
        return [
            "Create image",
            "Generate audio",
            "Create slides",
            "Analyze data",
            "Code generation"
        ];
    }
    homeWorkflows() {
        return {
            categories: this.homeWorkflowCategories
        };
    }
    homeUseCases() {
        return {
            title: "Quick-Start by Use Case",
            subtitle: "Popular ways teams get started with NexusAI.",
            items: this.homeUseCaseItems
        };
    }
    researchFeed(query) {
        if (!query?.category || query.category === "All") {
            return this.researchFeedItems;
        }
        return this.researchFeedItems.filter((item) => item.category?.toLowerCase() === query.category?.toLowerCase());
    }
    researchFeedFilters() {
        return {
            categories: Array.from(new Set(this.researchFeedItems
                .map((item) => item.category)
                .filter((category) => Boolean(category))))
        };
    }
};
exports.DiscoverService = DiscoverService;
exports.DiscoverService = DiscoverService = __decorate([
    (0, common_1.Injectable)()
], DiscoverService);
//# sourceMappingURL=discover.service.js.map