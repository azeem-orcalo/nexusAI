type PlaceholderAction = {
  id: string;
  label: string;
};

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions: PlaceholderAction[];
};

export const PlaceholderPage = ({
  eyebrow,
  title,
  description,
  actions
}: PlaceholderPageProps): JSX.Element => {
  return (
    <section className="min-h-[calc(100vh-53px)] bg-[#f7f3ee] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[980px] rounded-[28px] border border-[#e4d8ca] bg-white p-6 shadow-[0_18px_50px_rgba(76,53,33,0.08)]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#cb7640]">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-[36px] font-semibold tracking-[-0.04em] text-[#211c17]">
          {title}
        </h1>
        <p className="mt-3 max-w-[720px] text-[13px] leading-6 text-[#776d63]">
          {description}
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => (
            <article
              key={action.id}
              className="rounded-[16px] border border-[#e8ddd0] bg-[#fbf8f3] px-4 py-4"
            >
              <p className="text-[12px] font-medium text-[#3d342d]">
                {action.label}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
