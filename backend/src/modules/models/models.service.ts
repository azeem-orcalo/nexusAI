import { Injectable } from "@nestjs/common";
import { CompareModelsDto } from "./dto/compare-models.dto";
import { ListModelsQueryDto } from "./dto/list-models-query.dto";

const MODEL_DATA = [
  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    category: "language",
    useCases: ["agents", "reasoning"],
    tags: ["flagship", "multimodal"],
    description: "Flagship model for advanced reasoning and agent workflows.",
    pricePerMillion: "$7.50",
    averageRating: 4.9,
    contextWindow: 2000000,
    latencyMs: 1200
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    category: "multimodal",
    useCases: ["vision", "audio", "coding"],
    tags: ["vision", "audio"],
    description: "Unified multimodal model for text, image, and audio tasks.",
    pricePerMillion: "$2.50",
    averageRating: 4.7,
    contextWindow: 128000,
    latencyMs: 900
  }
];

const REVIEW_DATA = [
  {
    id: "rev_001",
    modelId: "gpt-5",
    authorName: "Verified Builder",
    rating: 5,
    comment: "Best reasoning quality for agent orchestration.",
    verified: true
  }
];

@Injectable()
export class ModelsService {
  findAll(query: ListModelsQueryDto) {
    return MODEL_DATA.filter((model) => {
      if (query.provider && model.provider !== query.provider) {
        return false;
      }
      if (query.category && model.category !== query.category) {
        return false;
      }
      if (query.search && !model.name.toLowerCase().includes(query.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }

  featured() {
    return MODEL_DATA;
  }

  providers() {
    return ["OpenAI", "Anthropic", "Google DeepMind", "Meta", "Mistral"];
  }

  findOne(id: string) {
    return {
      ...MODEL_DATA.find((model) => model.id === id),
      pricing: {
        input: "$2.50 / 1M",
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

  reviews(id: string) {
    return REVIEW_DATA.filter((review) => review.modelId === id);
  }

  compare(payload: CompareModelsDto) {
    return payload.modelIds.map((id) => this.findOne(id));
  }
}
