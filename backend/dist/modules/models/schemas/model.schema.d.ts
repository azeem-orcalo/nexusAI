import { HydratedDocument } from "mongoose";
export type ModelDocument = HydratedDocument<Model>;
export declare class Model {
    slug: string;
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
}
export declare const ModelSchema: import("mongoose").Schema<Model, import("mongoose").Model<Model, any, any, any, import("mongoose").Document<unknown, any, Model, any, {}> & Model & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Model, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Model>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Model> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
