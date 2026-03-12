"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import clsx from "clsx";

const schema = z.object({
  label: z.string().max(80).optional(),
  square_footage: z.coerce.number({ invalid_type_error: "Required" }).min(100, "Min 100 sqft").max(20000),
  bedrooms: z.coerce.number({ invalid_type_error: "Required" }).int().min(1).max(20),
  bathrooms: z.coerce.number({ invalid_type_error: "Required" }).min(0.5).max(10),
  year_built: z.coerce.number({ invalid_type_error: "Required" }).int().min(1800).max(2025),
  lot_size: z.coerce.number({ invalid_type_error: "Required" }).min(100).max(5_000_000),
  distance_to_city_center: z.coerce.number({ invalid_type_error: "Required" }).min(0).max(200),
  school_rating: z.coerce.number({ invalid_type_error: "Required" }).min(0).max(10),
});

export type FormValues = z.infer<typeof schema>;

const fields = [
  { name: "square_footage" as const, label: "Square Footage", placeholder: "1850", step: "1", unit: "sqft" },
  { name: "bedrooms" as const, label: "Bedrooms", placeholder: "3", step: "1", unit: "" },
  { name: "bathrooms" as const, label: "Bathrooms", placeholder: "2", step: "0.5", unit: "" },
  { name: "year_built" as const, label: "Year Built", placeholder: "1998", step: "1", unit: "" },
  { name: "lot_size" as const, label: "Lot Size", placeholder: "7500", step: "1", unit: "sqft" },
  { name: "distance_to_city_center" as const, label: "Distance to City Center", placeholder: "5.6", step: "0.1", unit: "mi" },
  { name: "school_rating" as const, label: "School Rating", placeholder: "8.2", step: "0.1", unit: "/ 10" },
] as const;

interface Props {
  onSubmit: (values: FormValues) => Promise<void>;
  loading: boolean;
}

export default function EstimatorForm({ onSubmit, loading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const handleReset = () => reset();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Label */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Estimate Label <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <input
          {...register("label")}
          placeholder="e.g. Dream home, Investment property…"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Feature fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map(({ name, label, placeholder, step, unit }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {label}
              {unit && <span className="ml-1 text-slate-400 font-normal text-xs">{unit}</span>}
            </label>
            <input
              {...register(name)}
              type="number"
              step={step}
              placeholder={placeholder}
              className={clsx(
                "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",
                errors[name] ? "border-red-400" : "border-slate-300"
              )}
            />
            {errors[name] && (
              <p className="text-red-500 text-xs mt-1">{errors[name]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors text-sm"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "Estimating…" : "Get Estimate"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2.5 text-sm border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600"
        >
          Clear
        </button>
      </div>
    </form>
  );
}
