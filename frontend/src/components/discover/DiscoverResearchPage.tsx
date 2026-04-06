import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import type { DiscoverResearchFilters, ResearchFeedItem } from "../../types/api";

type DiscoverResearchPageProps = { onOpenChatHub: () => void };

const categoryStyleMap: Record<string, string> = {
  Reasoning: "bg-[#eef3ff] text-[#4c78da] border-[#cfdcff]",
  Multimodal: "bg-[#ebfaf5] text-[#0f8a69] border-[#cbe9dc]",
  Alignment: "bg-[#fff3eb] text-[#de7b3b] border-[#f1d8c7]",
  Efficiency: "bg-[#fff7e8] text-[#c7801d] border-[#edd8a8]",
  "Open Weights": "bg-[#eef4ff] text-[#5075d8] border-[#d6e0fb]"
};

const defaultMetrics = [
  { label: "Score", value: "83.2%" },
  { label: "Delta", value: "+6.4%" },
  { label: "Context", value: "5M ctx" }
];

export const DiscoverResearchPage = ({
  onOpenChatHub
}: DiscoverResearchPageProps): JSX.Element => {
  const [items, setItems] = useState<ResearchFeedItem[]>([]);
  const [filters, setFilters] = useState<DiscoverResearchFilters | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const categories = useMemo(
    () => ["All", ...(filters?.categories ?? [])],
    [filters]
  );

  const selectedItem =
    items.find((item) => item.id === selectedId) ??
    items[0] ??
    null;

  useEffect(() => {
    let active = true;

    void api
      .researchFeedFilters()
      .then((nextFilters) => {
        if (!active) {
          return;
        }
        setFilters(nextFilters);
      })
      .catch(() => {
        if (!active) {
          return;
        }
        setFilters({ categories: [] });
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setError("");
    if (items.length === 0) {
      setIsLoading(true);
    } else {
      setIsFiltering(true);
    }

    void api
      .researchFeed(
        activeCategory === "All" ? undefined : { category: activeCategory }
      )
      .then((nextItems) => {
        if (!active) {
          return;
        }
        setItems(nextItems);
        setSelectedId((current) =>
          nextItems.some((item) => item.id === current)
            ? current
            : nextItems[0]?.id ?? ""
        );
      })
      .catch((loadError) => {
        if (!active) {
          return;
        }
        setItems([]);
        setSelectedId("");
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load research feed."
        );
      })
      .finally(() => {
        if (!active) {
          return;
        }
        setIsLoading(false);
        setIsFiltering(false);
      });

    return () => {
      active = false;
    };
  }, [activeCategory]);

  const papersThisWeek = `${items.length} papers this week`;

  return (
    <section className="min-h-[calc(100vh-53px)] bg-[#fbf8f3]">
      <div className="border-b border-[#ebe1d5] bg-white px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-[40px] font-semibold tracking-[-0.05em] text-[#19130f]">
              AI Research Feed
            </h1>
            <p className="mt-2 text-[15px] text-[#8b7d6f]">
              Curated breakthroughs · Updated daily
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-[#b9e0d2] bg-[#ecfaf4] px-5 py-2 text-[14px] font-semibold text-[#187c60]">
              {papersThisWeek}
            </span>
            <button
              className="rounded-full border border-[#e2d6c8] bg-white px-5 py-2 text-[14px] font-medium text-[#7b695b]"
              type="button"
            >
              Subscribe
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                className={`rounded-full border px-5 py-2 text-[14px] font-semibold transition ${
                  isActive
                    ? "border-[#1f1a16] bg-[#1f1a16] text-white"
                    : "border-[#e3d7ca] bg-white text-[#574c43]"
                }`}
                onClick={() => {
                  setActiveCategory(category);
                }}
                type="button"
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid min-h-[calc(100vh-220px)] xl:grid-cols-[370px_minmax(0,1fr)]">
        <aside className="border-r border-[#e8ddd0] bg-white">
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
            {items.map((item) => {
              const isSelected = item.id === selectedItem?.id;
              const badgeClass = categoryStyleMap[item.category ?? ""] ?? "bg-[#f2efe9] text-[#726456] border-[#e5dbd0]";
              const date = item.publishedAt ? new Date(item.publishedAt) : null;
              const month = date
                ? date.toLocaleString("en-US", { month: "short" }).toUpperCase()
                : "MAR";
              const day = date ? date.getDate() : 1;

              return (
                <button
                  key={item.id}
                  className={`grid w-full grid-cols-[72px_minmax(0,1fr)] gap-4 border-b border-[#efe5da] px-5 py-5 text-left transition ${
                    isSelected ? "bg-[#fff4ec]" : "bg-white hover:bg-[#fdf9f4]"
                  }`}
                  onClick={() => setSelectedId(item.id)}
                  type="button"
                >
                  <div>
                    <p className="text-[12px] uppercase tracking-[0.12em] text-[#a79486]">
                      {month}
                    </p>
                    <p className="mt-1 text-[22px] font-semibold text-[#1f1712]">
                      {day}
                    </p>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#494038]">
                        {item.provider}
                      </span>
                      {item.category ? (
                        <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${badgeClass}`}>
                          {item.category}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-3 text-[18px] font-semibold leading-7 text-[#15110d]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-7 text-[#7b6c5f]">
                      {item.summary}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex min-h-full flex-col bg-[#fbf8f3]">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center px-6 py-16 text-[16px] text-[#7b6d5f]">
              Loading research feed from backend...
            </div>
          ) : selectedItem ? (
            <>
              <div className="border-b border-[#e7ddd2] bg-white px-6 py-5 lg:px-7">
                <div className="flex flex-wrap items-center gap-2 text-[15px] text-[#8a7b6d]">
                  <span className="font-semibold text-[#4a4038]">{selectedItem.provider}</span>
                  {selectedItem.publishedAt ? (
                    <>
                      <span>·</span>
                      <span>{new Date(selectedItem.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    </>
                  ) : null}
                  {selectedItem.category ? (
                    <span className={`ml-2 rounded-full border px-3 py-1 text-[11px] font-semibold ${categoryStyleMap[selectedItem.category] ?? "bg-[#f2efe9] text-[#726456] border-[#e5dbd0]"}`}>
                      {selectedItem.category}
                    </span>
                  ) : null}
                </div>

                <h2 className="mt-4 text-[36px] font-semibold tracking-[-0.05em] text-[#17120e]">
                  {selectedItem.title}
                </h2>
                <p className="mt-3 text-[15px] leading-8 text-[#7a6c5e]">
                  {selectedItem.summary}
                </p>
              </div>

              {isFiltering ? (
                <div className="border-b border-[#eee3d8] bg-[#fffaf4] px-6 py-3 text-[14px] text-[#8a7868] lg:px-7">
                  Refreshing filtered results from backend...
                </div>
              ) : null}

              <div className="flex-1 px-6 py-6 lg:px-7">
                <section>
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#a19081]">
                    Overview
                  </p>
                  <p className="mt-4 text-[17px] leading-9 text-[#6e6258]">
                    {selectedItem.overview ?? selectedItem.summary}
                  </p>
                </section>

                <section className="mt-8 grid gap-4 md:grid-cols-3">
                  {(selectedItem.metrics?.length ? selectedItem.metrics : defaultMetrics).slice(0, 3).map((metric) => (
                    <article
                      key={metric.label}
                      className="rounded-[18px] border border-[#ebe1d5] bg-[#f7f3ee] px-5 py-6 text-center"
                    >
                      <p className="text-[34px] font-semibold tracking-[-0.04em] text-[#201813]">
                        {metric.value}
                      </p>
                      <p className="mt-2 text-[14px] text-[#9a8d81]">
                        {metric.label}
                      </p>
                    </article>
                  ))}
                </section>

                <section className="mt-8">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#a19081]">
                    Key Findings
                  </p>
                  <div className="mt-4 space-y-3">
                    {(selectedItem.findings ?? []).map((finding, index) => (
                      <div
                        key={`${selectedItem.id}-finding-${index}`}
                        className="flex gap-4 rounded-[16px] border border-[#efe4d8] bg-[#faf6f1] px-4 py-4"
                      >
                        <span className="text-[24px] font-semibold text-[#d26f2d]">
                          {index + 1}.
                        </span>
                        <p className="text-[15px] leading-7 text-[#685b4f]">
                          {finding}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mt-8">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#a19081]">
                    Models Referenced
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {(selectedItem.modelsReferenced ?? []).map((model) => (
                      <span
                        key={`${selectedItem.id}-${model}`}
                        className="rounded-full border border-[#e5d9cc] bg-white px-4 py-2 text-[14px] text-[#5c5047]"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              <div className="border-t border-[#e9ddd0] bg-white px-6 py-4 lg:px-7">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="flex-1 rounded-full bg-[#c96a2d] px-6 py-4 text-[16px] font-semibold text-white shadow-[0_12px_24px_rgba(201,106,45,0.18)]"
                    onClick={onOpenChatHub}
                    type="button"
                  >
                    Discuss in Chat Hub
                  </button>
                  <button
                    className="rounded-full border border-[#e4d8ca] bg-white px-6 py-4 text-[15px] font-medium text-[#6a5b4e]"
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    className="rounded-full border border-[#e4d8ca] bg-white px-6 py-4 text-[15px] font-medium text-[#6a5b4e]"
                    type="button"
                  >
                    Share
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center px-6 py-16 text-[16px] text-[#7b6d5f]">
              {error || "No research items available from backend."}
            </div>
          )}
        </main>
      </div>
    </section>
  );
};
