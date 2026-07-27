import { seedProperties } from "@/lib/db/seed-data";
import type { CrmAdapter, LeadPayload, RawCrmProperty } from "@/lib/crm/types";

function toRaw(seed: (typeof seedProperties)[number]): RawCrmProperty {
  const dirty =
    seed.reference === "1456"
      ? {
          builtArea: "https://example.com/broken-area",
          plotArea: 0,
          photos: [],
        }
      : {
          builtArea: seed.builtArea,
          plotArea: seed.plotArea,
          photos: (seed.images?.length ? seed.images : [seed.coverPlaceholder]).map(
            (url, index) => ({
              url,
              sortOrder: index,
              isCover: index === 0,
            }),
          ),
        };

  return {
    crmId: `mock-${seed.reference}`,
    reference: seed.reference,
    status: seed.status,
    type: seed.type,
    price: seed.price,
    bedrooms: seed.bedrooms,
    bathrooms: seed.bathrooms,
    ...dirty,
    features: seed.features,
    title: seed.titles.en,
    description: seed.descriptions.en,
    updatedAt: new Date().toISOString(),
    raw: { source: "mock", reference: seed.reference },
  };
}

export const mockCrmAdapter: CrmAdapter = {
  name: "mock",
  async fetchProperties() {
    return seedProperties.map(toRaw);
  },
  async fetchProperty(crmId) {
    const ref = crmId.replace(/^mock-/, "");
    const seed = seedProperties.find((p) => p.reference === ref);
    return seed ? toRaw(seed) : null;
  },
  async pushLead(lead: LeadPayload) {
    return { crmId: `mock-lead-${lead.email}`, mocked: true };
  },
};
