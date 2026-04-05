import { useEffect, useMemo, useState } from "react";
import type {
  ApiAgent,
  ApiAgentTemplate,
  CreateAgentRequest,
  DeployAgentResponse
} from "../../types/api";

type AgentsWorkspaceProps = {
  agents: ApiAgent[];
  templates: ApiAgentTemplate[];
  onCreateAgent: (payload: CreateAgentRequest) => Promise<ApiAgent>;
  onDeployAgent: (id: string) => Promise<DeployAgentResponse>;
  onUpdateAgent: (id: string, payload: Partial<CreateAgentRequest>) => Promise<ApiAgent>;
};

type SuggestionCategory =
  | "use-cases"
  | "business"
  | "learn"
  | "monitor"
  | "research"
  | "content"
  | "analysis";

const categoryMeta: Array<{ id: SuggestionCategory; label: string }> = [
  { id: "use-cases", label: "Use cases" },
  { id: "business", label: "Build a business" },
  { id: "learn", label: "Help me learn" },
  { id: "monitor", label: "Monitor the situation" },
  { id: "research", label: "Research" },
  { id: "content", label: "Create content" },
  { id: "analysis", label: "Analyze & research" }
];

const suggestionsByCategory: Record<
  SuggestionCategory,
  Array<{ id: string; icon: string; title: string; purpose: string; prompt: string }>
> = {
  "use-cases": [
    {
      id: "space-timeline",
      icon: "rocket",
      title: "Build a space exploration timeline app",
      purpose: "Plan product scope, features, and content structure.",
      prompt: "Create a product plan for a space exploration timeline app with discovery, milestones, and educational storytelling."
    },
    {
      id: "stock-tracker",
      icon: "chart",
      title: "Create a real-time stock market tracker",
      purpose: "Design a dashboard-focused monitoring agent.",
      prompt: "Design an agent that gathers stock metrics, summarizes changes, and highlights unusual activity."
    },
    {
      id: "chatbot-demo",
      icon: "bot",
      title: "Prototype an AI chatbot demo application",
      purpose: "Shape a demo assistant with polished onboarding.",
      prompt: "Build an agent brief for a chatbot demo app with sample flows, FAQs, and product guidance."
    },
    {
      id: "kanban-board",
      icon: "doc",
      title: "Create a project management Kanban board",
      purpose: "Organize delivery workflow and automations.",
      prompt: "Outline an agent that manages backlog triage, sprint planning, and Kanban board summaries."
    }
  ],
  business: [
    {
      id: "go-to-market",
      icon: "briefcase",
      title: "Draft a go-to-market operator",
      purpose: "Generate campaign plans, launch checklists, and positioning docs.",
      prompt: "Create a GTM agent that drafts messaging, launch timelines, and campaign briefs."
    },
    {
      id: "sales-support",
      icon: "spark",
      title: "Create a sales enablement agent",
      purpose: "Support proposals, objection handling, and call prep.",
      prompt: "Build an agent that prepares sales meeting notes, proposal drafts, and competitive rebuttals."
    }
  ],
  learn: [
    {
      id: "course-coach",
      icon: "book",
      title: "Build a personalized learning coach",
      purpose: "Turn topics into lesson plans and quizzes.",
      prompt: "Create a learning coach agent that explains concepts, tracks progress, and proposes exercises."
    },
    {
      id: "study-summaries",
      icon: "doc",
      title: "Turn notes into study summaries",
      purpose: "Summarize material and create flashcards.",
      prompt: "Design an agent that converts lecture notes into summaries, flashcards, and revision plans."
    }
  ],
  monitor: [
    {
      id: "ops-monitor",
      icon: "eye",
      title: "Monitor system incidents and escalations",
      purpose: "Summarize signals and propose next actions.",
      prompt: "Create an operations monitoring agent that watches incidents, summarizes risks, and recommends escalation steps."
    },
    {
      id: "market-watch",
      icon: "chart",
      title: "Track market shifts and competitor launches",
      purpose: "Spot trends and notify stakeholders.",
      prompt: "Build a market watcher agent that tracks competitors, summarizes launches, and flags strategic moves."
    }
  ],
  research: [
    {
      id: "deep-research",
      icon: "search",
      title: "Research a market before launch",
      purpose: "Compare alternatives, risks, and benchmarks.",
      prompt: "Create a research agent that gathers competitor insights, benchmarks pricing, and summarizes market opportunities."
    },
    {
      id: "candidate-research",
      icon: "search",
      title: "Research a candidate before interview",
      purpose: "Prepare structured hiring notes.",
      prompt: "Build a recruiting research agent that prepares background summaries, interview prompts, and evidence-based notes."
    }
  ],
  content: [
    {
      id: "content-studio",
      icon: "pen",
      title: "Create a content production agent",
      purpose: "Generate briefs, social posts, and landing copy.",
      prompt: "Create a content agent that writes campaign copy, repurposes content, and drafts editorial calendars."
    },
    {
      id: "brand-voice",
      icon: "spark",
      title: "Build a brand voice guardian",
      purpose: "Check tone and consistency across outputs.",
      prompt: "Design a brand voice agent that audits drafts for tone, clarity, and messaging consistency."
    }
  ],
  analysis: [
    {
      id: "data-analysis",
      icon: "chart",
      title: "Analyze data and generate insights",
      purpose: "Turn raw reports into recommendations.",
      prompt: "Create a data analysis agent that reviews datasets, surfaces trends, and proposes action items."
    },
    {
      id: "sprint-planner",
      icon: "kanban",
      title: "Manage a Jira sprint from planning to done",
      purpose: "Create sprints, assign tasks, and close validated AI work automatically.",
      prompt: "Create a Sprint Planner agent that builds Jira sprints, assigns issues by role and capacity, tracks AI-completed work, and marks tasks done after verification."
    },
    {
      id: "review-agent",
      icon: "code",
      title: "Review a codebase and summarize issues",
      purpose: "Catch bugs, risks, and missing tests.",
      prompt: "Build a code review agent that identifies risk areas, summarizes findings, and suggests next steps."
    }
  ]
};

