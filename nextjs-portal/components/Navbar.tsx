"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, TrendingUp, BarChart3 } from "lucide-react";
import clsx from "clsx";

const links = [
  { href: "/", label: "Home", icon: Home },
  { href: "/app1", label: "Value Estimator", icon: TrendingUp },
  { href: "/app2", label: "Market Analysis", icon: BarChart3 },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">PI</span>
            </div>
            <span className="font-semibold text-slate-800 text-sm sm:text-base">
              Property Intelligence
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {links.map(({ href, label, icon: Icon }) => {
              const active =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
