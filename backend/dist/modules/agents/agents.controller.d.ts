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
            readonly id: "use-case-space-app";
            readonly categoryId: "use-cases";
            readonly title: "Build a space exploration timeline app";
            readonly icon: "🚀";
            readonly prompt: "Help me build a space exploration timeline app with a clean product plan and implementation steps.";
        }, {
            readonly id: "use-case-speech-app";
            readonly categoryId: "use-cases";
            readonly title: "Add speech recognition to a coaching app";
            readonly icon: "🎙️";
            readonly prompt: "Help me design an agent workflow for a coaching app with speech recognition and summaries.";
        }, {
            readonly id: "use-case-doc-review";
            readonly categoryId: "use-cases";
            readonly title: "Review contracts and extract action items";
            readonly icon: "📄";
            readonly prompt: "I need an agent that reviews contracts and extracts key action items and risks.";
        }, {
            readonly id: "business-stock-tracker";
            readonly categoryId: "business";
            readonly title: "Create a real-time stock market tracker";
            readonly icon: "📊";
            readonly prompt: "Help me create a real-time stock market tracker and choose the best agent setup for it.";
        }, {
            readonly id: "business-pricing";
            readonly categoryId: "business";
            readonly title: "Build an AI SaaS pricing assistant";
            readonly icon: "💼";
            readonly prompt: "Help me build an AI SaaS pricing assistant and define the right business workflow.";
        }, {
            readonly id: "business-sales";
            readonly categoryId: "business";
            readonly title: "Automate lead qualification for sales";
            readonly icon: "📈";
            readonly prompt: "Design an agent that qualifies inbound sales leads and routes the best prospects.";
        }, {
            readonly id: "learn-chatbot-demo";
            readonly categoryId: "learn";
            readonly title: "Prototype an AI chatbot demo application";
            readonly icon: "🤖";
            readonly prompt: "Guide me through building a demo AI chatbot application from idea to prototype.";
        }, {
            readonly id: "learn-roadmap";
            readonly categoryId: "learn";
            readonly title: "Learn agent design step by step";
            readonly icon: "📚";
            readonly prompt: "Teach me agent design step by step and help me build my first production-ready agent.";
        }, {
            readonly id: "learn-prompts";
            readonly categoryId: "learn";
            readonly title: "Turn prompt ideas into agent workflows";
            readonly icon: "✍️";
            readonly prompt: "Show me how to turn prompt ideas into structured agent workflows with examples.";
        }, {
            readonly id: "monitor-kanban-board";
            readonly categoryId: "monitor";
            readonly title: "Create a project management Kanban board";
            readonly icon: "📋";
            readonly prompt: "I want an agent to help me create and manage a project management Kanban board.";
        }, {
            readonly id: "monitor-incidents";
            readonly categoryId: "monitor";
            readonly title: "Monitor incidents and summarize alerts";
            readonly icon: "🚨";
            readonly prompt: "Create an agent that monitors incidents and summarizes alerts for my ops team.";
        }, {
            readonly id: "monitor-dashboard";
            readonly categoryId: "monitor";
            readonly title: "Track model latency and cost over time";
            readonly icon: "📉";
            readonly prompt: "Help me build an agent that tracks model latency, uptime, and cost over time.";
        }, {
            readonly id: "research-market";
            readonly categoryId: "research";
            readonly title: "Research competitors before product launch";
            readonly icon: "🔎";
            readonly prompt: "Create a research agent that studies competitors before product launch.";
        }, {
            readonly id: "research-stack";
            readonly categoryId: "research";
            readonly title: "Compare AI stacks for a new product";
            readonly icon: "🧠";
            readonly prompt: "Compare AI stacks for a new product and recommend the best agent tooling.";
        }, {
            readonly id: "research-brief";
            readonly categoryId: "research";
            readonly title: "Generate weekly market intelligence briefs";
            readonly icon: "📰";
            readonly prompt: "Build an agent that generates weekly market intelligence briefs for leadership.";
        }, {
            readonly id: "content-campaign";
            readonly categoryId: "content";
            readonly title: "Create multi-channel campaign content";
            readonly icon: "🎨";
            readonly prompt: "Help me build an agent that creates multi-channel campaign content from one brief.";
        }, {
            readonly id: "content-social";
            readonly categoryId: "content";
            readonly title: "Turn a blog into social media assets";
            readonly icon: "📣";
            readonly prompt: "I need an agent that turns a blog into social media assets and short-form posts.";
        }, {
            readonly id: "content-email";
            readonly categoryId: "content";
            readonly title: "Write email sequences in brand voice";
            readonly icon: "✉️";
            readonly prompt: "Create an agent that writes email sequences in our brand voice and tracks revisions.";
        }, {
            readonly id: "analysis-kpis";
            readonly categoryId: "analysis";
            readonly title: "Analyze KPIs and explain anomalies";
            readonly icon: "📊";
            readonly prompt: "Build an analysis agent that reviews KPIs and explains anomalies in plain language.";
        }, {
            readonly id: "analysis-feedback";
            readonly categoryId: "analysis";
            readonly title: "Summarize customer feedback themes";
            readonly icon: "🧾";
            readonly prompt: "Create an agent that summarizes customer feedback themes and recommends actions.";
        }, {
            readonly id: "analysis-finance";
            readonly categoryId: "analysis";
            readonly title: "Review finance reports and highlight risks";
            readonly icon: "💹";
            readonly prompt: "Help me create an agent that reviews finance reports and highlights risks and trends.";
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
