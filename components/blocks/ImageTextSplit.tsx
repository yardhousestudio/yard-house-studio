import Image from "next/image";

type Props = {
  anchorId?: string;
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  label: string;
  title: string;
  body: string;
};

export function ImageTextSplit({
  anchorId,
  image,
  imageAlt,
  imagePosition,
  label,
  title,
  body,
}: Props) {
  const imageOnLeft = imagePosition === "left";
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <section
      id={anchorId}
      className="bg-page py-[var(--space-section-y)]"
    >
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div
            className={`relative w-full aspect-[5/4] ${
              imageOnLeft ? "md:order-1" : "md:order-2"
            }`}
          >
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div
            className={`flex flex-col gap-4 ${
              imageOnLeft ? "md:order-2" : "md:order-1"
            }`}
          >
            <p className="font-body text-label uppercase tracking-[0.05em] font-medium text-ink-secondary">
              {label}
            </p>
            <h2 className="font-display text-section text-ink">{title}</h2>
            <div className="flex flex-col gap-4 mt-2">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-body text-body text-ink-secondary leading-relaxed"
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
