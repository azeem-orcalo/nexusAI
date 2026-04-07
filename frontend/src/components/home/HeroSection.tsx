import { useEffect, useMemo, useRef, useState } from "react";
import type { HeroContent } from "../../data/mock/home";
import { getAltCamStream } from "../../lib/altcam";
import { t } from "../../lib/i18n";
import type { HomeWorkflowCategory, MediaAttachment } from "../../types/api";

export type HeroSearchResult = {
  id: string;
  title: string;
  subtitle: string;
  page: "chat-hub" | "marketplace" | "agents";
};

/** Re-use the shared type so ChatHub can consume these without conversion. */
type HeroAttachment = MediaAttachment;

type OnboardingStage = "welcome" | "questions" | "building";

type OnboardingOption = {
  id: string;
  icon: string;
  label: string;
  prompt: string;
};

type OnboardingStep = {
  id: string;
  helper: string;
  question: string;
  options: OnboardingOption[];
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
  onSubmitPrompt: (prompt: string, attachments: MediaAttachment[]) => void;
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

const workflowIconMap: Record<string, string> = {
  recruiting: "👥",
  prototype: "</>",
  business: "💼",
  learn: "📖",
  research: "🔎"
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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>("welcome");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [onboardingAnswers, setOnboardingAnswers] = useState<
    Record<string, OnboardingOption>
  >({});
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
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const screenChunksRef = useRef<Blob[]>([]);
  const onboardingTimerRef = useRef<number | null>(null);

  const filteredResults = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return [];
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

  const onboardingSteps = useMemo<OnboardingStep[]>(
    () => [
      {
        id: "goal",
        helper: t(language, "hero_onboarding_goal_helper"),
        question: t(language, "hero_onboarding_goal_question"),
        options: [
          {
            id: "create",
            icon: "🚀",
            label: t(language, "hero_onboarding_goal_create"),
            prompt: "create polished content and launch-ready assets"
          },
          {
            id: "research",
            icon: "🔎",
            label: t(language, "hero_onboarding_goal_research"),
            prompt: "research a topic and compare the best AI options"
          },
          {
            id: "learn",
            icon: "📚",
            label: t(language, "hero_onboarding_goal_learn"),
            prompt: "learn a topic in simple steps"
          },
          {
            id: "automate",
            icon: "⚙️",
            label: t(language, "hero_onboarding_goal_automate"),
            prompt: "automate a workflow or repetitive task"
          }
        ]
      },
      {
        id: "audience",
        helper: t(language, "hero_onboarding_audience_helper"),
        question: t(language, "hero_onboarding_audience_question"),
        options: [
          {
            id: "solo",
            icon: "🧑",
            label: t(language, "hero_onboarding_audience_solo"),
            prompt: "for myself as an individual user"
          },
          {
            id: "team",
            icon: "👥",
            label: t(language, "hero_onboarding_audience_team"),
            prompt: "for my internal team"
          },
          {
            id: "clients",
            icon: "🤝",
            label: t(language, "hero_onboarding_audience_clients"),
            prompt: "for clients or customer-facing work"
          },
          {
            id: "students",
            icon: "🎓",
            label: t(language, "hero_onboarding_audience_students"),
            prompt: "for study, teaching, or training"
          }
        ]
      },
      {
        id: "skill",
        helper: t(language, "hero_onboarding_skill_helper"),
        question: t(language, "hero_onboarding_skill_question"),
        options: [
          {
            id: "beginner",
            icon: "🌱",
            label: t(language, "hero_onboarding_skill_beginner"),
            prompt: "I need beginner-friendly guidance"
          },
          {
            id: "no-code",
            icon: "🪄",
            label: t(language, "hero_onboarding_skill_no_code"),
            prompt: "I prefer no-code or very simple tools"
          },
          {
            id: "intermediate",
            icon: "🧭",
            label: t(language, "hero_onboarding_skill_intermediate"),
            prompt: "I am comfortable with intermediate-level tooling"
          },
          {
            id: "advanced",
            icon: "🧠",
            label: t(language, "hero_onboarding_skill_advanced"),
            prompt: "I can handle advanced setup and customization"
          }
        ]
      },
      {
        id: "budget",
        helper: t(language, "hero_onboarding_budget_helper"),
        question: t(language, "hero_onboarding_budget_question"),
        options: [
          {
            id: "free",
            icon: "💸",
            label: t(language, "hero_onboarding_budget_free"),
            prompt: "with a free or almost free budget"
          },
          {
            id: "low",
            icon: "💰",
            label: t(language, "hero_onboarding_budget_low"),
            prompt: "with a low monthly budget"
          },
          {
            id: "flexible",
            icon: "📈",
            label: t(language, "hero_onboarding_budget_flexible"),
            prompt: "with a flexible budget if the value is worth it"
          },
          {
            id: "enterprise",
            icon: "🏢",
            label: t(language, "hero_onboarding_budget_enterprise"),
            prompt: "with an enterprise-grade budget and reliability needs"
          }
        ]
      }
    ],
    [language]
  );

  const currentOnboardingStep = onboardingSteps[currentQuestionIndex] ?? null;
  const progressValue =
    onboardingStage === "building"
      ? 100
      : ((currentQuestionIndex + (onboardingStage === "questions" ? 1 : 0)) /
          onboardingSteps.length) *
        100;
  const showResultsPanel =
    Boolean(query.trim()) && onboardingStage === "welcome";
  const showSupportPanel =
    showResultsPanel ||
    isOnboardingOpen ||
    attachments.length > 0 ||
    isCameraOn ||
    isScreenSharing;
  const visibleSuggestions = useMemo(
    () => activeCategory?.suggestions ?? [],
    [activeCategory]
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
      if (onboardingTimerRef.current) {
        window.clearTimeout(onboardingTimerRef.current);
      }
      speechRecognitionRef.current?.stop();
      mediaRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      cameraRecorderRef.current?.stream.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current?.getTracks().forEach((track) => track.stop());
      if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
        screenRecorderRef.current.ondataavailable = null;
        screenRecorderRef.current.onstop = null;
        screenRecorderRef.current.stop();
      }
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
      // Always create a blob URL so ChatHub can render/download every kind.
      previewUrl: URL.createObjectURL(file),
      sizeLabel: formatFileSize(file.size)
    }));

    setAttachments((current) => [...current, ...nextAttachments]);
    setStatus(`${nextAttachments.length} ${kind} item${nextAttachments.length > 1 ? "s" : ""} attached`);
  };

  const removeAttachment = (attachmentId: string): void => {
    setAttachments((current) => current.filter((attachment) => attachment.id !== attachmentId));
  };

  const buildOnboardingPrompt = (
    answers: Record<string, OnboardingOption>
  ): string => {
    const goal = answers.goal?.prompt ?? "find the right AI workflow";
    const audience = answers.audience?.prompt ?? "for my needs";
    const skill = answers.skill?.prompt ?? "I want practical guidance";
    const budget = answers.budget?.prompt ?? "within my budget";

    return `Help me ${goal} ${audience}. ${skill}. I want recommendations ${budget}. Suggest the best model or workflow and give me the best next step to start.`;
  };

  const completeOnboarding = (
    answers: Record<string, OnboardingOption>
  ): void => {
    const generatedPrompt = buildOnboardingPrompt(answers);

    setOnboardingStage("building");
    setStatus(t(language, "hero_onboarding_building"));
    setQuery(generatedPrompt);

    if (onboardingTimerRef.current) {
      window.clearTimeout(onboardingTimerRef.current);
    }

    const pendingAttachments = attachments.slice();
    setAttachments([]);
    onboardingTimerRef.current = window.setTimeout(() => {
      onSubmitPrompt(generatedPrompt, pendingAttachments);
    }, 1400);
  };

  const startOnboarding = (): void => {
    setIsOnboardingOpen(true);
    setOnboardingStage("questions");
    setCurrentQuestionIndex(0);
    setOnboardingAnswers({});
    setStatus(t(language, "hero_onboarding_prepare"));
  };

  const skipOnboarding = (): void => {
    setIsOnboardingOpen(false);
    setOnboardingStage("welcome");
    setCurrentQuestionIndex(0);
    setOnboardingAnswers({});
    setStatus(t(language, "hero_status_default"));
  };

  const handleOnboardingOptionSelect = (option: OnboardingOption): void => {
    if (!currentOnboardingStep) {
      return;
    }

    const nextAnswers = {
      ...onboardingAnswers,
      [currentOnboardingStep.id]: option
    };

    setOnboardingAnswers(nextAnswers);

    if (currentQuestionIndex < onboardingSteps.length - 1) {
      setCurrentQuestionIndex((value) => value + 1);
      return;
    }

    completeOnboarding(nextAnswers);
  };

  const handleSubmit = (): void => {
    const trimmedQuery = query.trim();
    const firstResult = filteredResults[0];

    if (trimmedQuery && firstResult) {
      onSearchNavigate(firstResult);
      return;
    }

    if (trimmedQuery) {
      onSubmitPrompt(trimmedQuery, attachments);
      setAttachments([]);
      return;
    }

    if (!isOnboardingOpen) {
      setIsOnboardingOpen(true);
      setOnboardingStage("welcome");
      setStatus(t(language, "hero_onboarding_prepare"));
      return;
    }

    if (onboardingStage === "welcome") {
      startOnboarding();
    }
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
      setStatus("AltCam recording is not supported in this browser.");
      return;
    }

    try {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await getAltCamStream({ audio: true, requireAltCam: true });

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
      setStatus("Recording video from AltCam...");
    } catch {
      setStatus("AltCam mila nahi. Pehle AltCam/AlterCam camera select ya install karein.");
    }
  };

  const toggleScreenShare = async (): Promise<void> => {
    if (isScreenSharing) {
      // Stop recorder — onstop handler finalizes the recording blob
      if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
        screenRecorderRef.current.stop();
      } else {
        screenStreamRef.current?.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
        setIsScreenSharing(false);
        setAttachments((current) => current.filter((attachment) => attachment.kind !== "screen"));
        setStatus("Screen share stopped");
        setScreenShareTick((value) => value + 1);
      }
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
      const attachmentId = `screen-${Date.now()}`;

      screenStreamRef.current = stream;
      setIsScreenSharing(true);
      setAttachments((current) => [
        ...current.filter((attachment) => attachment.kind !== "screen"),
        {
          id: attachmentId,
          kind: "screen",
          name: videoTrack?.label || "Live screen share",
          sizeLabel: "Live"
        }
      ]);
      setStatus("Screen recording started — stop sharing to save the recording");
      setScreenShareTick((value) => value + 1);

      // Start recording the screen stream
      const recorder = new MediaRecorder(stream);
      screenChunksRef.current = [];
      recorder.ondataavailable = (event) => { if (event.data.size > 0) screenChunksRef.current.push(event.data); };
      recorder.onstop = () => {
        const blob = new Blob(screenChunksRef.current, { type: recorder.mimeType || "video/webm" });
        const previewUrl = URL.createObjectURL(blob);
        screenStreamRef.current?.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
        setIsScreenSharing(false);
        setAttachments((current) =>
          current.map((attachment) =>
            attachment.id === attachmentId
              ? { id: attachment.id, kind: "screen" as const, name: attachment.name, previewUrl, sizeLabel: formatFileSize(blob.size) }
              : attachment
          )
        );
        setStatus("Screen recording saved — add a message and send");
        setScreenShareTick((value) => value + 1);
      };
      screenRecorderRef.current = recorder;
      recorder.start();

      // When the user ends sharing from the browser's built-in UI
      if (videoTrack) {
        videoTrack.onended = () => {
          if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
            screenRecorderRef.current.stop();
          }
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
                  onFocus={() => {
                    if (!query.trim()) {
                      setIsOnboardingOpen(true);
                      setStatus(t(language, "hero_onboarding_prepare"));
                    }
                  }}
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

          {showSupportPanel ? (
            <div className="mt-4 overflow-hidden rounded-[30px] border border-[#ddd4c9] bg-white shadow-[0_18px_40px_rgba(71,49,28,0.06)]">
              {showResultsPanel ? (
                <div className="p-5 text-left">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#c96a2a]">
                        {t(language, "hero_search_results_label")}
                      </p>
                      <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#231d18]">
                        {t(language, "hero_search_results_title")}
                      </h3>
                    </div>
                    <button
                      className="rounded-full border border-[#dfd5c8] bg-[#faf6f1] px-4 py-2 text-[12px] font-semibold text-[#6b6157]"
                      onClick={() => {
                        setQuery("");
                        setIsOnboardingOpen(true);
                      }}
                      type="button"
                    >
                      {t(language, "hero_back_to_guide")}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {filteredResults.length > 0 ? (
                      filteredResults.map((result) => (
                        <button
                          key={result.id}
                          className="flex w-full items-start gap-4 rounded-[18px] border border-[#ece3d8] bg-[#fcfaf7] px-4 py-4 text-left transition hover:border-[#decbb7] hover:bg-[#fffdf9]"
                          onClick={() => onSearchNavigate(result)}
                          type="button"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#f2eee8] text-[12px] font-semibold text-[#7f756c]">
                            {result.page === "chat-hub"
                              ? "AI"
                              : result.page === "marketplace"
                                ? "ML"
                                : "AG"}
                          </span>
                          <span>
                            <span className="block text-[16px] font-semibold text-[#312922]">
                              {result.title}
                            </span>
                            <span className="mt-1 block text-[12px] text-[#8e8276]">
                              {result.subtitle}
                            </span>
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-[#e4d9cc] bg-[#fcfaf7] px-5 py-6">
                        <p className="text-[16px] font-semibold text-[#332c26]">
                          {t(language, "hero_search_no_results_title")}
                        </p>
                        <p className="mt-2 text-[14px] leading-7 text-[#7f7368]">
                          {t(language, "hero_search_no_results_desc")}
                        </p>
                        <button
                          className="mt-5 rounded-full bg-[#d9772c] px-5 py-3 text-[13px] font-semibold text-white"
                          onClick={() => { onSubmitPrompt(query.trim(), attachments); setAttachments([]); }}
                          type="button"
                        >
                          {t(language, "hero_search_send_anyway")}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : onboardingStage === "welcome" ? (
                <div className="relative overflow-hidden px-6 py-8 text-center sm:px-8 sm:py-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(217,119,44,0.12),_transparent_34%)]" />
                  <div className="absolute left-[12%] top-8 h-20 w-20 rounded-full bg-[rgba(217,119,44,0.10)] blur-3xl" />
                  <div className="absolute right-[10%] top-10 h-16 w-16 rounded-full bg-[rgba(45,132,255,0.10)] blur-3xl" />
                  <div className="relative">
                    <div className="text-[32px]">✨ 👋 ✨</div>
                    <h3 className="mt-5 text-[28px] font-semibold tracking-[-0.04em] text-[#231d18] sm:text-[40px]">
                      {t(language, "hero_onboarding_title")}
                    </h3>
                    <p className="mx-auto mt-4 max-w-[760px] text-[15px] leading-8 text-[#72675e] sm:text-[17px]">
                      {t(language, "hero_onboarding_desc")}
                    </p>

                    <div className="mx-auto mt-8 max-w-[760px] space-y-3 text-left">
                      {[
                        { icon: "🧩", text: t(language, "hero_onboarding_benefit_plain") },
                        {
                          icon: "💬",
                          text: t(language, "hero_onboarding_benefit_questions")
                        },
                        { icon: "🚀", text: t(language, "hero_onboarding_benefit_build") }
                      ].map((item) => (
                        <div
                          key={item.text}
                          className="flex items-center gap-3 rounded-[18px] border border-[#ece3d8] bg-[#fcfaf7] px-4 py-4 text-[14px] text-[#5c534b]"
                        >
                          <span className="text-[18px]">{item.icon}</span>
                          <span>{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mx-auto mt-8 max-w-[280px]">
                      <p className="text-[13px] font-medium text-[#9a8d80]">
                        {t(language, "hero_onboarding_prepare")}
                      </p>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eee4d8]">
                        <div className="h-full w-1/3 rounded-full bg-[#d9772c]" />
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center gap-4">
                      <button
                        className="rounded-full bg-[linear-gradient(135deg,_#d9772c,_#b85c24)] px-8 py-4 text-[17px] font-semibold text-white shadow-[0_16px_32px_rgba(201,106,42,0.28)]"
                        onClick={startOnboarding}
                        type="button"
                      >
                        {t(language, "hero_onboarding_start")}
                      </button>
                      <button
                        className="text-[14px] font-medium text-[#9a8d80] transition hover:text-[#695f55]"
                        onClick={skipOnboarding}
                        type="button"
                      >
                        {t(language, "hero_onboarding_search_direct")}
                      </button>
                    </div>
                  </div>
                </div>
              ) : onboardingStage === "questions" && currentOnboardingStep ? (
                <div className="px-6 py-7 text-left sm:px-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#c96a2a]">
                        {t(language, "hero_onboarding_step")} {currentQuestionIndex + 1} /{" "}
                        {onboardingSteps.length}
                      </p>
                      <h3 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#231d18]">
                        {currentOnboardingStep.question}
                      </h3>
                      <p className="mt-2 text-[15px] leading-7 text-[#776b60]">
                        {currentOnboardingStep.helper}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {onboardingSteps.map((step, index) => (
                        <span
                          key={step.id}
                          className={`h-2.5 w-2.5 rounded-full ${
                            index <= currentQuestionIndex
                              ? "bg-[#d9772c]"
                              : "bg-[#e8ddd0]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 grid gap-4 md:grid-cols-2">
                    {currentOnboardingStep.options.map((option) => (
                      <button
                        key={option.id}
                        className="rounded-[22px] border border-[#e6dbcf] bg-[#fcfaf7] px-5 py-5 text-left transition hover:border-[#d9c2ae] hover:bg-white"
                        onClick={() => handleOnboardingOptionSelect(option)}
                        type="button"
                      >
                        <span className="text-[28px]">{option.icon}</span>
                        <span className="mt-4 block text-[17px] font-semibold text-[#2a231d]">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#ece3d8] pt-5">
                    <button
                      className="rounded-full border border-[#dfd5c8] bg-[#faf6f1] px-5 py-3 text-[13px] font-semibold text-[#695f55] disabled:cursor-not-allowed disabled:opacity-40"
                      disabled={currentQuestionIndex === 0}
                      onClick={() =>
                        setCurrentQuestionIndex((value) => Math.max(0, value - 1))
                      }
                      type="button"
                    >
                      {t(language, "hero_onboarding_back")}
                    </button>
                    <div className="flex-1">
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#eee4d8]">
                        <div
                          className="h-full rounded-full bg-[#d9772c] transition-all"
                          style={{ width: `${progressValue}%` }}
                        />
                      </div>
                    </div>
                    <button
                      className="text-[13px] font-medium text-[#9b8f83] transition hover:text-[#6d6258]"
                      onClick={skipOnboarding}
                      type="button"
                    >
                      {t(language, "hero_onboarding_skip")}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="px-6 py-10 text-center sm:px-8">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f8efe6] text-[28px]">
                    ✨
                  </div>
                  <h3 className="mt-6 text-[30px] font-semibold tracking-[-0.04em] text-[#231d18]">
                    {t(language, "hero_onboarding_building")}
                  </h3>
                  <p className="mx-auto mt-3 max-w-[560px] text-[15px] leading-7 text-[#766b61]">
                    {t(language, "hero_onboarding_building_desc")}
                  </p>
                  <div className="mx-auto mt-8 h-2 max-w-[420px] overflow-hidden rounded-full bg-[#eee4d8]">
                    <div className="h-full w-3/4 rounded-full bg-[linear-gradient(90deg,_#d9772c,_#f2c39b,_#d9772c)] animate-pulse" />
                  </div>
                </div>
              )}

              <div className="border-t border-[#ece3d8] px-6 py-4 text-[12px] text-[#9d9185] sm:px-8">
                {status}
              </div>

              {isCameraOn ? (
                <div className="px-6 pb-6 sm:px-8">
                  <div className="rounded-[18px] border border-[#e7dacd] bg-[#fbf7f1] p-3">
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
                          {isVideoRecording
                            ? t(language, "hero_stop_video")
                            : t(language, "hero_record_video")}
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
                </div>
              ) : null}

              {attachments.length > 0 ? (
                <div className="px-6 pb-6 sm:px-8">
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((attachment) => (
                      <article
                        key={attachment.id}
                        className="rounded-[16px] border border-[#e0d5c8] bg-[#fcfaf7] px-3 py-2 text-[10px] text-[#5f5449]"
                      >
                        <div className="flex items-start gap-3">
                          <div>
                            <p className="font-semibold">{attachment.name}</p>
                            <p className="mt-1 capitalize text-[#907f72]">
                              {attachment.kind}
                              {attachment.sizeLabel ? ` - ${attachment.sizeLabel}` : ""}
                            </p>
                          </div>
                          <button
                            className="text-[#c26f38]"
                            onClick={() => removeAttachment(attachment.id)}
                            type="button"
                          >
                            {t(language, "remove")}
                          </button>
                        </div>
                        {attachment.kind === "audio" && attachment.previewUrl ? (
                          <audio className="mt-2 w-full" controls src={attachment.previewUrl} />
                        ) : null}
                        {attachment.kind === "camera" && attachment.previewUrl ? (
                          <img
                            alt={attachment.name}
                            className="mt-2 max-h-[160px] w-full rounded-[12px] border border-[#e4d7ca] object-cover"
                            src={attachment.previewUrl}
                          />
                        ) : null}
                        {attachment.kind === "video" && attachment.previewUrl ? (
                          <video
                            className="mt-2 max-h-[160px] w-full rounded-[12px] border border-[#e4d7ca]"
                            controls
                            src={attachment.previewUrl}
                          />
                        ) : null}
                        {attachment.kind === "screen" && attachment.previewUrl ? (
                          <video
                            className="mt-2 max-h-[160px] w-full rounded-[12px] border border-[#e4d7ca]"
                            controls
                            src={attachment.previewUrl}
                          />
                        ) : null}
                      </article>
                    ))}
                  </div>
                </div>
              ) : null}

              {isScreenSharing ? (
                <div className="px-6 pb-6 sm:px-8">
                  <div className="rounded-[18px] border border-[#e7dacd] bg-[#fbf7f1] p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-[#8a7c6f]">
                      {t(language, "hero_screen_share_preview")}
                    </p>
                    <video
                      autoPlay
                      className="mt-3 max-h-[260px] w-full rounded-[14px] border border-[#e1d4c6] bg-[#1f1b18] object-cover"
                      muted
                      playsInline
                      ref={screenVideoRef}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {categoryTabs.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-[30px] border border-[#ddd4c9] bg-white shadow-[0_18px_40px_rgba(71,49,28,0.06)]">
              <div className="flex flex-wrap border-b border-[#e9e1d6] bg-[#fdfbf8] text-left">
                {categoryTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`flex items-center gap-2 border-r border-[#ece4d9] px-5 py-4 text-[13px] font-semibold ${
                      tab.id === activeTab ? "bg-white text-[#2a241f]" : "text-[#6f675d]"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    <span className="text-[12px]">
                      {workflowIconMap[tab.id] ?? tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-5 text-left">
                <div className="space-y-3">
                  {visibleSuggestions.map((item, index) => (
                    <button
                      key={`${activeTab}-${item}`}
                      className="flex w-full items-start gap-3 rounded-[16px] px-3 py-2 text-left transition hover:bg-[#faf5ee]"
                      onClick={() => {
                        setQuery(item);
                        setStatus(t(language, "hero_suggestion_added"));
                      }}
                      type="button"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-[#f2eee8] text-[12px] text-[#7f756c]">
                        {index + 1}
                      </span>
                      <span className="block text-[15px] text-[#4e463f]">{item}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-5 border-t border-[#ece3d8] pt-4 text-[12px] text-[#9d9185]">
                  {t(language, "hero_status_default")}
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {content.quickActions.map((action) => (
              <button
                key={action.id}
                className="rounded-[22px] border border-[#ddd4c9] bg-white px-4 py-5 text-center shadow-[0_8px_18px_rgba(71,49,28,0.05)] transition hover:-translate-y-0.5 hover:border-[#d7c4b2]"
                onClick={() => {
                  onSubmitPrompt(action.label, []);
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
