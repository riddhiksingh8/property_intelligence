import WhatIfTool from "@/components/app2/WhatIfTool";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WhatIfPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/app2" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">What-If Analysis</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Adjust property attributes and see the predicted price impact in real time.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <WhatIfTool />
      </div>
    </div>
  );
}
