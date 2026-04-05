"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsService = void 0;
const common_1 = require("@nestjs/common");
let AgentsService = class AgentsService {
    constructor() {
        this.agents = [
            {
                id: "agt_001",
                name: "Research Assistant",
                purpose: "Analyze documents and summarize findings",
                prompt: "Be precise and concise.",
                tools: ["documents", "search"],
                memory: ["project-context"],
                status: "draft"
            },
            {
                id: "agt_002",
                name: "Sprint Planner",
                purpose: "Create Jira sprints, assign delivery work, and close verified tasks automatically",
                prompt: "Act as a Jira sprint planner. Prepare sprint-ready issues, assign work by role and capacity, track progress, and move AI-completed tasks to Done only after validation passes.",
                tools: ["jira", "search", "documents", "analytics"],
                memory: ["project-context", "meeting-history", "delivery-rules", "team-capacity"],
                status: "draft"
            }
        ];
    }
    create(payload) {
        const agent = {
            id: `agt_${this.agents.length + 1}`,
            status: "draft",
            tools: payload.tools ?? [],
            memory: payload.memory ?? [],
            ...payload
        };
        this.agents.push(agent);
        return agent;
    }
    findAll() {
        return this.agents;
    }
    templates() {
        return [
            { id: "tpl_support", name: "Support Agent" },
            { id: "tpl_research", name: "Research Agent" },
            { id: "tpl_creator", name: "Content Creator" },
            { id: "tpl_sprint_planner", name: "Sprint Planner" }
        ];
    }
    findOne(id) {
        return this.agents.find((agent) => agent.id === id);
    }
    update(id, payload) {
        const agent = this.agents.find((item) => item.id === id);
        if (!agent) {
            return null;
        }
        Object.assign(agent, payload);
        return agent;
    }
    remove(id) {
        return { deleted: true, id };
    }
    deploy(id) {
        return {
            id,
            status: "deployed",
            endpoint: `/agents/${id}/invoke`
        };
    }
};
exports.AgentsService = AgentsService;
exports.AgentsService = AgentsService = __decorate([
    (0, common_1.Injectable)()
], AgentsService);
//# sourceMappingURL=agents.service.js.map