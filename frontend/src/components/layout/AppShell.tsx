import type { PropsWithChildren } from "react";
import type { AppPage, CurrentUser } from "../../types/api";

type AppShellProps = PropsWithChildren<{
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  onSignOut: () => void;
  user: CurrentUser | null;
}>;

export const AppShell = ({
  children,
  currentPage,
  onNavigate,
  onSignOut,
  user
}: AppShellProps): JSX.Element => {
  const navItems: Array<{ id: AppPage; label: string }> = [
    { id: "chat-hub", label: "Chat Hub" },
    { id: "marketplace", label: "Marketplace" },
    { id: "agents", label: "Agents" },
    { id: "discover-new", label: "Discover New" }
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
                  <p className="text-sm font-semibold tracking-tight text-[#1e1915]">
                    NexusAI
                  </p>
                </div>
              </button>
            </div>

            <nav className="hidden items-center gap-6 text-[11px] text-[#5f564e] md:flex">
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
              <button
                className="rounded-full border border-[#ddd0c1] bg-white px-3 py-1.5 text-[10px] font-medium text-[#4f463f] transition hover:border-[#cdb8a4]"
                onClick={() => onNavigate("settings")}
                type="button"
              >
                EN
              </button>
              {user ? (
                <>
                  <span className="rounded-full border border-[#ddd0c1] bg-white px-3 py-1.5 text-[10px] font-medium text-[#4f463f]">
                    {user.fullName}
                  </span>
                  <button
                    className="rounded-full bg-[#c76b2c] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#b55f25]"
                    onClick={onSignOut}
                    type="button"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="rounded-full border border-[#ddd0c1] bg-white px-3 py-1.5 text-[10px] font-medium text-[#4f463f] transition hover:border-[#cdb8a4]"
                    onClick={() => onNavigate("auth")}
                    type="button"
                  >
                    Sign in
                  </button>
                  <button
                    className="rounded-full bg-[#c76b2c] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#b55f25]"
                    onClick={() => onNavigate("auth")}
                    type="button"
                  >
                    Get Started Free
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
