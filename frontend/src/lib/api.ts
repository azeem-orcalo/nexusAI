import type {
  AccountSettings,
  ApiAgent,
  ApiAgentMessage,
  ApiAgentTask,
  ApiAgentTemplate,
  AgentWorkspaceContent,
  ApiKey,
  ApiModel,
  ApiModelDetail,
  ApiModelFilters,
  ApiReview,
  AuthSession,
  CreateAgentRequest,
  CreateAgentMessageRequest,
  CreateAgentTaskMessageRequest,
  CreateAgentTaskRequest,
  CurrentUser,
  DashboardOverview,
  DashboardUsagePoint,
  DiscoverResearchFilters,
  DeployAgentResponse,
  DiscoverOnboarding,
  ChatResponse,
  ChatResponseRequest,
  ChatHistoryResponse,
  HomeWorkflowResponse,
  HomeUseCasesResponse,
  RecommendationRequest,
  RecommendationResponse,
  ResearchFeedItem,
  SaveChatMessageRequest,
  SignInRequest,
  SignUpRequest,
  UpdateAgentRequest,
  UpdateAgentTaskRequest,
  UpdateSettingsRequest
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  token?: string | null;
};

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const searchParams = new URLSearchParams();

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value === undefined || value === "" || value === false) {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  const response = await fetch(
    `${API_BASE_URL}${path}${queryString ? `?${queryString}` : ""}`,
    {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
};

export const api = {
  signUp: (payload: SignUpRequest) =>
    request<AuthSession>("/auth/sign-up", { method: "POST", body: payload }),
  signIn: (payload: SignInRequest) =>
    request<AuthSession>("/auth/sign-in", { method: "POST", body: payload }),
  me: (token: string) => request<CurrentUser>("/auth/me", { token }),
  featuredModels: () => request<ApiModel[]>("/models/featured"),
  listModels: (query?: Record<string, string | number | boolean | undefined>) =>
    request<ApiModel[]>("/models", { query }),
  modelDetail: (id: string) => request<ApiModelDetail>(`/models/${id}`),
  modelReviews: (id: string) => request<ApiReview[]>(`/models/${id}/reviews`),
  providers: () => request<string[]>("/models/providers"),
  modelFilters: () => request<ApiModelFilters>("/models/filters"),
  agents: () => request<ApiAgent[]>("/agents"),
  agentWorkspaceContent: () =>
    request<AgentWorkspaceContent>("/agents/workspace-content"),
  agentTemplates: () => request<ApiAgentTemplate[]>("/agents/templates"),
  createAgent: (payload: CreateAgentRequest) =>
    request<ApiAgent>("/agents", { method: "POST", body: payload }),
  updateAgent: (id: string, payload: UpdateAgentRequest) =>
    request<ApiAgent>(`/agents/${id}`, { method: "PATCH", body: payload }),
  deployAgent: (id: string) =>
    request<DeployAgentResponse>(`/agents/${id}/deploy`, { method: "POST" }),
  agentMessages: (agentId: string) =>
    request<ApiAgentMessage[]>(`/agents/${agentId}/messages`),
  addAgentMessage: (agentId: string, payload: CreateAgentMessageRequest) =>
    request<ApiAgentMessage>(`/agents/${agentId}/messages`, {
      method: "POST",
      body: payload
    }),
  agentTasks: (agentId: string) => request<ApiAgentTask[]>(`/agents/${agentId}/tasks`),
  createAgentTask: (agentId: string, payload: CreateAgentTaskRequest) =>
    request<ApiAgentTask>(`/agents/${agentId}/tasks`, { method: "POST", body: payload }),
  updateAgentTask: (taskId: string, payload: UpdateAgentTaskRequest) =>
    request<ApiAgentTask>(`/agents/tasks/${taskId}`, { method: "PATCH", body: payload }),
  deleteAgentTask: (taskId: string) =>
    request<{ deleted: boolean; id: string }>(`/agents/tasks/${taskId}`, { method: "DELETE" }),
  duplicateAgentTask: (taskId: string) =>
    request<ApiAgentTask>(`/agents/tasks/${taskId}/duplicate`, { method: "POST" }),
  addAgentTaskMessage: (taskId: string, payload: CreateAgentTaskMessageRequest) =>
    request<ApiAgentTask>(`/agents/tasks/${taskId}/messages`, { method: "POST", body: payload }),
  dashboardOverview: () => request<DashboardOverview>("/dashboard/overview"),
  dashboardUsage: () => request<DashboardUsagePoint[]>("/dashboard/usage"),
  onboarding: () => request<DiscoverOnboarding>("/discover/onboarding"),
  recommendations: (payload: RecommendationRequest) =>
    request<RecommendationResponse>("/discover/recommendations", {
      method: "POST",
      body: payload
    }),
  quickActions: () => request<string[]>("/discover/quick-actions"),
  homeWorkflows: () => request<HomeWorkflowResponse>("/discover/home-workflows"),
  homeUseCases: () => request<HomeUseCasesResponse>("/discover/home-use-cases"),
  researchFeed: (query?: Record<string, string | number | boolean | undefined>) =>
    request<ResearchFeedItem[]>("/discover/research-feed", { query }),
  researchFeedFilters: () =>
    request<DiscoverResearchFilters>("/discover/research-feed/filters"),
  chatHistory: (sessionId: string) =>
    request<ChatHistoryResponse>("/chat/history", { query: { sessionId } }),
  chatRespond: (payload: ChatResponseRequest) =>
    request<ChatResponse>("/chat/respond", { method: "POST", body: payload }),
  saveChatMessage: (payload: SaveChatMessageRequest) =>
    request<{ saved: boolean }>("/chat/messages", {
      method: "POST",
      body: payload
    }),
  settings: (token: string | null) =>
    request<AccountSettings>("/account/settings", { token }),
  updateSettings: (payload: UpdateSettingsRequest, token: string | null) =>
    request<AccountSettings>("/account/settings", {
      method: "PATCH",
      body: payload,
      token
    }),
  apiKeys: (token: string | null) =>
    request<ApiKey[]>("/account/api-keys", { token })
};
