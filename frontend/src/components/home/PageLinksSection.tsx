type AppPage =
  | "home"
  | "chat-hub"
  | "marketplace"
  | "agents"
  | "discover-new"
  | "dashboard"
  | "api-access"
  | "reviews"
  | "research"
  | "settings"
  | "auth";

type PageLinkItem = {
  id: AppPage;
  title: string;
  description: string;
  category: string;
};

type PageLinksSectionProps = {
  links: PageLinkItem[];
  onNavigate: (page: AppPage) => void;
};

export const PageLinksSection = ({
  links,
  onNavigate
}: PageLinksSectionProps): JSX.Element => {
  return (
    <section className="border-t border-[#ece1d5] bg-white">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1840px]">
          <div className="mb-4">
            <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#211c17]">
              Explore Product Pages
            </h2>
            <p className="mt-1 text-[11px] text-[#81766b]">
              All primary flows mapped from requirements.md with direct page links.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((link) => (
          <button
            key={link.id}
            className="rounded-[18px] border border-[#e6dbcf] bg-[#fcfaf7] p-4 text-left shadow-[0_10px_24px_rgba(76,53,33,0.04)] transition hover:border-[#d8c4af] hover:bg-white"
            onClick={() => onNavigate(link.id)}
            type="button"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.04em] text-[#c7783f]">
              {link.category}
            </p>
            <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[#231e19]">
              {link.title}
            </h3>
            <p className="mt-2 text-[11px] leading-5 text-[#7c7064]">
              {link.description}
            </p>
            <span className="mt-4 inline-block text-[11px] font-medium text-[#d47838]">
              Open page →
            </span>
          </button>
        ))}
          </div>
        </div>
      </div>
    </section>
  );
};
