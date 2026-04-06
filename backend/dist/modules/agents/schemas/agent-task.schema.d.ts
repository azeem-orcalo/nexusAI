import { HydratedDocument } from "mongoose";
export declare class AgentTaskMessage {
    role: "assistant" | "user";
    text: string;
    createdAt: Date;
}
export declare class AgentTaskMessageSchemaClass extends AgentTaskMessage {
}
export declare const AgentTaskMessageSchema: import("mongoose").Schema<AgentTaskMessageSchemaClass, import("mongoose").Model<AgentTaskMessageSchemaClass, any, any, any, import("mongoose").Document<unknown, any, AgentTaskMessageSchemaClass, any, {}> & AgentTaskMessageSchemaClass & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AgentTaskMessageSchemaClass, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<AgentTaskMessageSchemaClass>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AgentTaskMessageSchemaClass> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export type AgentTaskDocument = HydratedDocument<AgentTask>;
export declare class AgentTask {
    agentId: string;
    name: string;
    completed: boolean;
    messages: AgentTaskMessage[];
}
export declare const AgentTaskSchema: import("mongoose").Schema<AgentTask, import("mongoose").Model<AgentTask, any, any, any, import("mongoose").Document<unknown, any, AgentTask, any, {}> & AgentTask & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AgentTask, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<AgentTask>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<AgentTask> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
