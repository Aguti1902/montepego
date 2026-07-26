"use client";

import { useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";

type PropertyMapProps = {
  latitude: string | null;
  longitude: string | null;
  precision: "exact" | "approximate" | "hidden";
  label: string;
};

export function PropertyMap({
  latitude,
  longitude,
  precision,
  label,
}: PropertyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (precision === "hidden" || !latitude || !longitude || !containerRef.current) {
      return;
    }

    let map: { remove: () => void } | null = null;
    let cancelled = false;

    async function init() {
      const maplibregl = await import("maplibre-gl");
      await import("maplibre-gl/dist/maplibre-gl.css");
      if (cancelled || !containerRef.current) return;

      const lat = Number(latitude);
      const lng = Number(longitude);
      const zoom = precision === "exact" ? 14 : 12;

      map = new maplibregl.Map({
        container: containerRef.current,
        style: siteConfig.mapTilesStyle,
        center: [lng, lat],
        zoom,
        interactive: true,
      });

      if (precision === "exact") {
        new maplibregl.Marker({ color: "#094D88" })
          .setLngLat([lng, lat])
          .setPopup(new maplibregl.Popup().setText(label))
          .addTo(map as never);
      } else {
        // approximate: circle-like marker without exact pin precision
        new maplibregl.Marker({ color: "#6E97B8", scale: 0.8 })
          .setLngLat([lng, lat])
          .addTo(map as never);
      }
    }

    void init();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [latitude, longitude, precision, label]);

  if (precision === "hidden" || !latitude || !longitude) {
    return (
      <p className="text-sm text-muted-foreground">
        Location shared on request.
      </p>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-72 w-full border border-border"
      role="img"
      aria-label={label}
    />
  );
}
