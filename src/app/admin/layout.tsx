import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel — MontePego Life",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-limestone text-ink">
      <header className="border-b border-border bg-card px-6 py-4">
        <p className="font-display text-xl text-sea-deep">
          MontePego Life — Panel
        </p>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
