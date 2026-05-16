type Props = {
  anchorId?: string;
  label: string;
  title: string;
  paragraphs: string[];
  anchor: string;
};

export function DarkTwoColumn({ anchorId, label, title, paragraphs }: Props) {
  return (
    <section
      id={anchorId}
      className="bg-dark py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
        <p className="font-body uppercase tracking-[0.05em] font-medium text-[length:var(--text-label)] text-on-dark/80">
          {label}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-8">
          <h2 className="font-display text-section text-on-dark leading-tight">
            {title}
          </h2>
          <div className="flex flex-col gap-8">
            {paragraphs.map((p, i) => (
              <p key={i} className="font-body text-body text-on-dark leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
