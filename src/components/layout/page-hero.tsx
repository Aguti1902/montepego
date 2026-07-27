import Image from "next/image";

type PageHeroProps = {
  title: string;
  intro: string;
  image: string;
  eyebrow?: string;
};

export function PageHero({ title, intro, image, eyebrow }: PageHeroProps) {
  return (
    <section className="relative isolate min-h-[42vh] overflow-hidden md:min-h-[48vh]">
      <Image
        src={image}
        alt=""
        fill
        priority
        className="animate-hero-zoom object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/35 to-ink/15" />
      <div className="relative mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-28 md:min-h-[48vh]">
        {eyebrow ? (
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.18em] text-sun-clay">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="animate-fade-up font-display mt-2 max-w-3xl text-4xl text-white md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="animate-fade-up-delay mt-4 max-w-2xl text-base text-white/90 md:text-lg">
          {intro}
        </p>
      </div>
    </section>
  );
}
