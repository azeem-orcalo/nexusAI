import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
export declare class AgentsService {
    private readonly agents;
    create(payload: CreateAgentDto): {
        name: string;
        purpose: string;
        prompt: string;
        tools: string[];
        memory: string[];
        id: string;
        status: string;
    };
    findAll(): {
        id: string;
        name: string;
        purpose: string;
        prompt: string;
        tools: string[];
        memory: string[];
        status: string;
    }[];
    templates(): {
        id: string;
        name: string;
    }[];
    findOne(id: string): {
        id: string;
        name: string;
        purpose: string;
        prompt: string;
        tools: string[];
        memory: string[];
        status: string;
    } | undefined;
    update(id: string, payload: UpdateAgentDto): {
        id: string;
        name: string;
        purpose: string;
        prompt: string;
        tools: string[];
        memory: string[];
        status: string;
    } | null;
    remove(id: string): {
        deleted: boolean;
        id: string;
    };
    deploy(id: string): {
        id: string;
        status: string;
        endpoint: string;
    };
}
