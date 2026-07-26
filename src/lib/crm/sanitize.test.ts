import { describe, expect, it } from "vitest";
import { parseNumericField, sanitizeCrmProperty } from "./sanitize";
import type { RawCrmProperty } from "./types";

describe("parseNumericField", () => {
  it("anula URLs en campos numéricos", () => {
    const result = parseNumericField(
      "https://old-site.com/area",
      "builtArea",
      "1456",
    );
    expect(result.value).toBeNull();
    expect(result.warning).toMatch(/URL/);
  });

  it("anula built_area = 0", () => {
    const result = parseNumericField(0, "builtArea", "1456");
    expect(result.value).toBeNull();
    expect(result.warning).toMatch(/= 0/);
  });
});

describe("sanitizeCrmProperty", () => {
  const base: RawCrmProperty = {
    crmId: "mock-1505",
    reference: "1505",
    status: "available",
    type: "villa",
    price: 495000,
    bedrooms: 3,
    bathrooms: 2,
    builtArea: 170,
    plotArea: 1600,
    title: "Villa",
    description: "Nice",
    photos: [{ url: "/photo.jpg", isCover: true }],
  };

  it("importa una propiedad limpia como publicable", () => {
    const result = sanitizeCrmProperty(base);
    expect(result.publishable).toBe(true);
    expect(result.status).toBe("available");
    expect(result.warnings).toHaveLength(0);
  });

  it("manda a draft si price es 0", () => {
    const result = sanitizeCrmProperty({ ...base, price: 0 });
    expect(result.status).toBe("draft");
    expect(result.publishable).toBe(false);
    expect(result.warnings.some((w) => w.includes("price"))).toBe(true);
  });

  it("manda a draft si faltan fotos", () => {
    const result = sanitizeCrmProperty({ ...base, photos: [] });
    expect(result.status).toBe("draft");
    expect(result.publishable).toBe(false);
  });

  it("caso 1456: área URL/0 no publica basura", () => {
    const result = sanitizeCrmProperty({
      ...base,
      reference: "1456",
      crmId: "mock-1456",
      builtArea: "https://example.com/x",
      plotArea: 0,
      photos: [],
    });
    expect(result.builtArea).toBeNull();
    expect(result.plotArea).toBeNull();
    expect(result.status).toBe("draft");
    expect(result.warnings.length).toBeGreaterThan(0);
  });
});
