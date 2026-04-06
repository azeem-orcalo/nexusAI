import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model as MongooseModel } from "mongoose";
import { CompareModelsDto } from "./dto/compare-models.dto";
import { ListModelsQueryDto } from "./dto/list-models-query.dto";
import { Model as MarketplaceModel, ModelDocument } from "./schemas/model.schema";
import { Review, ReviewDocument } from "./schemas/review.schema";

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
] as const;

@Injectable()
export class ModelsService {
  constructor(
    @InjectModel(MarketplaceModel.name)
    private readonly modelStore: MongooseModel<ModelDocument>,
    @InjectModel(Review.name)
    private readonly reviewStore: MongooseModel<ReviewDocument>
  ) {}

  private async getModelSource() {
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

  private async ensureSeedData() {
    const existingCount = await this.modelStore.countDocuments().exec();

    if (existingCount > 0) {
      return;
    }

    await this.modelStore.insertMany(MODEL_SEED_DATA);
  }

  private async getReviewSource() {
    return this.reviewStore.find().lean().exec();
  }

  private inferPriceModel(pricePerMillion: string): string {
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

  private matchesQuery(
    model: Awaited<ReturnType<ModelsService["getModelSource"]>>[number],
    query: ListModelsQueryDto
  ) {
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

  async findAll(query: ListModelsQueryDto) {
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
      maxPrice: Math.max(
        ...models.map((model) =>
          Number.parseFloat(model.pricePerMillion.replace(/[^0-9.]/g, "")) || 0
        )
      )
    };
  }

  async findOne(id: string) {
    const models = await this.getModelSource();
    const selectedModel = models.find((model) => model.id === id);

    return {
      ...selectedModel,
      pricing: {
        input: `${selectedModel?.pricePerMillion ?? "$0"} / 1M`,
        output: "$10 / 1M"
      },
      promptGuide: "Use structured system prompts and clear constraints.",
      benchmarks: {
        mmlu: 87.2,
        humanEval: 90.2,
        math: 76.6
      }
    };
  }

  async reviews(id: string) {
    const reviews = await this.getReviewSource();
    return reviews.filter((review) => review.modelId === id);
  }

  async compare(payload: CompareModelsDto) {
    return Promise.all(payload.modelIds.map((id) => this.findOne(id)));
  }
}
