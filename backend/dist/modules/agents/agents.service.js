"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const agent_message_schema_1 = require("./schemas/agent-message.schema");
const agent_task_schema_1 = require("./schemas/agent-task.schema");
const agent_schema_1 = require("./schemas/agent.schema");
const AGENT_SEED_DATA = [
    {
        name: "Research Agent",
        category: "Research & Data",
        purpose: "Analyze documents and summarize findings",
        audience: "Internal research team",
        prompt: "Act as a research agent. Be precise, structured, and concise.",
        tools: ["documents", "search", "web"],
        memory: ["project-context"],
        tests: ["Normal use case - typical user query"],
        deployTarget: "api",
        status: "draft"
    },
    {
        name: "Sprint Planner",
        category: "Operations",
        purpose: "Create Jira sprints, assign delivery work, and close verified tasks automatically",
        audience: "Product and engineering leads",
        prompt: "Act as a Jira sprint planner. Prepare sprint-ready issues, assign work by role and capacity, track progress, and move AI-completed tasks to Done only after validation passes.",
        tools: ["jira", "search", "documents", "analytics"],
        memory: ["project-context", "meeting-history", "delivery-rules", "team-capacity"],
        tests: ["Normal use case - typical user query", "Follow-up questions needing context"],
        deployTarget: "slack-bot",
        status: "draft"
    },
    {
        name: "Support Agent",
        category: "Customer Support",
        purpose: "Handle customer FAQs, triage issues, and draft helpful replies",
        audience: "Support customers",
        prompt: "Act as a customer support operator. Resolve common questions, summarize problems, and escalate urgent cases clearly.",
        tools: ["documents", "email"],
        memory: ["customer-notes", "delivery-rules"],
        tests: ["Escalation trigger - billing or security issue"],
        deployTarget: "widget",
        status: "draft"
    }
];
const WORKSPACE_CONTENT = {
    helperTitle: "Not sure where to start?",
    helperDescription: "Chat with our AI guide. Describe what you want your agent to do and get a personalized setup plan.",
    askHubLabel: "Ask the Hub",
    suggestionCategories: [
        { id: "use-cases", label: "Use cases" },
        { id: "business", label: "Build a business" },
        { id: "learn", label: "Help me learn" },
        { id: "monitor", label: "Monitor the situation" },
        { id: "research", label: "Research" },
        { id: "content", label: "Create content" },
        { id: "analysis", label: "Analyze & research" }
    ],
    suggestions: [
        {
            id: "space-app",
            categoryId: "use-cases",
            title: "Build a space exploration timeline app",
            icon: "🚀",
            prompt: "Help me build a space exploration timeline app with a clean product plan and implementation steps."
        },
        {
            id: "stock-tracker",
            categoryId: "business",
            title: "Create a real-time stock market tracker",
            icon: "📊",
            prompt: "Help me create a real-time stock market tracker and choose the best agent setup for it."
        },
        {
            id: "chatbot-demo",
            categoryId: "learn",
            title: "Prototype an AI chatbot demo application",
            icon: "🤖",
            prompt: "Guide me through building a demo AI chatbot application from idea to prototype."
        },
        {
            id: "kanban-board",
            categoryId: "monitor",
            title: "Create a project management Kanban board",
            icon: "📋",
            prompt: "I want an agent to help me create and manage a project management Kanban board."
        }
    ]
};
const TASK_SEED_DATA = [
    {
        name: "Dashboard Layout Adjustments",
        completed: false,
        messages: [
            { role: "assistant", text: "Start by aligning the dashboard layout with the approved structure and note the highest-impact UI changes.", createdAt: new Date() }
        ]
    },
    {
        name: "Design agent system prompt",
        completed: false,
        messages: [
            { role: "assistant", text: "Write a prompt that defines the agent role, constraints, escalation rules, and preferred output style.", createdAt: new Date() }
        ]
    },
    {
        name: "Configure tool integrations",
        completed: false,
        messages: [
            { role: "assistant", text: "Choose only the tools this agent truly needs, then confirm what each tool is responsible for.", createdAt: new Date() }
        ]
    }
];
let AgentsService = class AgentsService {
    constructor(agentStore, messageStore, taskStore) {
        this.agentStore = agentStore;
        this.messageStore = messageStore;
        this.taskStore = taskStore;
    }
    mapAgent(agent) {
        return {
            id: String(agent._id ?? ""),
            name: agent.name,
            category: agent.category ?? "Research & Data",
            purpose: agent.purpose,
            audience: agent.audience ?? "General users",
            prompt: agent.prompt,
            tools: agent.tools ?? [],
            memory: agent.memory ?? [],
            tests: agent.tests ?? [],
            deployTarget: agent.deployTarget ?? "api",
            status: agent.status ?? "draft"
        };
    }
    mapTask(task) {
        return {
            id: String(task._id ?? ""),
            agentId: task.agentId,
            name: task.name,
            completed: task.completed,
            messages: (task.messages ?? []).map((message) => ({
                role: message.role,
                text: message.text,
                createdAt: message.createdAt
            }))
        };
    }
    async ensureSeedData() {
        const agentCount = await this.agentStore.countDocuments().exec();
        if (agentCount === 0) {
            const seededAgents = await this.agentStore.insertMany(AGENT_SEED_DATA);
            await this.taskStore.insertMany(TASK_SEED_DATA.map((task) => ({ ...task, agentId: String(seededAgents[0]._id) })));
            return;
        }
        const taskCount = await this.taskStore.countDocuments().exec();
        if (taskCount === 0) {
            const firstAgent = await this.agentStore.findOne().lean().exec();
            if (firstAgent?._id) {
                await this.taskStore.insertMany(TASK_SEED_DATA.map((task) => ({ ...task, agentId: String(firstAgent._id) })));
            }
        }
    }
    async create(payload) {
        const agent = await this.agentStore.create({
            name: payload.name,
            category: payload.category ?? "Research & Data",
            purpose: payload.purpose,
            audience: payload.audience ?? "General users",
            prompt: payload.prompt,
            tools: payload.tools ?? [],
            memory: payload.memory ?? [],
            tests: payload.tests ?? [],
            deployTarget: payload.deployTarget ?? "api",
            status: "draft"
        });
        return this.mapAgent(agent);
    }
    async findAll() {
        await this.ensureSeedData();
        const agents = await this.agentStore.find().sort({ createdAt: 1 }).lean().exec();
        return agents.map((agent) => this.mapAgent(agent));
    }
    workspaceContent() {
        return WORKSPACE_CONTENT;
    }
    templates() {
        return [
            {
                id: "tpl_research",
                name: "Research Agent",
                description: "Automates web research and generates structured reports.",
                icon: "🔎",
                tags: ["GPT-5.4", "Web search"],
                featured: true
            },
            {
                id: "tpl_support",
                name: "Support Agent",
                description: "Handles tickets, FAQs, and escalates complex issues.",
                icon: "💼",
                tags: ["GPT-5.4", "Ticketing"],
                featured: false
            },
            {
                id: "tpl_code_review",
                name: "Code Review Agent",
                description: "Reviews PRs, flags bugs, and suggests improvements.",
                icon: "💻",
                tags: ["Claude Opus 4.6", "GitHub"],
                featured: true
            },
            {
                id: "tpl_data_analysis",
                name: "Data Analysis Agent",
                description: "Processes spreadsheets and generates visual insights.",
                icon: "📊",
                tags: ["Gemini", "Sheets"],
                featured: false
            },
            {
                id: "tpl_creator",
                name: "Content Writer Agent",
                description: "Creates blog posts and marketing copy with brand voice.",
                icon: "✍️",
                tags: ["Claude Opus 4.6", "Marketing"],
                featured: false
            }
        ];
    }
    async findOne(id) {
        const agent = await this.agentStore.findById(id).lean().exec();
        if (!agent) {
            throw new common_1.NotFoundException("Agent not found");
        }
        return this.mapAgent(agent);
    }
    async update(id, payload) {
        const agent = await this.agentStore
            .findByIdAndUpdate(id, payload, { new: true })
            .lean()
            .exec();
        if (!agent) {
            throw new common_1.NotFoundException("Agent not found");
        }
        return this.mapAgent(agent);
    }
    async remove(id) {
        await this.taskStore.deleteMany({ agentId: id }).exec();
        await this.agentStore.findByIdAndDelete(id).exec();
        return { deleted: true, id };
    }
    async deploy(id) {
        const agent = await this.agentStore
            .findByIdAndUpdate(id, { status: "deployed" }, { new: true })
            .lean()
            .exec();
        if (!agent) {
            throw new common_1.NotFoundException("Agent not found");
        }
        return {
            id,
            status: "deployed",
            endpoint: `/agents/${id}/invoke`
        };
    }
    async tasks(agentId) {
        await this.ensureSeedData();
        const tasks = await this.taskStore.find({ agentId }).sort({ createdAt: 1 }).lean().exec();
        return tasks.map((task) => this.mapTask(task));
    }
    async createTask(agentId, payload) {
        const task = await this.taskStore.create({
            agentId,
            name: payload.name,
            completed: false,
            messages: [
                {
                    role: "assistant",
                    text: `Let's work on ${payload.name}. Share the goal and I will help break it down into steps.`,
                    createdAt: new Date()
                }
            ]
        });
        return this.mapTask(task);
    }
    async updateTask(taskId, payload) {
        const task = await this.taskStore
            .findByIdAndUpdate(taskId, payload, { new: true })
            .lean()
            .exec();
        if (!task) {
            throw new common_1.NotFoundException("Task not found");
        }
        return this.mapTask(task);
    }
    async deleteTask(taskId) {
        await this.taskStore.findByIdAndDelete(taskId).exec();
        return { deleted: true, id: taskId };
    }
    async duplicateTask(taskId) {
        const task = await this.taskStore.findById(taskId).lean().exec();
        if (!task) {
            throw new common_1.NotFoundException("Task not found");
        }
        const duplicate = await this.taskStore.create({
            agentId: task.agentId,
            name: `${task.name} Copy`,
            completed: false,
            messages: task.messages ?? []
        });
        return this.mapTask(duplicate);
    }
    async addTaskMessage(taskId, payload) {
        const task = await this.taskStore.findById(taskId).exec();
        if (!task) {
            throw new common_1.NotFoundException("Task not found");
        }
        task.messages.push({
            role: payload.role,
            text: payload.text,
            createdAt: new Date()
        });
        if (payload.role === "user") {
            task.messages.push({
                role: "assistant",
                text: `For ${task.name}, I recommend turning this into a clear objective, selecting the right tools, and validating the result before marking it done.`,
                createdAt: new Date()
            });
        }
        await task.save();
        return this.mapTask(task);
    }
    async messages(agentId) {
        const messages = await this.messageStore.find({ agentId }).sort({ createdAt: 1 }).lean().exec();
        return messages.map((message) => ({ id: String(message._id), agentId: message.agentId, role: message.role, text: message.text, createdAt: message.createdAt }));
    }
    async addMessage(agentId, payload) {
        const agent = await this.agentStore.findById(agentId).lean().exec();
        if (!agent) {
            throw new common_1.NotFoundException("Agent not found");
        }
        await this.messageStore.create({ agentId, role: "user", text: payload.text });
        const assistantMessage = await this.messageStore.create({ agentId, role: "assistant", text: `${agent.name} can help with "${payload.text}". I can break this down into steps, use the configured tools, and keep the conversation aligned with the agent purpose.` });
        return { id: String(assistantMessage._id), agentId, role: assistantMessage.role, text: assistantMessage.text, createdAt: assistantMessage.createdAt };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(agent_schema_1.Agent.name)),
    __param(1, (0, mongoose_1.InjectModel)(agent_message_schema_1.AgentMessage.name)),
    __param(2, (0, mongoose_1.InjectModel)(agent_task_schema_1.AgentTask.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AgentsService);
//# sourceMappingURL=agents.service.js.map