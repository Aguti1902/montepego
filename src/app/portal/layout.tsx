import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portal — MontePego Life",
  robots: { index: false, follow: false },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-limestone text-ink">
      <header className="border-b border-border bg-card px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <p className="font-display text-xl text-sea-deep">Portal MontePego</p>
          <nav className="flex gap-4 text-sm">
            <Link href="/portal/owner" className="hover:text-sea-deep">
              Propietario
            </Link>
            <Link href="/portal/resident" className="hover:text-sea-deep">
              Residente
            </Link>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-8">{children}</div>
    </div>
  );
}
