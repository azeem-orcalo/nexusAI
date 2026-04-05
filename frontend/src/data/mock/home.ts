export type HeroStat = {
  label: string;
  value: string;
};

export type HeroPill = {
  id: string;
  label: string;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  targetPage?: "chat-hub" | "marketplace" | "agents";
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  primaryActionLabel: string;
  pills: HeroPill[];
  quickActions: QuickAction[];
  stats: HeroStat[];
};

export const heroContent: HeroContent = {
  eyebrow: "347 models live · Updated daily",
  title: "Find your perfect",
  highlightedTitle: "AI model with guided discovery",
  description:
    "You don't need to know anything about AI to get started. Just click the box below and we'll guide you through models, tools, and agent flows step by step.",
  primaryActionLabel: "Let's go",
  pills: [
    { id: "prototype", label: "Create a landing page or prototype" },
    { id: "essay", label: "Research and plan for a long-form article" },
    { id: "notes", label: "Research a candidate before an interview" },
    { id: "mindmap", label: "Build an educational mind map" }
  ],
  quickActions: [
    { id: "image", label: "Create Image", icon: "🖼️", targetPage: "chat-hub" },
    { id: "slides", label: "Generate Slides", icon: "🪄", targetPage: "chat-hub" },
    { id: "video", label: "Create Video", icon: "🎬", targetPage: "chat-hub" },
    { id: "audio", label: "Create Audio", icon: "🎧", targetPage: "chat-hub" },
    { id: "thought", label: "Create Infographic", icon: "💡", targetPage: "chat-hub" },
    { id: "quiz", label: "Create Quiz", icon: "❓", targetPage: "chat-hub" },
    { id: "mind", label: "Build Mind map", icon: "🧠", targetPage: "chat-hub" },
    { id: "agent", label: "Agent Workflows", icon: "⚙️", targetPage: "agents" }
  ],
  stats: [
    { label: "AI Models", value: "525+" },
    { label: "Builders", value: "82K" },
    { label: "AI Labs", value: "28" },
    { label: "Avg Rating", value: "4.8" }
  ]
};
