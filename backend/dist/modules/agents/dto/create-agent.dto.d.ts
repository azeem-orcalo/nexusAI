export declare class CreateAgentDto {
    name: string;
    category?: string;
    purpose: string;
    audience?: string;
    prompt: string;
    tools?: string[];
    memory?: string[];
    tests?: string[];
    deployTarget?: string;
}
