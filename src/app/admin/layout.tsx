import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/admin-nav";
import { ChatWidget } from "@/components/ai/chat-widget";

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
    <div className="admin-shell min-h-screen text-ink">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col bg-gradient-to-b from-[#1e3a5f] to-[#2c558a] text-white md:flex">
          <div className="border-b border-white/10 px-5 py-6">
            <p className="font-display text-2xl leading-none">MontePego</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
              Life · Panel
            </p>
          </div>
          <div className="flex-1 overflow-y-auto">
            <AdminNav />
          </div>
          <div className="border-t border-white/10 p-4 text-[11px] text-white/45">
            MontePego Life
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-black/5 bg-white/70 px-4 py-3 backdrop-blur-xl md:px-6 md:py-4">
            <div className="md:hidden">
              <p className="font-display text-xl text-sea-deep">Panel</p>
              <div className="mt-2 overflow-x-auto">
                <AdminNav />
              </div>
            </div>
            <p className="hidden text-sm text-muted-foreground md:block">
              Panel de la agencia
            </p>
          </header>
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
      <ChatWidget context="admin" locale="es" />
    </div>
  );
}
