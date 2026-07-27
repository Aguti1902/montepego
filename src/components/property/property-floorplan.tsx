import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { ResolvedMedia } from "@/lib/db/types";

type PropertyFloorplanProps = {
  media: ResolvedMedia[];
};

export async function PropertyFloorplan({ media }: PropertyFloorplanProps) {
  const t = await getTranslations("Property");
  const floorplans = media.filter((item) => item.kind === "floorplan");

  if (floorplans.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl">{t("floorplan")}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {floorplans.map((item) => (
          <figure
            key={item.id}
            className="overflow-hidden rounded-2xl bg-white/75 ring-1 ring-black/[0.04]"
          >
            <div className="relative aspect-[4/3] bg-white">
              <Image
                src={item.storagePath}
                alt={item.alt || t("floorplan")}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
