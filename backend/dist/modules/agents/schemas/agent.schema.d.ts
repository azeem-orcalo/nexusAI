import { HydratedDocument } from "mongoose";
export type AgentDocument = HydratedDocument<Agent>;
export declare class Agent {
    name: string;
    category: string;
    purpose: string;
    audience: string;
    prompt: string;
    tools: string[];
    memory: string[];
    tests: string[];
    deployTarget: string;
    status: string;
}
export declare const AgentSchema: import("mongoose").Schema<Agent, import("mongoose").Model<Agent, any, any, any, import("mongoose").Document<unknown, any, Agent, any, {}> & Agent & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Agent, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Agent>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Agent> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
