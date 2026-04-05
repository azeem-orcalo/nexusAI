import { CompareModelsDto } from "./dto/compare-models.dto";
import { ListModelsQueryDto } from "./dto/list-models-query.dto";
import { ModelsService } from "./models.service";
export declare class ModelsController {
    private readonly modelsService;
    constructor(modelsService: ModelsService);
    findAll(query: ListModelsQueryDto): {
        id: string;
        name: string;
        provider: string;
        category: string;
        useCases: string[];
        tags: string[];
        description: string;
        pricePerMillion: string;
        averageRating: number;
        contextWindow: number;
        latencyMs: number;
    }[];
    featured(): {
        id: string;
        name: string;
        provider: string;
        category: string;
        useCases: string[];
        tags: string[];
        description: string;
        pricePerMillion: string;
        averageRating: number;
        contextWindow: number;
        latencyMs: number;
    }[];
    providers(): string[];
    findOne(id: string): {
        pricing: {
            input: string;
            output: string;
        };
        promptGuide: string;
        benchmarks: {
            mmlu: number;
            humanEval: number;
            math: number;
        };
        id?: string | undefined;
        name?: string | undefined;
        provider?: string | undefined;
        category?: string | undefined;
        useCases?: string[] | undefined;
        tags?: string[] | undefined;
        description?: string | undefined;
        pricePerMillion?: string | undefined;
        averageRating?: number | undefined;
        contextWindow?: number | undefined;
        latencyMs?: number | undefined;
    };
    reviews(id: string): {
        id: string;
        modelId: string;
        authorName: string;
        rating: number;
        comment: string;
        verified: boolean;
    }[];
    compare(payload: CompareModelsDto): {
        pricing: {
            input: string;
            output: string;
        };
        promptGuide: string;
        benchmarks: {
            mmlu: number;
            humanEval: number;
            math: number;
        };
        id?: string | undefined;
        name?: string | undefined;
        provider?: string | undefined;
        category?: string | undefined;
        useCases?: string[] | undefined;
        tags?: string[] | undefined;
        description?: string | undefined;
        pricePerMillion?: string | undefined;
        averageRating?: number | undefined;
        contextWindow?: number | undefined;
        latencyMs?: number | undefined;
    }[];
}
