import Link from "next/link";
import { TrendingUp, BarChart3, ArrowRight, Cpu, History, GitCompare } from "lucide-react";

export default function HomePage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-700/50 rounded-full px-4 py-1.5 text-sm mb-6">
            <Cpu className="w-4 h-4" />
            Powered by Linear Regression · R² = 0.98
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Property Intelligence Portal
          </h1>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto mb-10">
            Two integrated applications providing AI-driven property valuations and
            comprehensive market analytics — all from a single platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/app1"
              className="inline-flex items-center gap-2 bg-white text-blue-900 font-semibold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Value Estimator
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/app2"
              className="inline-flex items-center gap-2 bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors border border-blue-600"
            >
              <BarChart3 className="w-5 h-5" />
              Market Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* App cards */}
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        {/* App 1 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">App 1 — Property Value Estimator</h2>
          <p className="text-slate-500 text-sm mb-6">
            Enter property details and get an instant AI price prediction. Track your
            estimates over time and compare multiple properties side-by-side.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 mb-8">
            {["Real-time price prediction", "Estimation history", "Side-by-side property comparison", "Visual feature charts"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">Python</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">FastAPI</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Port 8001</span>
          </div>
          <Link
            href="/app1"
            className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Open Estimator <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* App 2 */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-5">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">App 2 — Property Market Analysis</h2>
          <p className="text-slate-500 text-sm mb-6">
            Explore market trends, filter and sort the full property dataset, run
            what-if scenarios, and export data for offline analysis.
          </p>
          <ul className="space-y-2 text-sm text-slate-600 mb-8">
            {["Market statistics dashboard", "Interactive data tables", "What-if scenario analysis", "CSV & PDF export"].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
            <span className="bg-amber-50 text-amber-600 px-2 py-0.5 rounded font-medium">Java 21</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Spring Boot</span>
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">Port 8080</span>
          </div>
          <Link
            href="/app2"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Open Analysis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Architecture note */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="bg-slate-800 rounded-2xl p-8 text-white">
          <h3 className="font-semibold text-sm text-slate-400 uppercase tracking-wider mb-4">Architecture</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm">
            {[
              { label: "ML Model API", sub: "scikit-learn · :8000", color: "bg-purple-500" },
              { label: "Estimator API", sub: "FastAPI · :8001", color: "bg-blue-500" },
              { label: "Market API", sub: "Spring Boot · :8080", color: "bg-amber-500" },
              { label: "Next.js Portal", sub: "App Router · :3000", color: "bg-emerald-500" },
            ].map(({ label, sub, color }) => (
              <div key={label} className="bg-slate-700 rounded-xl p-4">
                <div className={`w-3 h-3 rounded-full ${color} mx-auto mb-2`} />
                <div className="font-medium text-white">{label}</div>
                <div className="text-slate-400 text-xs mt-1">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
