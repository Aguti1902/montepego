import { ImageResponse } from "next/og";
import { seedProperties } from "@/lib/db/seed-data";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const property = seedProperties.find((p) => p.slug === slug);

  const title = property?.titles.en ?? "MontePego Life";
  const reference = property?.reference ?? "";
  const price = property
    ? new Intl.NumberFormat("en", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }).format(property.price)
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 64,
          background: "linear-gradient(135deg, #094D88 0%, #4A5D46 100%)",
          color: "#EDE8DF",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.85 }}>MontePego Life</div>
        <div style={{ fontSize: 56, marginTop: 12, lineHeight: 1.1 }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            gap: 24,
            fontSize: 32,
            fontFamily: "sans-serif",
          }}
        >
          {reference ? <span>Ref. {reference}</span> : null}
          {price ? <span>{price}</span> : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
