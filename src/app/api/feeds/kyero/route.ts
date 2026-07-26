import { NextResponse } from "next/server";
import { listProperties } from "@/lib/db/queries/properties";
import { buildKyeroFeed, validateKyeroXml } from "@/lib/feeds/kyero";

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://montepegolife.com";
  const { items } = await listProperties({
    locale: "en",
    status: ["available", "reserved"],
    pageSize: 200,
  });
  const xml = buildKyeroFeed(items, siteUrl);
  const validation = validateKyeroXml(xml);

  if (!validation.ok) {
    return NextResponse.json(
      { error: "Feed inválido", details: validation.errors },
      { status: 500 },
    );
  }

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=1800, stale-while-revalidate",
    },
  });
}
