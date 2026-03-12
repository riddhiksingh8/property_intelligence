"use client";

import { useState, useEffect, useCallback } from "react";
import StatsCards from "@/components/app2/StatsCards";
import PriceCharts from "@/components/app2/PriceCharts";
import PropertyTable from "@/components/app2/PropertyTable";
import ExportButtons from "@/components/app2/ExportButtons";
import { marketApi } from "@/lib/api";
import type { MarketStats, Property, PropertyFilter } from "@/lib/types";
import { AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function App2Page() {
  const [stats, setStats] = useState<MarketStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    const s = await marketApi.getStats();
    setStats(s);
  };

  const fetchProperties = useCallback(async (filters?: PropertyFilter) => {
    const props = await marketApi.getProperties(filters);
    setProperties(props);
  }, []);

  useEffect(() => {
    Promise.all([fetchStats(), fetchProperties()])
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load data. Is the Java backend running?"))
      .finally(() => setLoading(false));
  }, [fetchProperties]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-slate-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading market data…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Property Market Analysis</h1>
          <p className="text-slate-500 text-sm mt-1">
            Explore the housing dataset, analyse market segments, and run what-if scenarios.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButtons />
          <Link
            href="/app2/what-if"
            className="text-sm bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            What-If Analysis →
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && <StatsCards stats={stats} />}

      {/* Charts */}
      {stats && <PriceCharts stats={stats} />}

      {/* Property table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-700 mb-5">Property Dataset</h2>
        <PropertyTable
          properties={properties}
          onFilterChange={async (filters) => {
            try {
              await fetchProperties(filters);
            } catch {
              // silently ignore filter errors
            }
          }}
        />
      </div>
    </div>
  );
}
