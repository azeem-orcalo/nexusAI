export type ChatModel = {
  id: string;
  name: string;
  provider: string;
  active?: boolean;
};

export type ChatAction = {
  id: string;
  label: string;
  icon: string;
};

export type ChatPromptOption = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

export type ChatSuggestion = {
  id: string;
  label: string;
};

export type ChatHubContent = {
  models: ChatModel[];
  quickActions: ChatAction[];
  createActions: ChatAction[];
  analysisActions: ChatAction[];
  promptOptions: ChatPromptOption[];
  suggestionChips: ChatSuggestion[];
  footerPrompts: string[];
};

export const chatHubContent: ChatHubContent = {
  models: [
    { id: "gpt-5", name: "GPT-5", provider: "OpenAI", active: true },
    { id: "gpt-52", name: "GPT-5.2", provider: "OpenAI" },
    { id: "gpt-5-turbo", name: "GPT-5 Turbo", provider: "OpenAI" },
    { id: "gpt-45", name: "GPT-4.5", provider: "OpenAI" },
    { id: "gpt-41", name: "GPT-4.1", provider: "OpenAI" },
    { id: "gpt-41-mini", name: "GPT-4.1-mini", provider: "OpenAI" },
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI" },
    { id: "gpt-4o-mini", name: "GPT-4o-mini", provider: "OpenAI" },
    { id: "o3", name: "o3", provider: "OpenAI" },
    { id: "claude-opus-46", name: "Claude Opus 4.6", provider: "Anthropic" },
    { id: "claude-sonnet-46", name: "Claude Sonnet 4.6", provider: "Anthropic" },
    { id: "gemini-31-pro", name: "Gemini 3.1 Pro", provider: "Google DeepMind" }
  ],
  quickActions: [
    { id: "marketplace", label: "Browse Marketplace", icon: "🏪" },
    { id: "agent", label: "Build an Agent", icon: "🧩" },
    { id: "guide", label: "How to use Guide", icon: "📖" },
    { id: "prompt", label: "Prompt Engineering", icon: "✏️" },
    { id: "pricing", label: "View Pricing", icon: "💳" },
    { id: "analysis", label: "AI Models Analysis", icon: "📊" }
  ],
  createActions: [
    { id: "image", label: "Create Image", icon: "🖼️" },
    { id: "audio", label: "Generate Audio", icon: "🎧" },
    { id: "video", label: "Create Video", icon: "🎬" },
    { id: "slides", label: "Create Slides", icon: "🧾" },
    { id: "infographic", label: "Create Infographs", icon: "📈" },
    { id: "quiz", label: "Create Quiz", icon: "❓" },
    { id: "flashcards", label: "Create Flashcards", icon: "🟨" },
    { id: "mindmap", label: "Create Mind map", icon: "🧠" }
  ],
  analysisActions: [
    { id: "data", label: "Analyze Data", icon: "📉" },
    { id: "content", label: "Write content", icon: "✍️" },
    { id: "code", label: "Code Generation", icon: "💻" },
    { id: "documents", label: "Document Analysis", icon: "📄" },
    { id: "translate", label: "Translate", icon: "🌐" }
  ],
  promptOptions: [
    {
      id: "write",
      title: "Write content",
      subtitle: "Emails, posts, stories",
      icon: "✍️"
    },
    {
      id: "images",
      title: "Create images",
      subtitle: "Art, photos, designs",
      icon: "🎨"
    },
    {
      id: "build",
      title: "Build something",
      subtitle: "Apps, tools, websites",
      icon: "🛠️"
    },
    {
      id: "automate",
      title: "Automate work",
      subtitle: "Save hours every week",
      icon: "⚡"
    },
    {
      id: "data",
      title: "Analyse data",
      subtitle: "PDFs, sheets, reports",
      icon: "📊"
    },
    {
      id: "explore",
      title: "Just exploring",
      subtitle: "Show me what's possible",
      icon: "🔎"
    }
  ],
  suggestionChips: [
    { id: "use-cases", label: "Use cases" },
    { id: "monitor", label: "Monitor the situation" },
    { id: "prototype", label: "Create a prototype" },
    { id: "business", label: "Build a business plan" },
    { id: "content", label: "Create content" },
    { id: "research", label: "Analyze & research" },
    { id: "learn", label: "Learn something" }
  ],
  footerPrompts: [
    "Help me find the best AI model for my project",
    "Generate realistic images for my marketing campaign",
    "Create AI agents for workflow automation",
    "I want to build an AI chatbot for my website",
    "Analyse documents and extract key information",
    "Add voice and speech recognition to my app"
  ]
};
