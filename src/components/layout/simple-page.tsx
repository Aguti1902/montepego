import { setRequestLocale } from "next-intl/server";

type SimplePageProps = {
  locale: string;
  title: string;
  intro: string;
  children?: React.ReactNode;
};

export function SimplePage({ locale, title, intro, children }: SimplePageProps) {
  setRequestLocale(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-display text-4xl text-ink">{title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
      {children ? <div className="mt-8 space-y-4 text-foreground">{children}</div> : null}
    </div>
  );
}
