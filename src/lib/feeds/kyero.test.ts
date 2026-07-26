import { describe, expect, it } from "vitest";
import { buildKyeroFeed, validateKyeroXml } from "./kyero";
import { seedToResolved } from "@/lib/db/mappers";
import { seedProperties } from "@/lib/db/seed-data";

describe("kyero feed", () => {
  it("genera XML válido con propiedades semilla", () => {
    const properties = seedProperties
      .filter((p) => p.status === "available")
      .map((p) => seedToResolved(p, "en"));
    const xml = buildKyeroFeed(properties, "https://montepegolife.com");
    const validation = validateKyeroXml(xml);
    expect(validation.ok).toBe(true);
    expect(xml).toContain("<ref>1505</ref>");
  });
});
