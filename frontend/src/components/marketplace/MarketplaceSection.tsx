import { useMemo, useState } from "react";
import type { MarketplaceModel } from "../../data/mock/marketplace";

type MarketplaceSectionProps = {
  models: MarketplaceModel[];
  onSelectModel: (modelId: string) => void;
};

export const MarketplaceSection = ({
  models,
  onSelectModel
}: MarketplaceSectionProps): JSX.Element => {
  const [query, setQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const filters = ["All", "Language", "Vision", "Code", "Image Gen", "Audio", "Open Source"];

  const filteredModels = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return models.filter((model) => {
      const matchesFilter =
        activeFilter === "All" ||
        model.tags.some(
          (tag) => tag.label.toLowerCase() === activeFilter.toLowerCase()
        );

      if (!matchesFilter) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        model.name,
        model.provider,
        model.description,
        ...model.tags.map((tag) => tag.label)
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [activeFilter, models, query]);

  return (
    <section className="border-t border-[#ece1d5] bg-[#f7f3ee] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#211c17]">
            Model Marketplace
          </h2>
          <p className="mt-1 text-[11px] text-[#81766b]">
            Search models, compare capabilities, and open detail view.
          </p>
        </div>
        <label className="hidden rounded-full border border-[#ddcfc0] bg-white px-4 py-2 md:block">
          <input
            className="w-56 bg-transparent text-[11px] text-[#554b42] outline-none placeholder:text-[#8c8074]"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search models, capabilities..."
            type="text"
            value={query}
          />
        </label>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map(
          (filter: string) => (
            <button
              key={filter}
              className={`rounded-full border px-3 py-1.5 text-[10px] ${
                filter === activeFilter
                  ? "border-[#da7d3e] bg-[#fff5ee] text-[#c86d30]"
                  : "border-[#ddd1c3] bg-white text-[#6c6259]"
              }`}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          )
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {filteredModels.map((model) => (
          <button
            key={model.id}
            className="rounded-[18px] border border-[#e6dbcf] bg-white p-4 text-left shadow-[0_10px_24px_rgba(76,53,33,0.06)] transition hover:border-[#dbc5b1]"
            onClick={() => onSelectModel(model.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[#f4e8ff] text-[12px]">
                  ✦
                </div>
                <div>
                  <p className="text-[18px] font-semibold tracking-[-0.02em] text-[#211c17]">
                    {model.name}
                  </p>
                  <p className="text-[10px] text-[#8f8377]">{model.provider}</p>
                </div>
              </div>
              {model.badge ? (
                <span className="rounded-full bg-[#fff0e6] px-2 py-1 text-[9px] font-semibold text-[#da7d3e]">
                  {model.badge}
                </span>
              ) : null}
            </div>

            <p className="mt-4 min-h-[60px] text-[11px] leading-5 text-[#7f7468]">
              {model.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {model.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="rounded-full bg-[#eef3ff] px-2.5 py-1 text-[9px] text-[#5c78cb]"
                >
                  {tag.label}
                </span>
              ))}
            </div>

            <div className="mt-6 border-t border-[#eee4d8] pt-3">
              <div className="flex items-center justify-between text-[11px] text-[#61574f]">
                <div className="flex items-center gap-1">
                  <span className="text-[#e49a23]">★★★★★</span>
                  <span>{model.rating}</span>
                  <span className="text-[#978b7f]">{model.reviews}</span>
                </div>
                <span className="text-[#1b8c73]">{model.price}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-[#8d8175]">{model.tokenUnit}</span>
                <span className="font-medium text-[#d47838]">
                  How to Use →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {filteredModels.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-[#dccfbe] bg-white/70 px-4 py-6 text-center text-[11px] text-[#7d7268]">
          No models matched your search. Try another keyword or filter.
        </div>
      ) : null}
    </section>
  );
};
