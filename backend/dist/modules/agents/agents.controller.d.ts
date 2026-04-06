import { AgentsService } from "./agents.service";
import { CreateAgentMessageDto } from "./dto/create-agent-message.dto";
import { CreateAgentTaskDto } from "./dto/create-agent-task.dto";
import { CreateAgentTaskMessageDto } from "./dto/create-agent-task-message.dto";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentTaskDto } from "./dto/update-agent-task.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
export declare class AgentsController {
    private readonly agentsService;
    constructor(agentsService: AgentsService);
    create(payload: CreateAgentDto): Promise<{
        id: string;
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
    }>;
    findAll(): Promise<{
        id: string;
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
    }[]>;
    workspaceContent(): {
        readonly helperTitle: "Not sure where to start?";
        readonly helperDescription: "Chat with our AI guide. Describe what you want your agent to do and get a personalized setup plan.";
        readonly askHubLabel: "Ask the Hub";
        readonly suggestionCategories: readonly [{
            readonly id: "use-cases";
            readonly label: "Use cases";
        }, {
            readonly id: "business";
            readonly label: "Build a business";
        }, {
            readonly id: "learn";
            readonly label: "Help me learn";
        }, {
            readonly id: "monitor";
            readonly label: "Monitor the situation";
        }, {
            readonly id: "research";
            readonly label: "Research";
        }, {
            readonly id: "content";
            readonly label: "Create content";
        }, {
            readonly id: "analysis";
            readonly label: "Analyze & research";
        }];
        readonly suggestions: readonly [{
            readonly id: "space-app";
            readonly categoryId: "use-cases";
            readonly title: "Build a space exploration timeline app";
            readonly icon: "🚀";
            readonly prompt: "Help me build a space exploration timeline app with a clean product plan and implementation steps.";
        }, {
            readonly id: "stock-tracker";
            readonly categoryId: "business";
            readonly title: "Create a real-time stock market tracker";
            readonly icon: "📊";
            readonly prompt: "Help me create a real-time stock market tracker and choose the best agent setup for it.";
        }, {
            readonly id: "chatbot-demo";
            readonly categoryId: "learn";
            readonly title: "Prototype an AI chatbot demo application";
            readonly icon: "🤖";
            readonly prompt: "Guide me through building a demo AI chatbot application from idea to prototype.";
        }, {
            readonly id: "kanban-board";
            readonly categoryId: "monitor";
            readonly title: "Create a project management Kanban board";
            readonly icon: "📋";
            readonly prompt: "I want an agent to help me create and manage a project management Kanban board.";
        }];
    };
    templates(): {
        id: string;
        name: string;
        description: string;
        icon: string;
        tags: string[];
        featured: boolean;
    }[];
    findOne(id: string): Promise<{
        id: string;
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
    }>;
    update(id: string, payload: UpdateAgentDto): Promise<{
        id: string;
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
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    deploy(id: string): Promise<{
        id: string;
        status: string;
        endpoint: string;
    }>;
    messages(id: string): Promise<{
        id: string;
        agentId: string;
        role: "user" | "assistant";
        text: string;
        createdAt: Date | undefined;
    }[]>;
    addMessage(id: string, payload: CreateAgentMessageDto): Promise<{
        id: string;
        agentId: string;
        role: "user" | "assistant";
        text: string;
        createdAt: Date | undefined;
    }>;
    tasks(id: string): Promise<{
        id: string;
        agentId: string;
        name: string;
        completed: boolean;
        messages: {
            role: "user" | "assistant";
            text: string;
            createdAt: Date;
        }[];
    }[]>;
    createTask(id: string, payload: CreateAgentTaskDto): Promise<{
        id: string;
        agentId: string;
        name: string;
        completed: boolean;
        messages: {
            role: "user" | "assistant";
            text: string;
            createdAt: Date;
        }[];
    }>;
    updateTask(taskId: string, payload: UpdateAgentTaskDto): Promise<{
        id: string;
        agentId: string;
        name: string;
        completed: boolean;
        messages: {
            role: "user" | "assistant";
            text: string;
            createdAt: Date;
        }[];
    }>;
    deleteTask(taskId: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    duplicateTask(taskId: string): Promise<{
        id: string;
        agentId: string;
        name: string;
        completed: boolean;
        messages: {
            role: "user" | "assistant";
            text: string;
            createdAt: Date;
        }[];
    }>;
    addTaskMessage(taskId: string, payload: CreateAgentTaskMessageDto): Promise<{
        id: string;
        agentId: string;
        name: string;
        completed: boolean;
        messages: {
            role: "user" | "assistant";
            text: string;
            createdAt: Date;
        }[];
    }>;
}
