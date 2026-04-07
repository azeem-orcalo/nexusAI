import { useEffect, useMemo, useState } from "react";
import { AuthPanel } from "./components/auth/AuthPanel";
import { AgentsWorkspace } from "./components/agents/AgentsWorkspace";
import { ChatHubShell } from "./components/chat/ChatHubShell";
import { DiscoverResearchPage } from "./components/discover/DiscoverResearchPage";
import {
  HeroSection,
  type HeroSearchResult
} from "./components/home/HeroSection";
import { HomeModelsSection } from "./components/home/HomeModelsSection";
import { HomeUseCasesSection } from "./components/home/HomeUseCasesSection";
import { PageLinksSection } from "./components/home/PageLinksSection";
import { AppShell } from "./components/layout/AppShell";
import { MarketplaceSection } from "./components/marketplace/MarketplaceSection";
import { ModelDetailModal } from "./components/marketplace/ModelDetailModal";
import { PlaceholderPage } from "./components/shared/PlaceholderPage";
import { useAuth } from "./context/AuthContext";
import { heroContent } from "./data/mock/home";
import { api } from "./lib/api";
import { isRtlLanguage, t } from "./lib/i18n";
import type { ChatAction, ChatPromptOption, ChatSuggestion } from "./data/mock/chatHub";
import type { HeroContent } from "./data/mock/home";
import type { ModelDetail } from "./data/mock/marketplace";
import type {
  AccountSettings,
  ApiAgent,
  ApiAgentTemplate,
  ApiKey,
  ApiModel,
  ApiModelDetail,
  ApiModelFilters,
  ApiReview,
  AppPage,
  ChatHubContent as ApiChatHubContent,
  DashboardOverview,
  DashboardUsagePoint,
  HomeUseCase,
  HomeWorkflowCategory,
  ResearchFeedItem
} from "./types/api";

const productPages: Array<{
  id: AppPage;
  title: string;
  description: string;
  category: string;
}> = [
  {
    id: "chat-hub",
    title: "Chat Hub",
    description: "Guided discovery, search help, and quick creation actions.",
    category: "Discovery"
  },
  {
    id: "marketplace",
    title: "Marketplace",
    description: "Browse, compare, filter, and open AI model details.",
    category: "Models"
  },
  {
    id: "agents",
    title: "Agents",
    description: "Create AI agents from scratch or start from templates.",
    category: "Builder"
  },
  {
    id: "discover-new",
    title: "Discover New",
    description: "Research feed, prompt guides, releases, and trend discovery.",
    category: "Research"
  },
  {
    id: "dashboard",
    title: "Dashboard",
    description: "Track usage, latency, cost, model health, and quality signals.",
    category: "Monitoring"
  },
  {
    id: "api-access",
    title: "API Access",
    description: "API keys, SDK docs, integration help, and developer access.",
    category: "Developer"
  },
  {
    id: "reviews",
    title: "Reviews",
    description: "User ratings, feedback summaries, and review insights.",
    category: "Trust"
  },
  {
    id: "research",
    title: "Research Feed",
    description: "Trending models, releases, newsletters, and model analysis.",
    category: "Updates"
  },
  {
    id: "settings",
    title: "Settings",
    description: "Language preferences, personalization, and account settings.",
    category: "Account"
  },
  {
    id: "auth",
    title: "Authentication",
    description: "Sign in, get started, and access account-based features.",
    category: "Access"
  }
];

const quickActionIconMap: Record<string, string> = {
  "Create image": "🖼",
  "Generate audio": "🎧",
  "Create slides": "🪄",
  "Analyze data": "📊",
  "Code generation": "💻"
};

const toSlug = (value: string): string => value.toLowerCase().split(" ").join("-");

