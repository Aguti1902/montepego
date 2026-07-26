import { describe, expect, it } from "vitest";
import { mapPropertyWithOverrides } from "./mappers";

describe("mapPropertyWithOverrides", () => {
  const baseRow = {
    id: "11111111-1111-1111-1111-111111111111",
    crmId: "crm-1",
    reference: "1505",
    slug: "villa-1505",
    status: "available" as const,
    type: "villa" as const,
    price: 495000,
    priceVisible: true,
    bedrooms: 3,
    bathrooms: 2,
    builtArea: 0,
    plotArea: 1600,
    terraceArea: null,
    yearBuilt: null,
    energyRating: null,
    latitude: "38.84",
    longitude: "0.01",
    locationPrecision: "approximate" as const,
    features: ["pool", "sea_view"],
    elevation: 185,
    orientation: "South",
    viewRelation: "sea & mountain",
    isFeatured: true,
    publishedAt: new Date("2026-01-01"),
    soldAt: null,
  };

  it("aplica overrides sobre builtArea sucio del CRM", () => {
    const resolved = mapPropertyWithOverrides(
      baseRow,
      [{ field: "builtArea", value: 170 }],
      {
        title: "Renovated Villa",
        description: "Desc",
        seoTitle: null,
        seoDescription: null,
      },
      [],
    );

    expect(resolved.builtArea).toBe(170);
    expect(resolved.overriddenFields).toContain("builtArea");
    expect(resolved.price).toBe(495000);
  });
});
