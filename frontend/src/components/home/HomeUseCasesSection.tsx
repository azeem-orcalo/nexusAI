import type { HomeUseCase } from "../../types/api";

type HomeUseCasesSectionProps = {
  title: string;
  subtitle?: string;
  items: HomeUseCase[];
  onOpenUseCase: (prompt: string) => void;
  onSubscribe: () => void;
};

export const HomeUseCasesSection = ({
  title,
  subtitle,
  items,
  onOpenUseCase,
  onSubscribe
}: HomeUseCasesSectionProps): JSX.Element => {
  return (
    <section className="bg-white">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1840px]">
          <div className="mb-6">
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-[#17120e] sm:text-[40px]">
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-2 text-[14px] text-[#7a6e63]">{subtitle}</p>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {items.map((item) => (
              <button
                key={item.id}
                className="rounded-[24px] border border-[#eadfd3] bg-white p-6 text-left shadow-[0_10px_26px_rgba(87,63,40,0.04)] transition hover:-translate-y-0.5 hover:border-[#dcbc9f]"
                onClick={() => onOpenUseCase(item.prompt)}
                type="button"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] bg-[#f7f1ea] text-[24px]">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#1f1a15]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-6 text-[#6f645a]">
                      {item.description}
                    </p>
                    <span className="mt-5 inline-block text-[14px] font-medium text-[#d36f2c]">
                      {item.actionLabel} →
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#23201c] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[980px] text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#d7722c]">
            Stay Ahead Of The Curve
          </p>
          <h3 className="mx-auto mt-6 max-w-[620px] text-[42px] font-semibold leading-[1.1] tracking-[-0.05em] text-white sm:text-[56px]">
            New models drop every week.
            <br />
            Don't miss a release.
          </h3>
          <p className="mx-auto mt-6 max-w-[760px] text-[18px] leading-8 text-[#c6b9ad]">
            Get a curated weekly digest: new model releases, benchmark comparisons,
            pricing changes, and prompt engineering tips straight to your inbox.
          </p>

          <div className="mx-auto mt-10 flex max-w-[520px] flex-col items-center gap-4 sm:flex-row">
            <input
              className="h-14 w-full rounded-full border border-[#4e4841] bg-[#312d28] px-6 text-[16px] text-white outline-none placeholder:text-[#8f857b]"
              placeholder="your@email.com"
              readOnly
              type="email"
            />
            <button
              className="h-14 shrink-0 rounded-full bg-[#cc6d2f] px-7 text-[16px] font-semibold text-white transition hover:bg-[#b95f25]"
              onClick={onSubscribe}
              type="button"
            >
              Subscribe free →
            </button>
          </div>

          <p className="mt-6 text-[13px] text-[#8e847b]">
            No spam. Unsubscribe any time. Trusted by 82K+ builders.
          </p>
        </div>
      </div>
    </section>
  );
};
