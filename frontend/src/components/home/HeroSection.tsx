import { useEffect, useMemo, useRef, useState } from "react";
import type { HeroContent } from "../../data/mock/home";
import { t } from "../../lib/i18n";
import type { HomeWorkflowCategory } from "../../types/api";

export type HeroSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  page: "chat-hub" | "marketplace" | "agents";
};

type HeroAttachment = {
  id: string;
  kind: "audio" | "camera" | "file" | "screen" | "video";
  name: string;
  previewUrl?: string;
  sizeLabel?: string;
};

type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: {
    results: ArrayLike<{
      0: { transcript: string };
      isFinal?: boolean;
      length: number;
    }>;
  }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type BrowserWindow = Window &
  typeof globalThis & {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };

type HeroSectionProps = {
  content: HeroContent;
  language: string;
  searchResults: HeroSearchResult[];
  workflowCategories: HomeWorkflowCategory[];
  onNavigate: (page: "chat-hub" | "marketplace" | "agents") => void;
  onSearchNavigate: (result: HeroSearchResult) => void;
  onSubmitPrompt: (prompt: string) => void;
};

const actionPills = [
  { id: "mic", title: "Voice recording", accent: "border-[#d9c6ff] bg-[#faf6ff] text-[#7c57d8]" },
  { id: "file", title: "File attachment", accent: "border-[#f0c78e] bg-[#fff8ee] text-[#c9801f]" },
  { id: "image", title: "Image attachment", accent: "border-[#9fc2ff] bg-[#f3f8ff] text-[#3979e7]" },
  { id: "audio", title: "Audio attachment", accent: "border-[#8fd5ef] bg-[#eefbff] text-[#1585b8]" },
  { id: "video", title: "Video attachment", accent: "border-[#ffb7b1] bg-[#fff1f0] text-[#d25d58]" },
  { id: "screen", title: "Screen sharing", accent: "border-[#9edfb8] bg-[#effbf4] text-[#179663]" }
] as const;

const ActionIcon = ({ id }: { id: (typeof actionPills)[number]["id"] }): JSX.Element => {
  const className = "h-5 w-5";

  switch (id) {
    case "mic":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6 11a6 6 0 0 0 12 0" />
          <path d="M12 17v4" />
        </svg>
      );
    case "file":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M9 7v10a4 4 0 0 0 8 0V6a3 3 0 0 0-6 0v10a2 2 0 0 0 4 0V8" />
        </svg>
      );
    case "image":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <circle cx="9" cy="10" r="1.5" />
          <path d="m21 16-5-5-7 7" />
        </svg>
      );
    case "audio":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M14 5v14" />
          <path d="M18 7v10" />
          <path d="M10 9v6" />
          <path d="M6 11v2" />
        </svg>
      );
    case "video":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="3" y="7" width="13" height="10" rx="2" />
          <path d="m16 11 5-3v8l-5-3" />
        </svg>
      );
    case "screen":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="3" y="5" width="18" height="12" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      );
  }
};

