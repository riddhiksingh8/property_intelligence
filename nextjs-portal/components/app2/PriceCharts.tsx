"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import type { MarketStats } from "@/lib/types";

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const BEDROOM_COLORS = ["#94a3b8", "#3b82f6", "#6366f1", "#8b5cf6"];
const DECADE_COLOR = "#10b981";

interface Props { stats: MarketStats }

export default function PriceCharts({ stats }: Props) {
  const bedroomData = Object.entries(stats.price_by_bedrooms)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([beds, price]) => ({ name: `${beds} bed${Number(beds) !== 1 ? "s" : ""}`, price: Math.round(price) }));

  const decadeData = Object.entries(stats.price_by_decade)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([decade, price]) => ({ name: decade, price: Math.round(price) }));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* By bedrooms */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm">Avg Price by Bedrooms</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bedroomData} margin={{ top: 4, right: 8, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [fmt.format(Number(v)), "Avg Price"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="price" radius={[4, 4, 0, 0]}>
                {bedroomData.map((_, i) => (
                  <Cell key={i} fill={BEDROOM_COLORS[i % BEDROOM_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* By decade */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <h3 className="font-semibold text-slate-700 mb-4 text-sm">Avg Price by Decade Built</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={decadeData} margin={{ top: 4, right: 8, left: -5, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [fmt.format(Number(v)), "Avg Price"]} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="price" fill={DECADE_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
