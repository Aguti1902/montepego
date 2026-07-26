"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { ResolvedMedia } from "@/lib/db/types";
import { cn } from "@/lib/utils";

type PropertyGalleryProps = {
  media: ResolvedMedia[];
  title: string;
};

export function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const photos = media.filter((m) => m.kind === "photo");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const current = photos[index] ?? photos[0];

  const go = useCallback(
    (delta: number) => {
      if (photos.length === 0) return;
      setIndex((prev) => (prev + delta + photos.length) % photos.length);
    },
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  if (!current) {
    return <div className="aspect-[16/9] bg-muted" />;
  }

  return (
    <>
      <div className="relative aspect-[16/9] overflow-hidden bg-muted">
        <button
          type="button"
          className="absolute inset-0"
          onClick={() => setOpen(true)}
          aria-label={title}
        >
          <Image
            src={current.storagePath}
            alt={current.alt || title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </button>
        {photos.length > 1 ? (
          <div className="absolute bottom-3 left-3 flex gap-2">
            {photos.slice(0, 6).map((photo, i) => (
              <button
                key={photo.id}
                type="button"
                className={cn(
                  "h-2 w-2 rounded-full bg-white/50",
                  i === index && "bg-white",
                )}
                onClick={() => setIndex(i)}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            className="absolute right-4 top-4 text-white"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
          <button
            type="button"
            className="absolute left-4 text-white"
            onClick={() => go(-1)}
          >
            ←
          </button>
          <div className="relative h-[80vh] w-full max-w-6xl">
            <Image
              src={current.storagePath}
              alt={current.alt || title}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
          <button
            type="button"
            className="absolute right-4 text-white"
            onClick={() => go(1)}
          >
            →
          </button>
        </div>
      ) : null}
    </>
  );
}
