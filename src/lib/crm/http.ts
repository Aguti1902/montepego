import { getCrmConfig } from "./config";
import { CrmApiError } from "./types";

type CrmHttpOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  /** Sobrescribe timeout de config */
  timeoutMs?: number;
  /** Sobrescribe reintentos de config */
  maxRetries?: number;
};

function buildUrl(baseUrl: string, path: string, query?: CrmHttpOptions["query"]) {
  if (!baseUrl) {
    throw new CrmApiError("CRM_API_URL no configurada", {
      code: "auth",
      retryable: false,
    });
  }

  const url = new URL(
    path.startsWith("http")
      ? path
      : `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`,
  );

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Cliente HTTP server-only para adaptadores CRM.
 * No registra apiKey ni Authorization en logs.
 */
export async function crmFetch<T = unknown>(
  options: CrmHttpOptions,
): Promise<T> {
  const config = getCrmConfig();

  if (!config.apiKey) {
    throw new CrmApiError("CRM_API_KEY / CRM_API_TOKEN no configurada", {
      code: "auth",
      retryable: false,
    });
  }

  const url = buildUrl(config.baseUrl, options.path, options.query);
  const maxRetries = options.maxRetries ?? config.maxRetries;
  const timeoutMs = options.timeoutMs ?? config.timeoutMs;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method: options.method ?? "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
          ...options.headers,
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timer);

      if (response.status === 401 || response.status === 403) {
        throw new CrmApiError(`CRM auth fallida (${response.status})`, {
          code: "auth",
          status: response.status,
          retryable: false,
        });
      }

      if (response.status === 429 || response.status >= 500) {
        const err = new CrmApiError(`CRM HTTP ${response.status}`, {
          code: "http",
          status: response.status,
          retryable: true,
        });
        if (attempt < maxRetries) {
          lastError = err;
          await sleep(250 * (attempt + 1));
          continue;
        }
        throw err;
      }

      if (!response.ok) {
        throw new CrmApiError(`CRM HTTP ${response.status}`, {
          code: "http",
          status: response.status,
          retryable: false,
        });
      }

      if (response.status === 204) {
        return undefined as T;
      }

      const text = await response.text();
      if (!text) return undefined as T;

      try {
        return JSON.parse(text) as T;
      } catch (cause) {
        throw new CrmApiError("Respuesta CRM no es JSON válido", {
          code: "parse",
          retryable: false,
          cause,
        });
      }
    } catch (error) {
      clearTimeout(timer);

      if (error instanceof CrmApiError) {
        if (error.retryable && attempt < maxRetries) {
          lastError = error;
          await sleep(250 * (attempt + 1));
          continue;
        }
        throw error;
      }

      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("abort"))
      ) {
        const timeoutError = new CrmApiError("Timeout al llamar al CRM", {
          code: "timeout",
          retryable: true,
          cause: error,
        });
        if (attempt < maxRetries) {
          lastError = timeoutError;
          await sleep(250 * (attempt + 1));
          continue;
        }
        throw timeoutError;
      }

      const networkError = new CrmApiError("Error de red al llamar al CRM", {
        code: "network",
        retryable: true,
        cause: error,
      });
      if (attempt < maxRetries) {
        lastError = networkError;
        await sleep(250 * (attempt + 1));
        continue;
      }
      throw networkError;
    }
  }

  throw lastError instanceof CrmApiError
    ? lastError
    : new CrmApiError("Fallo desconocido en CRM HTTP", {
        code: "network",
        retryable: false,
        cause: lastError,
      });
}