export const HeroSection = ({
  content,
  language,
  searchResults,
  workflowCategories,
  onSearchNavigate,
  onNavigate,
  onSubmitPrompt
}: HeroSectionProps): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>(
    workflowCategories[0]?.id ?? "recruiting"
  );
  const [attachments, setAttachments] = useState<HeroAttachment[]>([]);
  const [status, setStatus] = useState<string>(t(language, "hero_status_default"));
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [isVideoRecording, setIsVideoRecording] = useState<boolean>(false);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);
  const [cameraTick, setCameraTick] = useState<number>(0);
  const [screenShareTick, setScreenShareTick] = useState<number>(0);
  const audioInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement | null>(null);
  const cameraRecorderRef = useRef<MediaRecorder | null>(null);
  const cameraChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return searchResults.slice(0, 5);
    }

    return searchResults
      .filter((result) => {
        const haystack = `${result.title} ${result.subtitle}`.toLowerCase();
        return haystack.includes(normalizedQuery);
      })
      .slice(0, 5);
  }, [query, searchResults]);

  const categoryTabs = useMemo(() => workflowCategories, [workflowCategories]);

  const activeCategory = useMemo(
    () =>
      categoryTabs.find((tab) => tab.id === activeTab) ?? categoryTabs[0] ?? null,
    [activeTab, categoryTabs]
  );

  useEffect(() => {
    if (!categoryTabs.length) {
      return;
    }

    if (!categoryTabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(categoryTabs[0].id);
    }
  }, [activeTab, categoryTabs]);

  useEffect(() => {
    setStatus(t(language, "hero_status_default"));
  }, [language]);

  const visibleSuggestions = useMemo(() => {
    const activeSuggestions = activeCategory?.suggestions ?? [];

    if (query.trim()) {
      if (filteredResults.length > 0) {
        return filteredResults.map((result) => ({
          id: result.id,
          label: result.title,
          subtitle: result.subtitle,
          type: "result" as const
        }));
      }

      return activeSuggestions.slice(0, 5).map((item, index) => ({
        id: `${activeTab}-${index}`,
        label: item,
        subtitle: t(language, "hero_workflow_suggestion"),
        type: "suggestion" as const
      }));
    }

    return activeSuggestions.map((item, index) => ({
      id: `${activeTab}-${index}`,
      label: item,
      subtitle: t(language, "hero_workflow_suggestion"),
      type: "suggestion" as const
    }));
  }, [activeCategory, activeTab, filteredResults, language, query]);

  useEffect(() => {
    if (cameraVideoRef.current && cameraStreamRef.current) {
      cameraVideoRef.current.srcObject = cameraStreamRef.current;
    }
  }, [cameraTick]);

  useEffect(() => {
    if (screenVideoRef.current && screenStreamRef.current) {
      screenVideoRef.current.srcObject = screenStreamRef.current;
    }
  }, [screenShareTick]);

  useEffect(() => {
    return () => {
      speechRecognitionRef.current?.stop();
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      cameraRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const addAttachments = (
    files: FileList | null,
    kind: HeroAttachment["kind"]
  ): void => {
    if (!files || files.length === 0) {
      return;
    }

    const nextAttachments = Array.from(files).map((file, index) => ({
      id: `${kind}-${file.name}-${file.lastModified}-${index}`,
      kind,
      name: file.name,
      previewUrl:
        kind === "video" || kind === "camera" ? URL.createObjectURL(file) : undefined,
      sizeLabel: formatFileSize(file.size)
    }));

    setAttachments((current) => [...current, ...nextAttachments]);
    setStatus(`${nextAttachments.length} ${kind} item${nextAttachments.length > 1 ? "s" : ""} attached`);
  };

  const removeAttachment = (attachmentId: string): void => {
    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
  };

  const handleSubmit = (): void => {
    const trimmedQuery = query.trim();
    const firstResult = filteredResults[0];

    if (trimmedQuery && firstResult) {
      onSearchNavigate(firstResult);
      return;
    }

    if (trimmedQuery) {
      onSubmitPrompt(trimmedQuery);
      return;
    }

    onNavigate("chat-hub");
  };

  const speakResponse = (message: string): void => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  const stopCameraStream = (): void => {
    cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
    cameraStreamRef.current = null;
    setIsCameraOn(false);
    setCameraTick((value) => value + 1);
  };

  const startVoiceToVoice = async (): Promise<void> => {
    if (isListening) {
      speechRecognitionRef.current?.stop();
      setIsListening(false);
      setStatus("Voice input stopped");
      return;
    }

    if (typeof window === "undefined") {
      setStatus("Voice input is not available");
      return;
    }

    const browserWindow = window as BrowserWindow;
    const SpeechRecognitionCtor =
      browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      if (
        typeof navigator !== "undefined" &&
        navigator.mediaDevices &&
        typeof navigator.mediaDevices.getUserMedia === "function" &&
        typeof MediaRecorder !== "undefined"
      ) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          audioChunksRef.current = [];

          recorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
              audioChunksRef.current.push(event.data);
            }
          };

          recorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const previewUrl = URL.createObjectURL(audioBlob);

            setAttachments((current) => [
              ...current,
              {
                id: `audio-${Date.now()}`,
                kind: "audio",
                name: "voice-note.webm",
                previewUrl,
                sizeLabel: formatFileSize(audioBlob.size)
              }
            ]);

            stream.getTracks().forEach((track) => track.stop());
            mediaRecorderRef.current = null;
            setStatus("Voice note attached");
          };

          mediaRecorderRef.current = recorder;
          recorder.start();
          setIsListening(true);
          setStatus("Recording voice note...");
          return;
        } catch {
          setStatus("Microphone permission was denied");
          return;
        }
      }

      setStatus("Voice input is not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    speechRecognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();

      if (!transcript) {
        return;
      }

      setQuery(transcript);
      const spokenReply = `I heard ${transcript}. Press Let's go to continue.`;
      setStatus(spokenReply);
      speakResponse(spokenReply);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setStatus("Voice input failed. Please try again.");
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
    setIsListening(true);
    setStatus("Listening... speak now");
  };

  const toggleCameraCapture = async (): Promise<void> => {
    if (isCameraOn) {
      stopCameraStream();
      setStatus("Camera preview stopped");
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      imageInputRef.current?.click();
      setStatus("Camera preview unsupported. Use image upload instead.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });

      cameraStreamRef.current = stream;
      setIsCameraOn(true);
      setStatus("Camera preview is live");
      setCameraTick((value) => value + 1);
    } catch {
      imageInputRef.current?.click();
      setStatus("Camera permission denied. Use image upload instead.");
    }
  };

  const capturePhotoFromCamera = (): void => {
    if (!cameraVideoRef.current) {
      return;
    }

    const video = cameraVideoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const context = canvas.getContext("2d");
    if (!context) {
      setStatus("Camera capture is unavailable");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (!blob) {
        setStatus("Camera capture failed");
        return;
      }

      const previewUrl = URL.createObjectURL(blob);
      setAttachments((current) => [
        ...current,
        {
          id: `camera-${Date.now()}`,
          kind: "camera",
          name: `camera-shot-${Date.now()}.png`,
          previewUrl,
          sizeLabel: formatFileSize(blob.size)
        }
      ]);
      setStatus("Photo captured from camera");
    }, "image/png");
  };

  const toggleVideoRecording = async (): Promise<void> => {
    if (isVideoRecording) {
      cameraRecorderRef.current?.stop();
      setIsVideoRecording(false);
      setStatus("Finishing video recording...");
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function" ||
      typeof MediaRecorder === "undefined"
    ) {
      videoInputRef.current?.click();
      setStatus("Live video recording unsupported. Use video upload instead.");
      return;
    }

    try {
      const stream =
        cameraStreamRef.current ??
        (await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: true
        }));

      cameraStreamRef.current = stream;
      setIsCameraOn(true);
      setCameraTick((value) => value + 1);

      const recorder = new MediaRecorder(stream);
      cameraChunksRef.current = [];
      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          cameraChunksRef.current.push(event.data);
        }
      };
      recorder.onstop = () => {
        const videoBlob = new Blob(cameraChunksRef.current, { type: "video/webm" });
        const previewUrl = URL.createObjectURL(videoBlob);

        setAttachments((current) => [
          ...current,
          {
            id: `video-${Date.now()}`,
            kind: "video",
            name: "camera-recording.webm",
            previewUrl,
            sizeLabel: formatFileSize(videoBlob.size)
          }
        ]);

        cameraRecorderRef.current = null;
        setStatus("Camera video attached");
      };

      cameraRecorderRef.current = recorder;
      recorder.start();
      setIsVideoRecording(true);
      setStatus("Recording video from camera...");
    } catch {
      videoInputRef.current?.click();
      setStatus("Camera permission denied. Use video upload instead.");
    }
  };

  const toggleScreenShare = async (): Promise<void> => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
      setAttachments((current) => current.filter((attachment) => attachment.kind !== "screen"));
      setStatus("Screen share stopped");
      setScreenShareTick((value) => value + 1);
      return;
    }

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getDisplayMedia !== "function"
    ) {
      setStatus("Screen sharing is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true
      });
      const [videoTrack] = stream.getVideoTracks();

      screenStreamRef.current = stream;
      setIsScreenSharing(true);
      setAttachments((current) => [
        ...current.filter((attachment) => attachment.kind !== "screen"),
        {
          id: `screen-${Date.now()}`,
          kind: "screen",
          name: videoTrack?.label || "Live screen share"
        }
      ]);
      setStatus("Screen share is live");
      setScreenShareTick((value) => value + 1);

      if (videoTrack) {
        videoTrack.onended = () => {
          screenStreamRef.current = null;
          setIsScreenSharing(false);
          setAttachments((current) => current.filter((attachment) => attachment.kind !== "screen"));
          setStatus("Screen share ended");
          setScreenShareTick((value) => value + 1);
        };
      }
    } catch {
      setStatus("Screen sharing was cancelled");
    }
  };

  return (
    <section className="relative overflow-hidden border-b border-[#eee3d7] bg-[#fbf7f2] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-14">
      <div className="absolute inset-0 opacity-50 [background-image:radial-gradient(#eadfce_0.8px,transparent_0.8px)] [background-size:18px_18px]" />
      <div className="relative mx-auto flex max-w-[1180px] flex-col items-center text-center">
        <div className="mb-6 inline-flex rounded-full border border-[#ddd3c8] bg-white px-5 py-2 text-[11px] font-medium text-[#7f7468] shadow-sm">
          {content.eyebrow}
        </div>

        <h1 className="max-w-[980px] text-center text-[72px] font-semibold leading-[0.92] tracking-[-0.06em] text-[#1f1a16] sm:text-[92px] lg:text-[106px]">
          {content.title}
          <span className="block text-[#cc6d2f]">{content.highlightedTitle}</span>
        </h1>

        <p className="mt-6 max-w-[620px] text-[16px] leading-8 text-[#6e6459]">
          {content.description}
        </p>

        <div className="mt-10 w-full max-w-[1120px]">
          <div className="rounded-[32px] border border-[#ddd4c9] bg-white p-4 shadow-[0_18px_40px_rgba(71,49,28,0.08)]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 text-left">
                <input
                  className="w-full bg-transparent text-[22px] text-[#6a6258] outline-none placeholder:text-[#a29a90] sm:text-[18px]"
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  placeholder={t(language, "hero_search_placeholder")}
                  type="text"
                  value={query}
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#18b57b] text-[13px] font-semibold text-white shadow-sm"
                  onClick={() => onNavigate("agents")}
                  type="button"
                >
                  *
                </button>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d84ff] text-[13px] font-semibold text-white shadow-sm"
                  onClick={() => onNavigate("chat-hub")}
                  type="button"
                >
                  o
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {actionPills.map((pill) => {
                  const isActive =
                    (pill.id === "mic" && isListening) ||
                    (pill.id === "image" && isCameraOn) ||
                    (pill.id === "video" && isVideoRecording) ||
                    (pill.id === "screen" && isScreenSharing);

                  const handleClick = (): void => {
                    if (pill.id === "mic") {
                      void startVoiceToVoice();
                      return;
                    }

                    if (pill.id === "file") {
                      fileInputRef.current?.click();
                      return;
                    }

                    if (pill.id === "image") {
                      void toggleCameraCapture();
                      return;
                    }

                    if (pill.id === "audio") {
                      audioInputRef.current?.click();
                      return;
                    }

                    if (pill.id === "video") {
                      videoInputRef.current?.click();
                      return;
                    }

                    if (pill.id === "screen") {
                      void toggleScreenShare();
                    }
                  };

                  return (
                    <button
                      key={pill.id}
                      aria-label={pill.title}
                      className={`rounded-[14px] border px-4 py-3 text-[18px] font-semibold ${pill.accent} ${isActive ? "ring-2 ring-offset-1 ring-[#d9c4b0]" : ""}`}
                      onClick={handleClick}
                      title={pill.title}
                      type="button"
                    >
                      <ActionIcon id={pill.id} />
                    </button>
                  );
                })}
                <button
                  className="rounded-full border border-[#d8d1c3] bg-[#f4f0e8] px-4 py-2 text-[11px] font-semibold text-[#5a544b]"
                  onClick={() => onNavigate("agents")}
                  type="button"
                >
                  {t(language, "hero_agent_plus")}
                </button>
              </div>

              <button
                className="rounded-full bg-[#d9772c] px-7 py-4 text-[14px] font-semibold text-white shadow-[0_10px_22px_rgba(217,119,44,0.26)]"
                onClick={handleSubmit}
                type="button"
              >
                {t(language, "hero_lets_go")}
              </button>
            </div>
          </div>

          <input accept="audio/*" className="hidden" onChange={(event) => addAttachments(event.target.files, "audio")} ref={audioInputRef} type="file" />
          <input className="hidden" multiple onChange={(event) => addAttachments(event.target.files, "file")} ref={fileInputRef} type="file" />
          <input accept="image/*" capture="environment" className="hidden" onChange={(event) => addAttachments(event.target.files, "camera")} ref={imageInputRef} type="file" />
          <input accept="video/*" className="hidden" onChange={(event) => addAttachments(event.target.files, "video")} ref={videoInputRef} type="file" />

          <div className="mt-4 overflow-hidden rounded-[30px] border border-[#ddd4c9] bg-white shadow-[0_18px_40px_rgba(71,49,28,0.06)]">
            <div className="flex flex-wrap border-b border-[#e9e1d6] bg-[#fdfbf8] text-left">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center gap-2 border-r border-[#ece4d9] px-5 py-4 text-[13px] font-semibold ${tab.id === activeTab ? "bg-white text-[#2a241f]" : "text-[#6f675d]"}`}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  <span className="text-[11px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-5 text-left">
              <div className="space-y-3">
                {visibleSuggestions.map((item, index) => (
                  <button
                    key={item.id}
                    className="flex w-full items-start gap-3 rounded-[16px] px-3 py-2 text-left transition hover:bg-[#faf5ee]"
                    onClick={() => {
                      if (item.type === "result") {
                        const selectedResult = filteredResults.find((result) => result.id === item.id);
                        if (selectedResult) {
                          onSearchNavigate(selectedResult);
                          return;
                        }
                      }

                      setQuery(item.label);
                      setStatus(t(language, "hero_suggestion_added"));
                    }}
                    type="button"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#f2eee8] text-[12px] text-[#7f756c]">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block text-[15px] text-[#4e463f]">{item.label}</span>
                      <span className="mt-1 block text-[10px] text-[#9c9084]">{item.subtitle}</span>
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 border-t border-[#ece3d8] pt-4 text-[12px] text-[#9d9185]">{status}</div>

              {isCameraOn ? (
                <div className="mt-4 rounded-[18px] border border-[#e7dacd] bg-[#fbf7f1] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8a7c6f]">
                      {t(language, "hero_camera_preview")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="rounded-full border border-[#dfcfbf] bg-white px-3 py-2 text-[10px] font-semibold text-[#5c5147]"
                        onClick={capturePhotoFromCamera}
                        type="button"
                      >
                        {t(language, "hero_capture_photo")}
                      </button>
                      <button
                        className={`rounded-full px-3 py-2 text-[10px] font-semibold text-white ${
                          isVideoRecording ? "bg-[#cf5a43]" : "bg-[#cf6929]"
                        }`}
                        onClick={() => void toggleVideoRecording()}
                        type="button"
                      >
                        {isVideoRecording ? t(language, "hero_stop_video") : t(language, "hero_record_video")}
                      </button>
                      <button
                        className="rounded-full border border-[#dfcfbf] bg-white px-3 py-2 text-[10px] font-semibold text-[#5c5147]"
                        onClick={stopCameraStream}
                        type="button"
                      >
                        {t(language, "hero_close_camera")}
                      </button>
                    </div>
                  </div>
                  <video
                    autoPlay
                    className="mt-3 max-h-[260px] w-full rounded-[14px] border border-[#e1d4c6] bg-[#1f1b18] object-cover"
                    muted
                    playsInline
                    ref={cameraVideoRef}
                  />
                </div>
              ) : null}

              {attachments.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {attachments.map((attachment) => (
                    <article key={attachment.id} className="rounded-[16px] border border-[#e0d5c8] bg-[#fcfaf7] px-3 py-2 text-[10px] text-[#5f5449]">
                      <div className="flex items-start gap-3">
                        <div>
                          <p className="font-semibold">{attachment.name}</p>
                          <p className="mt-1 capitalize text-[#907f72]">{attachment.kind}{attachment.sizeLabel ? ` - ${attachment.sizeLabel}` : ""}</p>
                        </div>
                        <button className="text-[#c26f38]" onClick={() => removeAttachment(attachment.id)} type="button">{t(language, "remove")}</button>
                      </div>
                      {attachment.kind === "audio" && attachment.previewUrl ? <audio className="mt-2 w-full" controls src={attachment.previewUrl} /> : null}
                      {attachment.kind === "camera" && attachment.previewUrl ? <img alt={attachment.name} className="mt-2 max-h-[160px] w-full rounded-[12px] border border-[#e4d7ca] object-cover" src={attachment.previewUrl} /> : null}
                      {attachment.kind === "video" && attachment.previewUrl ? <video className="mt-2 max-h-[160px] w-full rounded-[12px] border border-[#e4d7ca]" controls src={attachment.previewUrl} /> : null}
                    </article>
                  ))}
                </div>
              ) : null}

              {isScreenSharing ? (
                <div className="mt-4 rounded-[18px] border border-[#e7dacd] bg-[#fbf7f1] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8a7c6f]">{t(language, "hero_screen_share_preview")}</p>
                  <video autoPlay className="mt-3 max-h-[260px] w-full rounded-[14px] border border-[#e1d4c6] bg-[#1f1b18] object-cover" muted playsInline ref={screenVideoRef} />
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {content.quickActions.map((action) => (
              <button
                key={action.id}
                className="rounded-[22px] border border-[#ddd4c9] bg-white px-4 py-5 text-center shadow-[0_8px_18px_rgba(71,49,28,0.05)] transition hover:-translate-y-0.5 hover:border-[#d7c4b2]"
                onClick={() => {
                  onSubmitPrompt(action.label);
                }}
                type="button"
              >
                <div className="text-[26px]">{action.icon}</div>
                <p className="mt-3 text-[13px] font-semibold leading-5 text-[#2f2924]">{action.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
