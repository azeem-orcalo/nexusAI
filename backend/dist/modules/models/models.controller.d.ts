import { CompareModelsDto } from "./dto/compare-models.dto";
import { ListModelsQueryDto } from "./dto/list-models-query.dto";
import { ModelsService } from "./models.service";
export declare class ModelsController {
    private readonly modelsService;
    constructor(modelsService: ModelsService);
    findAll(query: ListModelsQueryDto): Promise<{
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
        badge: string | undefined;
        priceModel: string;
        isOpenSource: boolean;
    }[]>;
    featured(): Promise<{
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
        badge: string | undefined;
        priceModel: string;
        isOpenSource: boolean;
    }[]>;
    providers(): Promise<string[]>;
    filters(): Promise<{
        providers: string[];
        categories: string[];
        tags: string[];
        useCases: string[];
        priceModels: string[];
        maxPrice: number;
    }>;
    findOne(id: string): Promise<{
        subtitle: string;
        tabs: {
            id: string;
            label: string;
        }[];
        overview: {
            description: string;
            input: string;
            output: string;
            context: string;
            maxOutput: string;
            latency: string;
            useCases: {
                id: string;
                label: string;
                icon: string;
            }[];
            examplePrompt: string;
            exampleResponse: string[];
            followUps: string[];
            benchmarks: {
                id: string;
                label: string;
                value: string;
            }[];
        };
        howToUse: {
            summary: string;
            steps: string[];
            checklist: string[];
        };
        pricing: {
            input: string;
            output: string;
            billing: string;
            enterprise: string;
            notes: string[];
        };
        promptGuide: {
            summary: string;
            tips: string[];
            starterPrompt: string;
            examples: string[];
        };
        agentCreation: {
            summary: string;
            steps: string[];
            recommendedTools: string[];
            deploymentNotes: string[];
        };
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
        badge: string | undefined;
        priceModel: string;
        isOpenSource: boolean;
    }>;
    reviews(id: string): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review, {}, {}> & import("./schemas/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    compare(payload: CompareModelsDto): Promise<{
        subtitle: string;
        tabs: {
            id: string;
            label: string;
        }[];
        overview: {
            description: string;
            input: string;
            output: string;
            context: string;
            maxOutput: string;
            latency: string;
            useCases: {
                id: string;
                label: string;
                icon: string;
            }[];
            examplePrompt: string;
            exampleResponse: string[];
            followUps: string[];
            benchmarks: {
                id: string;
                label: string;
                value: string;
            }[];
        };
        howToUse: {
            summary: string;
            steps: string[];
            checklist: string[];
        };
        pricing: {
            input: string;
            output: string;
            billing: string;
            enterprise: string;
            notes: string[];
        };
        promptGuide: {
            summary: string;
            tips: string[];
            starterPrompt: string;
            examples: string[];
        };
        agentCreation: {
            summary: string;
            steps: string[];
            recommendedTools: string[];
            deploymentNotes: string[];
        };
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
        badge: string | undefined;
        priceModel: string;
        isOpenSource: boolean;
    }[]>;
}
