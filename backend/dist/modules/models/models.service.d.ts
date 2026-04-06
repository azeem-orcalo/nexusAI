import { Model as MongooseModel } from "mongoose";
import { CompareModelsDto } from "./dto/compare-models.dto";
import { ListModelsQueryDto } from "./dto/list-models-query.dto";
import { ModelDocument } from "./schemas/model.schema";
import { Review, ReviewDocument } from "./schemas/review.schema";
export declare class ModelsService {
    private readonly modelStore;
    private readonly reviewStore;
    constructor(modelStore: MongooseModel<ModelDocument>, reviewStore: MongooseModel<ReviewDocument>);
    private getModelSource;
    private ensureSeedData;
    private getReviewSource;
    private inferPriceModel;
    private matchesQuery;
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
        badge?: string | undefined;
        priceModel?: string | undefined;
        isOpenSource?: boolean | undefined;
    }>;
    reviews(id: string): Promise<(import("mongoose").FlattenMaps<import("mongoose").Document<unknown, {}, Review, {}, {}> & Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    compare(payload: CompareModelsDto): Promise<{
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
        badge?: string | undefined;
        priceModel?: string | undefined;
        isOpenSource?: boolean | undefined;
    }[]>;
}
