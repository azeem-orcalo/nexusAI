import { useEffect, useMemo, useRef, useState } from "react";
import type {
  ChatAction,
  ChatModel,
  ChatPromptOption
} from "../../data/mock/chatHub";
import type {
  ChatHubPromptCategory,
  ChatHubPromptSuggestion
} from "../../types/api";
import { api } from "../../lib/api";
import { getAltCamStream } from "../../lib/altcam";
import { t } from "../../lib/i18n";

type AppPage = "chat-hub" | "marketplace" | "agents" | "discover-new" | "dashboard" | "api-access" | "reviews" | "research";
type InitialChatRequest = { id: string; prompt: string };
type ChatHubShellProps = { language: string; models: ChatModel[]; quickActions: ChatAction[]; createActions: ChatAction[]; analysisActions: ChatAction[]; promptOptions: ChatPromptOption[]; promptCategories: ChatHubPromptCategory[]; promptSuggestions: ChatHubPromptSuggestion[]; userInitial?: string; onNavigate: (page: AppPage) => void; initialRequest?: InitialChatRequest | null; onInitialMessageHandled?: () => void; };
type ComposerAttachment = { id: string; kind: "audio" | "camera" | "file" | "screen" | "video"; name: string; previewUrl?: string; sizeLabel?: string; stream?: MediaStream; };
type ChatMessage = { id: string; text: string; role: "assistant" | "user"; attachments?: ComposerAttachment[]; };
type SpeechRec = { continuous: boolean; interimResults: boolean; lang: string; onresult: ((event: { results: ArrayLike<{ 0: { transcript: string }; isFinal?: boolean }> }) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; };
type BrowserWindow = Window & typeof globalThis & { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec; };

const colors = { audio: "border-[#ead9cb] bg-[#fff4eb] text-[#b86835]", camera: "border-[#d9e8ff] bg-[#f2f7ff] text-[#356ec4]", file: "border-[#d8e7ff] bg-[#f1f7ff] text-[#3971c6]", screen: "border-[#d7efe3] bg-[#eefaf3] text-[#27815a]", video: "border-[#f2d7dd] bg-[#fff1f4] text-[#ba4962]" } as const;
const promptAccents = ["text-[#e07d34]","text-[#e08c49]","text-[#8b78d7]","text-[#e07d34]","text-[#64a0d7]","text-[#8f73c9]"] as const;
const toolButtonStyles = { voice: "border-[#ded0ff] bg-[#f6f1ff] text-[#7c55e5]", file: "border-[#ffd89d] bg-[#fff6e8] text-[#df8b1d]", camera: "border-[#cfe0ff] bg-[#eff6ff] text-[#3b72ce]", video: "border-[#f5c9d1] bg-[#fff2f4] text-[#cf5972]", screen: "border-[#cde9da] bg-[#edf9f3] text-[#2d8f62]" } as const;
const CHAT_SESSION_STORAGE_KEY = "nexusai-chat-session";

const createChatSessionId = (): string =>
  `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const revokeAttachmentPreview = (attachment: ComposerAttachment): void => {
  if (attachment.previewUrl) {
    URL.revokeObjectURL(attachment.previewUrl);
  }
  attachment.stream?.getTracks().forEach((track) => track.stop());
};

const sizeLabel = (size: number): string => size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;

const Icon = ({ kind, className = "h-4 w-4" }: { kind: "voice" | "file" | "camera" | "video" | "screen" | "send" | "search" | "sparkle"; className?: string; }): JSX.Element => {
  const common = { className, fill: "none", viewBox: "0 0 24 24" };
  if (kind === "voice") return <svg {...common}><rect x="9" y="4" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" /><path d="M6.5 11.5a5.5 5.5 0 1 0 11 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M12 17v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
  if (kind === "file") return <svg {...common}><path d="M9 6.5h7l2.5 2.5V18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" /><path d="M16 6.5V9h2.5" stroke="currentColor" strokeWidth="1.8" /></svg>;
  if (kind === "camera") return <svg {...common}><rect x="3.5" y="6.5" width="17" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" /><path d="M8 6.5 9.5 4.5h5L16 6.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
  if (kind === "video") return <svg {...common}><rect x="4" y="6.5" width="11" height="11" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="m15 10 4.5-2v8L15 14" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
  if (kind === "screen") return <svg {...common}><rect x="4" y="5.5" width="16" height="10.5" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9.5 19h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M12 16v3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
  if (kind === "search") return <svg {...common}><circle cx="10.5" cy="10.5" r="5.5" stroke="currentColor" strokeWidth="1.8" /><path d="m15 15 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
  if (kind === "sparkle") return <svg {...common}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" fill="currentColor" /></svg>;
  return <svg {...common}><path d="M5 12h11" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="m12 5 7 7-7 7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
};

const ScreenSharePreview = ({ stream }: { stream: MediaStream }): JSX.Element => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return <video autoPlay className="mt-2 max-h-[180px] w-full rounded-[12px] border border-current/10 bg-[#1e1a18]" muted playsInline ref={videoRef} />;
};

const ChatAvatar = ({
  kind,
  userInitial
}: {
  kind: "assistant" | "user";
  userInitial: string;
}): JSX.Element => (
  <div
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-[14px] font-semibold ${
      kind === "assistant"
        ? "border-[#f0d4c2] bg-[#fff8f2] text-[#d47b39]"
        : "border-[#dfc0a7] bg-[#cb6d2e] text-white"
    }`}
  >
    {kind === "assistant" ? "✦" : userInitial}
  </div>
);

