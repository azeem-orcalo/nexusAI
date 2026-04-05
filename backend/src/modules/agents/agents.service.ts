import { Injectable } from "@nestjs/common";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";

@Injectable()
export class AgentsService {
  private readonly agents = [
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
      prompt:
        "Act as a Jira sprint planner. Prepare sprint-ready issues, assign work by role and capacity, track progress, and move AI-completed tasks to Done only after validation passes.",
      tools: ["jira", "search", "documents", "analytics"],
      memory: ["project-context", "meeting-history", "delivery-rules", "team-capacity"],
      status: "draft"
    }
  ];

  create(payload: CreateAgentDto) {
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

  findOne(id: string) {
    return this.agents.find((agent) => agent.id === id);
  }

  update(id: string, payload: UpdateAgentDto) {
    const agent = this.agents.find((item) => item.id === id);
    if (!agent) {
      return null;
    }
    Object.assign(agent, payload);
    return agent;
  }

  remove(id: string) {
    return { deleted: true, id };
  }

  deploy(id: string) {
    return {
      id,
      status: "deployed",
      endpoint: `/agents/${id}/invoke`
    };
  }
}
