"use client";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { estimatorApi } from "@/lib/api";
import type { EstimateResult } from "@/lib/types";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const FEATURE_LABELS: Record<string, string> = {
  square_footage: "Sqft",
  bedrooms: "Beds",
  bathrooms: "Baths",
  year_built: "Year",
  lot_size: "Lot (sqft)",
  distance_to_city_center: "Distance (mi)",
  school_rating: "School Rating",
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];
const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function CompareView() {
  const searchParams = useSearchParams();
  const ids = searchParams.get("ids")?.split(",") ?? [];

  const [items, setItems] = useState<EstimateResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    estimatorApi.getHistory().then((history) => {
      setItems(history.filter((h) => ids.includes(h.id)));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-400">Loading…</div>;
  if (items.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 mb-4">Select at least 2 estimates from the history to compare.</p>
        <Link href="/app1" className="text-blue-600 hover:underline text-sm">← Back to Estimator</Link>
      </div>
    );
  }

  // Build chart data: one row per feature
  const chartData = Object.keys(FEATURE_LABELS).map((key) => {
    const row: Record<string, string | number> = { feature: FEATURE_LABELS[key] };
    items.forEach((item, i) => {
      row[item.label ?? `Property ${i + 1}`] = Number((item.features as unknown as Record<string, number>)[key]);
    });
    return row;
  });

  const propertyNames = items.map((item, i) => item.label ?? `Property ${i + 1}`);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app1" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Property Comparison</h1>
          <p className="text-slate-500 text-sm mt-0.5">Comparing {items.length} properties side-by-side</p>
        </div>
      </div>

      {/* Price cards */}
      <div className="grid gap-4 mb-8" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item, i) => (
          <div
            key={item.id}
            className="rounded-2xl p-5 text-white"
            style={{ background: `linear-gradient(135deg, ${COLORS[i]}, ${COLORS[i]}cc)` }}
          >
            <div className="text-sm opacity-80 mb-1 truncate">{item.label ?? `Property ${i + 1}`}</div>
            <div className="text-2xl font-bold">{fmt.format(item.predicted_price)}</div>
            <div className="text-xs opacity-70 mt-1">{new Date(item.timestamp).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {/* Feature comparison table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-700">Feature Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Feature</th>
                {items.map((item, i) => (
                  <th key={item.id} className="text-right px-6 py-3 font-medium" style={{ color: COLORS[i] }}>
                    {item.label ?? `Property ${i + 1}`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => {
                const vals = items.map((item) => Number((item.features as unknown as Record<string, number>)[key]));
                const max = Math.max(...vals);
                return (
                  <tr key={key} className="hover:bg-slate-50">
                    <td className="px-6 py-3 text-slate-600">{label}</td>
                    {vals.map((val, i) => (
                      <td
                        key={i}
                        className={`px-6 py-3 text-right font-medium ${val === max ? "text-blue-600" : "text-slate-700"}`}
                      >
                        {val}
                        {val === max && vals.filter((v) => v === max).length === 1 && (
                          <span className="ml-1 text-xs text-blue-400">▲</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr className="bg-slate-50 border-t-2 border-slate-200">
                <td className="px-6 py-3 font-semibold text-slate-700">Predicted Price</td>
                {items.map((item, i) => (
                  <td key={item.id} className="px-6 py-3 text-right font-bold" style={{ color: COLORS[i % COLORS.length] }}>
                    {fmt.format(item.predicted_price)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Grouped bar chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="font-semibold text-slate-700 mb-5">Feature Chart</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="feature" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend />
              {propertyNames.map((name, i) => (
                <Bar key={name} dataKey={name} fill={COLORS[i]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading…</div>}>
      <CompareView />
    </Suspense>
  );
}
