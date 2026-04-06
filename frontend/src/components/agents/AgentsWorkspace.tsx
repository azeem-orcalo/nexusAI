import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import type {
  AgentWorkspaceContent,
  AgentWorkspaceSuggestion,
  ApiAgent,
  ApiAgentMessage,
  ApiAgentTask,
  ApiAgentTemplate,
  CreateAgentRequest,
  DeployAgentResponse
} from "../../types/api";

type AgentsWorkspaceProps = {
  agents: ApiAgent[];
  templates: ApiAgentTemplate[];
  onCreateAgent: (payload: CreateAgentRequest) => Promise<ApiAgent>;
  onDeployAgent: (id: string) => Promise<DeployAgentResponse>;
  onUpdateAgent: (
    id: string,
    payload: Partial<CreateAgentRequest>
  ) => Promise<ApiAgent>;
};

type BuilderDraft = {
  name: string;
  category: string;
  purpose: string;
  audience: string;
  prompt: string;
  tools: string[];
  memory: string[];
  tests: string[];
  deployTarget: string;
};

const defaultWorkspaceContent: AgentWorkspaceContent = {
  helperTitle: "Not sure where to start?",
  helperDescription:
    "Chat with our AI guide. Describe what you want your agent to do and get a personalized setup plan.",
  askHubLabel: "Ask the Hub",
  suggestionCategories: [],
  suggestions: []
};

const actionIcons = ["🎙️", "📎", "📹", "🖥️", "🧷", "🖼️", "✦"];
const tagColorClasses = [
  "bg-[#edf2ff] text-[#4d6fd1]",
  "bg-[#eef8f2] text-[#2e9561]",
  "bg-[#fff1ea] text-[#d26d35]",
  "bg-[#f3efff] text-[#7d64d5]"
] as const;

const builderSteps = [
  { id: "purpose", label: "Purpose" },
  { id: "prompt", label: "System Prompt" },
  { id: "tools", label: "Tools & APIs" },
  { id: "memory", label: "Memory" },
  { id: "test", label: "Test" },
  { id: "deploy", label: "Deploy" }
] as const;

const builderCategories = [
  "Customer Support",
  "Research & Data",
  "Code & Dev",
  "Sales & CRM",
  "Content & Writing",
  "Operations",
  "Finance & Reports",
  "Something else"
] as const;

const builderPurposeIdeas = [
  "Answer customer questions and escalate unresolved issues",
  "Search the web and write structured research reports",
  "Review code for bugs and suggest improvements",
  "Draft emails, posts, and marketing content",
  "Summarise meetings and extract action items"
] as const;

const builderToolOptions = [
  { id: "search", title: "Web Search", description: "Search the web in real time for up-to-date information." },
  { id: "documents", title: "Database Lookup", description: "Query your database or vector store for internal knowledge." },
  { id: "email", title: "Email Sender", description: "Send emails and notifications on behalf of the agent." },
  { id: "calendar", title: "Calendar API", description: "Read and write calendar events and schedules." },
  { id: "slack", title: "Slack Webhook", description: "Post alerts and summaries to Slack channels." },
  { id: "jira", title: "Jira", description: "Create and update Jira tickets automatically." },
  { id: "sheets", title: "Google Sheets", description: "Read from and write to spreadsheets." },
  { id: "functions", title: "Custom Function", description: "Define custom JSON actions for your workflow." }
] as const;

const builderTestScenarios = [
  "Normal use case - typical user query",
  "Edge case - unexpected or out-of-scope request",
  "Escalation trigger - billing or security issue",
  "Empty or very short input",
  "Multilingual input",
  "Follow-up questions needing context"
] as const;

const deployTargets = [
  { id: "api", title: "API Endpoint", description: "Get a REST endpoint for app or backend integration." },
  { id: "widget", title: "Embed Widget", description: "Drop a chat widget onto your website with one line of code." },
  { id: "slack-bot", title: "Slack Bot", description: "Deploy your agent to an internal Slack workspace." },
  { id: "whatsapp", title: "WhatsApp / SMS", description: "Connect the agent to messaging channels." }
] as const;

const createDraft = (seed?: Partial<BuilderDraft>): BuilderDraft => ({
  name: seed?.name ?? "",
  category: seed?.category ?? "Research & Data",
  purpose: seed?.purpose ?? "",
  audience: seed?.audience ?? "Internal team members",
  prompt: seed?.prompt ?? "",
  tools: seed?.tools ?? ["search", "documents"],
  memory: seed?.memory ?? ["project-context"],
  tests: seed?.tests ?? ["Normal use case - typical user query", "Edge case - unexpected or out-of-scope request"],
  deployTarget: seed?.deployTarget ?? "api"
});

