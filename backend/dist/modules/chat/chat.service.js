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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const model_schema_1 = require("../models/schemas/model.schema");
const chat_conversation_schema_1 = require("./schemas/chat-conversation.schema");
const RESPONSE_MAP = [
    {
        keywords: ["image", "photo", "picture", "art", "design", "create image", "generate image"],
        data: {
            reply: `Sure! Here's how to generate images using AI:\n\n**Best models for image generation:**\n- **DALL·E 3** (OpenAI) — photorealistic, great for detailed prompts\n- **Stable Diffusion XL** — open-source, highly customizable\n- **Midjourney** — artistic style, excellent for creative work\n\n**Prompt tips:**\n1. Be specific about style (realistic, cartoon, oil painting)\n2. Mention lighting, angle, and mood\n3. Add negative prompts to exclude unwanted elements\n\n**Example prompt:** *"A futuristic city skyline at sunset, cinematic lighting, 4K, ultra detailed"*\n\nWould you like help crafting a specific image prompt?`,
            suggestedPrompts: [
                "Help me write a better image prompt",
                "Which model is best for product photography?",
                "Show me prompt examples for logo design"
            ]
        }
    },
    {
        keywords: ["code", "programming", "function", "api", "backend", "frontend", "develop", "bug", "error", "debug"],
        data: {
            reply: `I can help with coding! Here's what I can do:\n\n**Code assistance:**\n- Write functions, classes, or full modules\n- Debug and fix errors in your code\n- Review and optimize existing code\n- Generate API endpoints and schemas\n\n**Best models for coding:**\n- **Claude Sonnet 4.6** — excellent reasoning, great for complex logic\n- **GPT-4.1** — strong code generation and debugging\n- **o3** — best for algorithmic problem solving\n\n**Tips for better results:**\n1. Share the language and framework you're using\n2. Paste the error message if debugging\n3. Describe the expected vs actual behavior\n\nWhat language or framework are you working with?`,
            suggestedPrompts: [
                "Review my code for bugs",
                "Generate a REST API in NestJS",
                "Help me fix this TypeScript error"
            ]
        }
    },
    {
        keywords: ["video", "record", "film", "movie", "animation", "generate video"],
        data: {
            reply: `Great choice! Here's everything about AI video generation:\n\n**Top AI video models:**\n- **Sora** (OpenAI) — up to 60s, photorealistic\n- **Runway Gen-3** — great for short creative clips\n- **Pika Labs** — fast, good for social media content\n\n**What you can create:**\n- Text-to-video from a description\n- Image-to-video animation\n- Video editing and style transfer\n- Talking avatar videos\n\n**Prompt formula:** Subject + Action + Scene + Style + Duration\n\n*Example: "A person walking through a neon-lit Tokyo street at night, cinematic, slow motion, 10 seconds"*\n\nDo you have a specific video concept in mind?`,
            suggestedPrompts: [
                "Create a product demo video prompt",
                "Best model for short social media clips?",
                "How to animate a still image?"
            ]
        }
    },
    {
        keywords: ["audio", "music", "voice", "sound", "speech", "tts", "text to speech"],
        data: {
            reply: `Here's a guide to AI audio generation:\n\n**Audio AI capabilities:**\n- **Text-to-Speech** — natural voices in 30+ languages\n- **Music generation** — full tracks from a text description\n- **Voice cloning** — replicate a voice with samples\n- **Sound effects** — generate custom SFX\n\n**Top tools:**\n- **ElevenLabs** — best TTS, voice cloning\n- **Suno AI** — generate full songs with lyrics\n- **Udio** — high-quality music production\n- **Whisper** (OpenAI) — speech-to-text transcription\n\n**Getting started:**\n1. Choose your use case (podcast, music, narration)\n2. Select voice style and language\n3. Adjust speed, pitch, and emotion\n\nWhat type of audio are you looking to create?`,
            suggestedPrompts: [
                "Generate a podcast intro voice",
                "Create background music for a video",
                "Which TTS model sounds most natural?"
            ]
        }
    },
    {
        keywords: ["agent", "build agent", "create agent", "automate", "automation", "workflow", "task"],
        data: {
            reply: `Let's build your AI agent! Here's the process:\n\n**Agent building steps:**\n1. **Define the goal** — what should the agent do?\n2. **Choose tools** — search, code, email, database, API calls\n3. **Write the system prompt** — instructions and persona\n4. **Set memory** — what context should it remember?\n5. **Test and deploy** — iterate until it works reliably\n\n**Agent types:**\n- **Research Agent** — gathers and summarizes information\n- **Code Agent** — writes, reviews, and deploys code\n- **Customer Support Agent** — handles FAQs and tickets\n- **Data Analysis Agent** — processes and visualizes data\n\n**Best models for agents:**\n- Claude Sonnet 4.6 — excellent for multi-step reasoning\n- GPT-4.1 — great tool use and function calling\n\nHead to the **Agents** section to start building now!`,
            suggestedPrompts: [
                "Build a customer support agent",
                "Create a research and summarization agent",
                "How do I add memory to my agent?"
            ]
        }
    },
    {
        keywords: ["write", "content", "blog", "email", "essay", "article", "copy", "marketing"],
        data: {
            reply: `I can help you write professional content! Here's how:\n\n**Content types I can create:**\n- Blog posts and articles\n- Marketing copy and ad scripts\n- Email campaigns and newsletters\n- Social media captions\n- Product descriptions\n- Technical documentation\n\n**Writing best practices:**\n1. Define your audience (who will read this?)\n2. Set the tone (professional, casual, persuasive)\n3. Specify the length and format\n4. Include keywords for SEO if needed\n\n**Example prompt:** *"Write a 500-word blog post about AI tools for small businesses, casual tone, include 3 key benefits"*\n\n**Best models for writing:**\n- Claude Opus 4.6 — nuanced, long-form content\n- GPT-5 — creative and versatile\n\nWhat would you like to write today?`,
            suggestedPrompts: [
                "Write a product launch email",
                "Create 5 social media posts for my brand",
                "Write a blog post about AI trends"
            ]
        }
    },
    {
        keywords: ["data", "analyze", "analysis", "chart", "graph", "spreadsheet", "csv", "excel", "report"],
        data: {
            reply: `Here's how AI can help you analyze data:\n\n**Data analysis capabilities:**\n- Upload CSV, Excel, or PDF files\n- Generate charts and visualizations\n- Find patterns and trends\n- Statistical analysis and forecasting\n- Natural language queries on your data\n\n**What you can ask:**\n- *"Show me the top 5 performing products"*\n- *"What's the trend in sales over the last 6 months?"*\n- *"Find anomalies in this dataset"*\n\n**Supported formats:**\n- CSV, XLSX, JSON\n- PDF documents and reports\n- Database exports\n\n**Best models for data:**\n- GPT-4.1 with Code Interpreter\n- Claude Sonnet 4.6 — great for reasoning over tables\n\nUpload your data file or paste your data to get started!`,
            suggestedPrompts: [
                "Analyze my sales data CSV",
                "Create a chart from this data",
                "Find the key insights in this report"
            ]
        }
    },
    {
        keywords: ["document", "pdf", "summarize", "summary", "extract", "read", "review"],
        data: {
            reply: `AI can read and analyze your documents instantly:\n\n**Document analysis features:**\n- **Summarization** — get the key points in seconds\n- **Q&A** — ask questions about the document\n- **Data extraction** — pull out tables, numbers, names\n- **Comparison** — compare multiple documents\n- **Translation** — translate documents to any language\n\n**Supported file types:**\n- PDF, Word, PowerPoint\n- Text files and markdown\n- Scanned documents (with OCR)\n\n**How to use:**\n1. Upload your document using the paperclip icon\n2. Ask your question\n3. Get instant answers with source references\n\n*Example: "Summarize this contract and highlight any red flags"*\n\nUpload a document to begin!`,
            suggestedPrompts: [
                "Summarize this PDF in bullet points",
                "Extract all names and dates from this document",
                "Compare these two contracts"
            ]
        }
    },
    {
        keywords: ["translate", "translation", "language", "arabic", "urdu", "french", "spanish", "chinese"],
        data: {
            reply: `AI translation is fast and accurate across 100+ languages:\n\n**Translation features:**\n- Text translation (any language pair)\n- Document translation (preserves formatting)\n- Real-time conversation translation\n- Tone-aware translation (formal vs casual)\n\n**Supported languages include:**\n🌍 Arabic, Urdu, Hindi, French, Spanish, German, Chinese, Japanese, Korean, Portuguese, Italian, Russian, Turkish, and 90+ more\n\n**Usage tips:**\n1. Specify the target language clearly\n2. Mention if you need formal or informal tone\n3. For documents, upload the file directly\n\n*Example: "Translate this email to formal Arabic"*\n\n**Best models:** GPT-4.1, Claude Sonnet 4.6, Gemini 3.1 Pro\n\nWhat would you like to translate?`,
            suggestedPrompts: [
                "Translate this text to Urdu",
                "Convert this document to Arabic",
                "Which model is best for translation?"
            ]
        }
    },
    {
        keywords: ["model", "best model", "which model", "compare", "gpt", "claude", "gemini", "recommend"],
        data: {
            reply: `Here's a breakdown of the top AI models available on NexusAI:\n\n**By use case:**\n\n| Use Case | Best Model |\n|---|---|\n| Writing & Content | Claude Opus 4.6 |\n| Code Generation | GPT-4.1, Claude Sonnet 4.6 |\n| Reasoning & Analysis | o3, Claude Sonnet 4.6 |\n| Speed & Efficiency | GPT-4.1-mini, Claude Haiku |\n| Image Generation | DALL·E 3, Midjourney |\n| Multimodal | GPT-4o, Gemini 3.1 Pro |\n\n**How to choose:**\n- Need speed? → GPT-4.1-mini or Claude Haiku\n- Need accuracy? → Claude Opus 4.6 or o3\n- Need balance? → GPT-4.1 or Claude Sonnet 4.6\n- On a budget? → Open-source models\n\nCheck the **Marketplace** for detailed benchmarks, pricing, and reviews!`,
            suggestedPrompts: [
                "Compare GPT-4.1 vs Claude Sonnet 4.6",
                "Which model is cheapest for my use case?",
                "Show me the fastest models"
            ]
        }
    },
    {
        keywords: ["price", "pricing", "cost", "cheap", "affordable", "expensive", "budget"],
        data: {
            reply: `Here's a pricing overview for AI models on NexusAI:\n\n**Pricing tiers:**\n\n💰 **Budget-friendly (< $1/M tokens)**\n- GPT-4.1-mini — $0.40/M input\n- Claude Haiku 4.5 — $0.80/M input\n\n⚖️ **Mid-range ($1–$10/M tokens)**\n- GPT-4.1 — $2/M input\n- Claude Sonnet 4.6 — $3/M input\n- Gemini 3.1 Pro — $3.50/M input\n\n🚀 **Premium ($10+/M tokens)**\n- Claude Opus 4.6 — $15/M input\n- GPT-5 — $10/M input\n- o3 — $10/M input\n\n**Cost-saving tips:**\n1. Use smaller models for simple tasks\n2. Cache frequent prompts\n3. Batch requests when possible\n\nVisit the **Marketplace** to see full pricing and compare models!`,
            suggestedPrompts: [
                "What's the cheapest model for summarization?",
                "How can I reduce my AI costs?",
                "Show me open-source free alternatives"
            ]
        }
    },
    {
        keywords: ["hello", "hi", "hey", "salam", "help me", "what can you do", "start", "begin"],
        data: {
            reply: `Hello! Welcome to **NexusAI** 👋\n\nI'm your AI assistant — here's what I can help you with:\n\n🖼️ **Create** — Images, videos, audio, slides, infographics\n✍️ **Write** — Content, emails, blogs, marketing copy\n💻 **Code** — Generate, debug, and review code\n📊 **Analyze** — Data, documents, PDFs, reports\n🤖 **Build** — AI agents and automated workflows\n🌐 **Translate** — 100+ languages\n\n**Quick start options:**\n- Browse AI models in the **Marketplace**\n- Build your own agent in **Agents**\n- Explore research in **Discover**\n\nWhat would you like to do today?`,
            suggestedPrompts: [
                "Show me the best AI models",
                "Help me build an AI agent",
                "What can I create with NexusAI?"
            ]
        }
    }
];
const DEFAULT_RESPONSE = {
    reply: `I understand you're asking about that. Here's how NexusAI can help:\n\n**Available capabilities:**\n- 🖼️ Generate images, videos, and audio\n- ✍️ Write content, emails, and marketing copy\n- 💻 Code generation and debugging\n- 📊 Data and document analysis\n- 🤖 Build AI agents and workflows\n- 🌐 Translate across 100+ languages\n\n**Getting started:**\n1. Select a model from the left panel\n2. Type your request in detail\n3. Use attachments for files, images, or voice\n\nTry being more specific about what you need — for example:\n- *"Write a blog post about AI trends"*\n- *"Analyze this sales data CSV"*\n- *"Build a customer support agent"*\n\nWhat would you like to accomplish?`,
    suggestedPrompts: [
        "Show me what NexusAI can do",
        "Help me choose the right AI model",
        "Build an AI workflow for my business"
    ]
};
let ChatService = class ChatService {
    constructor(modelStore, chatStore) {
        this.modelStore = modelStore;
        this.chatStore = chatStore;
    }
    async history(sessionId) {
        const conversation = await this.chatStore
            .findOne({ sessionId })
            .lean()
            .exec();
        return {
            sessionId,
            messages: conversation?.messages.map((message) => ({
                role: message.role,
                text: message.text,
                attachments: message.attachments ?? [],
                createdAt: message.createdAt
            })) ?? []
        };
    }
    async deleteHistory(sessionId) {
        const result = await this.chatStore.deleteOne({ sessionId }).exec();
        return {
            deleted: result.deletedCount > 0,
            sessionId
        };
    }
    async respond(payload) {
        const trimmedMessage = payload.message.trim();
        const normalized = trimmedMessage.toLowerCase();
        const matched = RESPONSE_MAP.find((entry) => entry.keywords.some((keyword) => normalized.includes(keyword)));
        const { reply, suggestedPrompts } = matched?.data ?? DEFAULT_RESPONSE;
        const attachmentNote = payload.attachments && payload.attachments.length > 0
            ? `\n\n📎 *I can see ${payload.attachments.length} attachment${payload.attachments.length > 1 ? "s" : ""} (${payload.attachments.map((a) => a.kind).join(", ")}) — I'll factor those into my response.*`
            : "";
        const finalReply = `${reply}${attachmentNote}`;
        await this.appendMessages(payload.sessionId, [
            {
                role: "user",
                text: trimmedMessage,
                attachments: payload.attachments ?? [],
                createdAt: new Date()
            },
            {
                role: "assistant",
                text: finalReply,
                attachments: [],
                createdAt: new Date()
            }
        ]);
        return {
            reply: finalReply,
            suggestedPrompts
        };
    }
    async saveMessage(payload) {
        await this.appendMessages(payload.sessionId, [
            {
                role: payload.role,
                text: payload.message.trim(),
                attachments: payload.attachments ?? [],
                createdAt: new Date()
            }
        ]);
        return {
            saved: true
        };
    }
    async appendMessages(sessionId, messages) {
        await this.chatStore
            .updateOne({ sessionId }, {
            $setOnInsert: { sessionId },
            $push: { messages: { $each: messages } }
        }, { upsert: true })
            .exec();
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(model_schema_1.Model.name)),
    __param(1, (0, mongoose_1.InjectModel)(chat_conversation_schema_1.ChatConversation.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ChatService);
//# sourceMappingURL=chat.service.js.map