import type { EstimateRequest, EstimateResult, HouseFeatures, MarketStats, Property, PropertyFilter } from "./types";

const ESTIMATOR_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_ESTIMATOR_URL ?? "http://localhost:8001"
    : process.env.NEXT_PUBLIC_ESTIMATOR_URL ?? "http://localhost:8001";

const MARKET_URL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_MARKET_URL ?? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_MARKET_URL ?? "http://localhost:8080";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Property Estimator API (Python / port 8001) ─────────────────────────────

export const estimatorApi = {
  async estimate(data: EstimateRequest): Promise<EstimateResult> {
    const res = await fetch(`${ESTIMATOR_URL}/estimate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse<EstimateResult>(res);
  },

  async getHistory(): Promise<EstimateResult[]> {
    const res = await fetch(`${ESTIMATOR_URL}/history`, { cache: "no-store" });
    return handleResponse<EstimateResult[]>(res);
  },

  async deleteItem(id: string): Promise<void> {
    await fetch(`${ESTIMATOR_URL}/history/${id}`, { method: "DELETE" });
  },

  async clearHistory(): Promise<void> {
    await fetch(`${ESTIMATOR_URL}/history`, { method: "DELETE" });
  },
};

// ── Market Analysis API (Java / port 8080) ───────────────────────────────────

export const marketApi = {
  async getStats(): Promise<MarketStats> {
    const res = await fetch(`${MARKET_URL}/api/market/stats`, { cache: "no-store" });
    return handleResponse<MarketStats>(res);
  },

  async getProperties(filters?: PropertyFilter): Promise<Property[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== "") params.append(k, String(v));
      });
    }
    const res = await fetch(`${MARKET_URL}/api/market/properties?${params}`, {
      cache: "no-store",
    });
    return handleResponse<Property[]>(res);
  },

  async whatIf(features: HouseFeatures): Promise<{ predicted_price: number }> {
    const res = await fetch(`${MARKET_URL}/api/market/what-if`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(features),
    });
    return handleResponse<{ predicted_price: number }>(res);
  },

  getExportUrl(): string {
    return `${MARKET_URL}/api/market/export/csv`;
  },
};
