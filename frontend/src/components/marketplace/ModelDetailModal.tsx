import { useEffect, useState } from "react";
import type {
  ApiModelDetailTabId,
  MarketplaceModelDetail
} from "../../types/api";

type ModelDetailModalProps = {
  detail: MarketplaceModelDetail;
  onClose: () => void;
};

const badgeClasses: Record<ApiModelDetailTabId, string> = {
  overview: "border-[#f0dac8] bg-[#fff5eb] text-[#cf7a3d]",
  howToUse: "border-[#d8e8ff] bg-[#f2f7ff] text-[#5d86d7]",
  pricing: "border-[#f5dfc8] bg-[#fff6eb] text-[#cf873c]",
  promptGuide: "border-[#e4dbfb] bg-[#f7f3ff] text-[#8a71d4]",
  agentCreation: "border-[#d9f0e4] bg-[#f0fbf5] text-[#2d9566]",
  reviews: "border-[#ffe0d4] bg-[#fff4ee] text-[#cf6c45]"
};

export const ModelDetailModal = ({
  detail,
  onClose
}: ModelDetailModalProps): JSX.Element => {
  const [activeTab, setActiveTab] = useState<ApiModelDetailTabId>(
    detail.tabs[0]?.id ?? "overview"
  );

  useEffect(() => {
    setActiveTab(detail.tabs[0]?.id ?? "overview");
  }, [detail.id, detail.tabs]);

  const renderOverview = (): JSX.Element => (
    <div className="space-y-5">
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Description
          </p>
          <p className="mt-3 text-[15px] leading-8 text-[#5c5148]">
            {detail.overview.description}
          </p>
        </article>

        <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Input / Output
          </p>
          <div className="mt-3 space-y-2.5 text-[14px] leading-7 text-[#5c5148]">
            <p>
              <span className="font-semibold text-[#342b24]">Input:</span>{" "}
              {detail.overview.input}
            </p>
            <p>
              <span className="font-semibold text-[#342b24]">Output:</span>{" "}
              {detail.overview.output}
            </p>
            <p>
              <span className="font-semibold text-[#342b24]">Context:</span>{" "}
              {detail.overview.context}
            </p>
            <p>
              <span className="font-semibold text-[#342b24]">Max output:</span>{" "}
              {detail.overview.maxOutput}
            </p>
            <p>
              <span className="font-semibold text-[#342b24]">Latency:</span>{" "}
              {detail.overview.latency}
            </p>
          </div>
        </article>
      </div>

      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Use Cases
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {detail.overview.useCases.map((useCase) => (
            <div
              key={useCase.id}
              className="rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-5 text-center"
            >
              <div className="text-[22px]">{useCase.icon}</div>
              <p className="mt-3 text-[13px] font-medium leading-6 text-[#3f352e]">
                {useCase.label}
              </p>
            </div>
          ))}
        </div>
      </article>

      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Example Prompt to Output
        </p>
        <div className="mt-4 overflow-hidden rounded-[20px] border border-[#eadfd3] bg-white">
          <div className="border-b border-[#f0e4d7] bg-[#fff5ec] px-5 py-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9d8c7e]">
              User
            </p>
            <p className="mt-3 text-[15px] leading-7 text-[#544942]">
              "{detail.overview.examplePrompt}"
            </p>
          </div>
          <div className="grid gap-4 bg-[#eef2ff] px-5 py-4 lg:grid-cols-[1fr_0.9fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6677a8]">
                Model Response
              </p>
              <ul className="mt-3 space-y-2 text-[14px] leading-7 text-[#48506b]">
                {detail.overview.exampleResponse.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#6677a8]">
                Follow-up Questions
              </p>
              <ol className="mt-3 space-y-2 text-[14px] leading-7 text-[#48506b]">
                {detail.overview.followUps.map((question, index) => (
                  <li key={question}>
                    {index + 1}. {question}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </article>

      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Benchmark Scores
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {detail.overview.benchmarks.map((benchmark) => (
            <div
              key={benchmark.id}
              className="rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-5 text-center"
            >
              <p className="text-[28px] font-semibold tracking-[-0.04em] text-[#26201c]">
                {benchmark.value}
              </p>
              <p className="mt-2 text-[12px] text-[#93877b]">{benchmark.label}</p>
            </div>
          ))}
        </div>
      </article>
    </div>
  );

  const renderHowToUse = (): JSX.Element => (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Summary
        </p>
        <p className="mt-3 text-[15px] leading-8 text-[#5c5148]">
          {detail.howToUse.summary}
        </p>
      </article>
      <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Steps
          </p>
          <div className="mt-4 space-y-3">
            {detail.howToUse.steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-3 rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff0e4] text-[13px] font-semibold text-[#d27335]">
                  {index + 1}
                </div>
                <p className="text-[14px] leading-7 text-[#4a4038]">{step}</p>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Checklist
          </p>
          <div className="mt-4 space-y-3">
            {detail.howToUse.checklist.map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-4 text-[14px] leading-7 text-[#4a4038]"
              >
                {item}
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );

  const renderPricing = (): JSX.Element => (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Input", value: detail.pricing.input },
          { label: "Output", value: detail.pricing.output },
          { label: "Billing", value: detail.pricing.billing },
          { label: "Best Fit", value: detail.pricing.enterprise }
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
              {item.label}
            </p>
            <p className="mt-3 text-[18px] font-semibold leading-7 text-[#2d241d]">
              {item.value}
            </p>
          </article>
        ))}
      </div>
      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Pricing Notes
        </p>
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {detail.pricing.notes.map((note) => (
            <div
              key={note}
              className="rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-4 text-[14px] leading-7 text-[#4a4038]"
            >
              {note}
            </div>
          ))}
        </div>
      </article>
    </div>
  );

  const renderPromptGuide = (): JSX.Element => (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Summary
        </p>
        <p className="mt-3 text-[15px] leading-8 text-[#5c5148]">
          {detail.promptGuide.summary}
        </p>
      </article>
      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Tips
          </p>
          <ul className="mt-4 space-y-3">
            {detail.promptGuide.tips.map((tip) => (
              <li
                key={tip}
                className="rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-4 text-[14px] leading-7 text-[#4a4038]"
              >
                {tip}
              </li>
            ))}
          </ul>
        </article>
        <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Starter Prompt
          </p>
          <div className="mt-4 rounded-[20px] border border-[#e7dbcf] bg-white px-4 py-4 text-[14px] leading-7 text-[#4a4038]">
            {detail.promptGuide.starterPrompt}
          </div>
          <p className="mt-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Examples
          </p>
          <div className="mt-3 space-y-3">
            {detail.promptGuide.examples.map((example) => (
              <div
                key={example}
                className="rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-4 text-[14px] leading-7 text-[#4a4038]"
              >
                {example}
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );

  const renderAgentCreation = (): JSX.Element => (
    <div className="space-y-5">
      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Summary
        </p>
        <p className="mt-3 text-[15px] leading-8 text-[#5c5148]">
          {detail.agentCreation.summary}
        </p>
      </article>
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
            Build Steps
          </p>
          <div className="mt-4 space-y-3">
            {detail.agentCreation.steps.map((step, index) => (
              <div
                key={step}
                className="flex gap-3 rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-4"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#eef9f3] text-[13px] font-semibold text-[#2d9566]">
                  {index + 1}
                </div>
                <p className="text-[14px] leading-7 text-[#4a4038]">{step}</p>
              </div>
            ))}
          </div>
        </article>
        <div className="space-y-4">
          <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
              Recommended Tools
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.agentCreation.recommendedTools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-[#d9eadf] bg-white px-4 py-2 text-[13px] text-[#3b6753]"
                >
                  {tool}
                </span>
              ))}
            </div>
          </article>
          <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
              Deployment Notes
            </p>
            <div className="mt-4 space-y-3">
              {detail.agentCreation.deploymentNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[18px] border border-[#e7dbcf] bg-white px-4 py-4 text-[14px] leading-7 text-[#4a4038]"
                >
                  {note}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </div>
  );

  const renderReviews = (): JSX.Element => (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Average rating", value: detail.averageRating.toFixed(1) },
          { label: "Reviews", value: `${detail.reviews.length}` },
          { label: "Provider", value: detail.provider },
          { label: "Price", value: detail.pricePerMillion }
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5"
          >
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
              {item.label}
            </p>
            <p className="mt-3 text-[18px] font-semibold leading-7 text-[#2d241d]">
              {item.value}
            </p>
          </article>
        ))}
      </div>
      <article className="rounded-[24px] border border-[#e5d9cd] bg-[#faf6f0] p-5">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#a39384]">
          Verified Reviews
        </p>
        <div className="mt-4 space-y-3">
          {detail.reviews.length > 0 ? (
            detail.reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-[20px] border border-[#e7dbcf] bg-white px-5 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold text-[#2d241d]">
                      {review.authorName}
                    </p>
                    <p className="mt-1 text-[12px] text-[#97897d]">
                      {review.verified ? "Verified reviewer" : "Reviewer"}
                    </p>
                  </div>
                  <span className="rounded-full border border-[#f2dfd3] bg-[#fff6f0] px-3 py-1 text-[12px] font-semibold text-[#ce7843]">
                    {review.rating.toFixed(1)} / 5
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-7 text-[#4a4038]">
                  {review.comment}
                </p>
              </div>
            ))
          ) : (
            <div className="rounded-[20px] border border-dashed border-[#decfbe] bg-white px-5 py-10 text-center text-[14px] text-[#8a7d72]">
              No reviews available from backend for this model yet.
            </div>
          )}
        </div>
      </article>
    </div>
  );

  const content =
    activeTab === "overview"
      ? renderOverview()
      : activeTab === "howToUse"
        ? renderHowToUse()
        : activeTab === "pricing"
          ? renderPricing()
          : activeTab === "promptGuide"
            ? renderPromptGuide()
            : activeTab === "agentCreation"
              ? renderAgentCreation()
              : renderReviews();

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-[rgba(74,55,34,0.26)] px-4 py-6 backdrop-blur-[2px] sm:px-6">
      <section className="flex max-h-[90vh] w-full max-w-[1120px] flex-col overflow-hidden rounded-[32px] border border-[#e4d8cb] bg-white shadow-[0_30px_80px_rgba(61,45,30,0.2)]">
        <div className="flex items-start justify-between border-b border-[#eee3d7] px-6 py-5 sm:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef2ff] text-[22px] font-semibold text-[#7e6bf1]">
              {detail.provider.slice(0, 1)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[34px] font-semibold tracking-[-0.04em] text-[#221d18]">
                  {detail.name}
                </h3>
                {detail.badge ? (
                  <span className="rounded-full bg-[#eef9f4] px-3 py-1 text-[11px] font-semibold text-[#2d9566]">
                    {detail.badge}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[15px] text-[#8a7f73]">{detail.subtitle}</p>
            </div>
          </div>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3eee8] text-[20px] text-[#877b70] transition hover:bg-[#ece4da]"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <div className="border-b border-[#eee3d7] px-6 py-3 sm:px-7">
          <div className="flex flex-wrap gap-3 text-[13px] text-[#5c534b]">
            {detail.tabs.map((tab) => (
              <button
                key={tab.id}
                className={`rounded-full border px-4 py-2 transition ${
                  activeTab === tab.id
                    ? badgeClasses[tab.id]
                    : "border-transparent bg-transparent text-[#6e6258] hover:border-[#eadccc] hover:bg-[#fcfaf7]"
                }`}
                onClick={() => setActiveTab(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-7 sm:py-6">
          {content}
        </div>
      </section>
    </div>
  );
};
