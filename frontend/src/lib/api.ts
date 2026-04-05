import type {
  AccountSettings,
  ApiAgent,
  ApiAgentTemplate,
  ApiKey,
  ApiModel,
  ApiModelDetail,
  ApiReview,
  AuthSession,
  CreateAgentRequest,
  CurrentUser,
  DashboardOverview,
  DashboardUsagePoint,
  DeployAgentResponse,
  DiscoverOnboarding,
  RecommendationRequest,
  RecommendationResponse,
  ResearchFeedItem,
  SignInRequest,
  SignUpRequest,
  UpdateAgentRequest
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  token?: string | null;
};

const request = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token
        ? { Authorization: `Bearer ${options.token}` }
        : {})
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

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
  listModels: () => request<ApiModel[]>("/models"),
  modelDetail: (id: string) => request<ApiModelDetail>(`/models/${id}`),
  modelReviews: (id: string) => request<ApiReview[]>(`/models/${id}/reviews`),
  providers: () => request<string[]>("/models/providers"),
  agents: () => request<ApiAgent[]>("/agents"),
  agentTemplates: () => request<ApiAgentTemplate[]>("/agents/templates"),
  createAgent: (payload: CreateAgentRequest) =>
    request<ApiAgent>("/agents", { method: "POST", body: payload }),
  updateAgent: (id: string, payload: UpdateAgentRequest) =>
    request<ApiAgent>(`/agents/${id}`, { method: "PATCH", body: payload }),
  deployAgent: (id: string) =>
    request<DeployAgentResponse>(`/agents/${id}/deploy`, { method: "POST" }),
  dashboardOverview: () => request<DashboardOverview>("/dashboard/overview"),
  dashboardUsage: () => request<DashboardUsagePoint[]>("/dashboard/usage"),
  onboarding: () => request<DiscoverOnboarding>("/discover/onboarding"),
  recommendations: (payload: RecommendationRequest) =>
    request<RecommendationResponse>("/discover/recommendations", {
      method: "POST",
      body: payload
    }),
  quickActions: () => request<string[]>("/discover/quick-actions"),
  researchFeed: () => request<ResearchFeedItem[]>("/discover/research-feed"),
  settings: (token: string | null) =>
    request<AccountSettings>("/account/settings", { token }),
  apiKeys: (token: string | null) =>
    request<ApiKey[]>("/account/api-keys", { token })
};