const BuilderModal = ({
  draft,
  isSaving,
  mode,
  onChange,
  onClose,
  onFinish
}: {
  draft: BuilderDraft;
  isSaving: boolean;
  mode: "create" | "edit";
  onChange: (nextDraft: BuilderDraft) => void;
  onClose: () => void;
  onFinish: () => void;
}): JSX.Element => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setStepIndex(0);
  }, [draft.name, mode]);

  const isLastStep = stepIndex === builderSteps.length - 1;
  const generatedPrompt = `You are ${draft.name || "AI Assistant"}, an AI agent specializing in ${draft.category.toLowerCase()}.\n\n## Role\n${draft.purpose || "Help users with their requests clearly and accurately."}\n\n## Audience\n${draft.audience || "General users"}\n\n## Tools\n${draft.tools.length > 0 ? draft.tools.join(", ") : "No external tools"}\n\n## Memory\n${draft.memory.length > 0 ? draft.memory.join(", ") : "No memory"}\n\n## Style\nBe practical, structured, and outcome-focused. Escalate when requests are outside scope or need human review.`;

  const toggleTool = (toolId: string): void => {
    onChange({
      ...draft,
      tools: draft.tools.includes(toolId)
        ? draft.tools.filter((item) => item !== toolId)
        : [...draft.tools, toolId]
    });
  };

  const toggleTest = (testName: string): void => {
    onChange({
      ...draft,
      tests: draft.tests.includes(testName)
        ? draft.tests.filter((item) => item !== testName)
        : [...draft.tests, testName]
    });
  };

  return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(22,18,13,0.46)] p-4">
        <div className="flex h-[94vh] w-full max-w-[1080px] flex-col overflow-hidden rounded-[34px] bg-white shadow-[0_24px_80px_rgba(35,24,14,0.28)]">
          <div className="flex items-center justify-between border-b border-[#ece3d8] px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#c8622a] text-[18px] text-white">◆</div>
              <div>
                <h3 className="text-[30px] font-semibold tracking-[-0.04em]">
                  {stepIndex === 0
                    ? "Define your agent's purpose"
                    : builderSteps[stepIndex].label}
                </h3>
                <p className="mt-1 text-[14px] text-[#8f8173]">
                  Step {stepIndex + 1} of {builderSteps.length}
                </p>
              </div>
            </div>
            <button
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ddcfc2] text-[22px]"
              onClick={onClose}
              type="button"
            >
              ×
            </button>
          </div>

          <div className="border-b border-[#ece3d8] px-6 py-3">
            <div className="flex flex-wrap gap-5">
              {builderSteps.map((step, index) => {
                const active = index === stepIndex;
                const completed = index < stepIndex;

                return (
                  <button
                    key={step.id}
                    className={`flex items-center gap-2 border-b-2 pb-2 text-[15px] ${
                      active
                        ? "border-[#c8622a] text-[#211913]"
                        : "border-transparent text-[#9b8e81]"
                    }`}
                    onClick={() => setStepIndex(index)}
                    type="button"
                  >
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold ${
                        completed || active
                          ? "bg-[#c8622a] text-white"
                          : "bg-[#ebe5de] text-[#85796d]"
                      }`}
                    >
                      {completed ? "✓" : index + 1}
                    </span>
                    <span className={active ? "font-semibold" : ""}>{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto bg-[#f9f6f1] px-6 py-6">
            {stepIndex === 0 ? (
              <div className="space-y-6">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#d07033]">
                    Step 1 of 6
                  </p>
                  <p className="mt-3 text-[16px] text-[#685d53]">
                    Answer a few quick questions. We'll use your answers to build the perfect agent.
                  </p>
                </div>

                <label className="block">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9b8e81]">
                    Question 1 of 4
                  </span>
                  <p className="mt-2 text-[16px] font-semibold text-[#2b221c]">
                    What do you want to call your agent?
                  </p>
                  <input
                    className="mt-3 w-full rounded-[14px] border border-[#ddd2c6] bg-white px-4 py-3 text-[15px] outline-none"
                    onChange={(event) => onChange({ ...draft, name: event.target.value })}
                    placeholder="e.g. Support Bot, Research Assistant, Code Reviewer..."
                    value={draft.name}
                  />
                </label>

                <div>
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9b8e81]">
                    Question 2 of 4
                  </span>
                  <p className="mt-2 text-[16px] font-semibold text-[#2b221c]">
                    What kind of agent is this?
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {builderCategories.map((category) => (
                      <button
                        key={category}
                        className={`rounded-full border px-4 py-2 text-[14px] ${
                          draft.category === category
                            ? "border-[#d67f45] bg-[#fff1e8] text-[#bc6227]"
                            : "border-[#d9d0c6] bg-white text-[#554a40]"
                        }`}
                        onClick={() => onChange({ ...draft, category })}
                        type="button"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9b8e81]">
                    Question 3 of 4
                  </span>
                  <p className="mt-2 text-[16px] font-semibold text-[#2b221c]">
                    What's the main job?
                  </p>
                  <textarea
                    className="mt-3 min-h-[120px] w-full rounded-[18px] border border-[#ddd2c6] bg-white px-4 py-3 text-[15px] leading-7 outline-none"
                    onChange={(event) => onChange({ ...draft, purpose: event.target.value })}
                    placeholder="e.g. Answer customer questions, handle returns, and create support tickets for issues we can't resolve."
                    value={draft.purpose}
                  />
                  <div className="mt-3 flex flex-wrap gap-2">
                    {builderPurposeIdeas.map((idea) => (
                      <button
                        key={idea}
                        className="rounded-full border border-[#f0c8ae] bg-[#fff7f1] px-3 py-2 text-[13px] text-[#d26d35]"
                        onClick={() => onChange({ ...draft, purpose: idea })}
                        type="button"
                      >
                        {idea}
                      </button>
                    ))}
                  </div>
                </label>

                <label className="block">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#9b8e81]">
                    Question 4 of 4
                  </span>
                  <p className="mt-2 text-[16px] font-semibold text-[#2b221c]">
                    Who will be talking to this agent?
                  </p>
                  <input
                    className="mt-3 w-full rounded-[14px] border border-[#ddd2c6] bg-white px-4 py-3 text-[15px] outline-none"
                    onChange={(event) => onChange({ ...draft, audience: event.target.value })}
                    placeholder="e.g. Customers, internal ops team, marketing managers"
                    value={draft.audience}
                  />
                </label>
              </div>
            ) : null}

            {stepIndex === 1 ? (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#d07033]">
                      Step 2 of 6
                    </p>
                    <p className="mt-3 text-[16px] text-[#685d53]">
                      The system prompt defines the agent's role, scope, and behavior.
                    </p>
                  </div>
                  <button
                    className="rounded-full border border-[#f0c8ae] bg-[#fff7f1] px-4 py-2 text-[14px] font-semibold text-[#d26d35]"
                    onClick={() => onChange({ ...draft, prompt: generatedPrompt })}
                    type="button"
                  >
                    Regenerate from answers
                  </button>
                </div>

                <div className="rounded-[14px] border border-[#bfe4d7] bg-[#e9faf4] px-4 py-3 text-[14px] text-[#2f8b67]">
                  Auto-generated from your Step 1 answers. Edit freely below.
                </div>

                <textarea
                  className="min-h-[300px] w-full rounded-[18px] border border-[#ddd2c6] bg-white px-4 py-3 font-mono text-[14px] leading-7 outline-none"
                  onChange={(event) => onChange({ ...draft, prompt: event.target.value })}
                  value={draft.prompt}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[20px] border border-[#e5d8ca] bg-white p-5">
                    <p className="text-[18px] font-semibold text-[#2f8b67]">Include</p>
                    <ul className="mt-3 space-y-2 text-[14px] text-[#64584d]">
                      <li>Agent persona and role</li>
                      <li>Scope and escalation rules</li>
                      <li>Tone and response length</li>
                      <li>Allowed tools and limitations</li>
                    </ul>
                  </div>
                  <div className="rounded-[20px] border border-[#e5d8ca] bg-white p-5">
                    <p className="text-[18px] font-semibold text-[#d25663]">Avoid</p>
                    <ul className="mt-3 space-y-2 text-[14px] text-[#64584d]">
                      <li>Vague instructions</li>
                      <li>Contradictory rules</li>
                      <li>Unnecessary jargon</li>
                      <li>Missing edge cases</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#d07033]">
                    Step 3 of 6
                  </p>
                  <p className="mt-3 text-[16px] text-[#685d53]">
                    Equip your agent with the right tools and APIs.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {builderToolOptions.map((tool) => {
                    const active = draft.tools.includes(tool.id);

                    return (
                      <button
                        key={tool.id}
                        className={`rounded-[20px] border bg-white p-5 text-left ${
                          active
                            ? "border-[#d67f45] shadow-[0_8px_24px_rgba(204,109,47,0.12)]"
                            : "border-[#e5d8ca]"
                        }`}
                        onClick={() => toggleTool(tool.id)}
                        type="button"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[22px] font-semibold tracking-[-0.03em] text-[#241b16]">
                            {tool.title}
                          </p>
                          <span
                            className={`flex h-5 w-5 rounded-[6px] border ${
                              active ? "border-[#d67f45] bg-[#d67f45]" : "border-[#cfc3b6] bg-white"
                            }`}
                          />
                        </div>
                        <p className="mt-3 text-[14px] leading-7 text-[#6b6156]">
                          {tool.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#d07033]">
                    Step 4 of 6
                  </p>
                  <p className="mt-3 text-[16px] text-[#685d53]">
                    Configure short-term and long-term memory for this agent.
                  </p>
                </div>

                {[
                  {
                    id: "none",
                    title: "No Memory",
                    value: [] as string[],
                    description: "Stateless. Each conversation starts fresh."
                  },
                  {
                    id: "short",
                    title: "Short-term Only",
                    value: ["project-context"],
                    description: "Maintains conversation history within a session."
                  },
                  {
                    id: "long",
                    title: "Short + Long-term",
                    value: ["project-context", "user-preferences", "knowledge-store"],
                    description: "Persists key facts and preferences across sessions."
                  }
                ].map((option) => {
                  const active =
                    draft.memory.join("|") === option.value.join("|");

                  return (
                    <button
                      key={option.id}
                      className={`block w-full rounded-[22px] border bg-white px-5 py-5 text-left ${
                        active
                          ? "border-[#d67f45] bg-[#fff7f2]"
                          : "border-[#e5d8ca]"
                      }`}
                      onClick={() => onChange({ ...draft, memory: option.value })}
                      type="button"
                    >
                      <p className="text-[24px] font-semibold tracking-[-0.03em] text-[#231b15]">
                        {option.title}
                      </p>
                      <p className="mt-2 text-[15px] text-[#675c51]">
                        {option.description}
                      </p>
                    </button>
                  );
                })}

                <div className="rounded-[18px] border border-[#f2ddb0] bg-[#fff8e8] px-4 py-4 text-[14px] text-[#9a6c1b]">
                  Pro tip: use long-term memory for preferences, summaries, and stable context. Avoid storing raw conversation logs.
                </div>
              </div>
            ) : null}

            {stepIndex === 4 ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#d07033]">
                    Step 5 of 6
                  </p>
                  <p className="mt-3 text-[16px] text-[#685d53]">
                    Test the agent with recommended scenarios before deployment.
                  </p>
                </div>

                <div className="space-y-3">
                  {builderTestScenarios.map((scenario, index) => {
                    const active = draft.tests.includes(scenario);

                    return (
                      <button
                        key={scenario}
                        className="flex w-full items-center justify-between rounded-[16px] border border-[#e5d8ca] bg-white px-4 py-4 text-left"
                        onClick={() => toggleTest(scenario)}
                        type="button"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-5 w-5 rounded-[6px] border ${
                              active ? "border-[#d67f45] bg-[#d67f45]" : "border-[#cfc3b6] bg-white"
                            }`}
                          />
                          <span className="text-[15px] text-[#332921]">{scenario}</span>
                        </div>
                        <span className="text-[13px] text-[#a29386]">Scenario {index + 1}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {stepIndex === 5 ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[#d07033]">
                    Step 6 of 6
                  </p>
                  <p className="mt-3 text-[16px] text-[#685d53]">
                    Choose how to deploy and monitor this agent.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {deployTargets.map((target) => (
                    <button
                      key={target.id}
                      className={`rounded-[22px] border bg-white p-5 text-left ${
                        draft.deployTarget === target.id
                          ? "border-[#d67f45] shadow-[0_8px_24px_rgba(204,109,47,0.12)]"
                          : "border-[#e5d8ca]"
                      }`}
                      onClick={() => onChange({ ...draft, deployTarget: target.id })}
                      type="button"
                    >
                      <p className="text-[24px] font-semibold tracking-[-0.03em] text-[#241b16]">
                        {target.title}
                      </p>
                      <p className="mt-3 text-[14px] leading-7 text-[#6b6156]">
                        {target.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="rounded-[22px] border border-[#e5d8ca] bg-white p-5">
                  <p className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#9b8e81]">
                    Dashboard Metrics
                  </p>
                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    {[
                      { label: "Response Quality", value: "94%" },
                      { label: "Avg Latency", value: "1.2s" },
                      { label: "Token Usage", value: "12.4K/day" },
                      { label: "Satisfaction", value: "4.7★" }
                    ].map((metric) => (
                      <div key={metric.label} className="rounded-[18px] border border-[#efe6dc] bg-[#fbf8f3] px-4 py-5 text-center">
                        <p className="text-[28px] font-semibold tracking-[-0.03em] text-[#201812]">{metric.value}</p>
                        <p className="mt-2 text-[13px] text-[#86796d]">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center justify-between border-t border-[#ece3d8] bg-white px-6 py-5">
            <button
              className="rounded-full border border-[#ddcfc2] px-5 py-3 text-[14px] font-semibold"
              onClick={() => {
                if (stepIndex === 0) {
                  onClose();
                  return;
                }
                setStepIndex((current) => current - 1);
              }}
              type="button"
            >
              ← Back
            </button>

            <div className="flex items-center gap-2">
              {builderSteps.map((step, index) => (
                <span
                  key={step.id}
                  className={`h-2.5 rounded-full ${
                    index === stepIndex ? "w-7 bg-[#c8622a]" : "w-2.5 bg-[#ddd6cf]"
                  }`}
                />
              ))}
            </div>

            <button
              className="rounded-full bg-[#c8622a] px-6 py-3 text-[14px] font-semibold text-white"
              disabled={isSaving}
              onClick={() => {
                if (isLastStep) {
                  onFinish();
                  return;
                }

                setStepIndex((current) => current + 1);
              }}
              type="button"
            >
              {isLastStep ? (isSaving ? "Saving..." : "Finish") : "Next →"}
            </button>
          </div>
        </div>
      </div>
  );
};

export const AgentsWorkspace = ({
  agents,
  templates,
  onCreateAgent,
  onDeployAgent,
  onUpdateAgent
}: AgentsWorkspaceProps): JSX.Element => {
  const [workspaceContent, setWorkspaceContent] = useState<AgentWorkspaceContent>(defaultWorkspaceContent);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("use-cases");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id ?? "");
  const [tasks, setTasks] = useState<ApiAgentTask[]>([]);
  const [composerText, setComposerText] = useState<string>("");
  const [builderOpen, setBuilderOpen] = useState<boolean>(false);
  const [showNewAgentLibrary, setShowNewAgentLibrary] = useState<boolean>(false);
  const [builderDraft, setBuilderDraft] = useState<BuilderDraft>(createDraft());
  const [builderMode, setBuilderMode] = useState<"create" | "edit">("create");
  const [statusMessage, setStatusMessage] = useState<string>("Choose a suggestion, template, or create a new agent.");
  const [chatAgentId, setChatAgentId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ApiAgentMessage[]>([]);
  const [chatDraft, setChatDraft] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const selectedAgent = useMemo(() => agents.find((agent) => agent.id === selectedAgentId) ?? agents[0] ?? null, [agents, selectedAgentId]);
  const chatAgent = useMemo(() => agents.find((agent) => agent.id === chatAgentId) ?? null, [agents, chatAgentId]);
  const filteredSuggestions = useMemo(() => {
    const base = workspaceContent.suggestions;
    return selectedCategoryId ? base.filter((item) => item.categoryId === selectedCategoryId) : base;
  }, [selectedCategoryId, workspaceContent.suggestions]);

  useEffect(() => {
    if (!selectedAgentId && agents[0]?.id) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  useEffect(() => {
    void api.agentWorkspaceContent().then((content) => {
      setWorkspaceContent(content);
      setSelectedCategoryId(content.suggestionCategories[0]?.id ?? "use-cases");
    }).catch(() => {
      setWorkspaceContent(defaultWorkspaceContent);
    });
  }, []);

  useEffect(() => {
    if (!selectedAgentId) {
      setTasks([]);
      return;
    }

    void api.agentTasks(selectedAgentId).then((nextTasks) => setTasks(nextTasks)).catch(() => setTasks([]));
  }, [selectedAgentId]);

  useEffect(() => {
    if (!chatAgentId) {
      setChatMessages([]);
      return;
    }

    void api.agentMessages(chatAgentId).then((messages) => setChatMessages(messages)).catch(() => setChatMessages([]));
  }, [chatAgentId]);

  const openCreateBuilder = (seed?: Partial<BuilderDraft>): void => {
    setBuilderMode("create");
    setBuilderDraft(createDraft(seed));
    setShowNewAgentLibrary(false);
    setBuilderOpen(true);
  };

  const openEditBuilder = (): void => {
    if (!selectedAgent) {
      openCreateBuilder();
      return;
    }

    setBuilderMode("edit");
    setBuilderDraft(createDraft({
      name: selectedAgent.name,
      category: selectedAgent.category,
      purpose: selectedAgent.purpose,
      audience: selectedAgent.audience,
      prompt: selectedAgent.prompt,
      tools: selectedAgent.tools,
      memory: selectedAgent.memory,
      tests: selectedAgent.tests,
      deployTarget: selectedAgent.deployTarget
    }));
    setBuilderOpen(true);
  };
  const handleSuggestionClick = (item: AgentWorkspaceSuggestion): void => {
    setComposerText(item.prompt);
    openCreateBuilder({ name: item.title, purpose: item.title, prompt: item.prompt });
    setStatusMessage("Suggestion loaded from backend. Finish the builder to create the agent.");
  };

  const handleTemplateClick = (template: ApiAgentTemplate): void => {
    openCreateBuilder({
      name: template.name,
      purpose: template.description ?? `Build a ${template.name.toLowerCase()} workflow.`,
      prompt: `You are ${template.name}. ${template.description ?? "Work clearly, stay focused, and produce useful output."}`
    });
    setStatusMessage(`${template.name} template loaded from backend.`);
  };

  const handleCreateOrUpdateAgent = async (): Promise<void> => {
    if (!builderDraft.name.trim() || !builderDraft.purpose.trim() || !builderDraft.prompt.trim()) {
      setStatusMessage("Name, purpose, and prompt are required.");
      return;
    }

    setIsSaving(true);
    try {
      const payload: CreateAgentRequest = {
        name: builderDraft.name.trim(),
        category: builderDraft.category,
        purpose: builderDraft.purpose.trim(),
        audience: builderDraft.audience.trim(),
        prompt: builderDraft.prompt.trim(),
        tools: builderDraft.tools,
        memory: builderDraft.memory,
        tests: builderDraft.tests,
        deployTarget: builderDraft.deployTarget
      };

      const savedAgent = builderMode === "edit" && selectedAgentId
        ? await onUpdateAgent(selectedAgentId, payload)
        : await onCreateAgent(payload);

      await onDeployAgent(savedAgent.id);
      setSelectedAgentId(savedAgent.id);
      setBuilderOpen(false);
      setShowNewAgentLibrary(false);
      setChatAgentId(savedAgent.id);
      setStatusMessage(`${savedAgent.name} is ready and its chat is now open.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTask = async (): Promise<void> => {
    if (!selectedAgentId) {
      setStatusMessage("Create or select an agent first.");
      return;
    }

    const createdTask = await api.createAgentTask(selectedAgentId, { name: `New Task ${tasks.length + 1}` });
    setTasks((current) => [...current, createdTask]);
  };

  const handleSendAgentMessage = async (): Promise<void> => {
    const text = chatDraft.trim();
    if (!text || !chatAgentId) {
      return;
    }

    setChatDraft("");
    await api.addAgentMessage(chatAgentId, { text });
    const refreshed = await api.agentMessages(chatAgentId);
    setChatMessages(refreshed);
  };

  if (chatAgent) {
    const quickPrompts = ["What can you do?", "Give me a quick summary", "Show me an example", "How do you handle errors?", "What are your limits?"];

    return (
      <section className="min-h-[calc(100vh-53px)] bg-[#f6f2ec] text-[#1e1915]">
        <div className="border-b border-[#e6ddd3] bg-white px-5 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="rounded-full border border-[#ddcfc2] px-4 py-2 text-[14px]" onClick={() => setChatAgentId(null)} type="button">← Agents</button>
              <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#c8622a] text-[15px] font-semibold text-white">{chatAgent.name.slice(0, 2).toUpperCase()}</div>
              <div>
                <div className="flex items-center gap-2"><h2 className="text-[30px] font-semibold tracking-[-0.04em]">{chatAgent.name}</h2><span className="rounded-full bg-[#e4f7ed] px-3 py-1 text-[12px] font-semibold text-[#168b55]">Live</span></div>
                <p className="mt-1 text-[14px] text-[#7b6f63]">{chatAgent.category ?? "Custom Agent"} · Tools: {chatAgent.tools.join(", ") || "None"} · Memory: {chatAgent.memory.join(", ") || "None"}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2"><button className="rounded-full border border-[#ddd1c4] bg-white px-4 py-2 text-[14px]" onClick={openEditBuilder} type="button">Edit Agent</button></div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">{quickPrompts.map((prompt) => <button key={prompt} className="rounded-full border border-[#ddd1c4] bg-[#faf7f2] px-4 py-2 text-[13px] text-[#4f453c]" onClick={() => setChatDraft(prompt)} type="button">{prompt}</button>)}</div>
        </div>

        <div className="grid min-h-[calc(100vh-160px)] grid-cols-[minmax(0,1fr)_240px]">
          <div className="flex flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-5 py-6">
              {chatMessages.length === 0 ? <div className="max-w-[360px] rounded-[22px] border border-[#eadfd2] bg-white px-5 py-4"><p className="text-[20px]">Hi! I'm <span className="font-semibold">{chatAgent.name}</span>.</p><p className="mt-5 text-[16px]">How can I help you today?</p></div> : chatMessages.map((message) => <article key={message.id} className={`max-w-[680px] rounded-[22px] border px-5 py-4 ${message.role === "user" ? "ml-auto border-[#ead7c8] bg-[#fff4ea]" : "border-[#ece2d8] bg-white"}`}><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#a18f81]">{message.role === "user" ? "You" : chatAgent.name}</p><p className="mt-3 text-[15px] leading-7 text-[#2f2620]">{message.text}</p></article>)}
            </div>
            <div className="border-t border-[#e6ddd3] bg-white px-5 py-4">
              <div className="rounded-[24px] border border-[#d9c7b8] bg-[#fbf8f3] p-4">
                <textarea className="min-h-[88px] w-full resize-none bg-transparent text-[16px] outline-none placeholder:text-[#9b8e81]" onChange={(event) => setChatDraft(event.target.value)} placeholder="Describe your project, ask a question, or just say hi. I'm here to help..." rows={3} value={chatDraft} />
                <div className="mt-3 flex items-center justify-between gap-3 border-t border-[#e6ddd3] pt-3">
                  <div className="flex gap-2">{actionIcons.slice(0, 6).map((icon, index) => <span key={`${icon}-${index}`} className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e5d8ca] bg-white text-[16px]">{icon}</span>)}</div>
                  <button className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#c96b2e] text-white" onClick={() => void handleSendAgentMessage()} type="button">➤</button>
                </div>
              </div>
            </div>
          </div>

          <aside className="border-l border-[#e6ddd3] bg-white px-4 py-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a09081]">Agent Info</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-[18px] bg-[#f7f2eb] p-4"><p className="text-[13px] text-[#9d8f81]">Status</p><p className="mt-2 text-[18px] font-semibold text-[#168b55]">Deployed & Live</p></div>
              <div className="rounded-[18px] bg-[#f7f2eb] p-4"><p className="text-[13px] text-[#9d8f81]">Audience</p><p className="mt-2 text-[18px] font-semibold">{chatAgent.audience || "General users"}</p></div>
              <div className="rounded-[18px] bg-[#f7f2eb] p-4"><p className="text-[13px] text-[#9d8f81]">Memory</p><p className="mt-2 text-[18px] font-semibold">{chatAgent.memory.join(", ") || "None"}</p></div>
              <div className="rounded-[18px] bg-[#f7f2eb] p-4"><p className="text-[13px] text-[#9d8f81]">Tools Connected</p><p className="mt-2 text-[18px] font-semibold">{chatAgent.tools.join(", ") || "None"}</p></div>
              <div className="rounded-[18px] bg-[#f7f2eb] p-4"><p className="text-[13px] text-[#9d8f81]">Deploy Target</p><p className="mt-2 text-[18px] font-semibold">{chatAgent.deployTarget || "api"}</p></div>
            </div>
          </aside>
        </div>

        {builderOpen ? <BuilderModal draft={builderDraft} isSaving={isSaving} mode={builderMode} onChange={setBuilderDraft} onClose={() => setBuilderOpen(false)} onFinish={() => void handleCreateOrUpdateAgent()} /> : null}
      </section>
    );
  }
  if (showNewAgentLibrary) {
    return (
      <section className="min-h-[calc(100vh-53px)] bg-[#f7f3ee] text-[#1d1915]">
        <div className="grid min-h-[calc(100vh-53px)] xl:grid-cols-[268px_252px_minmax(0,1fr)]">
          <aside className="border-r border-[#e6ddd3] bg-white px-3 py-6">
            <div className="px-3">
              <div className="flex items-start gap-3"><div className="mt-1 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#c8622a] text-[18px] text-white">🤖</div><div><h2 className="text-[34px] font-semibold tracking-[-0.05em]">Agent Builder</h2><p className="mt-2 text-[15px] leading-6 text-[#6e645a]">Create powerful AI agents using any model. Pick a template or start from scratch.</p></div></div>
              <button className="mt-6 w-full rounded-full border border-[#d9cec2] bg-[#fbf8f3] px-5 py-4 text-[18px] font-semibold text-[#2a231d]" onClick={() => setShowNewAgentLibrary(false)} type="button">← Back</button>
            </div>

            <div className="mx-3 mt-5 rounded-[24px] border border-[#efc8ae] bg-[#fff7f0] p-5">
              <p className="text-[20px] font-semibold tracking-[-0.03em]">{workspaceContent.helperTitle}</p>
              <p className="mt-3 text-[15px] leading-7 text-[#6f6459]">{workspaceContent.helperDescription}</p>
              <button className="mt-5 rounded-full border border-[#dcc7b6] bg-white px-4 py-3 text-[15px] font-medium" onClick={() => setComposerText("Help me plan the right agent for my workflow.")} type="button">{workspaceContent.askHubLabel} →</button>
            </div>

            <div className="mt-5 border-t border-[#ece3d8] px-3 pt-5">
              <div className="flex items-center justify-between rounded-[18px] border border-dashed border-[#d6c8bb] bg-[#fbf8f3] px-4 py-3"><span className="text-[14px] font-semibold">+ New Task</span><button className="text-[14px] text-[#7d7063]" onClick={() => void handleAddTask()} type="button">Add</button></div>
              <div className="mt-4 space-y-1">{tasks.map((task) => <button key={task.id} className="flex w-full items-center gap-3 border-b border-[#efe7dd] px-3 py-4 text-left" onClick={() => setSelectedAgentId(task.agentId)} type="button"><span className="h-5 w-5 rounded-[6px] border border-[#d8cdc1] bg-white" /><span className="truncate text-[15px] text-[#2e271f]">{task.name}</span></button>)}</div>
            </div>
          </aside>

          <aside className="border-r border-[#e6ddd3] bg-white">
            <div className="flex items-center justify-between border-b border-[#ece3d8] px-5 py-5"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#c8622a] text-[15px] font-semibold text-white">🤖</div><div><h3 className="text-[18px] font-semibold">My Agents</h3><p className="text-[13px] text-[#8e8276]">Choose a saved agent</p></div></div><button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd0c4] text-[22px]" onClick={() => setShowNewAgentLibrary(false)} type="button">×</button></div>
            <div className="space-y-3 px-3 py-4">{agents.map((agent) => <button key={agent.id} className={`flex w-full items-center justify-between rounded-[18px] border px-4 py-4 text-left ${selectedAgentId === agent.id ? "border-[#ead8c9] bg-[#faf7f2]" : "border-transparent bg-white hover:border-[#eadfd2]"}`} onClick={() => setSelectedAgentId(agent.id)} type="button"><div className="flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef2fb] text-[16px]">{agent.name.slice(0, 1).toUpperCase()}</div><div><p className="text-[16px] font-semibold">{agent.name}</p><p className="text-[13px] text-[#8b8074]">{agent.tools[0] ?? "No tools"}</p></div></div><span className="h-3 w-3 rounded-full bg-[#35c46a]" /></button>)}</div>
            <div className="border-t border-[#ece3d8] p-3"><button className="w-full rounded-[18px] bg-[#c8622a] px-5 py-4 text-[18px] font-semibold text-white" onClick={() => openCreateBuilder()} type="button">Create Custom Agent</button></div>
          </aside>

          <main className="bg-[#fbf9f5]">
            <div className="flex items-center justify-between border-b border-[#e8ded4] bg-white px-6 py-5"><div><h2 className="text-[34px] font-semibold tracking-[-0.04em]">Agent Library</h2><p className="mt-1 text-[15px] text-[#7d7165]">Choose a default agent or build your own</p></div><span className="rounded-full bg-[#1d1915] px-4 py-3 text-[14px] font-semibold text-white">Default Agents</span></div>
            <div className="px-6 py-5">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {templates.map((template) => <button key={`library-${template.id}`} className="rounded-[22px] border border-[#e7ddd2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#dbbda2]" onClick={() => handleTemplateClick(template)} type="button"><div className="flex items-center gap-3"><span className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#f5f0ea] text-[24px]">{template.icon ?? "🤖"}</span><p className="text-[18px] font-semibold leading-6 tracking-[-0.03em]">{template.name}</p></div><p className="mt-4 min-h-[72px] text-[14px] leading-7 text-[#6b6156]">{template.description ?? "Configure this template for your workflow."}</p><div className="mt-4 flex flex-wrap gap-2">{(template.tags ?? []).slice(0, 3).map((tag, index) => <span key={`${template.id}-${tag}`} className={`rounded-full px-3 py-1 text-[12px] ${tagColorClasses[index % tagColorClasses.length]}`}>{tag}</span>)}</div></button>)}
                <button className="rounded-[22px] border border-dashed border-[#d8cdc1] bg-[#fbf8f3] p-5 text-center" onClick={() => openCreateBuilder()} type="button"><div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#f3eee8] text-[30px] text-[#8e8074]">+</div><p className="mt-6 text-[24px] font-semibold tracking-[-0.03em] text-[#544a41]">Build from Scratch</p><p className="mt-2 text-[14px] text-[#908377]">Create a fully custom agent</p></button>
              </div>

              <div className="mt-6 border-t border-[#e8ded4] pt-5">
                <div className="mb-4 flex items-center gap-2"><p className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#9b8e81]">Agent Templates</p><span className="rounded-[8px] bg-[#f0e8de] px-2 py-1 text-[12px]">{templates.length}</span></div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                  {templates.map((template) => <button key={`footer-${template.id}`} className="rounded-[22px] border border-[#e7ddd2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#dbbda2]" onClick={() => handleTemplateClick(template)} type="button"><div className="flex items-center gap-3"><span className="text-[24px]">{template.icon ?? "🤖"}</span><p className="text-[20px] font-semibold tracking-[-0.03em]">{template.name}</p></div><p className="mt-4 min-h-[76px] text-[14px] leading-7 text-[#6b6156]">{template.description ?? "Configure this template for your workflow."}</p><div className="mt-4 flex flex-wrap gap-2">{(template.tags ?? []).slice(0, 2).map((tag, index) => <span key={`${template.id}-footer-${tag}`} className={`rounded-full px-3 py-1 text-[12px] ${tagColorClasses[index % tagColorClasses.length]}`}>{tag}</span>)}</div></button>)}
                  <button className="rounded-[22px] border border-dashed border-[#e7c9b5] bg-[#fff5ed] p-5 text-center" onClick={() => openCreateBuilder()} type="button"><div className="mt-6 text-[34px]">+</div><p className="mt-6 text-[24px] font-semibold tracking-[-0.03em] text-[#c6672d]">Build from Scratch</p></button>
                </div>
              </div>

              <div className="mt-6 border-t border-[#e8ded4] pt-5">
                <div className="mb-4 flex items-center gap-2"><p className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#9b8e81]">Saved Agents</p><span className="rounded-[8px] bg-[#f0e8de] px-2 py-1 text-[12px]">{agents.length}</span></div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {agents.map((agent) => <button key={`saved-${agent.id}`} className="rounded-[22px] border border-[#e7ddd2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#dbbda2]" onClick={() => { setSelectedAgentId(agent.id); setChatAgentId(agent.id); }} type="button"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef2fb] text-[16px]">{agent.name.slice(0, 1).toUpperCase()}</span><div><p className="text-[18px] font-semibold tracking-[-0.03em]">{agent.name}</p><p className="text-[13px] text-[#8b8074]">{agent.category ?? "Custom Agent"}</p></div></div><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${agent.status === "deployed" ? "bg-[#e4f7ed] text-[#168b55]" : "bg-[#f2ebe2] text-[#8a7b6c]"}`}>{agent.status}</span></div><p className="mt-4 line-clamp-3 text-[14px] leading-7 text-[#6b6156]">{agent.purpose}</p><div className="mt-4 flex flex-wrap gap-2">{(agent.tools ?? []).slice(0, 3).map((tool, index) => <span key={`${agent.id}-${tool}`} className={`rounded-full px-3 py-1 text-[12px] ${tagColorClasses[index % tagColorClasses.length]}`}>{tool}</span>)}</div></button>)}
                </div>
              </div>
            </div>
          </main>
        </div>

        {builderOpen ? <BuilderModal draft={builderDraft} isSaving={isSaving} mode={builderMode} onChange={setBuilderDraft} onClose={() => setBuilderOpen(false)} onFinish={() => void handleCreateOrUpdateAgent()} /> : null}
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-53px)] bg-[#f7f3ee] text-[#1d1915]">
      <div className="grid min-h-[calc(100vh-53px)] xl:grid-cols-[268px_minmax(0,1fr)]">
        <aside className="border-r border-[#e6ddd3] bg-white px-3 py-6">
          <div className="px-3">
            <div className="flex items-start gap-3"><div className="mt-1 flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#c8622a] text-[18px] text-white">🤖</div><div><h2 className="text-[34px] font-semibold tracking-[-0.05em]">Agent Builder</h2><p className="mt-2 text-[15px] leading-6 text-[#6e645a]">Create powerful AI agents using any model. Pick a template or start from scratch.</p></div></div>
            <button className="mt-6 w-full rounded-full bg-[#c8622a] px-5 py-4 text-[18px] font-semibold text-white" onClick={() => setShowNewAgentLibrary(true)} type="button">+ New Agent</button>
          </div>

          <div className="mx-3 mt-5 rounded-[24px] border border-[#efc8ae] bg-[#fff7f0] p-5">
            <p className="text-[20px] font-semibold tracking-[-0.03em]">{workspaceContent.helperTitle}</p>
            <p className="mt-3 text-[15px] leading-7 text-[#6f6459]">{workspaceContent.helperDescription}</p>
            <button className="mt-5 rounded-full border border-[#dcc7b6] bg-white px-4 py-3 text-[15px] font-medium" onClick={() => setComposerText("Help me plan the right agent for my workflow.")} type="button">{workspaceContent.askHubLabel} →</button>
          </div>

          <div className="mt-5 border-t border-[#ece3d8] px-3 pt-5">
            <div className="flex items-center justify-between rounded-[18px] border border-dashed border-[#d6c8bb] bg-[#fbf8f3] px-4 py-3"><span className="text-[14px] font-semibold">+ New Task</span><button className="text-[14px] text-[#7d7063]" onClick={() => void handleAddTask()} type="button">Add</button></div>
            <div className="mt-4 space-y-1">{tasks.map((task) => <button key={task.id} className="flex w-full items-center gap-3 border-b border-[#efe7dd] px-3 py-4 text-left" onClick={() => setSelectedAgentId(task.agentId)} type="button"><span className="h-5 w-5 rounded-[6px] border border-[#d8cdc1] bg-white" /><span className="truncate text-[15px] text-[#2e271f]">{task.name}</span></button>)}</div>
          </div>
        </aside>

        <main>
          <div className="border-b border-[#e8ded4] bg-[linear-gradient(180deg,#fffdfa_0%,#faf7f2_100%)] px-6 py-10 text-center"><h1 className="text-[58px] font-semibold tracking-[-0.06em] text-[#1b1511]">Agent works <span className="text-[#cb6d2e]">for you.</span></h1><p className="mt-3 text-[17px] text-[#6e645a]">Your AI agent takes care of everything, end to end.</p></div>

          <div className="px-5 py-5 lg:px-6">
            <div className="rounded-[28px] border border-[#d8b38f] bg-white shadow-[0_10px_24px_rgba(78,57,35,0.05)]">
              <textarea className="min-h-[86px] w-full resize-none rounded-t-[28px] bg-transparent px-5 py-4 text-[19px] outline-none placeholder:text-[#8f8173]" onChange={(event) => setComposerText(event.target.value)} placeholder="What should we work on next?" rows={2} value={composerText} />
              <div className="flex items-center justify-between gap-4 border-t border-[#efe5db] px-4 py-3">
                <div className="flex flex-wrap gap-2">{actionIcons.map((icon, index) => <span key={`${icon}-${index}`} className="flex h-10 w-10 items-center justify-center rounded-[12px] border border-[#e5d8ca] bg-white text-[16px]">{icon}</span>)}</div>
                <div className="flex items-center gap-3"><span className="text-[15px] text-[#9f8f80]">Agent</span><button className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#cb6d2e] text-[20px] text-white" onClick={() => { if (composerText.trim()) { openCreateBuilder({ name: composerText.trim(), purpose: composerText.trim(), prompt: composerText.trim() }); } }} type="button">➤</button></div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">{workspaceContent.suggestionCategories.map((category) => <button key={category.id} className={`rounded-full px-4 py-3 text-[15px] font-semibold ${selectedCategoryId === category.id ? "bg-[#1d1915] text-white" : "border border-[#ddd1c4] bg-white text-[#534940]"}`} onClick={() => setSelectedCategoryId(category.id)} type="button">{category.label}</button>)}</div>

            <div className="mt-4 overflow-hidden rounded-[24px] border border-[#ece3d8] bg-white">
              {filteredSuggestions.map((item) => <button key={item.id} className="flex w-full items-center gap-4 border-b border-[#efe6dc] px-5 py-5 text-left last:border-b-0" onClick={() => handleSuggestionClick(item)} type="button"><span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#f3eee8] text-[22px]">{item.icon}</span><span className="text-[24px] tracking-[-0.03em] text-[#3a3028]">{item.title}</span></button>)}
              <div className="flex items-center justify-between px-5 py-4 text-[15px] text-[#7e7164]"><span>View all suggestions</span><button type="button">↻ Shuffle</button></div>
            </div>

            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2"><p className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#9b8e81]">Agent Templates</p><span className="rounded-[8px] bg-[#f0e8de] px-2 py-1 text-[12px]">{templates.length}</span></div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                {templates.map((template) => <button key={template.id} className="rounded-[22px] border border-[#e7ddd2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#dbbda2]" onClick={() => handleTemplateClick(template)} type="button"><div className="flex items-center gap-3"><span className="text-[26px]">{template.icon ?? "🤖"}</span><p className="text-[22px] font-semibold tracking-[-0.03em]">{template.name}</p></div><p className="mt-4 min-h-[76px] text-[15px] leading-7 text-[#6b6156]">{template.description ?? "Configure this template for your workflow."}</p><div className="mt-4 flex flex-wrap gap-2">{(template.tags ?? []).map((tag, index) => <span key={`${template.id}-${tag}`} className={`rounded-full px-3 py-1 text-[12px] ${tagColorClasses[index % tagColorClasses.length]}`}>{tag}</span>)}</div></button>)}
                <button className="rounded-[22px] border border-dashed border-[#e7c9b5] bg-[#fff5ed] p-5 text-center" onClick={() => openCreateBuilder()} type="button"><div className="mt-6 text-[34px]">+</div><p className="mt-6 text-[24px] font-semibold tracking-[-0.03em] text-[#c6672d]">Build from Scratch</p></button>
              </div>
            </div>

            {selectedAgent ? <div className="mt-8 rounded-[24px] border border-[#e7ddd2] bg-white p-5"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-[14px] font-semibold uppercase tracking-[0.14em] text-[#a09081]">Saved Agent</p><h3 className="mt-2 text-[34px] font-semibold tracking-[-0.04em]">{selectedAgent.name}</h3><p className="mt-2 max-w-[760px] text-[15px] leading-7 text-[#6d6258]">{selectedAgent.purpose}</p></div><div className="flex flex-wrap gap-2"><button className="rounded-full border border-[#ddd1c4] px-4 py-2 text-[14px]" onClick={openEditBuilder} type="button">Edit Agent</button><button className="rounded-full bg-[#cb6d2e] px-4 py-2 text-[14px] font-semibold text-white" onClick={() => setChatAgentId(selectedAgent.id)} type="button">Open Agent Chat</button></div></div></div> : null}

            <div className="mt-8">
              <div className="mb-4 flex items-center gap-2"><p className="text-[18px] font-semibold uppercase tracking-[0.08em] text-[#9b8e81]">Your Agents</p><span className="rounded-[8px] bg-[#f0e8de] px-2 py-1 text-[12px]">{agents.length}</span></div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {agents.map((agent) => <button key={`dashboard-agent-${agent.id}`} className="rounded-[22px] border border-[#e7ddd2] bg-white p-5 text-left transition hover:-translate-y-0.5 hover:border-[#dbbda2]" onClick={() => { setSelectedAgentId(agent.id); setChatAgentId(agent.id); }} type="button"><div className="flex items-center justify-between gap-3"><div><p className="text-[20px] font-semibold tracking-[-0.03em]">{agent.name}</p><p className="mt-1 text-[13px] text-[#8b8074]">{agent.category ?? "Custom Agent"} · {agent.audience ?? "General users"}</p></div><span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${agent.status === "deployed" ? "bg-[#e4f7ed] text-[#168b55]" : "bg-[#f2ebe2] text-[#8a7b6c]"}`}>{agent.status}</span></div><p className="mt-4 line-clamp-3 text-[14px] leading-7 text-[#6b6156]">{agent.purpose}</p><div className="mt-4 flex flex-wrap gap-2">{(agent.tests ?? []).slice(0, 2).map((test, index) => <span key={`${agent.id}-test-${index}`} className={`rounded-full px-3 py-1 text-[12px] ${tagColorClasses[index % tagColorClasses.length]}`}>{test}</span>)}</div></button>)}
              </div>
            </div>
          </div>
        </main>
      </div>

      {builderOpen ? <BuilderModal draft={builderDraft} isSaving={isSaving} mode={builderMode} onChange={setBuilderDraft} onClose={() => setBuilderOpen(false)} onFinish={() => void handleCreateOrUpdateAgent()} /> : null}
    </section>
  );
};
