type Item = {
  number: string;
  title: string;
  description: string;
};

type Props = {
  anchorId?: string;
  label: string;
  title: string;
  anchor: string;
  items: Item[];
};

export function ServicesThreeColumn({ anchorId, label, title, items }: Props) {
  return (
    <section
      id={anchorId}
      className="bg-surface py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
        <p className="font-body text-label uppercase tracking-[0.05em] font-medium text-label">
          {label}
        </p>
        <h2 className="font-display text-section text-ink mt-4 max-w-[720px]">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-10 mt-16">
          {items.map((item) => (
            <div key={item.number} className="border-t border-ink pt-6">
              <p className="font-display text-card-number text-muted leading-none">
                {item.number}
              </p>
              <h3 className="font-display text-card-title text-ink mt-5">
                {item.title}
              </h3>
              <p className="font-body text-small text-ink-2 leading-relaxed mt-3">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
