"use client";

import Image from "next/image";
import { useState } from "react";
import { Star } from "lucide-react";
import type { DemoMediaItem } from "@/lib/db/admin-demo-data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  items: DemoMediaItem[];
  propertyId?: string;
};

export function MediaManager({ items, propertyId }: Props) {
  const filtered = propertyId
    ? items.filter((m) => m.propertyId === propertyId)
    : items;
  const [order, setOrder] = useState(filtered);

  function move(id: string, delta: number) {
    setOrder((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx < 0) return prev;
      const next = [...prev];
      const target = idx + delta;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next.map((m, i) => ({ ...m, sortOrder: i }));
    });
  }

  function setCover(id: string) {
    setOrder((prev) =>
      prev.map((m) => ({ ...m, isCover: m.id === id })),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {order.length} fotos · arrastra lógica simulada con botones · IA
          sugiere portada y orden
        </p>
        <Button type="button" size="sm" variant="outline">
          Subir fotos
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {order.map((item, index) => (
          <article
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl bg-white ring-1 ring-black/5",
              item.isCover && "ring-2 ring-sea-deep",
            )}
          >
            <div className="relative aspect-[4/3] bg-muted">
              <Image
                src={item.url}
                alt={item.altEs}
                fill
                className="object-cover"
                sizes="(max-width:768px) 50vw, 33vw"
              />
              {item.isCover ? (
                <span className="absolute left-2 top-2 rounded-full bg-sea-deep px-2 py-0.5 text-[10px] font-medium text-white">
                  Portada
                </span>
              ) : null}
              {item.aiQualityScore != null ? (
                <span className="absolute right-2 top-2 flex items-center gap-0.5 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                  <Star className="h-3 w-3 fill-sun-clay text-sun-clay" />
                  {item.aiQualityScore.toFixed(1)}
                </span>
              ) : null}
            </div>
            <div className="space-y-2 p-3 text-xs">
              <p className="font-medium text-ink">
                Ref. {item.reference}
                {item.aiRoomType ? ` · ${item.aiRoomType}` : ""}
              </p>
              <p className="text-muted-foreground line-clamp-1">{item.altEs}</p>
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => move(item.id, -1)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => move(item.id, 1)}
                  disabled={index === order.length - 1}
                >
                  ↓
                </Button>
                {!item.isCover ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setCover(item.id)}
                  >
                    Portada
                  </Button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
