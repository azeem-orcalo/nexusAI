import type { ModelDetail } from "../../data/mock/marketplace";

type ModelDetailModalProps = {
  detail: ModelDetail;
  onClose: () => void;
};

export const ModelDetailModal = ({
  detail,
  onClose
}: ModelDetailModalProps): JSX.Element => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(74,55,34,0.24)] px-4 py-8 backdrop-blur-[2px] sm:items-center">
      <section className="w-full max-w-[510px] rounded-[24px] border border-[#e3d8cb] bg-white shadow-[0_24px_70px_rgba(61,45,30,0.18)]">
        <div className="flex items-start justify-between border-b border-[#eee3d7] px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef1ff] text-sm">
              ✦
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-[#221d18]">
                {detail.name}
              </h3>
              <p className="text-[10px] text-[#8a7f73]">{detail.subtitle}</p>
            </div>
          </div>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f3eee8] text-[#877b70]"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-[#eee3d7] px-5 py-3">
          <div className="flex flex-wrap gap-5 text-[11px] text-[#5c534b]">
            {["Overview", "How to Use", "Pricing", "Prompt Guide", "Agent Creation", "Reviews"].map(
              (tab: string, index: number) => (
                <button
                  key={tab}
                  className={`pb-2 ${
                    index === 0
                      ? "border-b border-[#e28a4b] text-[#da7a3d]"
                      : ""
                  }`}
                  type="button"
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-[12px] border border-[#e1d6ca] bg-[#f8f4ee] p-4">
              <p className="text-[10px] font-semibold uppercase text-[#9a8f83]">
                Description
              </p>
              <p className="mt-2 text-[12px] leading-6 text-[#61574f]">
                {detail.overview}
              </p>
            </article>

            <article className="rounded-[12px] border border-[#e1d6ca] bg-[#f8f4ee] p-4">
              <p className="text-[10px] font-semibold uppercase text-[#9a8f83]">
                Input / Output
              </p>
              <div className="mt-2 space-y-1.5 text-[12px] text-[#61574f]">
                <p>
                  <span className="font-semibold text-[#3c342e]">Input:</span>{" "}
                  {detail.input}
                </p>
                <p>
                  <span className="font-semibold text-[#3c342e]">Output:</span>{" "}
                  {detail.output}
                </p>
                <p>
                  <span className="font-semibold text-[#3c342e]">Context:</span>{" "}
                  {detail.context}
                </p>
                <p>
                  <span className="font-semibold text-[#3c342e]">
                    Max output:
                  </span>{" "}
                  {detail.maxOutput}
                </p>
                <p>
                  <span className="font-semibold text-[#3c342e]">Latency:</span>{" "}
                  {detail.latency}
                </p>
              </div>
            </article>
          </div>

          <article className="rounded-[12px] border border-[#e1d6ca] bg-[#f8f4ee] p-4">
            <p className="text-[10px] font-semibold uppercase text-[#9a8f83]">
              Use Cases
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-5">
              {detail.useCases.map((useCase) => (
                <div
                  key={useCase.id}
                  className="rounded-[10px] border border-[#e4d9cd] bg-white px-3 py-4 text-center"
                >
                  <div className="text-sm">{useCase.icon}</div>
                  <p className="mt-2 text-[10px] font-medium text-[#403730]">
                    {useCase.label}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[12px] border border-[#e1d6ca] bg-[#f8f4ee] p-4">
            <p className="text-[10px] font-semibold uppercase text-[#9a8f83]">
              Example Prompt → Output
            </p>
            <div className="mt-3 overflow-hidden rounded-[10px] border border-[#eadfd3] bg-white">
              <div className="border-b border-[#f1e6db] bg-[#fff4eb] px-4 py-3">
                <p className="text-[10px] font-semibold text-[#85796d]">USER</p>
                <p className="mt-2 text-[12px] text-[#534942]">
                  "{detail.examplePrompt}"
                </p>
              </div>
              <div className="bg-[#edf2ff] px-4 py-3">
                <p className="text-[10px] font-semibold text-[#6f7cab]">GPT-4O</p>
                <ul className="mt-2 space-y-2 text-[12px] text-[#48506b]">
                  {detail.exampleResponse.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
                <div className="mt-4 text-[12px] text-[#48506b]">
                  <p className="font-semibold">Follow-up questions:</p>
                  <ol className="mt-2 space-y-1">
                    {detail.followUps.map((question, index) => (
                      <li key={question}>
                        {index + 1}. {question}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[12px] border border-[#e1d6ca] bg-[#f8f4ee] p-4">
            <p className="text-[10px] font-semibold uppercase text-[#9a8f83]">
              Benchmark Scores
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
              {detail.benchmarks.map((benchmark) => (
                <div
                  key={benchmark.id}
                  className="rounded-[10px] border border-[#e4d9cd] bg-white px-3 py-4 text-center"
                >
                  <p className="text-[24px] font-semibold tracking-[-0.03em] text-[#26201c]">
                    {benchmark.value}
                  </p>
                  <p className="mt-1 text-[10px] text-[#918679]">
                    {benchmark.label}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};