const sidebarActionStyles: Record<string, string> = {
  marketplace: "border-[#eddcca] bg-[#fff7eb] text-[#b8753d]",
  agent: "border-[#ead8ff] bg-[#f8f2ff] text-[#8a5be3]",
  guide: "border-[#d7e5ff] bg-[#f1f6ff] text-[#5e86db]",
  prompt: "border-[#e2ddf3] bg-[#f7f4ff] text-[#8675b6]",
  pricing: "border-[#f5decd] bg-[#fff5eb] text-[#d28639]",
  analysis: "border-[#d8f0e4] bg-[#effaf4] text-[#2f9a6c]",
  image: "border-[#ffd9d7] bg-[#fff3f1] text-[#df7464]",
  audio: "border-[#e0d7ff] bg-[#f5f2ff] text-[#7860d9]",
  video: "border-[#d7dcff] bg-[#f3f5ff] text-[#6576d9]",
  slides: "border-[#ffe2c9] bg-[#fff5ea] text-[#d8893f]",
  infographic: "border-[#d8e4ff] bg-[#f0f5ff] text-[#557fda]",
  quiz: "border-[#ffd6dc] bg-[#fff1f4] text-[#dc587a]",
  flashcards: "border-[#ffe0a8] bg-[#fff8e7] text-[#d19b20]",
  mindmap: "border-[#ffd7eb] bg-[#fff1f8] text-[#e05b9b]",
  data: "border-[#d8e4ff] bg-[#f0f5ff] text-[#5d7fdb]",
  content: "border-[#ffe3c1] bg-[#fff5e7] text-[#e08b28]",
  code: "border-[#d3ebff] bg-[#edf7ff] text-[#3f96d0]",
  documents: "border-[#e3dff8] bg-[#f6f4ff] text-[#8c7acb]",
  translate: "border-[#d8efff] bg-[#eff9ff] text-[#3a9ac6]",
  default: "border-[#eadfd2] bg-[#f8f4ee] text-[#9f8f81]"
};