const iconMap: Record<string, string> = {
  rocket: "🚀",
  chart: "📊",
  bot: "🤖",
  doc: "📋",
  briefcase: "💼",
  spark: "✦",
  book: "📖",
  eye: "👁",
  search: "⌕",
  pen: "✎",
  code: "💻"
};

const templateDescriptions: Record<string, string> = {
  "Support Agent": "Handles FAQs, customer guidance, and resolution drafts.",
  "Research Agent": "Summarizes sources, findings, and recommendation notes.",
  "Content Creator": "Builds content briefs, campaign copy, and publishing ideas.",
  "Sprint Planner":
    "Creates Jira sprints, assigns work, tracks progress, and marks validated tasks as done."
};

const toolsCatalog = ["search", "documents", "web", "email", "analytics", "code", "jira"];
const memoryCatalog = [
  "project-context",
  "customer-notes",
  "meeting-history",
  "brand-guidelines",
  "delivery-rules",
  "team-capacity"
];

const toArray = (value: string): string[] =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const AgentsWorkspace = ({
  agents,
  templates,
  onCreateAgent,
  onDeployAgent,
  onUpdateAgent
}: AgentsWorkspaceProps): JSX.Element => {
  const [selectedCategory, setSelectedCategory] =
    useState<SuggestionCategory>("use-cases");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id ?? "");
  const [draftName, setDraftName] = useState<string>("");
  const [draftPurpose, setDraftPurpose] = useState<string>("");
  const [draftPrompt, setDraftPrompt] = useState<string>("");
  const [draftTools, setDraftTools] = useState<string>("search, documents");
  const [draftMemory, setDraftMemory] = useState<string>("project-context");
  const [taskChecklist, setTaskChecklist] = useState<string[]>([
    "Dashboard layout adjustments",
    "Design agent system prompt",
    "Configure tool integrations"
  ]);
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Describe what your agent should do and get a personalized setup plan."
  );
  const [deployedEndpoint, setDeployedEndpoint] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const suggestionItems = suggestionsByCategory[selectedCategory];

  const selectedAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? null,
    [agents, selectedAgentId]
  );

  useEffect(() => {
    if (!selectedAgent) {
      return;
    }

    setDraftName(selectedAgent.name);
    setDraftPurpose(selectedAgent.purpose);
    setDraftPrompt(selectedAgent.prompt);
    setDraftTools(selectedAgent.tools.join(", "));
    setDraftMemory(selectedAgent.memory.join(", "));
  }, [selectedAgent]);

  const handleNewAgent = (): void => {
    setSelectedAgentId("");
    setDraftName("");
    setDraftPurpose("");
    setDraftPrompt("");
    setDraftTools("search, documents");
    setDraftMemory("project-context");
    setDeployedEndpoint("");
    setStatusMessage("Start from scratch or choose a template to seed the builder.");
  };

  const handleSuggestionPick = (
    item: (typeof suggestionItems)[number]
  ): void => {
    setDraftName(item.title.replace(/^Build |^Create |^Prototype /, "").trim());
    setDraftPurpose(item.purpose);
    setDraftPrompt(item.prompt);
    setStatusMessage("Suggestion added to the builder.");
  };

  const handleTemplatePick = (template: ApiAgentTemplate): void => {
    setSelectedAgentId("");
    if (template.name === "Sprint Planner") {
      setDraftName("Sprint Planner");
      setDraftPurpose(
        "Create Jira sprints, assign delivery tasks, and close verified work automatically."
      );
      setDraftPrompt(
        "Act as a Jira sprint planner. Create and organize sprints, assign tasks by role and capacity, track progress, and move AI-completed work to Done once acceptance criteria are verified."
      );
      setDraftTools("jira, search, documents, analytics");
      setDraftMemory(
        "project-context, meeting-history, delivery-rules, team-capacity"
      );
      setStatusMessage("Sprint Planner template loaded into the builder.");
      return;
    }

    setDraftName(template.name);
    setDraftPurpose(
      templateDescriptions[template.name] ??
        "Configure this template with your own prompt, tools, and memory."
    );
    setDraftPrompt(
      `You are the ${template.name}. Help the team with clear, actionable output.`
    );
    setDraftTools("search, documents");
    setDraftMemory("project-context");
    setStatusMessage(`${template.name} template loaded into the builder.`);
  };

  const handleSaveAgent = async (): Promise<void> => {
    if (!draftName.trim() || !draftPurpose.trim() || !draftPrompt.trim()) {
      setStatusMessage("Name, purpose, and prompt are required.");
      return;
    }

    setIsSaving(true);

    const payload: CreateAgentRequest = {
      name: draftName.trim(),
      purpose: draftPurpose.trim(),
      prompt: draftPrompt.trim(),
      tools: toArray(draftTools),
      memory: toArray(draftMemory)
    };

    try {
      const nextAgent = selectedAgentId
        ? await onUpdateAgent(selectedAgentId, payload)
        : await onCreateAgent(payload);

      setSelectedAgentId(nextAgent.id);
      setStatusMessage(
        selectedAgentId
          ? `${nextAgent.name} updated successfully.`
          : `${nextAgent.name} created successfully.`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeploy = async (): Promise<void> => {
    if (!selectedAgentId) {
      setStatusMessage("Save the agent before deploying it.");
      return;
    }

    setIsSaving(true);
    try {
      const result = await onDeployAgent(selectedAgentId);
      setDeployedEndpoint(result.endpoint);
      setStatusMessage("Agent deployed and ready to assign to a workspace.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-53px)] bg-[#fbf8f4] text-[#1f1a16]">
      <div className="grid min-h-[calc(100vh-53px)] grid-cols-[320px_minmax(0,1fr)]">
        <aside className="border-r border-[#e8ddd2] bg-white px-6 py-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#d46f2b] text-xl text-white">
              🤖
            </div>
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.03em]">
                Agent Builder
              </h2>
              <p className="mt-2 max-w-[220px] text-[15px] leading-7 text-[#5f584f]">
                Create powerful AI agents using any model. Pick a template or
                start from scratch.
              </p>
            </div>
          </div>

          <button
            className="mt-8 w-full rounded-full bg-[#c86426] px-5 py-4 text-[24px] font-semibold text-white shadow-[0_12px_22px_rgba(200,100,38,0.2)]"
            onClick={handleNewAgent}
            type="button"
          >
            + New Agent
          </button>

          <div className="mt-5 rounded-[24px] border border-[#f1c7a7] bg-[#fff4ec] p-5">
            <p className="text-[14px] font-semibold uppercase tracking-[0.06em] text-[#241d17]">
              Not sure where to start?
            </p>
            <p className="mt-3 text-[15px] leading-7 text-[#5f584f]">
              Chat with our AI guide, describe what you want your agent to do,
              and get a personalized setup plan.
            </p>
            <button
              className="mt-5 rounded-full border border-[#dfc0a9] bg-white px-6 py-3 text-[18px] font-medium text-[#221d18]"
              onClick={() => {
                setStatusMessage("AI guide mode started. Use a suggestion or template to seed the builder.");
                setSelectedCategory("research");
              }}
              type="button"
            >
              Ask the Hub →
            </button>
          </div>

          <button
            className="mt-8 flex w-full items-center gap-3 rounded-[18px] border border-dashed border-[#d9cec1] bg-[#fbf8f4] px-4 py-4 text-left text-[18px] font-semibold text-[#5b534b]"
            onClick={() => {
              const nextTask = `New task ${taskChecklist.length + 1}`;
              setTaskChecklist((current) => [...current, nextTask]);
            }}
            type="button"
          >
            <span className="text-[28px]">+</span>
            <span>New Task</span>
          </button>

          <div className="mt-5 space-y-4 border-t border-[#ece1d6] pt-4">
            {taskChecklist.map((task) => {
              const checked = checkedTasks.includes(task);
              return (
                <label
                  key={task}
                  className="flex cursor-pointer items-center gap-3 border-b border-[#f0e8de] pb-4 text-[18px] text-[#211c17]"
                >
                  <input
                    checked={checked}
                    className="h-5 w-5 rounded border-[#d6cabd]"
                    onChange={() =>
                      setCheckedTasks((current) =>
                        checked
                          ? current.filter((item) => item !== task)
                          : [...current, task]
                      )
                    }
                    type="checkbox"
                  />
                  <span className={checked ? "line-through text-[#9a8f83]" : ""}>
                    {task}
                  </span>
                </label>
              );
            })}
          </div>
        </aside>

        <main>
          <section className="border-b border-[#e8ddd2] px-10 py-10 text-center">
            <h1 className="text-[56px] font-semibold tracking-[-0.05em] text-[#181410]">
              Agent works <span className="text-[#cc6d2f]">for you.</span>
            </h1>
            <p className="mt-4 text-[18px] text-[#5f584f]">
              Your AI agent takes care of everything, end to end.
            </p>
          </section>

          <section className="px-6 py-4">
            <div className="rounded-[26px] border border-[#ddd3c7] bg-white px-6 py-5 shadow-[0_14px_30px_rgba(68,46,24,0.05)]">
              <div className="border-b border-[#ede5db] pb-5">
                <div className="text-left text-[18px] text-[#80776d]">
                  What should we work on next?
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2">
                    {["🎙", "📎", "📹", "🖥", "🖼", "✦"].map((icon) => (
                      <span
                        key={icon}
                        className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e8ddd2] bg-[#faf6f0] text-[18px]"
                      >
                        {icon}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[16px] text-[#a39689]">Agent</span>
                    <button
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-[#cf6e2e] text-[24px] text-white shadow-[0_10px_22px_rgba(207,110,46,0.25)]"
                      onClick={() => {
                        setSelectedCategory("use-cases");
                        setStatusMessage("Suggested use cases refreshed.");
                      }}
                      type="button"
                    >
                      ↗
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                {categoryMeta.map((category) => (
                  <button
                    key={category.id}
                    className={`rounded-full border px-6 py-3 text-[16px] font-semibold ${
                      category.id === selectedCategory
                        ? "border-[#1f1a16] bg-[#1f1a16] text-white"
                        : "border-[#ddd2c5] bg-[#fdfaf6] text-[#4a433c]"
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                    type="button"
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 divide-y divide-[#efe5da]">
                {suggestionItems.map((item) => (
                  <button
                    key={item.id}
                    className="flex w-full items-center gap-4 px-3 py-5 text-left transition hover:bg-[#faf6f0]"
                    onClick={() => handleSuggestionPick(item)}
                    type="button"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f3ece3] text-[19px]">
                      {iconMap[item.icon] ?? "✦"}
                    </span>
                    <span className="text-[17px] text-[#4f473f]">{item.title}</span>
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-[#efe5da] pt-4 text-[15px] text-[#6f665d]">
                <button
                  className="flex items-center gap-2"
                  onClick={() => setSelectedCategory("research")}
                  type="button"
                >
                  <span>View all suggestions</span>
                  <span>›</span>
                </button>
                <button
                  className="flex items-center gap-2"
                  onClick={() =>
                    setSelectedCategory((current) => {
                      const index = categoryMeta.findIndex((item) => item.id === current);
                      return categoryMeta[(index + 1) % categoryMeta.length].id;
                    })
                  }
                  type="button"
                >
                  <span>↗</span>
                  <span>Shuffle</span>
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#9e907f]">
                <span>Agent Templates</span>
                <span className="rounded-full bg-[#f3eee6] px-3 py-1 text-[12px] text-[#6b6157]">
                  {templates.length}
                </span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    className="rounded-[22px] border border-[#e5dbcf] bg-white px-5 py-5 text-left shadow-[0_8px_20px_rgba(68,46,24,0.04)] transition hover:border-[#d7c4b2]"
                    onClick={() => handleTemplatePick(template)}
                    type="button"
                  >
                    <p className="text-[22px] font-semibold tracking-[-0.03em] text-[#1f1a16]">
                      {template.name}
                    </p>
                    <p className="mt-2 text-[15px] leading-7 text-[#61584f]">
                      {templateDescriptions[template.name] ??
                        "Configure this template with your own prompt, tools, and memory."}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
              <section className="rounded-[26px] border border-[#e3d8cc] bg-white p-6 shadow-[0_12px_26px_rgba(68,46,24,0.04)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#9d8e7d]">
                      Builder
                    </p>
                    <h3 className="mt-2 text-[32px] font-semibold tracking-[-0.04em] text-[#1f1a16]">
                      {selectedAgent ? selectedAgent.name : "New agent draft"}
                    </h3>
                  </div>
                  <div className="rounded-full border border-[#e3d6c8] bg-[#faf5ef] px-4 py-2 text-[14px] text-[#7a6f63]">
                    {selectedAgent?.status ?? "draft"}
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <label className="text-left">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8f8172]">
                      Name
                    </span>
                    <input
                      className="mt-2 w-full rounded-[16px] border border-[#dfd2c5] bg-[#fcfaf7] px-4 py-3 text-[16px] outline-none"
                      onChange={(event) => setDraftName(event.target.value)}
                      placeholder="Research operator"
                      type="text"
                      value={draftName}
                    />
                  </label>

                  <label className="text-left">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8f8172]">
                      Purpose
                    </span>
                    <input
                      className="mt-2 w-full rounded-[16px] border border-[#dfd2c5] bg-[#fcfaf7] px-4 py-3 text-[16px] outline-none"
                      onChange={(event) => setDraftPurpose(event.target.value)}
                      placeholder="Summarize research and recommend next steps"
                      type="text"
                      value={draftPurpose}
                    />
                  </label>

                  <label className="text-left">
                    <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8f8172]">
                      System Prompt
                    </span>
                    <textarea
                      className="mt-2 min-h-[170px] w-full rounded-[18px] border border-[#dfd2c5] bg-[#fcfaf7] px-4 py-3 text-[15px] leading-7 outline-none"
                      onChange={(event) => setDraftPrompt(event.target.value)}
                      placeholder="Tell the agent how it should reason, respond, and collaborate."
                      value={draftPrompt}
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="text-left">
                      <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8f8172]">
                        Tools
                      </span>
                      <input
                        className="mt-2 w-full rounded-[16px] border border-[#dfd2c5] bg-[#fcfaf7] px-4 py-3 text-[16px] outline-none"
                        onChange={(event) => setDraftTools(event.target.value)}
                        placeholder={toolsCatalog.join(", ")}
                        type="text"
                        value={draftTools}
                      />
                    </label>

                    <label className="text-left">
                      <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#8f8172]">
                        Memory
                      </span>
                      <input
                        className="mt-2 w-full rounded-[16px] border border-[#dfd2c5] bg-[#fcfaf7] px-4 py-3 text-[16px] outline-none"
                        onChange={(event) => setDraftMemory(event.target.value)}
                        placeholder={memoryCatalog.join(", ")}
                        type="text"
                        value={draftMemory}
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    className="rounded-full bg-[#cc6d2f] px-6 py-3 text-[16px] font-semibold text-white"
                    disabled={isSaving}
                    onClick={() => {
                      void handleSaveAgent();
                    }}
                    type="button"
                  >
                    {isSaving ? "Saving..." : selectedAgentId ? "Update Agent" : "Create Agent"}
                  </button>
                  <button
                    className="rounded-full border border-[#d9cec1] bg-white px-6 py-3 text-[16px] font-semibold text-[#2a241f]"
                    disabled={isSaving}
                    onClick={() => {
                      void handleDeploy();
                    }}
                    type="button"
                  >
                    Deploy Agent
                  </button>
                </div>

                <div className="mt-4 rounded-[18px] border border-[#eee3d8] bg-[#fbf7f1] px-4 py-4 text-[15px] text-[#5f584f]">
                  {statusMessage}
                  {deployedEndpoint ? (
                    <div className="mt-2 text-[14px] text-[#86613d]">
                      Endpoint: <code>{deployedEndpoint}</code>
                    </div>
                  ) : null}
                </div>
              </section>

              <aside className="rounded-[26px] border border-[#e3d8cc] bg-white p-6 shadow-[0_12px_26px_rgba(68,46,24,0.04)]">
                <p className="text-[14px] font-semibold uppercase tracking-[0.08em] text-[#9d8e7d]">
                  Existing Agents
                </p>
                <div className="mt-4 space-y-3">
                  {agents.map((agent) => (
                    <button
                      key={agent.id}
                      className={`w-full rounded-[18px] border px-4 py-4 text-left ${
                        agent.id === selectedAgentId
                          ? "border-[#d37b3a] bg-[#fff4ea]"
                          : "border-[#e6ddd2] bg-[#fcfaf7]"
                      }`}
                      onClick={() => setSelectedAgentId(agent.id)}
                      type="button"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[18px] font-semibold text-[#211c17]">
                          {agent.name}
                        </p>
                        <span className="rounded-full bg-white px-3 py-1 text-[12px] text-[#7e7266]">
                          {agent.status}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] leading-6 text-[#62594f]">
                        {agent.purpose}
                      </p>
                    </button>
                  ))}
                </div>
              </aside>
            </div>
          </section>
        </main>
      </div>
    </section>
  );
};
