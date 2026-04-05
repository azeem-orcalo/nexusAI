import { HydratedDocument } from "mongoose";
export type ResearchItemDocument = HydratedDocument<ResearchItem>;
export declare class ResearchItem {
    title: string;
    summary: string;
    provider: string;
    publishedAt: string;
    trending: boolean;
}
export declare const ResearchItemSchema: import("mongoose").Schema<ResearchItem, import("mongoose").Model<ResearchItem, any, any, any, import("mongoose").Document<unknown, any, ResearchItem, any, {}> & ResearchItem & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ResearchItem, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ResearchItem>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ResearchItem> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
