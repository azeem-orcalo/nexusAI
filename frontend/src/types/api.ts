export type AppPage =
  | "home"
  | "chat-hub"
  | "marketplace"
  | "agents"
  | "discover-new"
  | "dashboard"
  | "api-access"
  | "reviews"
  | "research"
  | "settings"
  | "auth";

export type SignUpRequest = {
  fullName: string;
  email: string;
  password: string;
};

export type SignInRequest = {
  email: string;
  password: string;
};

export type AuthSession = {
  id: string;
  email: string;
  token: string;
  fullName?: string;
  language?: string;
};

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  language: string;
  isActive: boolean;
};

export type ApiModel = {
  id: string;
  name: string;
  provider: string;
  category: string;
  useCases: string[];
  tags: string[];
  description: string;
  pricePerMillion: string;
  averageRating: number;
  contextWindow: number;
  latencyMs: number;
  badge?: string;
  priceModel?: string;
  isOpenSource?: boolean;
};

export type ApiModelFilters = {
  providers: string[];
  categories: string[];
  tags: string[];
  useCases: string[];
  priceModels: string[];
  maxPrice: number;
};

export type ApiModelDetail = ApiModel & {
  pricing?: {
    input: string;
    output: string;
  };
  promptGuide?: string;
  benchmarks?: {
    mmlu: number;
    humanEval: number;
    math: number;
  };
};

export type ApiReview = {
  id: string;
  modelId: string;
  authorName: string;
  rating: number;
  comment: string;
  verified: boolean;
};

export type ApiAgent = {
  id: string;
  name: string;
  category?: string;
  purpose: string;
  audience?: string;
  prompt: string;
  tools: string[];
  memory: string[];
  tests?: string[];
  deployTarget?: string;
  status: string;
};

export type ApiAgentTemplate = {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  tags?: string[];
  featured?: boolean;
};

export type AgentWorkspaceSuggestionCategory = {
  id: string;
  label: string;
};

export type AgentWorkspaceSuggestion = {
  id: string;
  categoryId: string;
  title: string;
  icon: string;
  prompt: string;
};

export type AgentWorkspaceContent = {
  helperTitle: string;
  helperDescription: string;
  askHubLabel: string;
  suggestionCategories: AgentWorkspaceSuggestionCategory[];
  suggestions: AgentWorkspaceSuggestion[];
};

export type ApiAgentTaskMessage = {
  role: "assistant" | "user";
  text: string;
  createdAt?: string;
};

export type ApiAgentTask = {
  id: string;
  agentId: string;
  name: string;
  completed: boolean;
  messages: ApiAgentTaskMessage[];
};

export type ApiAgentMessage = {
  id: string;
  agentId: string;
  role: "assistant" | "user";
  text: string;
  createdAt?: string;
};

export type CreateAgentRequest = {
  name: string;
  category?: string;
  purpose: string;
  audience?: string;
  prompt: string;
  tools?: string[];
  memory?: string[];
  tests?: string[];
  deployTarget?: string;
};

export type UpdateAgentRequest = Partial<CreateAgentRequest>;

export type CreateAgentTaskRequest = {
  name: string;
};

export type UpdateAgentTaskRequest = {
  name?: string;
  completed?: boolean;
};

export type CreateAgentTaskMessageRequest = {
  role: "assistant" | "user";
  text: string;
};

export type CreateAgentMessageRequest = {
  text: string;
};

export type DeployAgentResponse = {
  id: string;
  status: string;
  endpoint: string;
};

export type DashboardOverview = {
  requests: number;
  costUsd: number;
  averageLatencyMs: number;
  activeModels: number;
};

export type DashboardUsagePoint = {
  day: string;
  requests: number;
  costUsd: number;
};

export type AgentPerformance = {
  agentId: string;
  satisfactionScore: number;
  successRate: number;
  latencyMs: number;
};

export type DiscoverOnboarding = {
  steps: string[];
};

export type ChatHubAction = {
  id: string;
  label: string;
  icon: string;
};

export type ChatHubPromptOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export type ChatHubSuggestion = {
  id: string;
  label: string;
};

export type ChatHubPromptCategory = {
  id: string;
  label: string;
};

export type ChatHubPromptSuggestion = {
  id: string;
  categoryId: string;
  label: string;
  prompt: string;
};

export type ChatHubContent = {
  quickActions: ChatHubAction[];
  createActions: ChatHubAction[];
  analysisActions: ChatHubAction[];
  promptOptions: ChatHubPromptOption[];
  promptCategories: ChatHubPromptCategory[];
  promptSuggestions: ChatHubPromptSuggestion[];
};

export type HomeWorkflowCategory = {
  id: string;
  label: string;
  icon: string;
  suggestions: string[];
};

export type HomeWorkflowResponse = {
  categories: HomeWorkflowCategory[];
};

export type HomeUseCase = {
  id: string;
  title: string;
  description: string;
  providers: string[];
  actionLabel: string;
  prompt: string;
  icon: string;
};

export type HomeUseCasesResponse = {
  title: string;
  subtitle: string;
  items: HomeUseCase[];
};

export type RecommendationRequest = {
  goal: string;
};

export type RecommendationResponse = {
  goal: string;
  recommendations: Array<{
    modelId: string;
    reason: string;
  }>;
};

export type ResearchFeedItem = {
  id: string;
  title: string;
  summary: string;
  provider: string;
  category?: string;
  publishedAt?: string;
  overview?: string;
  metrics?: Array<{
    label: string;
    value: string;
    helper?: string;
  }>;
  findings?: string[];
  modelsReferenced?: string[];
};

export type DiscoverResearchFilters = {
  categories: string[];
};

export type AccountSettings = {
  language: string;
  persona: string;
};

export type UpdateSettingsRequest = Partial<AccountSettings>;

export type ApiKey = {
  id: string;
  label: string;
  keyPreview: string;
  isActive: boolean;
};

export type ChatAttachmentRequest = {
  kind: "audio" | "camera" | "file" | "screen" | "video";
  name: string;
  sizeLabel?: string;
};

export type ChatHistoryMessage = {
  role: "assistant" | "user";
  text: string;
  attachments?: ChatAttachmentRequest[];
  createdAt?: string;
};

export type ChatHistoryResponse = {
  sessionId: string;
  messages: ChatHistoryMessage[];
};

export type DeleteChatHistoryResponse = {
  deleted: boolean;
  sessionId: string;
};

export type ChatResponseRequest = {
  sessionId: string;
  message: string;
  modelId?: string;
  attachments?: ChatAttachmentRequest[];
};

export type ChatResponse = {
  reply: string;
  suggestedPrompts: string[];
};

export type SaveChatMessageRequest = {
  sessionId: string;
  message: string;
  role: "assistant" | "user";
  attachments?: ChatAttachmentRequest[];
};
