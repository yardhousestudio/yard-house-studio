type ContactItem = {
  label: string;
  value: string;
  type: "email" | "phone" | "text";
};

type Props = {
  anchorId?: string;
  label: string;
  title: string;
  subtitle: string;
  anchor: string;
  items: ContactItem[];
};

function hrefFor(item: ContactItem): string | undefined {
  if (item.type === "email") return `mailto:${item.value}`;
  if (item.type === "phone") return `tel:${item.value.replace(/\s+/g, "")}`;
  return undefined;
}

export function CenteredContact({
  anchorId,
  label,
  title,
  subtitle,
  items,
}: Props) {
  return (
    <section
      id={anchorId}
      className="bg-page py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16 text-center">
        <p className="font-body text-label uppercase tracking-[0.05em] font-medium text-ink-secondary">
          {label}
        </p>
        <h2 className="font-display text-section text-ink mt-4">{title}</h2>
        <p className="font-body text-subtitle text-ink-secondary max-w-[640px] mx-auto mt-4 leading-relaxed">
          {subtitle}
        </p>
        <ul className="flex flex-col gap-3 mt-12">
          {items.map((item, i) => {
            const href = hrefFor(item);
            return (
              <li key={i} className="font-body text-body text-ink">
                <span className="text-ink-secondary">{item.label}: </span>
                {href ? (
                  <a
                    href={href}
                    className="text-ink hover:underline underline-offset-4"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span>{item.value}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