const toModelDetail = (
  detail: ApiModelDetail,
  reviews: ApiReview[]
): ModelDetail => ({
  id: detail.id,
  name: detail.name,
  subtitle: `by ${detail.provider} · ${detail.category} model`,
  overview: detail.description,
  input: "Text, images, audio, PDFs",
  output: "Text, code, structured data",
  context: `${detail.contextWindow.toLocaleString()} tokens`,
  maxOutput: detail.pricing?.output ?? "10 / 1M",
  latency: `${detail.latencyMs}ms avg`,
  useCases: detail.useCases.map((useCase) => ({
    id: useCase,
    label: useCase,
    icon: "•"
  })),
  examplePrompt:
    "Summarize this research paper in 3 bullet points and suggest 2 follow-up questions.",
  exampleResponse:
    reviews.length > 0
      ? reviews.map((review) => `${review.authorName}: ${review.comment}`)
      : ["No reviews yet. This model is ready for evaluation workflows."],
  followUps: [
    detail.promptGuide ?? "Use explicit goals and constraints in prompts.",
    `Average rating: ${detail.averageRating.toFixed(1)}`
  ],
  benchmarks: [
    {
      id: "mmlu",
      label: "MMLU",
      value: `${detail.benchmarks?.mmlu ?? 0}`
    },
    {
      id: "human-eval",
      label: "HumanEval",
      value: `${detail.benchmarks?.humanEval ?? 0}`
    },
    {
      id: "math",
      label: "MATH",
      value: `${detail.benchmarks?.math ?? 0}`
    },
    {
      id: "rating",
      label: "Rating",
      value: detail.averageRating.toFixed(1)
    }
  ]
});

