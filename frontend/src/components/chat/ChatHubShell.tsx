import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ChatAction,
  ChatModel,
  ChatPromptOption,
  ChatSuggestion
} from "../../data/mock/chatHub";
import { ChatWelcomePanel } from "./ChatWelcomePanel";

type AppPage =
  | "chat-hub"
  | "marketplace"
  | "agents"
  | "discover-new"
  | "dashboard"
  | "api-access"
  | "reviews"
  | "research";

type ChatHubShellProps = {
  models: ChatModel[];
  quickActions: ChatAction[];
  createActions: ChatAction[];
  analysisActions: ChatAction[];
  promptOptions: ChatPromptOption[];
  suggestionChips: ChatSuggestion[];
  footerPrompts: string[];
  onNavigate: (page: AppPage) => void;
};

type ComposerAttachment = {
  id: string;
  kind: "audio" | "file" | "screen" | "video";
  name: string;
  previewUrl?: string;
  sizeLabel?: string;
};

type ChatMessage = {
  id: string;
  text: string;
  role: "assistant" | "user";
  status?: string;
  attachments?: ComposerAttachment[];
};

type ConversationItem = {
  id: string;
  title: string;
  summary: string;
  tag: string;
  updatedAt: string;
};

const actionColorMap: Record<ComposerAttachment["kind"], string> = {
  audio: "border-[#ead9cb] bg-[#fff4eb] text-[#b86835]",
  file: "border-[#d8e7ff] bg-[#f1f7ff] text-[#3971c6]",
  screen: "border-[#d7efe3] bg-[#eefaf3] text-[#27815a]",
  video: "border-[#f2d7dd] bg-[#fff1f4] text-[#ba4962]"
};

const conversationsSeed: ConversationItem[] = [
  {
    id: "launch-plan",
    title: "Launch Strategy Sprint",
    summary: "Finalize rollout messaging, demo assets, and handoff notes.",
    tag: "Strategy",
    updatedAt: "2 min ago"
  },
  {
    id: "sales-copilot",
    title: "Sales Copilot Build",
    summary: "Create prompts, attach call notes, and review deal blockers.",
    tag: "Agent",
    updatedAt: "18 min ago"
  },
  {
    id: "research-brief",
    title: "Research Brief",
    summary: "Collect sources, compare models, and summarize key findings.",
    tag: "Research",
    updatedAt: "36 min ago"
  },
  {
    id: "support-workflow",
    title: "Support Workflow",
    summary: "Map escalation paths and create reusable support responses.",
    tag: "Ops",
    updatedAt: "1 hr ago"
  }
];

const formatBytes = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const ComposerIcon = ({
  kind,
  className = "h-[18px] w-[18px]"
}: {
  kind: "voice" | "file" | "audio" | "video" | "screen" | "send" | "search";
  className?: string;
}): JSX.Element => {
  if (kind === "voice") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <rect x="9" y="4" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M6.5 11.5a5.5 5.5 0 1 0 11 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M12 17v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "file") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <path d="M9 6.5h7l2.5 2.5V18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M16 6.5V9h2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "audio") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <path d="M9 15V9a3 3 0 1 1 6 0v6" stroke="currentColor" strokeWidth="1.8" />
        <path d="M7 13.5a5 5 0 0 0 10 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M12 18v2.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "video") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <rect x="4" y="6.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m15 10 4.5-2v8L15 14" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "screen") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <rect x="4" y="5.5" width="16" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.8" />
        <path d="M9.5 19h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
        <path d="M12 16v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (kind === "search") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24">
        <circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="m15 15 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <path d="M5 12h11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <path d="m12 5 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
};

