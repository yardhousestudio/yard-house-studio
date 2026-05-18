type Props = {
  brand: string;
  tagline: string;
  location: string;
};

export function SiteFooter({ brand, tagline, location }: Props) {
  return (
    <footer className="bg-frame">
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="font-brand italic text-[1.125rem] text-ink">{brand}</p>
        <div className="flex flex-col md:items-end gap-1">
          <p className="font-body text-small text-ink-secondary">{tagline}</p>
          <p className="font-body text-small text-ink-secondary">{location}</p>
        </div>
      </div>
    </footer>
  );
}