const SidebarActionIcon = ({ actionId }: { actionId: string }): JSX.Element => {
  const common = {
    className: "h-4 w-4",
    fill: "none",
    viewBox: "0 0 24 24"
  };

  const glyph = (() => {
    switch (actionId) {
      case "marketplace":
        return <svg {...common}><path d="M4 8.5 6 5h12l2 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /><path d="M5 9h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V9Z" stroke="currentColor" strokeWidth="1.8" /><path d="M9.5 13.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "agent":
        return <svg {...common}><rect x="6" y="7" width="12" height="10" rx="3" stroke="currentColor" strokeWidth="1.8" /><circle cx="9" cy="12" r="1" fill="currentColor" /><circle cx="15" cy="12" r="1" fill="currentColor" /><path d="M9.5 15h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M12 4v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "guide":
        return <svg {...common}><path d="M6 6.5h6.5a2.5 2.5 0 0 1 2.5 2.5v8.5H8.5A2.5 2.5 0 0 0 6 20Z" stroke="currentColor" strokeWidth="1.8" /><path d="M18 6.5h-5.5A2.5 2.5 0 0 0 10 9v8.5h5.5A2.5 2.5 0 0 1 18 20Z" stroke="currentColor" strokeWidth="1.8" /></svg>;
      case "prompt":
        return <svg {...common}><path d="M7 18 17 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M7 8h4v4H7z" stroke="currentColor" strokeWidth="1.8" /><path d="M13 14h4v4h-4z" stroke="currentColor" strokeWidth="1.8" /></svg>;
      case "pricing":
        return <svg {...common}><path d="M12 4.5v15" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M15.5 7.5a3.5 3.5 0 0 0-7 0c0 4.5 7 2.5 7 7a3.5 3.5 0 0 1-7 0" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "analysis":
      case "data":
        return <svg {...common}><path d="M6 18V8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M12 18V5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M18 18v-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "image":
        return <svg {...common}><rect x="4.5" y="6" width="15" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><circle cx="9" cy="10" r="1.5" fill="currentColor" /><path d="m7 16 3.2-3.2a1 1 0 0 1 1.4 0L14 15l1.5-1.5a1 1 0 0 1 1.4 0L18 14.6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
      case "audio":
        return <svg {...common}><path d="M10 8.5v7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M10 9.5 14 7v10l-4-2.5" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /><path d="M17 10.2a4 4 0 0 1 0 3.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "video":
        return <svg {...common}><rect x="4.5" y="7" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.8" /><path d="m14.5 10 4-2v8l-4-2" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
      case "slides":
        return <svg {...common}><path d="M6 5.5h12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><rect x="7" y="7.5" width="10" height="8" rx="1.8" stroke="currentColor" strokeWidth="1.8" /><path d="M12 15.5V19" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M9.5 19h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "infographic":
        return <svg {...common}><path d="M7 17V9" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M12 17V6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M17 17v-4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M5 19h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "quiz":
        return <svg {...common}><path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.8.7-1.7 1.4-1.7 2.7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><circle cx="12" cy="17" r="1" fill="currentColor" /></svg>;
      case "flashcards":
        return <svg {...common}><rect x="6" y="7" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.8" /><path d="M9 5h8a2 2 0 0 1 2 2v8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "mindmap":
        return <svg {...common}><circle cx="12" cy="8" r="2" stroke="currentColor" strokeWidth="1.8" /><circle cx="7.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.8" /><circle cx="16.5" cy="15.5" r="2" stroke="currentColor" strokeWidth="1.8" /><path d="M10.8 9.8 8.7 13.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="m13.2 9.8 2.1 3.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "content":
        return <svg {...common}><path d="M7.5 6.5h7l2 2V17a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" /><path d="M10 11.5h4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M10 14.5h4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "code":
        return <svg {...common}><path d="m9.5 8.5-3 3.5 3 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /><path d="m14.5 8.5 3 3.5-3 3.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" /></svg>;
      case "documents":
        return <svg {...common}><path d="M8 5.5h6l3 3V18a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.8" /><path d="M14 5.5v3h3" stroke="currentColor" strokeWidth="1.8" /><path d="M9.5 13h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      case "translate":
        return <svg {...common}><path d="M6.5 8h7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M10 6v2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M8 12c1.2 0 2.6-1 4-3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="M14.5 8.5h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="m16.5 8.5-2 7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /><path d="m18.5 15.5-2-7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg>;
      default:
        return <svg {...common}><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" /></svg>;
    }
  })();

  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] border ${
        sidebarActionStyles[actionId] ?? sidebarActionStyles.default
      }`}
    >
      {glyph}
    </span>
  );
};

export const ChatHubShell = ({ language, models, quickActions, createActions, analysisActions, promptOptions, promptCategories, promptSuggestions, userInitial = "U", onNavigate, initialRequest, onInitialMessageHandled }: ChatHubShellProps): JSX.Element => {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const [activeModelId, setActiveModelId] = useState(models.find((m) => m.active)?.id ?? models[0]?.id ?? "");
  const [activePromptCategoryId, setActivePromptCategoryId] = useState(
    promptCategories[0]?.id ?? "use-cases"
  );
  const [status, setStatus] = useState(t(language, "ready_to_collaborate"));
  const [modelQuery, setModelQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const speechRef = useRef<SpeechRec | null>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraChunksRef = useRef<Blob[]>([]);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLInputElement | null>(null);
  const autoSentRequestRef = useRef<string>("");
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const existingSessionId = window.localStorage.getItem(CHAT_SESSION_STORAGE_KEY);
    const nextSessionId = existingSessionId || createChatSessionId();

    if (!existingSessionId) {
      window.localStorage.setItem(CHAT_SESSION_STORAGE_KEY, nextSessionId);
    }

    setSessionId(nextSessionId);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return;
    }

    setIsHistoryLoaded(false);

    void api
      .chatHistory(sessionId)
      .then((history) => {
        setMessages(
          history.messages.map((message, index) => ({
            id: `${message.role}-${message.createdAt ?? index}`,
            text: message.text,
            role: message.role,
            attachments: message.attachments?.map((attachment, attachmentIndex) => ({
              id: `${message.role}-${index}-${attachment.kind}-${attachmentIndex}`,
              kind: attachment.kind,
              name: attachment.name,
              sizeLabel: attachment.sizeLabel
            }))
          }))
        );
      })
      .catch(() => {
        setStatus("Unable to load saved chat history");
      })
      .finally(() => {
        setIsHistoryLoaded(true);
      });
  }, [sessionId]);

  useEffect(() => () => {
    speechRef.current?.stop();
    audioRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    cameraRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    cameraStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    messagesRef.current.forEach((message) => message.attachments?.forEach(revokeAttachmentPreview));
  }, []);

  useEffect(() => {
    if (cameraVideoRef.current && cameraStreamRef.current) cameraVideoRef.current.srcObject = cameraStreamRef.current;
  }, [isCameraOn]);

  useEffect(() => {
    if (!promptCategories.some((category) => category.id === activePromptCategoryId)) {
      setActivePromptCategoryId(promptCategories[0]?.id ?? "use-cases");
    }
  }, [activePromptCategoryId, promptCategories]);

  const activeModel = models.find((m) => m.id === activeModelId) ?? models[0] ?? null;
  const filteredModels = useMemo(() => {
    const q = modelQuery.trim().toLowerCase();
    return q ? models.filter((m) => `${m.name} ${m.provider}`.toLowerCase().includes(q)) : models;
  }, [modelQuery, models]);
  const filteredPromptSuggestions = useMemo(
    () =>
      promptSuggestions.filter(
        (suggestion) => suggestion.categoryId === activePromptCategoryId
      ),
    [activePromptCategoryId, promptSuggestions]
  );
  const shared = messages.flatMap((m) => m.attachments ?? []);

  const sendAttachmentMessage = async (
    attachments: ComposerAttachment[],
    text: string
  ): Promise<void> => {
    const nextMessage = {
      id: `user-${Date.now()}`,
      text,
      role: "user" as const,
      attachments
    };

    setMessages((current) => [...current, nextMessage]);

    if (!sessionId) {
      setStatus("Chat session is still loading");
      return;
    }

    setIsSending(true);
    setStatus("Sending attachment to backend...");

    try {
      const response = await api.chatRespond({
        sessionId,
        message: text,
        modelId: activeModel?.id,
        attachments: attachments.map((attachment) => ({
          kind: attachment.kind,
          name: attachment.name,
          sizeLabel: attachment.sizeLabel
        }))
      });

      const assistant: ChatMessage = {
        id: `assistant-${Date.now()}`,
        text: response.reply,
        role: "assistant"
      };

      setMessages((current) => [...current, assistant]);
      setStatus("Attachment processed by backend");
    } catch {
      const assistant: ChatMessage = {
        id: `assistant-${Date.now()}`,
        text: "Attachment backend tak gaya nahi. Please server check karein aur dobara try karein.",
        role: "assistant"
      };

      setMessages((current) => [...current, assistant]);
      setStatus("Attachment response failed");
    } finally {
      setIsSending(false);
    }
  };

  const routeAction = (actionId: string): void => {
    if (actionId === "marketplace") { onNavigate("marketplace"); return; }
    if (actionId === "agent") { onNavigate("agents"); return; }
    if (actionId === "analysis" || actionId === "research") { onNavigate("research"); return; }
    const selectedPrompt = promptSuggestions.find(
      (prompt) =>
        prompt.id === actionId ||
        prompt.label.toLowerCase().includes(actionId.toLowerCase())
    );
    if (selectedPrompt) { setDraft(selectedPrompt.prompt); setStatus("Action added to composer"); return; }
    setStatus("Action ready in composer");
  };

  const addFiles = (files: FileList | null, kind: ComposerAttachment["kind"]): void => {
    if (!files?.length) return;
    const attachments = Array.from(files).map((file, index) => ({ id: `${kind}-${Date.now()}-${index}`, kind, name: file.name, previewUrl: kind === "audio" || kind === "camera" || kind === "video" ? URL.createObjectURL(file) : undefined, sizeLabel: sizeLabel(file.size) }));
    const attachmentText = attachments.length > 1 ? `Shared ${attachments.length} ${kind} files` : `Shared ${kind} attachment`;
    void sendAttachmentMessage(attachments, attachmentText);
  };
  const stopCamera = (): void => { cameraStreamRef.current?.getTracks().forEach((t) => t.stop()); cameraStreamRef.current = null; setIsCameraOn(false); setIsRecordingVideo(false); };
  const clearLocalChatState = (): void => {
    speechRef.current?.stop();
    if (audioRecorderRef.current) {
      audioRecorderRef.current.ondataavailable = null;
      audioRecorderRef.current.onstop = null;
    }
    audioRecorderRef.current?.stop();
    audioRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
    audioRecorderRef.current = null;
    if (cameraRecorderRef.current) {
      cameraRecorderRef.current.ondataavailable = null;
      cameraRecorderRef.current.onstop = null;
    }
    cameraRecorderRef.current?.stop();
    cameraRecorderRef.current = null;
    cameraChunksRef.current = [];
    stopCamera();
    screenStreamRef.current?.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;
    setIsSharingScreen(false);
    setIsListening(false);
    setIsSending(false);
    setDraft("");
    messagesRef.current.forEach((message) =>
      message.attachments?.forEach(revokeAttachmentPreview)
    );
    setMessages([]);
  };

  const handleResetChat = async (): Promise<void> => {
    if (!sessionId || isResetting) {
      return;
    }

    setIsResetting(true);
    setStatus("Deleting chat history...");

    try {
      await api.deleteChatHistory(sessionId);
      clearLocalChatState();
      const nextSessionId = createChatSessionId();
      window.localStorage.setItem(CHAT_SESSION_STORAGE_KEY, nextSessionId);
      setSessionId(nextSessionId);
      setIsHistoryLoaded(true);
      autoSentRequestRef.current = "";
      onInitialMessageHandled?.();
      setStatus("Chat reset ho gayi. Nayi conversation start karein.");
    } catch {
      setStatus("Chat delete nahi ho saki. Dobara try karein.");
    } finally {
      setIsResetting(false);
    }
  };

  const handleVoice = async (): Promise<void> => {
    if (isListening) {
      speechRef.current?.stop();
      audioRecorderRef.current?.stop();
      audioRecorderRef.current?.stream.getTracks().forEach((t) => t.stop());
      audioRecorderRef.current = null;
      setIsListening(false);
      setStatus("Voice stopped");
      return;
    }
    const browserWindow = window as BrowserWindow;
    const SpeechCtor = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
    if (SpeechCtor) {
      const rec = new SpeechCtor();
      speechRef.current = rec;
      rec.continuous = false; rec.interimResults = true; rec.lang = "en-US";
      rec.onresult = (event) => {
        const results = Array.from(event.results);
        const text = results.map((r) => r[0].transcript).join(" ").trim();
        const isFinal = results.some((result) => result.isFinal);
        if (text) {
          setDraft(text);
        }
        if (text && isFinal) {
          setStatus("Sending voice prompt...");
          void handleSend(text);
        }
      };
      rec.onerror = () => { setIsListening(false); setStatus("Voice input failed"); };
      rec.onend = () => setIsListening(false);
      rec.start(); setIsListening(true); setStatus("Listening for voice input..."); return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setStatus("Voice recording is not available"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream); audioChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        if (!audioChunksRef.current.length) return;
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        void sendAttachmentMessage([{ id: `audio-${Date.now()}`, kind: "audio", name: `voice-note-${Date.now()}.webm`, previewUrl: URL.createObjectURL(blob), sizeLabel: sizeLabel(blob.size) }], "Shared voice note");
      };
      recorder.start(); audioRecorderRef.current = recorder; setIsListening(true); setStatus("Recording voice note...");
    } catch { setStatus("Microphone permission is required"); }
  };

  const handleCamera = async (): Promise<void> => {
    if (isCameraOn) { stopCamera(); setStatus("Camera preview stopped"); return; }
    if (!navigator.mediaDevices?.getUserMedia) { imageRef.current?.click(); setStatus("Camera unavailable. Use upload."); return; }
    try { cameraStreamRef.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false }); setIsCameraOn(true); setStatus("Camera preview is live"); } catch { imageRef.current?.click(); setStatus("Camera permission denied"); }
  };

  const capturePhoto = (): void => {
    if (!cameraVideoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = cameraVideoRef.current.videoWidth || 1280; canvas.height = cameraVideoRef.current.videoHeight || 720;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.drawImage(cameraVideoRef.current, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => { if (!blob) return; void sendAttachmentMessage([{ id: `camera-${Date.now()}`, kind: "camera", name: `camera-shot-${Date.now()}.png`, previewUrl: URL.createObjectURL(blob), sizeLabel: sizeLabel(blob.size) }], "Shared camera photo"); }, "image/png");
  };

  const handleVideo = async (): Promise<void> => {
    if (isRecordingVideo && cameraRecorderRef.current) { cameraRecorderRef.current.stop(); setIsRecordingVideo(false); setStatus("Finishing video recording..."); return; }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") { setStatus("AltCam recording is not supported in this browser."); return; }
    try {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await getAltCamStream({ audio: true, requireAltCam: true });
      cameraStreamRef.current = stream; setIsCameraOn(true);
      const recorder = new MediaRecorder(stream); cameraChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) cameraChunksRef.current.push(event.data); };
      recorder.onstop = () => { const blob = new Blob(cameraChunksRef.current, { type: recorder.mimeType || "video/webm" }); void sendAttachmentMessage([{ id: `video-${Date.now()}`, kind: "video", name: `altcam-video-${Date.now()}.webm`, previewUrl: URL.createObjectURL(blob), sizeLabel: sizeLabel(blob.size) }], "Shared AltCam video"); };
      cameraRecorderRef.current = recorder; recorder.start(); setIsRecordingVideo(true); setStatus("Recording video from AltCam...");
    } catch { setStatus("AltCam was not found. Please select or install the AltCam/AlterCam camera first."); }
  };

  const handleScreen = async (): Promise<void> => {
    if (isSharingScreen && screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop()); screenStreamRef.current = null; setIsSharingScreen(false); setStatus("Screen sharing stopped"); return;
    }
    if (!navigator.mediaDevices || !("getDisplayMedia" in navigator.mediaDevices)) { setStatus("Screen sharing is not supported"); return; }
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio: true, video: true });
      const track = stream.getVideoTracks()[0];
      screenStreamRef.current = stream; setIsSharingScreen(true);
      void sendAttachmentMessage([{ id: `screen-${Date.now()}`, kind: "screen", name: track?.label || "screen-share", sizeLabel: "Live preview", stream }], "Started screen sharing");
      track?.addEventListener("ended", () => { setIsSharingScreen(false); screenStreamRef.current = null; setStatus("Screen sharing stopped"); });
    } catch { setStatus("Screen sharing requires permission"); }
  };

  const handleSend = async (overrideText?: string): Promise<void> => {
    const text = (overrideText ?? draft).trim();
    if (isSending) { return; }
    if (!sessionId) { setStatus("Chat session is still loading"); return; }
    if (!text) { setStatus("Add a message to continue"); return; }
    const user: ChatMessage = { id: `user-${Date.now()}`, text, role: "user" };
    setMessages((current) => [...current, user]); setDraft(""); setIsSending(true); setStatus("Sending to backend...");
    try {
      const response = await api.chatRespond({ sessionId, message: text, modelId: activeModel?.id });
      const assistant: ChatMessage = { id: `assistant-${Date.now()}`, text: response.reply, role: "assistant" };
      setMessages((current) => [...current, assistant]); setStatus("Response received from backend");
    } catch {
      const assistant: ChatMessage = { id: `assistant-${Date.now()}`, text: "Backend chat API se response nahi aa saka. Please backend server check karein aur dobara try karein.", role: "assistant" };
      setMessages((current) => [...current, assistant]); setStatus("Backend response failed");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    const nextRequestId = initialRequest?.id ?? "";
    const nextMessage = initialRequest?.prompt.trim() ?? "";

    if (!sessionId || !isHistoryLoaded || !nextRequestId || !nextMessage) {
      autoSentRequestRef.current = "";
      return;
    }

    if (isSending) {
      return;
    }

    if (autoSentRequestRef.current === nextRequestId) {
      return;
    }

    autoSentRequestRef.current = nextRequestId;
    setDraft(nextMessage);
    void handleSend(nextMessage).finally(() => {
      onInitialMessageHandled?.();
    });
  }, [initialRequest, isHistoryLoaded, isSending, onInitialMessageHandled, sessionId]);

  const sections = { quick: quickActions, create: createActions, analysis: analysisActions };

  return (
    <section className="h-[calc(100vh-53px)] overflow-hidden bg-[#f7f3ee]">
      <div className="grid h-full min-h-0 xl:grid-cols-[240px_minmax(0,1fr)_270px]">
        <aside className="overflow-y-auto border-r border-[#e6ddd3] bg-white px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#a29184]">{t(language, "models")}</p>
          <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-[#decfbf] bg-[#fbf8f3] px-4 py-3 text-[#8f8377]"><Icon kind="search" /><input className="w-full bg-transparent text-[14px] text-[#332b24] outline-none placeholder:text-[#ac9f92]" onChange={(event) => setModelQuery(event.target.value)} placeholder={t(language, "search_models")} value={modelQuery} /></div>
          <div className="mt-4 max-h-[calc(100vh-170px)] space-y-2 overflow-y-auto pr-1">{filteredModels.map((model) => { const active = model.id === activeModelId; return <button key={model.id} className={`flex w-full items-center gap-3 rounded-[18px] px-3 py-3 text-left transition ${active ? "border border-[#ecd8c8] bg-[#fdf2ea]" : "border border-transparent hover:border-[#eadccc] hover:bg-[#fcfaf7]"}`} onClick={() => { setActiveModelId(model.id); setStatus(`${model.name} selected`); }} type="button"><div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#eef2fb] text-[15px]">{model.provider.slice(0, 1)}</div><div className="min-w-0"><p className="truncate text-[15px] font-semibold text-[#231d18]">{model.name}</p><p className="mt-1 flex items-center gap-1 text-[12px] text-[#97897d]"><span className="h-1.5 w-1.5 rounded-full bg-[#47b067]" />{model.provider}</p></div></button>; })}</div>
        </aside>

        <div className="flex min-h-0 flex-col bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.65),_transparent_42%),linear-gradient(180deg,_#f5f1ea_0%,_#f2ede6_100%)]">
          <div className="flex min-h-0 flex-1 px-5 pb-5 pt-6 lg:px-6">
            <div className="flex h-full min-h-0 w-full flex-col rounded-[28px] border border-[#e9e0d6] bg-[rgba(255,255,255,0.48)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 lg:px-6">
                {messages.length === 0 ? <div className="mx-auto mt-4 max-w-[600px] rounded-[30px] border border-[#eadfd2] bg-white px-8 py-9 text-center shadow-[0_20px_45px_rgba(86,62,35,0.08)]"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#f0d4c2] bg-[#fff8f2] text-[#6c655f]"><Icon kind="sparkle" /></div><h2 className="mt-7 text-[28px] font-semibold tracking-[-0.03em] text-[#1b1511]">Welcome! I'm here to help you</h2><p className="mx-auto mt-4 max-w-[470px] text-[15px] leading-7 text-[#766b61]">No tech background needed. Tell me what you'd like to achieve and I'll help you discover what's possible, step by step.</p><div className="mt-7 rounded-[24px] border border-[#e7dbcf] bg-[#f8f4ee] p-4 text-left"><p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#db7c37]">{t(language, "chat_today")}</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{promptOptions.map((option, index) => <button key={option.id} className="rounded-[18px] border border-[#e5d8ca] bg-white px-4 py-5 text-center transition hover:-translate-y-0.5 hover:border-[#d8c3af]" onClick={() => { setDraft(option.title); setStatus("Prompt selected"); }} type="button"><div className={`text-[28px] ${promptAccents[index % promptAccents.length]}`}>{option.icon}</div><p className="mt-3 text-[16px] font-semibold text-[#211a15]">{option.title}</p><p className="mt-1 text-[12px] text-[#918477]">{option.subtitle}</p></button>)}</div></div><p className="mt-6 text-[14px] text-[#9a8d80]">{t(language, "chat_or_type")}</p></div> : <div className="mx-auto max-w-[860px] space-y-5">{messages.map((message) => <div key={message.id} className={`flex items-start gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>{message.role === "assistant" ? <ChatAvatar kind="assistant" userInitial={userInitial} /> : null}<article className={`rounded-[24px] border px-5 py-4 ${message.role === "user" ? "max-w-[85%] border-[#ead7c8] bg-[#fff6ee]" : "max-w-[90%] border-[#ece2d8] bg-white"}`}><div className="flex items-center justify-between gap-3"><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a18f81]">{message.role === "user" ? "You" : "Assistant"}</p><span className="text-[11px] text-[#ad9d8f]">{activeModel?.name ?? "Workspace"}</span></div><p className="mt-3 text-[15px] leading-7 text-[#2c241e]">{message.text}</p>{message.attachments?.length ? <div className="mt-4 flex flex-wrap gap-3">{message.attachments.map((attachment) => <div key={attachment.id} className={`rounded-[18px] border px-4 py-3 text-[12px] ${colors[attachment.kind]}`}><p className="font-semibold capitalize">{attachment.kind}: {attachment.name}</p>{attachment.sizeLabel ? <p className="mt-1 text-[11px] opacity-80">{attachment.sizeLabel}</p> : null}{attachment.kind === "audio" && attachment.previewUrl ? <audio className="mt-2 w-full" controls src={attachment.previewUrl} /> : null}{attachment.kind === "camera" && attachment.previewUrl ? <img alt={attachment.name} className="mt-2 max-h-[160px] w-full rounded-[12px] border border-current/10 object-cover" src={attachment.previewUrl} /> : null}{attachment.kind === "video" && attachment.previewUrl ? <video className="mt-2 max-h-[180px] w-full rounded-[12px] border border-current/10" controls src={attachment.previewUrl} /> : null}{attachment.kind === "screen" && attachment.stream ? <ScreenSharePreview stream={attachment.stream} /> : null}</div>)}</div> : null}</article>{message.role === "user" ? <ChatAvatar kind="user" userInitial={userInitial} /> : null}</div>)}</div>}
              </div>

              <div className="border-t border-[#e7ddd3] bg-white/75 px-4 py-4 lg:px-6">
                <div className="rounded-[24px] border border-[#decfbf] bg-[#fbf8f3] shadow-[0_12px_26px_rgba(83,59,31,0.05)]"><textarea className="min-h-[54px] w-full resize-none rounded-t-[24px] bg-transparent px-5 py-4 text-[16px] leading-7 text-[#241c17] outline-none placeholder:text-[#9d9185]" onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void handleSend(); } }} placeholder="Describe your project, ask a question, or just say hi. I'm here to help..." rows={2} value={draft} /><div className="flex flex-wrap items-center gap-2 border-t border-[#e8ded4] px-4 py-3"><button className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border ${toolButtonStyles.voice} ${isListening ? "ring-2 ring-[#d8c9ff]" : ""}`} onClick={() => void handleVoice()} type="button"><Icon kind="voice" /></button><button className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border ${toolButtonStyles.file}`} onClick={() => fileRef.current?.click()} type="button"><Icon kind="file" /></button><button className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border ${toolButtonStyles.camera} ${isCameraOn ? "ring-2 ring-[#cadcff]" : ""}`} onClick={() => void handleCamera()} type="button"><Icon kind="camera" /></button><button className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border ${toolButtonStyles.video} ${isRecordingVideo ? "ring-2 ring-[#f3c6cf]" : ""}`} onClick={() => void handleVideo()} title={isRecordingVideo ? "Stop AltCam recording" : "Record with AltCam"} type="button"><Icon kind="video" /></button><button className={`inline-flex h-10 w-10 items-center justify-center rounded-[12px] border ${toolButtonStyles.screen} ${isSharingScreen ? "ring-2 ring-[#bfe4ce]" : ""}`} onClick={() => void handleScreen()} type="button"><Icon kind="screen" /></button><div className="ml-auto flex items-center gap-3"><span className="hidden text-[13px] text-[#ae9b89] lg:inline">{activeModel ? `${activeModel.name} by ${activeModel.provider}` : t(language, "no_model_selected")}</span><button className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#c96b2e] text-white transition hover:bg-[#b75d22]" onClick={() => void handleSend()} type="button"><Icon kind="send" className="h-5 w-5" /></button></div></div></div>
                <input className="hidden" multiple onChange={(event) => addFiles(event.target.files, "file")} ref={fileRef} type="file" />
                <input accept="image/*" capture="environment" className="hidden" onChange={(event) => addFiles(event.target.files, "camera")} ref={imageRef} type="file" />
                <input accept="audio/*" className="hidden" multiple onChange={(event) => addFiles(event.target.files, "audio")} ref={audioRef} type="file" />
                {isCameraOn ? <div className="mt-3 rounded-[22px] border border-[#dbe5f3] bg-[#f5f9ff] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#406cb7]">AltCam Preview</p><div className="flex flex-wrap gap-2"><button className="rounded-full border border-[#cfdbef] bg-white px-3 py-2 text-[11px] font-semibold text-[#47618f]" onClick={capturePhoto} type="button">Capture photo</button><button className={`rounded-full px-3 py-2 text-[11px] font-semibold text-white ${isRecordingVideo ? "bg-[#cf5972]" : "bg-[#ca6a2f]"}`} onClick={() => void handleVideo()} type="button">{isRecordingVideo ? "Stop AltCam" : "Record with AltCam"}</button><button className="rounded-full border border-[#cfdbef] bg-white px-3 py-2 text-[11px] font-semibold text-[#47618f]" onClick={stopCamera} type="button">Close camera</button></div></div><video autoPlay className="mt-3 max-h-[240px] w-full rounded-[16px] border border-[#d7e3f1] bg-[#1e1a18] object-cover" muted playsInline ref={cameraVideoRef} /></div> : null}
                <div className="mt-4 flex flex-wrap items-center gap-2">{promptCategories.map((category, index) => <button key={category.id} className={`rounded-full border px-4 py-2 text-[13px] transition ${activePromptCategoryId === category.id ? "border-[#1f1a16] bg-[#1f1a16] text-white" : index === 0 ? "border-[#ddd1c4] bg-white text-[#54493f] hover:border-[#ccb9a6]" : "border-[#ddd1c4] bg-white text-[#54493f] hover:border-[#ccb9a6]"}`} onClick={() => { setActivePromptCategoryId(category.id); setStatus(`${category.label} prompts loaded`); }} type="button">{category.label}</button>)}</div>
                <div className="mt-4 grid gap-2 text-[14px] text-[#7b6e62] lg:grid-cols-2">{filteredPromptSuggestions.map((suggestion) => <button key={suggestion.id} className="text-left transition hover:text-[#c96b2e]" onClick={() => { setDraft(suggestion.prompt); setStatus("Prompt added to composer"); }} type="button">• {suggestion.label}</button>)}</div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[12px] text-[#a18f81]">{status}</p>
                  <button className="rounded-full border border-[#ddcfc2] bg-white px-4 py-2 text-[12px] font-semibold text-[#7b6e62] transition hover:border-[#d2bea9] disabled:cursor-not-allowed disabled:opacity-60" disabled={isResetting || isSending} onClick={() => void handleResetChat()} type="button">{isResetting ? "Deleting chat..." : "Reset & delete chat"}</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="overflow-y-auto border-l border-[#e6ddd3] bg-white px-4 py-4">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#a29184]">{t(language, "quick_actions")}</p>
          <div className="mt-4 space-y-5">{[{ title: "Navigation & Tools", actions: sections.quick }, { title: "Create & Generate", actions: sections.create }, { title: "Analyze & Write", actions: sections.analysis }].map((section) => <div key={section.title}><p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#af9f91]">{section.title}</p><div className="mt-3 space-y-2">{section.actions.map((action) => <button key={action.id} className="flex w-full items-center gap-3 rounded-[14px] border border-[#e5d9cc] bg-white px-4 py-3 text-left text-[14px] text-[#3b3128] transition hover:border-[#d6bda8] hover:bg-[#fcfaf7]" onClick={() => routeAction(action.id)} type="button"><SidebarActionIcon actionId={action.id} /><span>{action.label}</span></button>)}</div></div>)}<div className="rounded-[18px] border border-[#e5d9cc] bg-[#fcfaf7] px-4 py-4"><p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#af9f91]">{t(language, "live_summary")}</p><div className="mt-3 grid grid-cols-3 gap-2 text-center"><div className="rounded-[14px] border border-[#eadfd2] bg-white px-3 py-3"><p className="text-[18px] font-semibold text-[#231d18]">{messages.length}</p><p className="mt-1 text-[11px] text-[#938578]">{t(language, "messages")}</p></div><div className="rounded-[14px] border border-[#eadfd2] bg-white px-3 py-3"><p className="text-[18px] font-semibold text-[#231d18]">{shared.length}</p><p className="mt-1 text-[11px] text-[#938578]">{t(language, "assets")}</p></div><div className="rounded-[14px] border border-[#eadfd2] bg-white px-3 py-3"><p className="text-[18px] font-semibold text-[#231d18]">{isSharingScreen ? t(language, "on") : t(language, "off")}</p><p className="mt-1 text-[11px] text-[#938578]">{t(language, "screen")}</p></div></div></div></div>
        </aside>
      </div>
    </section>
  );
};







