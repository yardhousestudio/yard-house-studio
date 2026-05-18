import Image from "next/image";

type Props = {
  anchorId?: string;
  image: string;
  imageAlt: string;
  headline: string;
  subtitle: string;
};

export function HeroImageText({ anchorId, image, imageAlt, headline, subtitle }: Props) {
  return (
    <section id={anchorId} className="bg-surface">
      <div className="relative w-full h-[420px] md:h-[560px]">
        <Image
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="mx-auto max-w-content px-6 md:px-8 lg:px-16">
        {/* White panel pulled up over the image's lower edge for layered depth. */}
        <div className="relative z-10 bg-page shadow-[0_0_60px_-10px_color-mix(in_srgb,var(--color-frame)_60%,transparent)] max-w-[880px] -mt-10 md:-mt-14 px-6 md:px-12 pt-12 md:pt-16 pb-10 md:pb-14">
          <h1 className="font-display text-hero text-ink leading-[1.05]">
            {headline}
          </h1>
          <p className="font-body text-subtitle text-ink-secondary max-w-[620px] mt-6 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
