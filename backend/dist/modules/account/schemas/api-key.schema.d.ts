import { HydratedDocument } from "mongoose";
export type ApiKeyDocument = HydratedDocument<ApiKey>;
export declare class ApiKey {
    userId: string;
    label: string;
    keyPreview: string;
    isActive: boolean;
}
export declare const ApiKeySchema: import("mongoose").Schema<ApiKey, import("mongoose").Model<ApiKey, any, any, any, import("mongoose").Document<unknown, any, ApiKey, any, {}> & ApiKey & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ApiKey, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ApiKey>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<ApiKey> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
