"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { EstimateResult } from "@/lib/types";
import { TrendingUp } from "lucide-react";

// Dataset averages for visual context
const AVERAGES: Record<string, number> = {
  square_footage: 1718,
  bedrooms: 3.0,
  bathrooms: 1.84,
  year_built: 1997,
  lot_size: 7258,
  distance_to_city_center: 4.97,
  school_rating: 7.81,
};

const LABELS: Record<string, string> = {
  square_footage: "Sqft",
  bedrooms: "Beds",
  bathrooms: "Baths",
  year_built: "Year",
  lot_size: "Lot",
  distance_to_city_center: "Distance",
  school_rating: "School",
};

interface Props {
  result: EstimateResult;
}

export default function PredictionResult({ result }: Props) {
  // Normalise each feature as % of its average (capped 0–200 for display)
  const chartData = Object.entries(result.features).map(([key, val]) => {
    const avg = AVERAGES[key] ?? 1;
    const pct = Math.min(200, Math.round((Number(val) / avg) * 100));
    return { feature: LABELS[key] ?? key, value: pct, raw: val, avg };
  });

  const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Price card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-1 text-blue-200 text-sm">
          <TrendingUp className="w-4 h-4" />
          Estimated Market Value
        </div>
        {result.label && (
          <div className="text-blue-200 text-xs mb-1 truncate">{result.label}</div>
        )}
        <div className="text-4xl font-bold">{fmt.format(result.predicted_price)}</div>
        <div className="text-blue-200 text-xs mt-2">
          {new Date(result.timestamp).toLocaleString()}
        </div>
      </div>

      {/* Feature breakdown table */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Feature Breakdown</h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Feature</th>
                <th className="text-right px-4 py-2.5 text-slate-500 font-medium">Value</th>
                <th className="text-right px-4 py-2.5 text-slate-500 font-medium">Avg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(result.features).map(([key, val]) => (
                <tr key={key} className="hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-700">{LABELS[key] ?? key}</td>
                  <td className="px-4 py-2 text-right font-medium text-slate-800">{String(val)}</td>
                  <td className="px-4 py-2 text-right text-slate-500">{AVERAGES[key]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* vs-average bar chart */}
      <div>
        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">
          Feature vs. Dataset Average (%)
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="feature" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(v) => [`${v}%`, "vs Average"]}
                contentStyle={{ borderRadius: 8, fontSize: 12 }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.value >= 100 ? "#3b82f6" : "#94a3b8"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-slate-400 mt-1">Blue = above average · Grey = below average</p>
      </div>
    </div>
  );
}
