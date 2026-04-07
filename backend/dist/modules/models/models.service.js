"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const model_schema_1 = require("./schemas/model.schema");
const review_schema_1 = require("./schemas/review.schema");
const MODEL_SEED_DATA = [
    {
        slug: "gpt-5",
        name: "GPT-5",
        provider: "OpenAI",
        category: "language",
        useCases: ["Agents", "Reasoning", "Writing"],
        tags: ["Flagship", "Multimodal", "Language"],
        description: "Flagship model for agent workflows, deep reasoning, and high quality writing.",
        pricePerMillion: "$7.50",
        averageRating: 4.9,
        contextWindow: 2000000,
        latencyMs: 950
    },
    {
        slug: "gpt-5-2",
        name: "GPT-5.2",
        provider: "OpenAI",
        category: "language",
        useCases: ["Instruction", "Chat", "Analysis"],
        tags: ["Balanced", "Multimodal", "Language"],
        description: "Balanced GPT-5 series model with strong instruction following and multimodal support.",
        pricePerMillion: "$4.00",
        averageRating: 4.8,
        contextWindow: 1000000,
        latencyMs: 780
    },
    {
        slug: "gpt-4o",
        name: "GPT-4o",
        provider: "OpenAI",
        category: "vision",
        useCases: ["Vision", "Audio", "Chat"],
        tags: ["Vision", "Audio", "Coding"],
        description: "Multimodal model for real-time text, image, and audio understanding.",
        pricePerMillion: "$2.50",
        averageRating: 4.7,
        contextWindow: 128000,
        latencyMs: 620
    },
    {
        slug: "claude-opus-4-5",
        name: "Claude Opus 4.5",
        provider: "Anthropic",
        category: "language",
        useCases: ["Long-form", "Research", "Analysis"],
        tags: ["Creative", "Long-context", "Reasoning"],
        description: "High-end model for long-context reasoning, analysis, and premium writing quality.",
        pricePerMillion: "$15.00",
        averageRating: 4.8,
        contextWindow: 1000000,
        latencyMs: 1200
    },
    {
        slug: "claude-sonnet-4-5",
        name: "Claude Sonnet 4.5",
        provider: "Anthropic",
        category: "language",
        useCases: ["Coding", "Chat", "Documents"],
        tags: ["Fast", "Reasoning", "Language"],
        description: "Fast general-purpose model with strong coding help and document understanding.",
        pricePerMillion: "$3.20",
        averageRating: 4.7,
        contextWindow: 200000,
        latencyMs: 640
    },
    {
        slug: "gemini-1-5-pro",
        name: "Gemini 1.5 Pro",
        provider: "Google DeepMind",
        category: "vision",
        useCases: ["Video", "Documents", "Research"],
        tags: ["Vision", "Long-context", "Multimodal"],
        description: "Large-context multimodal model suited for documents, vision, and long session memory.",
        pricePerMillion: "$3.50",
        averageRating: 4.6,
        contextWindow: 1000000,
        latencyMs: 710
    },
    {
        slug: "llama-3-1-405b",
        name: "Llama 3.1 405B",
        provider: "Meta",
        category: "open-source",
        useCases: ["Open Source", "Reasoning", "Chat"],
        tags: ["Open Source", "Reasoning", "Language"],
        description: "Large open-source frontier model for advanced reasoning and customizable deployments.",
        pricePerMillion: "$0.00",
        averageRating: 4.5,
        contextWindow: 128000,
        latencyMs: 880
    },
    {
        slug: "deepseek-v3",
        name: "DeepSeek V3",
        provider: "DeepSeek",
        category: "code",
        useCases: ["Coding", "Math", "Chat"],
        tags: ["Code", "Efficient", "STEM"],
        description: "Cost-efficient model with strong coding and mathematical reasoning performance.",
        pricePerMillion: "$1.10",
        averageRating: 4.6,
        contextWindow: 128000,
        latencyMs: 540
    },
    {
        slug: "mistral-large",
        name: "Mistral Large",
        provider: "Mistral AI",
        category: "language",
        useCases: ["Enterprise", "Agents", "Writing"],
        tags: ["Enterprise", "Language", "Agents"],
        description: "Enterprise-ready model optimized for assistants, knowledge tasks, and workflow agents.",
        pricePerMillion: "$8.00",
        averageRating: 4.5,
        contextWindow: 128000,
        latencyMs: 690
    },
    {
        slug: "command-r-plus",
        name: "Command R+",
        provider: "Cohere",
        category: "language",
        useCases: ["RAG", "Search", "Business"],
        tags: ["RAG", "Enterprise", "Language"],
        description: "Retrieval-focused enterprise model designed for grounded responses over business data.",
        pricePerMillion: "$2.85",
        averageRating: 4.4,
        contextWindow: 128000,
        latencyMs: 610
    }
];
let ModelsService = class ModelsService {
    constructor(modelStore, reviewStore) {
        this.modelStore = modelStore;
        this.reviewStore = reviewStore;
    }
    async getModelSource() {
        await this.ensureSeedData();
        const records = await this.modelStore.find().lean().exec();
        return records.map((model) => ({
            id: model.slug,
            name: model.name,
            provider: model.provider,
            category: model.category,
            useCases: model.useCases ?? [],
            tags: model.tags ?? [],
            description: model.description,
            pricePerMillion: model.pricePerMillion,
            averageRating: model.averageRating,
            contextWindow: model.contextWindow,
            latencyMs: model.latencyMs,
            badge: model.averageRating >= 4.8 ? "Hot" : undefined,
            priceModel: this.inferPriceModel(model.pricePerMillion),
            isOpenSource: (model.tags ?? []).some((tag) => tag.toLowerCase().includes("open"))
        }));
    }
    async ensureSeedData() {
        const existingCount = await this.modelStore.countDocuments().exec();
        if (existingCount > 0) {
            return;
        }
        await this.modelStore.insertMany(MODEL_SEED_DATA);
    }
    async getReviewSource() {
        return this.reviewStore.find().lean().exec();
    }
    inferPriceModel(pricePerMillion) {
        const numeric = Number.parseFloat(pricePerMillion.replace(/[^0-9.]/g, ""));
        if (!Number.isFinite(numeric) || numeric === 0) {
            return "free-tier";
        }
        if (numeric <= 3) {
            return "pay-per-use";
        }
        if (numeric <= 8) {
            return "subscription";
        }
        return "enterprise";
    }
    modelDetailTabs() {
        return [
            { id: "overview", label: "Overview" },
            { id: "howToUse", label: "How to Use" },
            { id: "pricing", label: "Pricing" },
            { id: "promptGuide", label: "Prompt Guide" },
            { id: "agentCreation", label: "Agent Creation" },
            { id: "reviews", label: "Reviews" }
        ];
    }
    getUseCaseIcon(useCase) {
        const normalized = useCase.toLowerCase();
        if (normalized.includes("agent"))
            return "🤖";
        if (normalized.includes("reason"))
            return "🧠";
        if (normalized.includes("writ"))
            return "✍️";
        if (normalized.includes("vision"))
            return "🖼️";
        if (normalized.includes("audio"))
            return "🎧";
        if (normalized.includes("chat"))
            return "💬";
        if (normalized.includes("analysis"))
            return "📊";
        if (normalized.includes("research"))
            return "🔎";
        if (normalized.includes("coding") || normalized.includes("code"))
            return "💻";
        if (normalized.includes("document"))
            return "📄";
        if (normalized.includes("video"))
            return "🎬";
        if (normalized.includes("business"))
            return "💼";
        if (normalized.includes("math"))
            return "📐";
        if (normalized.includes("search"))
            return "🌐";
        if (normalized.includes("open source"))
            return "🧩";
        return "✨";
    }
    matchesQuery(model, query) {
        if (query.provider && model.provider !== query.provider) {
            return false;
        }
        if (query.category && model.category !== query.category) {
            return false;
        }
        if (query.useCase && !model.useCases.some((item) => item.toLowerCase() === query.useCase?.toLowerCase())) {
            return false;
        }
        if (query.priceModel && model.priceModel !== query.priceModel) {
            return false;
        }
        if (query.tag && !model.tags.some((item) => item.toLowerCase() === query.tag?.toLowerCase())) {
            return false;
        }
        if (query.openSource === "true" && !model.isOpenSource) {
            return false;
        }
        if (query.minRating && model.averageRating < Number.parseFloat(query.minRating)) {
            return false;
        }
        if (query.maxPrice) {
            const numeric = Number.parseFloat(model.pricePerMillion.replace(/[^0-9.]/g, ""));
            if (Number.isFinite(numeric) && numeric > Number.parseFloat(query.maxPrice)) {
                return false;
            }
        }
        if (query.search) {
            const haystack = [
                model.name,
                model.provider,
                model.category,
                model.description,
                ...model.tags,
                ...model.useCases
            ]
                .join(" ")
                .toLowerCase();
            if (!haystack.includes(query.search.toLowerCase())) {
                return false;
            }
        }
        return true;
    }
    async findAll(query) {
        const models = await this.getModelSource();
        return models.filter((model) => this.matchesQuery(model, query));
    }
    async featured() {
        const models = await this.getModelSource();
        return models
            .slice()
            .sort((left, right) => right.averageRating - left.averageRating)
            .slice(0, 6);
    }
    async providers() {
        const models = await this.getModelSource();
        return Array.from(new Set(models.map((model) => model.provider)));
    }
    async filters() {
        const models = await this.getModelSource();
        return {
            providers: Array.from(new Set(models.map((model) => model.provider))),
            categories: Array.from(new Set(models.map((model) => model.category))),
            tags: Array.from(new Set(models.flatMap((model) => model.tags))),
            useCases: Array.from(new Set(models.flatMap((model) => model.useCases))),
            priceModels: Array.from(new Set(models.map((model) => model.priceModel))),
            maxPrice: Math.max(...models.map((model) => Number.parseFloat(model.pricePerMillion.replace(/[^0-9.]/g, "")) || 0))
        };
    }
    async findOne(id) {
        const models = await this.getModelSource();
        const selectedModel = models.find((model) => model.id === id);
        if (!selectedModel) {
            throw new common_1.NotFoundException(`Model ${id} not found`);
        }
        const numericPrice = Number.parseFloat(selectedModel.pricePerMillion.replace(/[^0-9.]/g, "")) || 0;
        const outputPrice = numericPrice === 0 ? "$0.00 / 1M" : `$${(numericPrice * 1.35).toFixed(2)} / 1M`;
        return {
            ...selectedModel,
            subtitle: `by ${selectedModel.provider} · ${selectedModel.category} model`,
            tabs: this.modelDetailTabs(),
            overview: {
                description: selectedModel.description,
                input: selectedModel.category === "vision"
                    ? "Text, images, audio, PDFs, video"
                    : selectedModel.category === "code"
                        ? "Text, codebases, files, diagrams"
                        : "Text, documents, spreadsheets, images",
                output: selectedModel.category === "code"
                    ? "Code, text, plans, structured JSON"
                    : "Text, code, summaries, structured data",
                context: `${selectedModel.contextWindow.toLocaleString()} tokens`,
                maxOutput: selectedModel.contextWindow >= 1000000 ? "32,768 tokens" : "8,192 tokens",
                latency: `~${(selectedModel.latencyMs / 1000).toFixed(1)}s avg`,
                useCases: selectedModel.useCases.map((useCase) => ({
                    id: useCase.toLowerCase().replace(/\s+/g, "-"),
                    label: useCase,
                    icon: this.getUseCaseIcon(useCase)
                })),
                examplePrompt: `Help me use ${selectedModel.name} for a ${selectedModel.useCases[0] ?? "high-value"} workflow and show the best setup.`,
                exampleResponse: [
                    `${selectedModel.name} is a strong fit when you need ${selectedModel.useCases.join(", ").toLowerCase()}.`,
                    `Start with a narrow prompt, clear success criteria, and a real sample input from your workflow.`,
                    `Measure quality, latency, and cost together before rolling it into production.`
                ],
                followUps: [
                    `What is the best prompt structure for ${selectedModel.name}?`,
                    `Should I use ${selectedModel.name} in chat, API, or agent workflows?`
                ],
                benchmarks: [
                    { id: "mmlu", label: "MMLU", value: "87.2" },
                    { id: "human-eval", label: "HumanEval", value: "90.2" },
                    { id: "math", label: "MATH", value: "76.6" },
                    {
                        id: "rating",
                        label: "Rating",
                        value: selectedModel.averageRating.toFixed(1)
                    }
                ]
            },
            howToUse: {
                summary: `${selectedModel.name} works best when prompts are goal-first, grounded in real context, and tested on representative tasks.`,
                steps: [
                    `Define the exact outcome you want from ${selectedModel.name}.`,
                    "Provide task context, constraints, and any reference material up front.",
                    "Run 3-5 realistic examples before using it in a live workflow.",
                    "Track response quality, latency, and cost together."
                ],
                checklist: [
                    "Use one clear task per prompt",
                    "Add examples when output format matters",
                    "Ask for structured output when integrating with tools",
                    "Review safety, compliance, and hallucination risk"
                ]
            },
            pricing: {
                input: `${selectedModel.pricePerMillion} / 1M`,
                output: outputPrice,
                billing: `${this.inferPriceModel(selectedModel.pricePerMillion)} billing`,
                enterprise: numericPrice >= 8
                    ? "Best for premium or enterprise-grade workloads"
                    : "Good for production pilots and scalable app workflows",
                notes: [
                    "Input cost is best for prompt-side planning and retrieval context.",
                    "Output cost matters most for long answers, reports, or generated content.",
                    "Production teams should compare quality per dollar, not token price alone."
                ]
            },
            promptGuide: {
                summary: `Prompt ${selectedModel.name} with a role, desired outcome, constraints, and output format in one place.`,
                tips: [
                    "State the role or expertise you want the model to assume.",
                    "Describe the output format before the task details.",
                    "Include constraints like tone, length, and forbidden content.",
                    "Ask the model to explain tradeoffs when quality matters."
                ],
                starterPrompt: `You are an expert ${selectedModel.category} assistant. Help me with [task]. Use this context: [context]. Deliver the result as [format]. Keep these constraints in mind: [constraints].`,
                examples: [
                    `Turn ${selectedModel.name} into a reviewer: critique this draft and suggest the top 3 improvements.`,
                    `Use ${selectedModel.name} as a planner: break this goal into milestones, risks, and next steps.`,
                    `Use ${selectedModel.name} as an analyst: summarize the file and extract decisions, blockers, and owners.`
                ]
            },
            agentCreation: {
                summary: `${selectedModel.name} can be used as the reasoning engine inside agents that coordinate prompts, tools, files, and decision steps.`,
                steps: [
                    "Choose the agent goal and define what success looks like.",
                    "Add the minimum tools the agent needs, such as search, files, or APIs.",
                    `Use ${selectedModel.name} for planning, reasoning, and response generation.`,
                    "Test with real edge cases before deployment."
                ],
                recommendedTools: [
                    "Knowledge base or document retrieval",
                    "Task memory and conversation history",
                    "Structured output schemas",
                    "Monitoring for latency, cost, and quality"
                ],
                deploymentNotes: [
                    "Start with one workflow before expanding to multi-step automation.",
                    "Keep approval checkpoints for expensive or high-risk actions.",
                    "Store successful prompts and failure examples for iteration."
                ]
            }
        };
    }
    async reviews(id) {
        const reviews = await this.getReviewSource();
        return reviews.filter((review) => review.modelId === id);
    }
    async compare(payload) {
        return Promise.all(payload.modelIds.map((id) => this.findOne(id)));
    }
};
exports.ModelsService = ModelsService;
exports.ModelsService = ModelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(model_schema_1.Model.name)),
    __param(1, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ModelsService);
//# sourceMappingURL=models.service.js.map