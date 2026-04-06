import { HydratedDocument } from "mongoose";
export type AgentMessageDocument = HydratedDocument<AgentMessage>;
export declare class AgentMessage {
    agentId: string;
    role: "assistant" | "user";
    text: string;
}
export declare const AgentMessageSchema: import("mongoose").Schema<AgentMessage, import("mongoose").Model<AgentMessage, any, any, any, import("mongoose").Document<unknown, any, AgentMessage, any, {}> & AgentMessage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AgentMessage, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<AgentMessage>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AgentMessage> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
