import { describe, expect, it } from "vitest";
import { applyOverrides } from "./apply-overrides";

describe("applyOverrides", () => {
  it("deja el valor base si no hay overrides", () => {
    const base = { price: 100000, builtArea: 120 };
    expect(applyOverrides(base, [])).toEqual(base);
  });

  it("el override manda sobre el valor del CRM", () => {
    const base = { price: 100000, builtArea: 0, plotArea: 500 };
    const result = applyOverrides(base, [
      { field: "builtArea", value: 170 },
      { field: "price", value: 495000 },
    ]);
    expect(result.builtArea).toBe(170);
    expect(result.price).toBe(495000);
    expect(result.plotArea).toBe(500);
  });

  it("el último override del mismo campo gana", () => {
    const base = { builtArea: 0 };
    const result = applyOverrides(base, [
      { field: "builtArea", value: 100 },
      { field: "builtArea", value: 170 },
    ]);
    expect(result.builtArea).toBe(170);
  });
});
