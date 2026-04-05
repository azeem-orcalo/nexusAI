import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type AuthPanelProps = {
  onSuccess: () => void;
};

export const AuthPanel = ({ onSuccess }: AuthPanelProps): JSX.Element => {
  const { signIn, signUp, isLoading } = useAuth();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("azeem@example.com");
  const [password, setPassword] = useState<string>("secret123");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    setError("");
    setIsSubmitting(true);

    try {
      if (mode === "sign-in") {
        await signIn({ email, password });
      } else {
        await signUp({ email, fullName, password });
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

  return (
    <section className="min-h-[calc(100vh-53px)] bg-[#f7f3ee] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[460px] rounded-[28px] border border-[#e4d8ca] bg-white p-6 shadow-[0_18px_50px_rgba(76,53,33,0.08)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.04em] text-[#cc7640]">
              Authentication
            </p>
            <h1 className="mt-2 text-[30px] font-semibold tracking-[-0.04em] text-[#211c17]">
              {mode === "sign-in" ? "Sign in" : "Create account"}
            </h1>
          </div>
          <button
            className="rounded-full border border-[#dfd2c3] px-3 py-1.5 text-[10px] text-[#5c534b]"
            onClick={() =>
              setMode((current) =>
                current === "sign-in" ? "sign-up" : "sign-in"
              )
            }
            type="button"
          >
            {mode === "sign-in" ? "Need account?" : "Have account?"}
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {mode === "sign-up" ? (
            <label className="block">
              <span className="mb-1 block text-[11px] font-medium text-[#5f554d]">
                Full name
              </span>
              <input
                className="w-full rounded-[14px] border border-[#dfd2c3] px-4 py-3 text-[13px] outline-none"
                onChange={(event) => setFullName(event.target.value)}
                value={fullName}
              />
            </label>
          ) : null}

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-[#5f554d]">
              Email
            </span>
            <input
              className="w-full rounded-[14px] border border-[#dfd2c3] px-4 py-3 text-[13px] outline-none"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-medium text-[#5f554d]">
              Password
            </span>
            <input
              className="w-full rounded-[14px] border border-[#dfd2c3] px-4 py-3 text-[13px] outline-none"
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              value={password}
            />
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-[14px] bg-[#fff1e8] px-4 py-3 text-[11px] text-[#b45a24]">
            {error}
          </p>
        ) : null}

        <button
          className="mt-5 w-full rounded-full bg-[#c76b2c] px-4 py-3 text-[12px] font-semibold text-white disabled:opacity-60"
          disabled={isSubmitting || isLoading}
          onClick={() => void handleSubmit()}
          type="button"
        >
          {isSubmitting ? "Please wait..." : mode === "sign-in" ? "Sign in" : "Create account"}
        </button>
      </div>
    </section>
  );
};
