"use client";

import { Trash2, GitCompare, Clock } from "lucide-react";
import type { EstimateResult } from "@/lib/types";
import Link from "next/link";

interface Props {
  history: EstimateResult[];
  selected: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function HistoryTable({ history, selected, onToggleSelect, onDelete, onClearAll }: Props) {
  if (history.length === 0) {
    return (
      <div className="text-center py-10 text-slate-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No estimates yet. Submit the form to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-500">{history.length} estimate{history.length !== 1 ? "s" : ""}</span>
        <div className="flex gap-2">
          {selected.length >= 2 && (
            <Link
              href={`/app1/compare?ids=${selected.join(",")}`}
              className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare ({selected.length})
            </Link>
          )}
          <button
            onClick={onClearAll}
            className="flex items-center gap-1.5 text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear all
          </button>
        </div>
      </div>

      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="w-10 px-3 py-2.5" />
              <th className="text-left px-4 py-2.5 text-slate-500 font-medium">Label</th>
              <th className="text-right px-4 py-2.5 text-slate-500 font-medium">Predicted Price</th>
              <th className="text-right px-4 py-2.5 text-slate-500 font-medium hidden sm:table-cell">Beds/Baths</th>
              <th className="text-right px-4 py-2.5 text-slate-500 font-medium hidden md:table-cell">Sqft</th>
              <th className="text-right px-4 py-2.5 text-slate-500 font-medium">Date</th>
              <th className="w-10 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {history.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50 ${selected.includes(item.id) ? "bg-blue-50" : ""}`}
              >
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.id)}
                    onChange={() => onToggleSelect(item.id)}
                    className="rounded accent-blue-600"
                  />
                </td>
                <td className="px-4 py-2.5 text-slate-700 truncate max-w-[120px]">
                  {item.label ?? <span className="text-slate-400 italic">—</span>}
                </td>
                <td className="px-4 py-2.5 text-right font-semibold text-blue-700">
                  {fmt.format(item.predicted_price)}
                </td>
                <td className="px-4 py-2.5 text-right text-slate-500 hidden sm:table-cell">
                  {item.features.bedrooms} / {item.features.bathrooms}
                </td>
                <td className="px-4 py-2.5 text-right text-slate-500 hidden md:table-cell">
                  {item.features.square_footage.toLocaleString()}
                </td>
                <td className="px-4 py-2.5 text-right text-slate-400 text-xs">
                  {new Date(item.timestamp).toLocaleDateString()}
                </td>
                <td className="px-3 py-2.5">
                  <button
                    onClick={() => onDelete(item.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected.length === 1 && (
        <p className="text-xs text-slate-400">Select at least 2 estimates to compare.</p>
      )}
    </div>
  );
}
