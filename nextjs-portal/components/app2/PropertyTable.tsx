"use client";

import { useState, useMemo } from "react";
import type { Property, PropertyFilter } from "@/lib/types";
import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react";

interface Props {
  properties: Property[];
  onFilterChange: (f: PropertyFilter) => void;
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const PAGE_SIZE = 10;

type SortKey = "price" | "square_footage" | "year_built" | "school_rating" | "bedrooms";

export default function PropertyTable({ properties, onFilterChange }: Props) {
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("price");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<PropertyFilter>({});

  const sorted = useMemo(() => {
    return [...properties].sort((a, b) => {
      const av = a[sortKey as keyof Property] as number;
      const bv = b[sortKey as keyof Property] as number;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [properties, sortKey, sortDir]);

  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ChevronsUpDown className="w-3 h-3 text-slate-400" />;
    return sortDir === "asc" ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />;
  };

  const updateFilter = (key: keyof PropertyFilter, value: string) => {
    const next = { ...filters, [key]: value === "" ? "" : (isNaN(Number(value)) ? value : Number(value)) };
    setFilters(next);
    setPage(1);
    onFilterChange(next);
  };

  const ThSort = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      className="px-4 py-3 text-right cursor-pointer select-none hover:bg-slate-100 whitespace-nowrap"
      onClick={() => handleSort(k)}
    >
      <span className="flex items-center justify-end gap-1 text-slate-500 font-medium text-xs">
        {label} <SortIcon k={k} />
      </span>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { key: "bedrooms", label: "Bedrooms", type: "number", placeholder: "Any" },
          { key: "min_year", label: "Min Year", type: "number", placeholder: "1970" },
          { key: "max_year", label: "Max Year", type: "number", placeholder: "2025" },
          { key: "min_price", label: "Min Price ($)", type: "number", placeholder: "0" },
          { key: "max_price", label: "Max Price ($)", type: "number", placeholder: "500000" },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-slate-500 mb-1">{label}</label>
            <input
              type="number"
              placeholder={placeholder}
              onChange={(e) => updateFilter(key as keyof PropertyFilter, e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        ))}
        <div className="flex items-end">
          <button
            onClick={() => { setFilters({}); setPage(1); onFilterChange({}); }}
            className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-slate-500 font-medium text-xs">#</th>
                <ThSort k="price" label="Price" />
                <ThSort k="square_footage" label="Sqft" />
                <ThSort k="bedrooms" label="Beds" />
                <th className="px-4 py-3 text-right text-slate-500 font-medium text-xs">Baths</th>
                <ThSort k="year_built" label="Year" />
                <th className="px-4 py-3 text-right text-slate-500 font-medium text-xs">Lot</th>
                <th className="px-4 py-3 text-right text-slate-500 font-medium text-xs">Dist.</th>
                <ThSort k="school_rating" label="School" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pageItems.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-2.5 text-slate-400 text-xs">{p.id}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-emerald-700">{fmt.format(p.price)}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{p.square_footage.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{p.bedrooms}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{p.bathrooms}</td>
                  <td className="px-4 py-2.5 text-right text-slate-600">{p.year_built}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500 text-xs">{p.lot_size.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-slate-500">{p.distance_to_city_center}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${p.school_rating >= 8 ? "bg-emerald-100 text-emerald-700" : p.school_rating >= 7 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                      {p.school_rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500 text-xs">{properties.length} properties</span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50">‹</button>
          <span className="px-3 py-1 text-xs text-slate-600">Page {page} / {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50">›</button>
        </div>
      </div>
    </div>
  );
}