const ActionGroup = ({
  title,
  actions,
  onActionClick
}: {
  title: string;
  actions: ChatAction[];
  onActionClick: (actionId: string) => void;
}): JSX.Element => {
  return (
    <div className="rounded-[24px] border border-[#eadfce] bg-white p-4 shadow-[0_16px_40px_rgba(83,59,31,0.08)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8d80]">
        {title}
      </p>
      <div className="mt-3 space-y-2">
        {actions.map((action) => (
          <button
            key={action.id}
            className="flex w-full items-center justify-between rounded-[16px] border border-[#eee2d4] bg-[#fcfaf7] px-3 py-3 text-left text-[13px] text-[#40352d] transition hover:border-[#d8c5b3] hover:bg-white"
            onClick={() => onActionClick(action.id)}
            type="button"
          >
            <span className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#eadccc] bg-white text-[13px] text-[#c66b2d]">
                {action.icon.slice(0, 1) || "+"}
              </span>
              <span>{action.label}</span>
            </span>
            <span className="text-[#b6a596]">+</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export const ChatHubShell = ({
  models,
  quickActions,
  createActions,
  analysisActions,
  promptOptions,
  suggestionChips,
  footerPrompts,
  onNavigate
}: ChatHubShellProps): JSX.Element => {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeModelId, setActiveModelId] = useState(
    models.find((model) => model.active)?.id ?? models[0]?.id ?? ""
  );
  const [pendingAttachments, setPendingAttachments] = useState<ComposerAttachment[]>([]);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [composerStatus, setComposerStatus] = useState("Ready to collaborate");
  const [modelQuery, setModelQuery] = useState("");
  const [conversationQuery, setConversationQuery] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState(conversationsSeed[0]?.id ?? "");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      pendingAttachments.forEach((attachment) => {
        if (attachment.previewUrl) {
          URL.revokeObjectURL(attachment.previewUrl);
        }
      });
    };
  }, [pendingAttachments]);

  const activeModel =
    models.find((model) => model.id === activeModelId) ?? models[0] ?? null;

  const filteredModels = useMemo(() => {
    const query = modelQuery.trim().toLowerCase();

    if (!query) {
      return models;
    }

    return models.filter((model) => {
      const haystack = `${model.name} ${model.provider}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [modelQuery, models]);

  const filteredConversations = useMemo(() => {
    const query = conversationQuery.trim().toLowerCase();

    if (!query) {
      return conversationsSeed;
    }

    return conversationsSeed.filter((conversation) => {
      const haystack = `${conversation.title} ${conversation.summary} ${conversation.tag}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [conversationQuery]);

  const selectedConversation =
    conversationsSeed.find((conversation) => conversation.id === selectedConversationId) ??
    conversationsSeed[0] ??
    null;

  const visibleMessages = messages.filter(
    (message) => !message.status || message.status === selectedConversation?.id
  );

  const pinnedMessages = visibleMessages.filter((message) => message.role === "assistant").slice(-2);
  const sharedAttachments = visibleMessages.flatMap((message) => message.attachments ?? []).slice(-6);

  const routeAction = (actionId: string): void => {
    if (actionId === "marketplace") {
      onNavigate("marketplace");
      return;
    }

    if (actionId === "agent") {
      onNavigate("agents");
      return;
    }

    if (actionId === "analysis" || actionId === "research") {
      onNavigate("research");
      return;
    }

    const selectedPrompt = footerPrompts.find((prompt) =>
      prompt.toLowerCase().includes(actionId.toLowerCase())
    );

    if (selectedPrompt) {
      setDraft(selectedPrompt);
      setComposerStatus("Action added to composer");
      return;
    }

    setComposerStatus("Action ready in composer");
  };

  const addAttachments = (
    files: FileList | null,
    kind: ComposerAttachment["kind"]
  ): void => {
    if (!files || files.length === 0) {
      return;
    }

    const nextAttachments = Array.from(files).map((file, index) => ({
      id: `${kind}-${Date.now()}-${index}`,
      kind,
      name: file.name,
      previewUrl: kind === "video" || kind === "audio" ? URL.createObjectURL(file) : undefined,
      sizeLabel: formatBytes(file.size)
    }));

    setPendingAttachments((current) => [...current, ...nextAttachments]);
    setComposerStatus(`${nextAttachments.length} attachment added`);
  };

  const handleRemoveAttachment = (attachmentId: string): void => {
    setPendingAttachments((current) => {
      const found = current.find((attachment) => attachment.id === attachmentId);
      if (found?.previewUrl) {
        URL.revokeObjectURL(found.previewUrl);
      }
      return current.filter((attachment) => attachment.id !== attachmentId);
    });
  };

  const toggleVoiceRecording = async (): Promise<void> => {
    if (isRecordingVoice && mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
      setIsRecordingVoice(false);
      setComposerStatus("Voice note saved to attachments");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setComposerStatus("Voice recording is not available in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      });

      recorder.addEventListener("stop", () => {
        if (audioChunksRef.current.length === 0) {
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const previewUrl = URL.createObjectURL(blob);
        setPendingAttachments((current) => [
          ...current,
          {
            id: `audio-recording-${Date.now()}`,
            kind: "audio",
            name: `voice-note-${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit"
            })}.webm`,
            sizeLabel: formatBytes(blob.size)
          }
        ]);
      });

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingVoice(true);
      setComposerStatus("Recording voice note");
    } catch {
      setComposerStatus("Microphone permission is required to record voice");
    }
  };

  const toggleScreenShare = async (): Promise<void> => {
    if (isSharingScreen && screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setIsSharingScreen(false);
      setPendingAttachments((current) =>
        current.filter((attachment) => attachment.kind !== "screen")
      );
      setComposerStatus("Screen sharing stopped");
      return;
    }

    if (!navigator.mediaDevices || !("getDisplayMedia" in navigator.mediaDevices)) {
      setComposerStatus("Screen sharing is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const [track] = stream.getVideoTracks();
      const screenName = track?.label || `screen-share-${Date.now()}`;

      screenStreamRef.current = stream;
      setIsSharingScreen(true);
      setPendingAttachments((current) => [
        ...current.filter((attachment) => attachment.kind !== "screen"),
        {
          id: `screen-${Date.now()}`,
          kind: "screen",
          name: screenName,
          sizeLabel: "Live preview"
        }
      ]);
      setComposerStatus("Screen sharing is active");

      track?.addEventListener("ended", () => {
        setIsSharingScreen(false);
        setPendingAttachments((current) =>
          current.filter((attachment) => attachment.kind !== "screen")
        );
        setComposerStatus("Screen sharing stopped");
      });
    } catch {
      setComposerStatus("Screen sharing requires permission");
    }
  };

  const handleSend = (): void => {
    const trimmedDraft = draft.trim();

    if (!trimmedDraft && pendingAttachments.length === 0) {
      setComposerStatus("Add a message or attachment to continue");
      return;
    }

    const nextUserMessage: ChatMessage = {
      id: `message-${Date.now()}`,
      text: trimmedDraft || "Shared attachments",
      role: "user",
      status: selectedConversation?.id,
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined
    };

    const assistantReply: ChatMessage = {
      id: `assistant-${Date.now()}`,
      text: trimmedDraft
        ? `I am ready to help with "${trimmedDraft}". I can turn this into a plan, research brief, or agent workflow while keeping your uploaded context attached.`
        : "I received your attachments and can help summarize them, extract actions, or turn them into a working plan.",
      role: "assistant",
      status: selectedConversation?.id
    };

    setMessages((current) => [...current, nextUserMessage, assistantReply]);
    setDraft("");
    setPendingAttachments([]);
    setComposerStatus("Message sent");
  };

  return (
    <section className="min-h-[calc(100vh-53px)] bg-[#f7f3ee] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] gap-4 xl:grid-cols-[280px_minmax(0,1fr)_310px]">
        <aside className="space-y-4">
          <div className="rounded-[28px] border border-[#eadfce] bg-white p-5 shadow-[0_20px_45px_rgba(83,59,31,0.08)]">
            <div className="inline-flex rounded-full border border-[#eadccf] bg-[#fff8f1] px-3 py-1 text-[11px] font-semibold text-[#ca6f33]">
              Chat Hub
            </div>
            <h1 className="mt-4 text-[28px] font-semibold leading-[1.05] text-[#18120f]">
              Design, discuss, and ship with one guided workspace.
            </h1>
            <p className="mt-3 text-[14px] leading-6 text-[#74695f]">
              Your chat hub keeps voice, files, video, screen sharing, and model context together so every task stays actionable.
            </p>

            <button
              className="mt-5 flex w-full items-center justify-center rounded-full bg-[#c9682d] px-4 py-3 text-[15px] font-semibold text-white transition hover:bg-[#b55c26]"
              onClick={() => {
                setSelectedConversationId(conversationsSeed[0]?.id ?? "");
                setDraft("Help me create a step-by-step launch workspace.");
                setComposerStatus("Starter prompt added");
              }}
              type="button"
            >
              Start a guided session
            </button>
          </div>

          <div className="rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-[0_20px_45px_rgba(83,59,31,0.08)]">
            <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8d80]" htmlFor="conversation-search">
              Search conversations
            </label>
            <div className="mt-3 flex items-center gap-3 rounded-[18px] border border-[#eadfce] bg-[#fbf8f4] px-4 py-3 text-[#9a8d80]">
              <ComposerIcon kind="search" className="h-[16px] w-[16px]" />
              <input
                id="conversation-search"
                className="w-full bg-transparent text-[14px] text-[#302720] outline-none placeholder:text-[#b3a598]"
                onChange={(event) => setConversationQuery(event.target.value)}
                placeholder="Find a chat, topic, or task"
                value={conversationQuery}
              />
            </div>

            <div className="mt-4 space-y-2">
              {filteredConversations.map((conversation) => {
                const isActive = conversation.id === selectedConversationId;

                return (
                  <button
                    key={conversation.id}
                    className={`w-full rounded-[20px] border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-[#d1b59c] bg-[#fff6ee] shadow-[0_12px_22px_rgba(114,79,42,0.08)]"
                        : "border-[#eee3d6] bg-[#fcfaf7] hover:border-[#dcc8b5] hover:bg-white"
                    }`}
                    onClick={() => setSelectedConversationId(conversation.id)}
                    type="button"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[14px] font-semibold text-[#2f261f]">{conversation.title}</p>
                      <span className="rounded-full border border-[#ead9cb] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#b47542]">
                        {conversation.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-[12px] leading-5 text-[#7d7269]">{conversation.summary}</p>
                    <p className="mt-2 text-[11px] text-[#a39486]">Updated {conversation.updatedAt}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-[0_20px_45px_rgba(83,59,31,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8d80]">
                Models
              </p>
              <span className="rounded-full bg-[#f5ede5] px-2 py-1 text-[10px] font-semibold text-[#946b49]">
                {filteredModels.length}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3 rounded-[16px] border border-[#eadfce] bg-[#fbf8f4] px-3 py-2.5 text-[#9a8d80]">
              <ComposerIcon kind="search" className="h-[15px] w-[15px]" />
              <input
                className="w-full bg-transparent text-[13px] text-[#302720] outline-none placeholder:text-[#b3a598]"
                onChange={(event) => setModelQuery(event.target.value)}
                placeholder="Search models"
                value={modelQuery}
              />
            </div>
            <div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto pr-1">
              {filteredModels.map((model) => {
                const isActive = model.id === activeModelId;

                return (
                  <button
                    key={model.id}
                    className={`flex w-full items-center justify-between rounded-[16px] border px-3 py-3 text-left transition ${
                      isActive
                        ? "border-[#d3b69b] bg-[#fff5eb]"
                        : "border-[#eee3d6] bg-[#fcfaf7] hover:border-[#dcc8b5] hover:bg-white"
                    }`}
                    onClick={() => {
                      setActiveModelId(model.id);
                      setComposerStatus(`${model.name} selected`);
                    }}
                    type="button"
                  >
                    <span>
                      <span className="block text-[13px] font-semibold text-[#312821]">{model.name}</span>
                      <span className="block text-[11px] text-[#8d8177]">{model.provider}</span>
                    </span>
                    {isActive ? (
                      <span className="rounded-full bg-[#cf6f33] px-2 py-1 text-[10px] font-semibold text-white">
                        Live
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-[34px] border border-[#eadfce] bg-white px-6 py-7 shadow-[0_24px_56px_rgba(83,59,31,0.08)]">
            <div className="flex flex-col gap-4 border-b border-[#efe4d7] pb-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#a18f81]">
                  Active workspace
                </p>
                <h2 className="mt-2 text-[34px] font-semibold leading-none text-[#15110e]">
                  {selectedConversation?.title ?? "New conversation"}
                </h2>
                <p className="mt-3 max-w-[720px] text-[15px] leading-7 text-[#74695f]">
                  {selectedConversation?.summary ?? "Start with a prompt, voice note, file, video, or screen share and keep every response connected to the same thread."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-full border border-[#eadccc] bg-[#fbf5ee] px-4 py-2 text-[12px] text-[#7d6f62]">
                  {activeModel ? `${activeModel.name} by ${activeModel.provider}` : "No model selected"}
                </div>
                <button
                  className="rounded-full border border-[#eadccc] bg-white px-4 py-2 text-[12px] font-semibold text-[#4f433a] transition hover:border-[#d4bca4]"
                  onClick={() => onNavigate("agents")}
                  type="button"
                >
                  Open agent builder
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
              <div className="rounded-[28px] border border-[#eadfce] bg-[#fbf8f4] p-4">
                <div className="flex items-center gap-3 rounded-[22px] border border-[#e6d9c8] bg-white px-4 py-4 shadow-[0_12px_26px_rgba(83,59,31,0.05)]">
                  <textarea
                    className="min-h-[70px] w-full resize-none bg-transparent text-[16px] leading-7 text-[#241c17] outline-none placeholder:text-[#a99a8d]"
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && !event.shiftKey) {
                        event.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Describe your project, ask a question, or say hi. Voice, files, video, and screen share all work from here."
                    rows={3}
                    value={draft}
                  />
                  <button
                    className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ca6a2f] text-white transition hover:bg-[#b45d27] md:inline-flex"
                    onClick={handleSend}
                    type="button"
                  >
                    <ComposerIcon kind="send" className="h-[20px] w-[20px]" />
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-[16px] border transition ${
                      isRecordingVoice
                        ? "border-[#d9b6c0] bg-[#fff1f4] text-[#bb4a63]"
                        : "border-[#d9cdfa] bg-[#f4efff] text-[#7c55e5]"
                    }`}
                    onClick={() => {
                      void toggleVoiceRecording();
                    }}
                    title="Voice recording"
                    type="button"
                  >
                    <ComposerIcon kind="voice" />
                  </button>

                  <button
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#ffd89d] bg-[#fff6e8] text-[#df8b1d] transition hover:bg-white"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    type="button"
                  >
                    <ComposerIcon kind="file" />
                  </button>

                  <button
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#cfe0ff] bg-[#eff6ff] text-[#3b72ce] transition hover:bg-white"
                    onClick={() => audioInputRef.current?.click()}
                    title="Attach audio"
                    type="button"
                  >
                    <ComposerIcon kind="audio" />
                  </button>

                  <button
                    className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] border border-[#f5c9d1] bg-[#fff2f4] text-[#cf5972] transition hover:bg-white"
                    onClick={() => videoInputRef.current?.click()}
                    title="Attach video"
                    type="button"
                  >
                    <ComposerIcon kind="video" />
                  </button>

                  <button
                    className={`inline-flex h-12 w-12 items-center justify-center rounded-[16px] border transition ${
                      isSharingScreen
                        ? "border-[#b9dfc8] bg-[#ecf9f0] text-[#2f8d61]"
                        : "border-[#cde9da] bg-[#edf9f3] text-[#2d8f62]"
                    }`}
                    onClick={() => {
                      void toggleScreenShare();
                    }}
                    title="Share screen"
                    type="button"
                  >
                    <ComposerIcon kind="screen" />
                  </button>

                  <div className="ml-auto hidden rounded-full border border-[#eadccc] bg-white px-4 py-2 text-[12px] text-[#87796b] md:block">
                    {composerStatus}
                  </div>
                </div>

                <input
                  accept="*"
                  className="hidden"
                  multiple
                  onChange={(event) => addAttachments(event.target.files, "file")}
                  ref={fileInputRef}
                  type="file"
                />
                <input
                  accept="audio/*"
                  className="hidden"
                  multiple
                  onChange={(event) => addAttachments(event.target.files, "audio")}
                  ref={audioInputRef}
                  type="file"
                />
                <input
                  accept="video/*"
                  className="hidden"
                  multiple
                  onChange={(event) => addAttachments(event.target.files, "video")}
                  ref={videoInputRef}
                  type="file"
                />

                {pendingAttachments.length > 0 ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {pendingAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className={`flex items-center gap-3 rounded-full border px-4 py-2 text-[12px] shadow-[0_10px_20px_rgba(83,59,31,0.05)] ${actionColorMap[attachment.kind]}`}
                      >
                        <span className="font-semibold capitalize">{attachment.kind}</span>
                        <span className="max-w-[220px] truncate">{attachment.name}</span>
                        {attachment.sizeLabel ? <span>{attachment.sizeLabel}</span> : null}
                        <button
                          className="rounded-full border border-current/20 px-2 py-0.5 text-[11px]"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          type="button"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}

                {isSharingScreen ? (
                  <div className="mt-4 rounded-[24px] border border-[#d8eadf] bg-[#f3fbf6] p-4">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#2a8a5d]">
                      Screen preview ready
                    </p>
                    <p className="mt-2 text-[13px] leading-6 text-[#5d7167]">
                      Your shared screen is attached to the next message. Press the green screen button again to stop sharing.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[28px] border border-[#eadfce] bg-[#fbf8f4] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8d80]">
                  Suggested paths
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestionChips.map((chip) => (
                    <button
                      key={chip.id}
                      className="rounded-full border border-[#eadccc] bg-white px-4 py-2 text-[12px] font-semibold text-[#4e433a] transition hover:border-[#d4bca4]"
                      onClick={() => {
                        setDraft(chip.label);
                        setComposerStatus("Suggestion added to composer");
                      }}
                      type="button"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5 space-y-2">
                  {footerPrompts.slice(0, 4).map((prompt) => (
                    <button
                      key={prompt}
                      className="w-full rounded-[18px] border border-[#eadccc] bg-white px-4 py-3 text-left text-[13px] text-[#4f463f] transition hover:border-[#d4bca4]"
                      onClick={() => {
                        setDraft(prompt);
                        setComposerStatus("Prompt added to composer");
                      }}
                      type="button"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="rounded-[32px] border border-[#eadfce] bg-white p-5 shadow-[0_24px_56px_rgba(83,59,31,0.08)]">
              {visibleMessages.length === 0 ? (
                <ChatWelcomePanel
                  onPromptSelect={(value) => {
                    setDraft(value);
                    setComposerStatus("Prompt selected");
                  }}
                  promptOptions={promptOptions}
                />
              ) : (
                <div className="space-y-4">
                  {visibleMessages.map((message) => (
                    <article
                      key={message.id}
                      className={`rounded-[26px] border px-5 py-4 ${
                        message.role === "user"
                          ? "ml-auto max-w-[88%] border-[#e6d4c0] bg-[#fff6ee]"
                          : "max-w-[92%] border-[#ece2d8] bg-[#fcfaf7]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a18f81]">
                          {message.role === "user" ? "You" : "Assistant"}
                        </p>
                        <span className="text-[11px] text-[#ad9d8f]">
                          {selectedConversation?.tag ?? "Session"}
                        </span>
                      </div>
                      <p className="mt-3 text-[15px] leading-7 text-[#2c241e]">{message.text}</p>

                      {message.attachments?.length ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className={`rounded-full border px-4 py-2 text-[12px] ${actionColorMap[attachment.kind]}`}
                            >
                              {attachment.kind}: {attachment.name}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-[0_20px_45px_rgba(83,59,31,0.08)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8d80]">
                  Live room
                </p>
                <div className="mt-3 rounded-[22px] border border-[#eadccc] bg-[#fbf8f4] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold text-[#241b16]">{selectedConversation?.tag ?? "Workspace"}</p>
                      <p className="mt-1 text-[12px] text-[#7d7269]">Voice, media, and files stay attached to this thread.</p>
                    </div>
                    <span className="rounded-full bg-[#edf8f1] px-3 py-1 text-[11px] font-semibold text-[#2e8d61]">
                      Synced
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-[18px] border border-[#ebdfd2] bg-white px-3 py-3">
                      <p className="text-[18px] font-semibold text-[#221b16]">{visibleMessages.length}</p>
                      <p className="mt-1 text-[11px] text-[#8f8276]">Messages</p>
                    </div>
                    <div className="rounded-[18px] border border-[#ebdfd2] bg-white px-3 py-3">
                      <p className="text-[18px] font-semibold text-[#221b16]">{sharedAttachments.length}</p>
                      <p className="mt-1 text-[11px] text-[#8f8276]">Assets</p>
                    </div>
                    <div className="rounded-[18px] border border-[#ebdfd2] bg-white px-3 py-3">
                      <p className="text-[18px] font-semibold text-[#221b16]">{isSharingScreen ? "On" : "Off"}</p>
                      <p className="mt-1 text-[11px] text-[#8f8276]">Screen</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-[0_20px_45px_rgba(83,59,31,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8d80]">
                    Pinned context
                  </p>
                  <span className="rounded-full bg-[#f5ede5] px-2 py-1 text-[10px] font-semibold text-[#946b49]">
                    {pinnedMessages.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {pinnedMessages.length > 0 ? (
                    pinnedMessages.map((message) => (
                      <div key={message.id} className="rounded-[18px] border border-[#eadccc] bg-[#fcfaf7] px-4 py-3">
                        <p className="text-[12px] font-semibold text-[#342b24]">Assistant note</p>
                        <p className="mt-2 text-[12px] leading-6 text-[#7b7066]">{message.text}</p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-[#e2d4c3] bg-[#fbf8f4] px-4 py-4 text-[12px] leading-6 text-[#8a7d71]">
                      Send a message to start building pinned guidance for this workspace.
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-[#eadfce] bg-white p-4 shadow-[0_20px_45px_rgba(83,59,31,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b8d80]">
                    Shared assets
                  </p>
                  <span className="rounded-full bg-[#f5ede5] px-2 py-1 text-[10px] font-semibold text-[#946b49]">
                    {sharedAttachments.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {sharedAttachments.length > 0 ? (
                    sharedAttachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className={`rounded-[18px] border px-4 py-3 text-[12px] ${actionColorMap[attachment.kind]}`}
                      >
                        <p className="font-semibold capitalize">{attachment.kind}</p>
                        <p className="mt-1 truncate">{attachment.name}</p>
                        {attachment.sizeLabel ? <p className="mt-1 text-[11px] opacity-80">{attachment.sizeLabel}</p> : null}
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[18px] border border-dashed border-[#e2d4c3] bg-[#fbf8f4] px-4 py-4 text-[12px] leading-6 text-[#8a7d71]">
                      Attached files, voice notes, videos, and screen shares will appear here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <ActionGroup title="Quick actions" actions={quickActions} onActionClick={routeAction} />
          <ActionGroup title="Create with AI" actions={createActions} onActionClick={routeAction} />
          <ActionGroup title="Analysis tools" actions={analysisActions} onActionClick={routeAction} />
        </aside>
      </div>
    </section>
  );
};
