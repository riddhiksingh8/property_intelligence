"use client";

import type { MarketStats } from "@/lib/types";
import { Home, DollarSign, Star, TrendingUp } from "lucide-react";

interface Props { stats: MarketStats }

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const cards = (s: MarketStats) => [
  { label: "Total Properties", value: s.total_properties.toString(), sub: "in dataset", icon: Home, color: "bg-blue-100 text-blue-600" },
  { label: "Average Price", value: fmt.format(s.avg_price), sub: `Range: ${fmt.format(s.min_price)} – ${fmt.format(s.max_price)}`, icon: DollarSign, color: "bg-emerald-100 text-emerald-600" },
  { label: "Avg School Rating", value: s.avg_school_rating.toFixed(1) + " / 10", sub: "district quality", icon: Star, color: "bg-amber-100 text-amber-600" },
  { label: "Avg Square Footage", value: s.avg_square_footage.toLocaleString() + " sqft", sub: "per property", icon: TrendingUp, color: "bg-purple-100 text-purple-600" },
];

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards(stats).map(({ label, value, sub, icon: Icon, color }) => (
        <div key={label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center mb-3`}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-slate-800">{value}</div>
          <div className="text-sm font-medium text-slate-600 mt-0.5">{label}</div>
          <div className="text-xs text-slate-400 mt-1">{sub}</div>
        </div>
      ))}
    </div>
  );
}
