import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { t } from "../../lib/i18n";

type AuthPanelProps = {
  language: string;
  onClose: () => void;
  onSuccess: () => void;
};

const highlights = [
  "525+ AI models from 30+ labs",
  "Custom agent builder with any model",
  "Connect tools, memory & APIs",
  "Real-time analytics & monitoring"
];

const socialProviders = [
  { id: "google", label: "Google", icon: "G" },
  { id: "github", label: "GitHub", icon: "GH" },
  { id: "microsoft", label: "Microsoft", icon: "MS" }
];

export const AuthPanel = ({
  language,
  onClose,
  onSuccess
}: AuthPanelProps): JSX.Element => {
  const { signIn, signUp, isLoading } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isSignUp = mode === "sign-up";

  const handleSubmit = async (): Promise<void> => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setError(t(language, "auth_error_email_password"));
      return;
    }

    if (isSignUp && !trimmedName) {
      setError(t(language, "auth_error_full_name"));
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError(t(language, "auth_error_password_match"));
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp({ email: trimmedEmail, fullName: trimmedName, password });
      } else {
        await signIn({ email: trimmedEmail, password });
      }

      onSuccess();
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Authentication failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: "sign-in" | "sign-up"): void => {
    setMode(nextMode);
    setError("");
  };

  return (
    <section className="min-h-[calc(100vh-53px)] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(228,120,48,0.18),_transparent_32%),linear-gradient(180deg,_#f6f1eb_0%,_#efe6dc_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[980px] overflow-hidden rounded-[34px] border border-[#dccfbe] bg-[#fbf8f3] shadow-[0_28px_80px_rgba(80,52,28,0.18)]">
        <div className="grid min-h-[760px] lg:grid-cols-[0.92fr_1.38fr]">
          <aside className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(217,119,54,0.28),_transparent_26%),linear-gradient(180deg,_#241b15_0%,_#18120e_100%)] px-8 py-10 text-[#fff6ed] sm:px-10">
            <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:20px_20px]" />
            <div className="relative flex h-full flex-col">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d47231] text-lg font-semibold text-white shadow-[0_10px_30px_rgba(212,114,49,0.35)]">
                  N
                </div>
                <p className="text-[18px] font-semibold tracking-[-0.03em]">NexusAI</p>
              </div>

              <div className="mt-14 flex justify-center lg:mt-20">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border border-[rgba(216,118,54,0.45)] bg-[radial-gradient(circle,_rgba(216,118,54,0.18),_rgba(36,27,21,0.16)_60%,_transparent_70%)]">
                  <div className="absolute inset-4 rounded-full border border-[rgba(255,166,99,0.18)]" />
                  <div className="text-[40px] font-semibold leading-none text-[#ffd5b5]">
                    AI
                  </div>
                </div>
              </div>

              <div className="mt-14 max-w-[320px]">
                <h2 className="text-[42px] font-semibold leading-[0.95] tracking-[-0.05em] text-white">
                  {t(language, "build_smarter")}
                  <br />
                  {t(language, "with_ai_agents")}
                </h2>
                <p className="mt-5 text-[17px] leading-8 text-[rgba(255,245,236,0.7)]">
                  {t(language, "auth_marketing_desc")}
                </p>
              </div>

              <div className="mt-auto space-y-4 pt-12">
                {highlights.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 text-sm text-[rgba(255,245,236,0.78)]"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[rgba(214,116,51,0.18)] text-[11px] font-semibold text-[#ffcfaa]">
                      {index + 1}
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="relative bg-[#fbf8f3] px-6 py-7 sm:px-10 sm:py-8 lg:px-12">
            <button
              className="absolute right-5 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-[#d7ccbf] bg-[rgba(255,255,255,0.72)] text-xl text-[#85796e] transition hover:border-[#cbbaa7] hover:text-[#4d4137]"
              onClick={onClose}
              type="button"
            >
              X
            </button>

            <div className="mx-auto max-w-[484px] pt-8 sm:pt-4">
              <div className="flex items-center gap-8 border-b border-[#e6ddd2] text-sm font-semibold text-[#a19a93]">
                <button
                  className={`relative pb-4 transition ${
                    !isSignUp ? "text-[#1f1a16]" : "hover:text-[#4c4036]"
                  }`}
                  onClick={() => switchMode("sign-in")}
                  type="button"
                >
                  {t(language, "sign_in")}
                  {!isSignUp ? (
                    <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-[#d77433]" />
                  ) : null}
                </button>
                <button
                  className={`relative pb-4 transition ${
                    isSignUp ? "text-[#d77433]" : "hover:text-[#4c4036]"
                  }`}
                  onClick={() => switchMode("sign-up")}
                  type="button"
                >
                  {t(language, "create_account")}
                  {isSignUp ? (
                    <span className="absolute inset-x-0 bottom-[-1px] h-0.5 rounded-full bg-[#d77433]" />
                  ) : null}
                </button>
              </div>

              <div className="pt-10">
                <h1 className="text-[36px] font-semibold tracking-[-0.05em] text-[#221c17]">
                  {isSignUp ? t(language, "create_your_account") : t(language, "welcome_back")}
                </h1>
                <p className="mt-3 text-[17px] leading-7 text-[#746b63]">
                  {isSignUp
                    ? t(language, "auth_signup_desc")
                    : t(language, "auth_signin_desc")}
                </p>
              </div>

              <div className="mt-10 space-y-5">
                {isSignUp ? (
                  <label className="block">
                    <span className="mb-2 block text-[15px] font-semibold text-[#29211c]">
                      {t(language, "full_name")}
                    </span>
                    <input
                      className="w-full rounded-[16px] border border-[#d8cdc0] bg-[#f7f2eb] px-4 py-4 text-[16px] text-[#2b241e] outline-none transition placeholder:text-[#b2aaa1] focus:border-[#d77433] focus:bg-white"
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="John Doe"
                      value={fullName}
                    />
                  </label>
                ) : null}

                <label className="block">
                  <span className="mb-2 block text-[15px] font-semibold text-[#29211c]">
                    {t(language, "email_address")}
                  </span>
                  <input
                    className="w-full rounded-[16px] border border-[#d8cdc0] bg-[#f7f2eb] px-4 py-4 text-[16px] text-[#2b241e] outline-none transition placeholder:text-[#b2aaa1] focus:border-[#d77433] focus:bg-white"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@company.com"
                    type="email"
                    value={email}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-[15px] font-semibold text-[#29211c]">
                    {t(language, "password")}
                  </span>
                  <input
                    className="w-full rounded-[16px] border border-[#d8cdc0] bg-[#f7f2eb] px-4 py-4 text-[16px] text-[#2b241e] outline-none transition placeholder:text-[#b2aaa1] focus:border-[#d77433] focus:bg-white"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={isSignUp ? "Create a strong password" : "Enter your password"}
                    type="password"
                    value={password}
                  />
                </label>

                {isSignUp ? (
                  <label className="block">
                    <span className="mb-2 block text-[15px] font-semibold text-[#29211c]">
                      {t(language, "confirm_password")}
                    </span>
                    <input
                      className="w-full rounded-[16px] border border-[#d8cdc0] bg-[#f7f2eb] px-4 py-4 text-[16px] text-[#2b241e] outline-none transition placeholder:text-[#b2aaa1] focus:border-[#d77433] focus:bg-white"
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      placeholder="Confirm your password"
                      type="password"
                      value={confirmPassword}
                    />
                  </label>
                ) : (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-[#746b63]">
                      <input className="h-4 w-4 accent-[#d77433]" type="checkbox" />
                      {t(language, "remember_me")}
                    </label>
                    <button
                      className="font-semibold text-[#d77433] transition hover:text-[#b75e23]"
                      type="button"
                    >
                      {t(language, "forgot_password")}
                    </button>
                  </div>
                )}
              </div>

              {error ? (
                <p className="mt-5 rounded-[16px] border border-[#efcfbd] bg-[#fff1e8] px-4 py-3 text-sm text-[#b75e23]">
                  {error}
                </p>
              ) : null}

              <button
                className="mt-6 w-full rounded-[16px] bg-[#cf6929] px-5 py-4 text-[17px] font-semibold text-white shadow-[0_12px_26px_rgba(207,105,41,0.28)] transition hover:bg-[#be5d21] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSubmitting || isLoading}
                onClick={() => void handleSubmit()}
                type="button"
              >
                {isSubmitting
                  ? t(language, "please_wait")
                  : isSignUp
                    ? t(language, "create_account_cta")
                    : t(language, "sign_in")}
              </button>

              <div className="mt-8 flex items-center gap-4 text-sm text-[#9b928a]">
                <div className="h-px flex-1 bg-[#e6ddd2]" />
                <span>{t(language, "or_continue_with")}</span>
                <div className="h-px flex-1 bg-[#e6ddd2]" />
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {socialProviders.map((provider) => (
                  <button
                    key={provider.id}
                    className="flex items-center justify-center gap-3 rounded-[16px] border border-[#ddd2c6] bg-white px-4 py-3 text-[15px] font-medium text-[#2a231d] transition hover:border-[#d0bca9] hover:bg-[#fffdfa]"
                    type="button"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5efe8] text-[11px] font-semibold text-[#cf6929]">
                      {provider.icon}
                    </span>
                    <span>{provider.label}</span>
                  </button>
                ))}
              </div>

              <p className="mt-8 text-center text-[15px] text-[#7f766e]">
                {isSignUp ? t(language, "already_have_account") : t(language, "need_account")}{" "}
                <button
                  className="font-semibold text-[#d77433] transition hover:text-[#b75e23]"
                  onClick={() => switchMode(isSignUp ? "sign-in" : "sign-up")}
                  type="button"
                >
                  {isSignUp ? `${t(language, "sign_in")} ->` : `${t(language, "create_account_cta")} ->`}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