const App = (): JSX.Element => {
  const { user, session, signOut, isAuthenticated, isLoading: authLoading } =
    useAuth();
  const [currentPage, setCurrentPage] = useState<AppPage>("home");
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);
  const [featuredModels, setFeaturedModels] = useState<ApiModel[]>([]);
  const [chatHubModels, setChatHubModels] = useState<ApiModel[]>([]);
  const [allModels, setAllModels] = useState<ApiModel[]>([]);
  const [modelFilters, setModelFilters] = useState<ApiModelFilters | null>(null);
  const [homeWorkflowCategories, setHomeWorkflowCategories] = useState<
    HomeWorkflowCategory[]
  >([]);
  const [homeUseCases, setHomeUseCases] = useState<HomeUseCase[]>([]);
  const [homeUseCaseTitle, setHomeUseCaseTitle] = useState<string>(
    "Quick-Start by Use Case"
  );
  const [homeUseCaseSubtitle, setHomeUseCaseSubtitle] = useState<string>("");
  const [researchFeed, setResearchFeed] = useState<ResearchFeedItem[]>([]);
  const [dashboardOverview, setDashboardOverview] =
    useState<DashboardOverview | null>(null);
  const [dashboardUsage, setDashboardUsage] = useState<DashboardUsagePoint[]>(
    []
  );
  const [agents, setAgents] = useState<ApiAgent[]>([]);
  const [agentTemplates, setAgentTemplates] = useState<ApiAgentTemplate[]>([]);
  const [settings, setSettings] = useState<AccountSettings | null>(null);
  const [language, setLanguage] = useState<string>(
    window.localStorage.getItem("nexusai-language") ?? "en"
  );
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [chatHubContent, setChatHubContent] = useState<ApiChatHubContent | null>(
    null
  );
  const [selectedModelDetail, setSelectedModelDetail] =
    useState<ModelDetail | null>(null);
  const [pendingChatRequest, setPendingChatRequest] = useState<{
    id: string;
    prompt: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChatHubLoading, setIsChatHubLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [chatHubError, setChatHubError] = useState<string>("");

  const refreshAgents = (): Promise<void> =>
    Promise.all([api.agents(), api.agentTemplates()]).then(
      ([nextAgents, nextTemplates]) => {
        setAgents(nextAgents);
        setAgentTemplates(nextTemplates);
      }
    );

  useEffect(() => {
    let isMounted = true;

    void Promise.all([
      api.featuredModels(),
      api.listModels(),
      api.modelFilters(),
      api.homeWorkflows(),
      api.homeUseCases(),
      api.researchFeed(),
      api.dashboardOverview(),
      api.dashboardUsage(),
      api.agents(),
      api.agentTemplates()
    ])
      .then(
        ([
          nextFeaturedModels,
          nextAllModels,
          nextModelFilters,
          nextHomeWorkflows,
          nextHomeUseCases,
          nextResearchFeed,
          nextDashboardOverview,
          nextDashboardUsage,
          nextAgents,
          nextAgentTemplates
        ]) => {
          if (!isMounted) {
            return;
          }
          setFeaturedModels(nextFeaturedModels);
          setAllModels(nextAllModels);
          setModelFilters(nextModelFilters);
          setHomeWorkflowCategories(nextHomeWorkflows.categories);
          setHomeUseCases(nextHomeUseCases.items);
          setHomeUseCaseTitle(nextHomeUseCases.title);
          setHomeUseCaseSubtitle(nextHomeUseCases.subtitle);
          setResearchFeed(nextResearchFeed);
          setDashboardOverview(nextDashboardOverview);
          setDashboardUsage(nextDashboardUsage);
          setAgents(nextAgents);
          setAgentTemplates(nextAgentTemplates);
        }
      )
      .catch((loadError) => {
        if (isMounted) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load API data."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentPage !== "chat-hub") {
      return;
    }

    let isMounted = true;
    setIsChatHubLoading(true);
    setChatHubError("");

    void Promise.all([api.featuredModels(), api.chatHubContent()])
      .then(([nextChatHubModels, nextChatHubContent]) => {
        if (!isMounted) {
          return;
        }

        setChatHubModels(nextChatHubModels);
        setChatHubContent(nextChatHubContent);
      })
      .catch((loadError) => {
        if (isMounted) {
          setChatHubError(
            loadError instanceof Error
              ? loadError.message
              : "Failed to load Chat Hub data."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsChatHubLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  useEffect(() => {
    if (!session?.token) {
      setSettings(null);
      setApiKeys([]);
      return;
    }

    void Promise.all([api.settings(session.token), api.apiKeys(session.token)])
      .then(([nextSettings, nextApiKeys]) => {
        setSettings(nextSettings);
        setLanguage(nextSettings.language ?? "en");
        setApiKeys(nextApiKeys);
      })
      .catch(() => {
        setSettings(null);
        setApiKeys([]);
      });
  }, [session?.token]);

  const handleLanguageChange = (nextLanguage: string): void => {
    setLanguage(nextLanguage);
    window.localStorage.setItem("nexusai-language", nextLanguage);
    if (session?.token) {
      void api
        .updateSettings({ language: nextLanguage }, session.token)
        .then((nextSettings) => setSettings(nextSettings))
        .catch(() => undefined);
    }
  };

  const handleNavigate = (page: AppPage): void => {
    if (page === "agents" && !isAuthenticated) {
      setCurrentPage("auth");
      return;
    }

    setCurrentPage(page);
  };

  useEffect(() => {
    if (!selectedModelId) {
      setSelectedModelDetail(null);
      return;
    }

    void Promise.all([
      api.modelDetail(selectedModelId),
      api.modelReviews(selectedModelId)
    ])
      .then(([detail, reviews]) => setSelectedModelDetail(toModelDetail(detail, reviews)))
      .catch(() => setSelectedModelDetail(null));
  }, [selectedModelId]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtlLanguage(language) ? "rtl" : "ltr";
  }, [language]);

  const heroApiContent = useMemo<HeroContent>(
    () => ({
      ...heroContent,
      eyebrow: `${featuredModels.length || 0} featured models · Updated from API`,
      stats: [
        {
          label: "AI Models",
          value: `${allModels.length || featuredModels.length}+`
        },
        {
          label: "Builders",
          value: `${agents.length || 0}K`
        },
        {
          label: "AI Labs",
          value: `${new Set(allModels.map((model) => model.provider)).size || 0}`
        },
        {
          label: "Avg Rating",
          value:
            featuredModels.length > 0
              ? (
                  featuredModels.reduce(
                    (total, model) => total + model.averageRating,
                    0
                  ) / featuredModels.length
                ).toFixed(1)
              : "0.0"
        }
      ]
    }),
    [agents.length, allModels, featuredModels]
  );

  const quickActions: string[] = [];

  const chatModels = useMemo(
    () =>
      chatHubModels.map((model, index) => ({
        id: model.id,
        name: model.name,
        provider: model.provider,
        active: index === 0
      })),
    [chatHubModels]
  );

  const chatQuickActions = useMemo<ChatAction[]>(
    () =>
      quickActions.map((action, index) => ({
        id: toSlug(action),
        label: action,
        icon: quickActionIconMap[action] ?? "•"
      })),
    [quickActions]
  );

  const chatPromptOptions = useMemo<ChatPromptOption[]>(
    () =>
      quickActions.slice(0, 6).map((action) => ({
        id: toSlug(action),
        title: action,
        subtitle: "Live API action",
        icon: quickActionIconMap[action] ?? "•"
      })),
    [quickActions]
  );

  const chatSuggestionChips = useMemo<ChatSuggestion[]>(
    () =>
      researchFeed.slice(0, 5).map((item) => ({
        id: item.id,
        label: item.title
      })),
    [researchFeed]
  );

  const heroSearchResults = useMemo<HeroSearchResult[]>(
    () => {
      const corePages: HeroSearchResult[] = [
        {
          id: "page-chat-hub",
          title: "Chat Hub",
          subtitle: "Guided discovery, search help, and quick creation actions.",
          page: "chat-hub"
        },
        {
          id: "page-marketplace",
          title: "Marketplace",
          subtitle: "Browse, compare, filter, and open AI model details.",
          page: "marketplace"
        },
        {
          id: "page-agents",
          title: "Agents",
          subtitle: "Create AI agents from scratch or start from templates.",
          page: "agents"
        }
      ];

      return [
        ...featuredModels.map((model) => ({
          id: `model-${model.id}`,
          title: model.name,
          subtitle: `${model.provider} model`,
          page: "marketplace" as const
        })),
        ...agents.map((agent) => ({
          id: `agent-${agent.id}`,
          title: agent.name,
          subtitle: "Agent workflow",
          page: "agents" as const
        })),
        ...researchFeed.slice(0, 4).map((item) => ({
          id: `research-${item.id}`,
          title: item.title,
          subtitle: "Research feed item",
          page: "chat-hub" as const
        })),
        ...corePages
      ];
    },
    [agents, featuredModels, researchFeed]
  );

  const renderLoading = (): JSX.Element => (
    <PlaceholderPage
      actions={[
        { id: "loading-models", label: "Loading models..." },
        { id: "loading-dashboard", label: "Loading dashboard metrics..." },
        { id: "loading-discovery", label: "Loading discovery feeds..." }
      ]}
      description={t(language, "loading_desc")}
      eyebrow="Integration"
      title={t(language, "loading_title")}
    />
  );

  const renderError = (): JSX.Element => (
    <PlaceholderPage
      actions={[
        { id: "api-base", label: t(language, "error_check_base") },
        { id: "backend", label: t(language, "error_check_backend") },
        { id: "cors", label: t(language, "error_check_cors") }
      ]}
      description={error}
      eyebrow="Integration Error"
      title={t(language, "error_title")}
    />
  );

  const renderChatHubLoading = (): JSX.Element => (
    <PlaceholderPage
      actions={[
        { id: "loading-chat-models", label: "Loading Chat Hub models..." },
        { id: "loading-chat-actions", label: "Loading sidebar actions..." },
        { id: "loading-chat-prompts", label: "Loading chat prompts..." }
      ]}
      description="Chat Hub data is loading from backend APIs."
      eyebrow="Chat Hub"
      title="Preparing Chat Hub"
    />
  );

  const renderChatHubError = (): JSX.Element => (
    <PlaceholderPage
      actions={[
        { id: "retry-chat-hub", label: "Open Chat Hub again" },
        { id: "discover-endpoint", label: "Check /api/discover/chat-hub" },
        { id: "models-endpoint", label: "Check /api/models/featured" }
      ]}
      description={chatHubError}
      eyebrow="Chat Hub Error"
      title="Chat Hub failed to load"
    />
  );

  const renderPage = (): JSX.Element => {
    if (authLoading || isLoading) {
      return renderLoading();
    }

    if (error) {
      return renderError();
    }

    if (currentPage === "auth") {
      return (
        <AuthPanel
          language={language}
          onClose={() => setCurrentPage("home")}
          onSuccess={() => setCurrentPage("home")}
        />
      );
    }

    if (currentPage === "agents" && !isAuthenticated) {
      return (
        <AuthPanel
          language={language}
          onClose={() => setCurrentPage("home")}
          onSuccess={() => setCurrentPage("agents")}
        />
      );
    }

    if (currentPage === "home") {
      return (
        <>
          <HeroSection
            content={heroApiContent}
            language={language}
            onSubmitPrompt={(prompt) => {
              setPendingChatRequest({ id: `home-search-${Date.now()}`, prompt });
              handleNavigate("chat-hub");
            }}
            onSearchNavigate={(result) => {
              handleNavigate(result.page);
            }}
            searchResults={heroSearchResults}
            workflowCategories={homeWorkflowCategories}
            onNavigate={handleNavigate}
          />
          <HomeModelsSection
            models={featuredModels}
            onOpenModel={(modelId) => {
              setSelectedModelId(modelId);
              setCurrentPage("marketplace");
            }}
            onSeeAll={() => handleNavigate("marketplace")}
          />
          <PageLinksSection
            links={productPages}
            onNavigate={handleNavigate}
          />
          <HomeUseCasesSection
            items={homeUseCases}
            onOpenUseCase={(prompt) => {
              setPendingChatRequest({ id: `use-case-${Date.now()}`, prompt });
              handleNavigate("chat-hub");
            }}
            onSubscribe={() => handleNavigate(isAuthenticated ? "discover-new" : "auth")}
            subtitle={homeUseCaseSubtitle}
            title={homeUseCaseTitle}
          />
        </>
      );
    }

    const pageContent: Record<
      Exclude<AppPage, "home" | "chat-hub" | "marketplace">,
      {
        eyebrow: string;
        title: string;
        description: string;
        actions: Array<{ id: string; label: string }>;
      }
    > = {
      agents: {
        eyebrow: "Agent Builder",
        title: "Build and deploy AI agents",
        description:
          "Start from scratch or from templates, define prompts, tools, memory, and prepare agent playground and deployment flows.",
        actions: [
          { id: "create-agent", label: "Create new agent" },
          {
            id: "templates",
            label: `Templates: ${agentTemplates.map((item) => item.name).join(", ")}`
          },
          { id: "memory", label: `Existing agents: ${agents.length}` }
        ]
      },
      "discover-new": {
        eyebrow: "Discovery",
        title: "Prompt guides, releases, and discovery flows",
        description:
          "Explore prompt engineering guidance, content creation flows, translations, no-code discovery, and trend-based recommendation surfaces from live backend feeds.",
        actions: researchFeed.slice(0, 3).map((item) => ({
          id: item.id,
          label: `${item.title} · ${item.provider}`
        }))
      },
      dashboard: {
        eyebrow: "Monitoring",
        title: "Usage, latency, and cost dashboard",
        description:
          "Track requests, cost, latency, active model health, agent quality, and quick actions aligned with the must-have monitoring requirements.",
        actions: [
          {
            id: "usage",
            label: `Requests: ${dashboardOverview?.requests.toLocaleString() ?? 0}`
          },
          {
            id: "latency",
            label: `Avg latency: ${dashboardOverview?.averageLatencyMs ?? 0}ms`
          },
          {
            id: "quality",
            label: `Usage points loaded: ${dashboardUsage.length}`
          }
        ]
      },
      "api-access": {
        eyebrow: "Developer Access",
        title: "API keys and integration docs",
        description:
          "Manage API access, SDK and REST integration guidance, and developer-oriented quick start flows.",
        actions: [
          { id: "keys", label: `API keys: ${apiKeys.length}` },
          { id: "sdk", label: "Swagger UI: /docs" },
          { id: "rest", label: "REST base: http://localhost:3000/api" }
        ]
      },
      reviews: {
        eyebrow: "Social Proof",
        title: "Ratings and verified reviews",
        description:
          "Review aggregate ratings, breakdown summaries, and testimonials used to support model comparison decisions.",
        actions: [
          {
            id: "ratings",
            label: `Featured average: ${
              featuredModels.length > 0
                ? (
                    featuredModels.reduce(
                      (total, model) => total + model.averageRating,
                      0
                    ) / featuredModels.length
                  ).toFixed(1)
                : "0.0"
            }`
          },
          { id: "testimonials", label: "Use marketplace detail modal for live reviews" },
          { id: "breakdown", label: `Models with reviews: ${featuredModels.length}` }
        ]
      },
      research: {
        eyebrow: "Research Feed",
        title: "AI releases and market updates",
        description:
          "Discover trending models, newly released systems, weekly digests, and analysis-focused feeds for continuous discovery.",
        actions: [
          { id: "trending", label: "Trending models" },
          { id: "releases", label: "New releases" },
          { id: "digest", label: "Weekly digest" }
        ]
      },
      settings: {
        eyebrow: "Account Settings",
        title: "Language and personalization settings",
        description:
          "Manage language preferences, personalized experience controls, and account-level access settings.",
        actions: [
          { id: "language", label: `Language: ${settings?.language ?? "n/a"}` },
          { id: "profile", label: `Signed in: ${isAuthenticated ? "Yes" : "No"}` },
          { id: "preferences", label: `Persona: ${settings?.persona ?? "n/a"}` }
        ]
      },
      auth: {
        eyebrow: "Authentication",
        title: "Sign in and get started",
        description:
          "Access entry points for sign in, onboarding, and free account creation required for personalized user journeys.",
        actions: [
          { id: "signin", label: "Sign in flow" },
          { id: "signup", label: "Create free account" },
          { id: "onboarding", label: "Start guided onboarding" }
        ]
      }
    };

    if (currentPage === "chat-hub") {
      if (chatHubError) {
        return renderChatHubError();
      }

      if (isChatHubLoading || !chatHubContent) {
        return renderChatHubLoading();
      }

      return (
        <ChatHubShell
          analysisActions={chatHubContent.analysisActions}
          createActions={chatHubContent.createActions}
          initialRequest={pendingChatRequest}
          language={language}
          models={chatModels}
          onNavigate={handleNavigate}
          onInitialMessageHandled={() => setPendingChatRequest(null)}
          promptOptions={chatHubContent.promptOptions}
          promptCategories={chatHubContent.promptCategories}
          promptSuggestions={chatHubContent.promptSuggestions}
          quickActions={chatHubContent.quickActions}
          userInitial={(user?.fullName?.trim()?.[0] ?? user?.email?.trim()?.[0] ?? "U").toUpperCase()}
        />
      );
    }

    if (currentPage === "discover-new") {
      return (
        <DiscoverResearchPage
          onOpenChatHub={() => handleNavigate("chat-hub")}
        />
      );
    }

    if (currentPage === "agents") {
      return (
        <AgentsWorkspace
          agents={agents}
          onOpenChatHub={(prompt) => {
            setPendingChatRequest({ id: `agent-chat-${Date.now()}`, prompt });
            handleNavigate("chat-hub");
          }}
          onCreateAgent={async (payload) => {
            const createdAgent = await api.createAgent(payload);
            await refreshAgents();
            return createdAgent;
          }}
          onDeployAgent={async (id) => {
            const result = await api.deployAgent(id);
            await refreshAgents();
            return result;
          }}
          onUpdateAgent={async (id, payload) => {
            const updatedAgent = await api.updateAgent(id, payload);
            await refreshAgents();
            return updatedAgent;
          }}
          templates={agentTemplates}
        />
      );
    }

    if (currentPage === "marketplace") {
      return (
        <div className="bg-[#f7f3ee]">
          <MarketplaceSection
            filterOptions={modelFilters}
            language={language}
            models={allModels}
            onSelectModel={(modelId) => setSelectedModelId(modelId)}
          />
        </div>
      );
    }

    return (
      <PlaceholderPage
        actions={pageContent[currentPage].actions}
        description={pageContent[currentPage].description}
        eyebrow={pageContent[currentPage].eyebrow}
        title={pageContent[currentPage].title}
      />
    );
  };

  return (
    <AppShell
      currentPage={currentPage}
      language={language}
      labels={{
        agents: t(language, "nav_agents"),
        chatHub: t(language, "nav_chat_hub"),
        discoverNew: t(language, "nav_discover_new"),
        getStartedFree: t(language, "get_started_free"),
        marketplace: t(language, "nav_marketplace"),
        signIn: t(language, "sign_in"),
        signOut: t(language, "sign_out")
      }}
      onLanguageChange={handleLanguageChange}
      onNavigate={handleNavigate}
      onSignOut={signOut}
      user={user}
    >
      {renderPage()}
      {selectedModelDetail ? (
        <ModelDetailModal
          detail={selectedModelDetail}
          onClose={() => setSelectedModelId(null)}
        />
      ) : null}
    </AppShell>
  );
};

export default App;

