"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Zap } from "lucide-react";
import { marketApi } from "@/lib/api";

const schema = z.object({
  square_footage: z.coerce.number().min(100).max(20000),
  bedrooms: z.coerce.number().int().min(1).max(20),
  bathrooms: z.coerce.number().min(0.5).max(10),
  year_built: z.coerce.number().int().min(1800).max(2025),
  lot_size: z.coerce.number().min(100).max(5_000_000),
  distance_to_city_center: z.coerce.number().min(0).max(200),
  school_rating: z.coerce.number().min(0).max(10),
});

type FormValues = z.infer<typeof schema>;

// Dataset averages as defaults
const DEFAULTS: FormValues = {
  square_footage: 1718,
  bedrooms: 3,
  bathrooms: 1.84,
  year_built: 1997,
  lot_size: 7258,
  distance_to_city_center: 4.97,
  school_rating: 7.81,
};

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fields = [
  { name: "square_footage" as const, label: "Square Footage", step: "1", unit: "sqft" },
  { name: "bedrooms" as const, label: "Bedrooms", step: "1", unit: "" },
  { name: "bathrooms" as const, label: "Bathrooms", step: "0.5", unit: "" },
  { name: "year_built" as const, label: "Year Built", step: "1", unit: "" },
  { name: "lot_size" as const, label: "Lot Size", step: "1", unit: "sqft" },
  { name: "distance_to_city_center" as const, label: "Distance to City", step: "0.1", unit: "mi" },
  { name: "school_rating" as const, label: "School Rating", step: "0.1", unit: "/ 10" },
];

export default function WhatIfTool() {
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULTS,
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await marketApi.whatIf(values);
      setResult(res.predicted_price);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  const avgPrice = 274500; // dataset average

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Form */}
      <div>
        <p className="text-sm text-slate-500 mb-4">
          Adjust any property attributes to model price impact. Pre-filled with dataset averages.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {fields.map(({ name, label, step, unit }) => (
              <div key={name}>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  {label} {unit && <span className="text-slate-400">{unit}</span>}
                </label>
                <input
                  {...register(name)}
                  type="number"
                  step={step}
                  className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                {errors[name] && (
                  <p className="text-red-500 text-xs mt-0.5">{errors[name]?.message}</p>
                )}
              </div>
            ))}
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {loading ? "Calculating…" : "Run Analysis"}
            </button>
            <button
              type="button"
              onClick={() => { reset(DEFAULTS); setResult(null); }}
              className="px-4 py-2.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Result */}
      <div className="flex flex-col gap-4">
        {result !== null ? (
          <>
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white">
              <div className="text-emerald-200 text-sm mb-1">Predicted Market Value</div>
              <div className="text-4xl font-bold">{fmt.format(result)}</div>
              <div className="text-emerald-200 text-xs mt-2">via ML Model API</div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h4 className="text-sm font-semibold text-slate-600 mb-3">vs. Dataset Average</h4>
              <div className="space-y-3">
                {[
                  { label: "Your Property", value: result, color: "bg-emerald-500" },
                  { label: "Dataset Average", value: avgPrice, color: "bg-slate-300" },
                ].map(({ label, value, color }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{label}</span>
                      <span className="font-medium">{fmt.format(value)}</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all`}
                        style={{ width: `${Math.min(100, (value / 450000) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs text-slate-500">
                Difference:{" "}
                <span className={result > avgPrice ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                  {result > avgPrice ? "+" : ""}{fmt.format(result - avgPrice)}
                </span>{" "}
                ({((result / avgPrice - 1) * 100).toFixed(1)}%)
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-10 text-center text-slate-400">
            <Zap className="w-8 h-8 mb-2 opacity-40" />
            <p className="text-sm">Run analysis to see predicted price</p>
          </div>
        )}
      </div>
    </div>
  );
}
