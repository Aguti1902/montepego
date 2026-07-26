import { afterEach, describe, expect, it, vi } from "vitest";
import { getCrmConfig, crmConfigIsLive } from "./config";
import { CrmApiError } from "./types";

describe("getCrmConfig", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("usa mock por defecto", () => {
    vi.stubEnv("CRM_ADAPTER", "");
    vi.stubEnv("CRM_API_URL", "");
    vi.stubEnv("CRM_API_KEY", "");
    const config = getCrmConfig();
    expect(config.adapter).toBe("mock");
    expect(crmConfigIsLive(config)).toBe(false);
  });

  it("marca live solo con adapter distinto de mock + url + key", () => {
    vi.stubEnv("CRM_ADAPTER", "ego");
    vi.stubEnv("CRM_API_URL", "https://api.example.com");
    vi.stubEnv("CRM_API_KEY", "secret");
    expect(crmConfigIsLive(getCrmConfig())).toBe(true);
  });
});

describe("CrmApiError", () => {
  it("expone code y retryable", () => {
    const error = new CrmApiError("timeout", {
      code: "timeout",
      retryable: true,
    });
    expect(error.name).toBe("CrmApiError");
    expect(error.code).toBe("timeout");
    expect(error.retryable).toBe(true);
  });
});
