import type { ApiModel } from "../../types/api";

type HomeModelsSectionProps = {
  models: ApiModel[];
  onOpenModel: (modelId: string) => void;
  onSeeAll: () => void;
};

const providerIcon = (provider: string): string => provider.slice(0, 1).toUpperCase();

export const HomeModelsSection = ({
  models,
  onOpenModel,
  onSeeAll
}: HomeModelsSectionProps): JSX.Element => {
  return (
    <section className="border-t border-[#ece1d5] bg-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold tracking-[-0.03em] text-[#211c17]">
            Model Marketplace
          </h2>
          <p className="mt-1 text-[12px] text-[#81766b]">
            Featured models from backend.
          </p>
        </div>

        <button
          className="rounded-full border border-[#decfbe] bg-[#fcfaf7] px-4 py-2 text-[12px] font-semibold text-[#c46d31] transition hover:border-[#d5bea9] hover:bg-white"
          onClick={onSeeAll}
          type="button"
        >
          See all
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {models.map((model) => (
          <button
            key={model.id}
            className="rounded-[22px] border border-[#e7ddd2] bg-[#fcfaf7] p-5 text-left shadow-[0_10px_26px_rgba(87,63,40,0.06)] transition hover:-translate-y-0.5 hover:border-[#dbc4af] hover:bg-white"
            onClick={() => onOpenModel(model.id)}
            type="button"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#eef2ff] text-[14px] font-semibold text-[#7b68eb]">
                  {providerIcon(model.provider)}
                </div>
                <div>
                  <p className="text-[18px] font-semibold tracking-[-0.03em] text-[#211b16]">
                    {model.name}
                  </p>
                  <p className="mt-1 text-[12px] text-[#918476]">{model.provider}</p>
                </div>
              </div>

              {model.badge ? (
                <span className="rounded-full bg-[#fff0e6] px-3 py-1 text-[10px] font-semibold text-[#da7d3e]">
                  {model.badge}
                </span>
              ) : null}
            </div>

            <p className="mt-4 min-h-[72px] text-[14px] leading-7 text-[#71665b]">
              {model.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {[...model.tags, ...model.useCases].slice(0, 3).map((tag) => (
                <span
                  key={`${model.id}-${tag}`}
                  className="rounded-full bg-[#eef3ff] px-3 py-1 text-[11px] text-[#4f73cc]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-5 border-t border-[#eee4d8] pt-4">
              <div className="flex items-center justify-between gap-3 text-[13px] text-[#61574f]">
                <div>
                  <p className="text-[#e49a23]">★★★★★</p>
                  <p className="mt-1">
                    {model.averageRating.toFixed(1)} ({Math.round(model.averageRating * 860)})
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#177f66]">{model.pricePerMillion}/1M tk</p>
                  <p className="mt-1 text-[#d47838]">Open model</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
