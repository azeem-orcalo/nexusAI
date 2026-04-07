import type { PropsWithChildren } from "react";
import type { AppPage, CurrentUser } from "../../types/api";
import { supportedLanguages } from "../../lib/i18n";

const GlobeIcon = (): JSX.Element => (
  <svg
    aria-hidden="true"
    fill="none"
    height="13"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.8"
    viewBox="0 0 24 24"
    width="13"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

type AppShellProps = PropsWithChildren<{
  currentPage: AppPage;
  language: string;
  onNavigate: (page: AppPage) => void;
  onLanguageChange: (language: string) => void;
  onSignOut: () => void;
  labels: {
    chatHub: string;
    marketplace: string;
    agents: string;
    discoverNew: string;
    signIn: string;
    signOut: string;
    getStartedFree: string;
  };
  user: CurrentUser | null;
}>;

export const AppShell = ({
  children,
  currentPage,
  language,
  labels,
  onLanguageChange,
  onNavigate,
  onSignOut,
  user
}: AppShellProps): JSX.Element => {
  const navItems: Array<{ id: AppPage; label: string }> = [
    { id: "chat-hub", label: labels.chatHub },
    { id: "marketplace", label: labels.marketplace },
    { id: "agents", label: labels.agents },
    { id: "discover-new", label: labels.discoverNew }
  ];

  return (
    <div className="min-h-screen bg-[#f7f3ee] text-[#231f1b]">
      <div className="mx-auto flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-20 border-b border-[#e9dfd3] bg-[rgba(247,243,238,0.9)] backdrop-blur-md">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                className="flex items-center gap-2"
                onClick={() => onNavigate("home")}
                type="button"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#c76628] text-[10px] font-semibold text-white">
                  N
                </div>
                <div>
                  <p className="text-[16px] font-semibold tracking-tight text-[#1e1915]">
                    NexusAI
                  </p>
                </div>
              </button>
            </div>

            <nav className="hidden items-center gap-7 text-[13px] text-[#5f564e] md:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`border-b pb-1 transition hover:text-[#1e1915] ${
                    currentPage === item.id
                      ? "border-[#d97c3f] text-[#d97c3f]"
                      : "border-transparent"
                  }`}
                  onClick={() => onNavigate(item.id)}
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1.5 rounded-full border border-[#ddd0c1] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4f463f] transition hover:border-[#cdb8a4] cursor-pointer">
                <GlobeIcon />
                <select
                  className="bg-transparent outline-none cursor-pointer"
                  onChange={(event) => onLanguageChange(event.target.value)}
                  value={language}
                >
                  {supportedLanguages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              {user ? (
                <>
                  <span className="rounded-full border border-[#ddd0c1] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4f463f]">
                    {user.fullName}
                  </span>
                  <button
                    className="rounded-full bg-[#c76b2c] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#b55f25]"
                    onClick={onSignOut}
                    type="button"
                  >
                    {labels.signOut}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="rounded-full border border-[#ddd0c1] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4f463f] transition hover:border-[#cdb8a4]"
                    onClick={() => onNavigate("auth")}
                    type="button"
                  >
                    {labels.signIn}
                  </button>
                  <button
                    className="rounded-full bg-[#c76b2c] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#b55f25]"
                    onClick={() => onNavigate("auth")}
                    type="button"
                  >
                    {labels.getStartedFree}
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};
