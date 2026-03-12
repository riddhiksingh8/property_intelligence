"use client";

import { Download, Printer } from "lucide-react";
import { marketApi } from "@/lib/api";

export default function ExportButtons() {
  const handleCsvExport = () => {
    window.open(marketApi.getExportUrl(), "_blank");
  };

  const handlePdfExport = () => {
    window.print();
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCsvExport}
        className="flex items-center gap-1.5 text-sm bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
      >
        <Download className="w-4 h-4" />
        Export CSV
      </button>
      <button
        onClick={handlePdfExport}
        className="flex items-center gap-1.5 text-sm border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors font-medium"
      >
        <Printer className="w-4 h-4" />
        Print / PDF
      </button>
    </div>
  );
}
