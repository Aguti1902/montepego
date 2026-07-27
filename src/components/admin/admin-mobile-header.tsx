"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminNav } from "@/components/admin/admin-nav";

export function AdminMobileHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur-xl pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-xl text-sea-deep">MontePego</p>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Panel · Life
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sea-deep text-white"
            aria-label="Abrir menú"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/45 md:hidden"
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[min(288px,88vw)] flex-col bg-gradient-to-b from-[#1e3a5f] to-[#2c558a] text-white shadow-2xl md:hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
              <div>
                <p className="font-display text-2xl leading-none">MontePego</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/55">
                  Life · Panel
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              <AdminNav onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
