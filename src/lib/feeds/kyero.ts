import type { ResolvedProperty } from "@/lib/db/types";

/**
 * Feed Kyero-compatible (XML). Validación estructural básica.
 * Docs: https://www.kyero.com/
 */
export function buildKyeroFeed(properties: ResolvedProperty[], siteUrl: string) {
  const items = properties
    .filter((p) => p.status === "available" || p.status === "reserved")
    .map((p) => {
      const url = `${siteUrl}/en/property/${p.slug}`;
      return `
  <property>
    <id>${escapeXml(p.reference)}</id>
    <date>${(p.publishedAt ?? new Date()).toISOString()}</date>
    <ref>${escapeXml(p.reference)}</ref>
    <price>${p.price}</price>
    <currency>EUR</currency>
    <price_freq>sale</price_freq>
    <part_ownership>0</part_ownership>
    <leasehold>0</leasehold>
    <new_build>0</new_build>
    <type>${escapeXml(p.type)}</type>
    <town>Monte Pego</town>
    <province>Alicante</province>
    <country>Spain</country>
    <location>
      <latitude>${p.latitude ?? ""}</latitude>
      <longitude>${p.longitude ?? ""}</longitude>
    </location>
    <beds>${p.bedrooms}</beds>
    <baths>${p.bathrooms}</baths>
    ${p.builtArea != null ? `<surface_area><built>${p.builtArea}</built></surface_area>` : ""}
    ${p.plotArea != null ? `<plot_area>${p.plotArea}</plot_area>` : ""}
    <url language="en">${escapeXml(url)}</url>
    <desc language="en"><![CDATA[${p.description}]]></desc>
    <features>
      ${p.features.map((f) => `<feature>${escapeXml(f)}</feature>`).join("\n      ")}
    </features>
    <images>
      ${(p.media.length ? p.media : [{ storagePath: p.coverUrl ?? "", id: "1", kind: "photo" as const, width: null, height: null, sortOrder: 0, alt: p.title, isCover: true, aiRoomType: null }])
        .filter((m) => m.kind === "photo" && m.storagePath)
        .map(
          (m, i) =>
            `<image id="${i + 1}"><url>${escapeXml(absoluteMedia(siteUrl, m.storagePath))}</url></image>`,
        )
        .join("\n      ")}
    </images>
  </property>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<kyero>
  <feed_version>3</feed_version>
${items}
</kyero>
`;
}

export function validateKyeroXml(xml: string): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!xml.includes("<kyero>")) errors.push("Falta nodo raíz kyero");
  if (!xml.includes("<feed_version>")) errors.push("Falta feed_version");
  if (!xml.includes("<property>")) errors.push("No hay propiedades");
  if (!xml.includes("<ref>")) errors.push("Falta ref en propiedades");
  if (!xml.includes("<price>")) errors.push("Falta price");
  return { ok: errors.length === 0, errors };
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function absoluteMedia(siteUrl: string, path: string) {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}
