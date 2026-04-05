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
  purpose: string;
  prompt: string;
  tools: string[];
  memory: string[];
  status: string;
};

export type ApiAgentTemplate = {
  id: string;
  name: string;
};

export type CreateAgentRequest = {
  name: string;
  purpose: string;
  prompt: string;
  tools?: string[];
  memory?: string[];
};

export type UpdateAgentRequest = Partial<CreateAgentRequest>;

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
};

export type AccountSettings = {
  language: string;
  persona: string;
};

export type ApiKey = {
  id: string;
  label: string;
  keyPreview: string;
  isActive: boolean;
};
