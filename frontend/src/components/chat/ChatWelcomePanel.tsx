import type { ChatPromptOption } from "../../data/mock/chatHub";

type ChatWelcomePanelProps = {
  onPromptSelect: (value: string) => void;
  promptOptions: ChatPromptOption[];
};

export const ChatWelcomePanel = ({
  onPromptSelect,
  promptOptions
}: ChatWelcomePanelProps): JSX.Element => {
  return (
    <section className="mx-auto mt-4 w-full max-w-[376px] rounded-[24px] border border-[#e6ddd2] bg-white p-5 shadow-[0_18px_50px_rgba(91,70,44,0.12)]">
      <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-[#ecdccd] bg-[#fbf4ec] text-[11px] text-[#b97a42]">
        *
      </div>

      <h2 className="mt-4 text-center text-[15px] font-semibold text-[#191512]">
        Welcome! I&apos;m here to help.
      </h2>
      <p className="mx-auto mt-2 max-w-[260px] text-center text-[10px] leading-5 text-[#7f756c]">
        No tech background needed. Tell me what you&apos;d like to achieve and I
        will help you discover what&apos;s possible, step by step.
      </p>

      <div className="mt-4 rounded-[16px] border border-[#e5dbcf] bg-[#f7f2eb] p-3">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.03em] text-[#d47b3f]">
          What would you like to do today?
        </p>

        <div className="grid grid-cols-2 gap-2">
          {promptOptions.map((option) => (
            <button
              key={option.id}
              className="rounded-[12px] border border-[#ded4c9] bg-white px-3 py-4 text-center shadow-[0_6px_14px_rgba(71,49,28,0.04)]"
              onClick={() => onPromptSelect(option.title)}
              type="button"
            >
              <div className="text-[18px]">{option.icon}</div>
              <p className="mt-2 text-[11px] font-semibold text-[#28211d]">
                {option.title}
              </p>
              <p className="mt-1 text-[9px] leading-4 text-[#84796d]">
                {option.subtitle}
              </p>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-center text-[10px] text-[#9b9084]">
        Or type anything below. There are no wrong answers.
      </p>
    </section>
  );
};
