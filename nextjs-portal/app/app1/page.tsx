"use client";

import { useState, useEffect, useCallback } from "react";
import EstimatorForm, { type FormValues } from "@/components/app1/EstimatorForm";
import PredictionResult from "@/components/app1/PredictionResult";
import HistoryTable from "@/components/app1/HistoryTable";
import { estimatorApi } from "@/lib/api";
import type { EstimateResult } from "@/lib/types";
import { AlertCircle } from "lucide-react";

export default function App1Page() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [history, setHistory] = useState<EstimateResult[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const h = await estimatorApi.getHistory();
      setHistory(h);
    } catch {
      // backend not yet up – silently skip
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    setError(null);
    try {
      const res = await estimatorApi.estimate(values);
      setResult(res);
      setHistory((prev) => [res, ...prev]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Estimation failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    await estimatorApi.deleteItem(id).catch(() => null);
    setHistory((prev) => prev.filter((h) => h.id !== id));
    setSelected((prev) => prev.filter((s) => s !== id));
    if (result?.id === id) setResult(null);
  };

  const handleClearAll = async () => {
    await estimatorApi.clearHistory().catch(() => null);
    setHistory([]);
    setSelected([]);
    setResult(null);
  };

  const toggleSelect = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Property Value Estimator</h1>
        <p className="text-slate-500 text-sm mt-1">
          Enter property details to get an AI-powered price prediction from the ML model.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left: Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-5">Property Details</h2>
          <EstimatorForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {/* Right: Result */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-slate-700 mb-5">Prediction Result</h2>
          {result ? (
            <PredictionResult result={result} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 text-sm text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-2xl">🏠</span>
              </div>
              Submit the form to see your prediction here.
            </div>
          )}
        </div>
      </div>

      {/* History */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-slate-700 mb-5">Estimation History</h2>
        {historyLoading ? (
          <div className="text-sm text-slate-400 py-6 text-center">Loading history…</div>
        ) : (
          <HistoryTable
            history={history}
            selected={selected}
            onToggleSelect={toggleSelect}
            onDelete={handleDelete}
            onClearAll={handleClearAll}
          />
        )}
      </div>
    </div>
  );
}
