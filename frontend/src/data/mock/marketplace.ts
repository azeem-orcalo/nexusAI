export type ModelTag = {
  id: string;
  label: string;
};

export type MarketplaceModel = {
  id: string;
  name: string;
  provider: string;
  badge?: string;
  description: string;
  tags: ModelTag[];
  rating: string;
  reviews: string;
  price: string;
  tokenUnit: string;
};

export type ModelUseCase = {
  id: string;
  label: string;
  icon: string;
};

export type ModelBenchmark = {
  id: string;
  label: string;
  value: string;
};

export type ModelDetail = {
  id: string;
  name: string;
  subtitle: string;
  overview: string;
  input: string;
  output: string;
  context: string;
  maxOutput: string;
  latency: string;
  useCases: ModelUseCase[];
  examplePrompt: string;
  exampleResponse: string[];
  followUps: string[];
  benchmarks: ModelBenchmark[];
};

export const marketplaceModels: MarketplaceModel[] = [
  {
    id: "gpt-5",
    name: "GPT-5",
    provider: "OpenAI",
    badge: "Hot",
    description:
      "OpenAI flagship. Native agent use, advanced reasoning, and long-context workflows.",
    tags: [
      { id: "flagship", label: "Flagship" },
      { id: "agents", label: "Agents" },
      { id: "multimodal", label: "Multimodal" }
    ],
    rating: "4.9",
    reviews: "(4,210)",
    price: "$7.50/1M",
    tokenUnit: "tk"
  },
  {
    id: "gpt-52",
    name: "GPT-5.2",
    provider: "OpenAI",
    badge: "New",
    description:
      "Mid-tier GPT-5 variant with improved instruction-following and multimodal support.",
    tags: [
      { id: "multimodal", label: "Multimodal" },
      { id: "balanced", label: "Balanced" },
      { id: "instruction", label: "Instruction" }
    ],
    rating: "4.8",
    reviews: "(2,180)",
    price: "$4/1M",
    tokenUnit: "tk"
  },
  {
    id: "gpt-45",
    name: "GPT-4.5",
    provider: "OpenAI",
    description:
      "Bridging model with improved creativity and long-form generation for mixed workloads.",
    tags: [
      { id: "creative", label: "Creative" },
      { id: "long-form", label: "Long-form" },
      { id: "language", label: "Language" }
    ],
    rating: "4.7",
    reviews: "(1,980)",
    price: "$3/1M",
    tokenUnit: "tk"
  },
  {
    id: "gpt-41",
    name: "GPT-4.1",
    provider: "OpenAI",
    description:
      "Optimized for coding and instruction-following with 128K context and strong latency balance.",
    tags: [
      { id: "code", label: "Code" },
      { id: "instructions", label: "Instructions" },
      { id: "128k", label: "128K" }
    ],
    rating: "4.7",
    reviews: "(2,310)",
    price: "$2/1M",
    tokenUnit: "tk"
  },
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description:
      "Multimodal flagship combining text, vision, and audio in one unified model.",
    tags: [
      { id: "multimodal", label: "Multimodal" },
      { id: "vision", label: "Vision" },
      { id: "audio", label: "Audio" }
    ],
    rating: "4.7",
    reviews: "(5,120)",
    price: "$2.50/1M",
    tokenUnit: "tk"
  },
  {
    id: "o3",
    name: "o3",
    provider: "OpenAI",
    badge: "Hot",
    description:
      "OpenAI's advanced reasoning model with chain-of-thought support for complex tasks.",
    tags: [
      { id: "reasoning", label: "Reasoning" },
      { id: "math", label: "Math" },
      { id: "science", label: "Science" }
    ],
    rating: "4.8",
    reviews: "(1,640)",
    price: "$15/1M",
    tokenUnit: "tk"
  }
];

export const featuredModelDetail: ModelDetail = {
  id: "gpt-45-detail",
  name: "GPT-4.5",
  subtitle: "by OpenAI · Creative model",
  overview:
    "GPT-4o is OpenAI's flagship multimodal model combining text, vision, and audio in one unified architecture. It achieves state-of-the-art performance across language understanding, reasoning, and code generation tasks.",
  input: "Text, images, audio, PDFs",
  output: "Text, code, structured data",
  context: "128K tokens",
  maxOutput: "4,096 tokens",
  latency: "~1.2s avg",
  useCases: [
    { id: "content", label: "Content writing", icon: "✍️" },
    { id: "code", label: "Code generation", icon: "💻" },
    { id: "docs", label: "Document analysis", icon: "🔎" },
    { id: "translate", label: "Translation", icon: "🌐" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "data", label: "Data analysis", icon: "📊" }
  ],
  examplePrompt:
    "Summarize this research paper in 3 bullet points and suggest 2 follow-up questions.",
  exampleResponse: [
    "The paper introduces a new attention mechanism reducing compute by 40%",
    "Results on MMLU show 3.2% improvement over baseline",
    "Authors release code and weights under MIT license"
  ],
  followUps: [
    "How does this scale to 100B+ parameter models?",
    "What are the trade-offs in inference time?"
  ],
  benchmarks: [
    { id: "mmlu", label: "MMLU", value: "87.2" },
    { id: "human-eval", label: "HumanEval", value: "90.2" },
    { id: "math", label: "MATH", value: "76.6" },
    { id: "rating", label: "Rating", value: "4.7⭐" }
  ]
};
