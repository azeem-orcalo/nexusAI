import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import type { ApiModel, ApiModelFilters } from "../../types/api";

type MarketplaceSectionProps = { language: string; models: ApiModel[]; filterOptions: ApiModelFilters | null; onSelectModel: (modelId: string) => void; };
const primaryFilters = ["All", "Language", "Vision", "Code", "Image Gen", "Audio", "Open Source"];
const filterLabelMap: Record<string, string> = { "pay-per-use": "Pay-per-use", subscription: "Subscription", "free-tier": "Free tier", enterprise: "Enterprise" };
const providerIcon = (provider: string): string => provider.slice(0, 1).toUpperCase();

export const MarketplaceSection = ({ language: _language, models: initialModels, filterOptions: initialFilterOptions, onSelectModel }: MarketplaceSectionProps): JSX.Element => {
  const [models, setModels] = useState<ApiModel[]>(initialModels);
  const [filterOptions, setFilterOptions] = useState<ApiModelFilters | null>(initialFilterOptions);
  const [query, setQuery] = useState("");
  const [activeTopFilter, setActiveTopFilter] = useState("All");
  const [activeProvider, setActiveProvider] = useState("All Labs");
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [selectedPriceModels, setSelectedPriceModels] = useState<string[]>([]);
  const [selectedOpenSource, setSelectedOpenSource] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  useEffect(() => { setModels(initialModels); }, [initialModels]);
  useEffect(() => { setFilterOptions(initialFilterOptions); }, [initialFilterOptions]);

  useEffect(() => {
    let active = true;
    const topFilter = activeTopFilter === "All" ? undefined : activeTopFilter === "Open Source" ? undefined : activeTopFilter.toLowerCase();
    void Promise.all([
      api.listModels({ search: query || undefined, provider: activeProvider === "All Labs" ? selectedProviders[0] : activeProvider, tag: topFilter, openSource: activeTopFilter === "Open Source" || selectedOpenSource || undefined, priceModel: selectedPriceModels[0], minRating: minRating || undefined, maxPrice: maxPrice ?? undefined }),
      api.modelFilters()
    ]).then(([nextModels, nextFilters]) => {
      if (!active) return;
      let filtered = nextModels;
      if (selectedProviders.length > 0) filtered = filtered.filter((model) => selectedProviders.includes(model.provider));
      if (selectedPriceModels.length > 0) filtered = filtered.filter((model) => selectedPriceModels.includes(model.priceModel ?? ""));
      setModels(filtered);
      setFilterOptions(nextFilters);
    }).catch(() => undefined);
    return () => { active = false; };
  }, [activeProvider, activeTopFilter, maxPrice, minRating, query, selectedOpenSource, selectedPriceModels, selectedProviders]);

  const providerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    models.forEach((model) => counts.set(model.provider, (counts.get(model.provider) ?? 0) + 1));
    return counts;
  }, [models]);

  const toggleListValue = (current: string[], nextValue: string, setter: (value: string[]) => void): void => { setter(current.includes(nextValue) ? current.filter((item) => item !== nextValue) : [...current, nextValue]); };

  return (
    <section className="min-h-[calc(100vh-53px)] bg-[#f7f3ee]">
      <div className="border-b border-[#e7ddd2] bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center"><h2 className="text-[28px] font-semibold tracking-[-0.04em] text-[#211b16]">Model Marketplace</h2><label className="flex w-full max-w-[420px] items-center gap-3 rounded-full border border-[#dccfc1] bg-[#fbf8f3] px-4 py-3"><span className="text-[#9a8f84]">⌕</span><input className="w-full bg-transparent text-[14px] text-[#4d443d] outline-none placeholder:text-[#9e9387]" onChange={(event) => setQuery(event.target.value)} placeholder="Search models, capabilities..." type="text" value={query} /></label></div>
          <div className="flex flex-wrap gap-2">{primaryFilters.map((filter) => <button key={filter} className={`rounded-full border px-4 py-2 text-[13px] transition ${activeTopFilter === filter ? "border-[#df7f38] bg-[#fff4ec] text-[#cd702c]" : "border-[#ddd1c3] bg-white text-[#61574f]"}`} onClick={() => setActiveTopFilter(filter)} type="button">{filter}</button>)}</div>
        </div>
      </div>

      <div className="border-b border-[#e7ddd2] bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1"><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9f9082]">AI Labs</span><button className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition ${activeProvider === "All Labs" ? "bg-[#d9772f] text-white" : "border border-[#ddd1c3] bg-white text-[#5f554c]"}`} onClick={() => setActiveProvider("All Labs")} type="button">All Labs ({models.length})</button>{(filterOptions?.providers ?? []).map((provider) => <button key={provider} className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] transition ${activeProvider === provider ? "border-[#df7f38] bg-[#fff4ec] text-[#cd702c]" : "border-[#ddd1c3] bg-white text-[#5f554c]"}`} onClick={() => setActiveProvider(provider)} type="button"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#f2e7ff] text-[10px]">{providerIcon(provider)}</span><span>{provider}</span><span className="text-[#9a8f84]">({providerCounts.get(provider) ?? 0})</span></button>)}</div>
      </div>

      <div className="grid min-h-[calc(100vh-170px)] xl:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="border-r border-[#e6ddd2] bg-white px-4 py-5"><div className="rounded-[18px] border border-[#f0d7c7] bg-[#fff5ee] p-4"><p className="text-[12px] font-semibold text-[#de7d37]">Need help choosing?</p><p className="mt-2 text-[13px] leading-6 text-[#8a7868]">Chat with our AI guide for a personalized recommendation in 60 seconds.</p></div><div className="mt-6 space-y-6 text-[14px] text-[#4e453d]"><div><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9c8f84]">Provider</p><div className="space-y-2">{(filterOptions?.providers ?? []).map((provider) => <label key={provider} className="flex items-center gap-2"><input checked={selectedProviders.includes(provider)} onChange={() => toggleListValue(selectedProviders, provider, setSelectedProviders)} type="checkbox" /><span>{provider}</span></label>)}</div></div><div><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9c8f84]">Pricing Model</p><div className="space-y-2">{(filterOptions?.priceModels ?? []).map((model) => <label key={model} className="flex items-center gap-2"><input checked={selectedPriceModels.includes(model)} onChange={() => toggleListValue(selectedPriceModels, model, setSelectedPriceModels)} type="checkbox" /><span>{filterLabelMap[model] ?? model}</span></label>)}</div></div><div><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9c8f84]">Max Price /1M Tokens</p><input className="w-full accent-[#d9772f]" max={filterOptions?.maxPrice ?? 33} min={0} onChange={(event) => setMaxPrice(Number(event.target.value))} type="range" value={maxPrice ?? filterOptions?.maxPrice ?? 33} /><p className="mt-2 text-[12px] text-[#8c7f73]">{maxPrice === null ? "No limit applied" : `Up to $${maxPrice}`}</p></div><div><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9c8f84]">Min Rating</p><div className="flex flex-wrap gap-2">{[0,4,4.5].map((value) => <button key={value} className={`rounded-full border px-3 py-1 text-[12px] ${minRating === value ? "border-[#df7f38] bg-[#fff4ec] text-[#cd702c]" : "border-[#ddd1c3] bg-white text-[#61574f]"}`} onClick={() => setMinRating(value)} type="button">{value === 0 ? "Any" : `${value}+`}</button>)}</div></div><div><p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-[#9c8f84]">Licence</p><label className="flex items-center gap-2"><input checked={selectedOpenSource} onChange={(event) => setSelectedOpenSource(event.target.checked)} type="checkbox" /><span>Open source only</span></label></div></div></aside>
        <div className="bg-[#f7f3ee] px-4 py-5 sm:px-6 lg:px-8"><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">{models.map((model) => <button key={model.id} className="rounded-[24px] border border-[#e7ddd2] bg-white p-5 text-left shadow-[0_12px_30px_rgba(87,63,40,0.08)] transition hover:-translate-y-0.5 hover:border-[#ddc6b1]" onClick={() => onSelectModel(model.id)} type="button"><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-[#eef2ff] text-[14px] font-semibold text-[#7e6bf1]">{providerIcon(model.provider)}</div><div><p className="text-[17px] font-semibold tracking-[-0.03em] text-[#211b16]">{model.name}</p><p className="mt-1 text-[12px] text-[#918476]">{model.provider}</p></div></div>{model.badge ? <span className="rounded-full bg-[#fff0e6] px-3 py-1 text-[10px] font-semibold text-[#da7d3e]">{model.badge}</span> : null}</div><p className="mt-5 min-h-[78px] text-[14px] leading-7 text-[#71665b]">{model.description}</p><div className="mt-4 flex flex-wrap gap-2">{[...model.tags, ...model.useCases].slice(0,4).map((tag) => <span key={`${model.id}-${tag}`} className="rounded-full bg-[#eef3ff] px-3 py-1 text-[11px] text-[#4f73cc]">{tag}</span>)}</div><div className="mt-6 border-t border-[#eee4d8] pt-4"><div className="flex items-center justify-between gap-3 text-[13px] text-[#61574f]"><div><p className="text-[#e49a23]">★★★★★</p><p className="mt-1">{model.averageRating.toFixed(1)} ({Math.round(model.averageRating * 860)})</p></div><div className="text-right"><p className="font-semibold text-[#177f66]">{model.pricePerMillion}/1M tk</p><p className="mt-1 text-[#d47838]">How to Use</p></div></div></div></button>)}</div>{models.length === 0 ? <div className="rounded-[22px] border border-dashed border-[#dccfbe] bg-white/70 px-4 py-12 text-center text-[14px] text-[#7d7268]">No models found from backend. Add model documents in MongoDB.</div> : null}</div>
      </div>
    </section>
  );
};

