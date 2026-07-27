import { seedProperties } from "@/lib/db/seed-data";
import { seedToResolved } from "@/lib/db/mappers";
import { demoMediaItems, type DemoMediaItem } from "@/lib/db/admin-demo-data";

export async function listAdminMedia(): Promise<DemoMediaItem[]> {
  const items: DemoMediaItem[] = [...demoMediaItems];

  for (const seed of seedProperties.slice(0, 12)) {
    const resolved = seedToResolved(seed, "en");
    const images = seed.images?.length ? seed.images : [seed.coverPlaceholder];
    images.slice(0, 4).forEach((url, index) => {
      if (items.some((m) => m.url === url)) return;
      items.push({
        id: `media-${seed.reference}-${index}`,
        propertyId: resolved.id,
        reference: seed.reference,
        title: resolved.title,
        url,
        sortOrder: index,
        isCover: index === 0,
        aiRoomType: index === 0 ? "facade" : null,
        aiQualityScore: index === 0 ? 8 + (index % 3) * 0.3 : null,
        altEs: `${resolved.title} — foto ${index + 1}`,
        altEn: `${resolved.title} — photo ${index + 1}`,
      });
    });
  }

  return items.sort((a, b) => a.reference.localeCompare(b.reference));
}

export async function listMediaForProperty(propertyId: string) {
  const all = await listAdminMedia();
  return all.filter((m) => m.propertyId === propertyId);
}
