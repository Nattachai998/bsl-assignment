"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  LightBulbIcon,
  ArrowRightStartOnRectangleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href ? "bg-slate-700/70 ring-1 ring-white/10" : "";

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col p-4 overflow-y-auto">
      <Link
        className="text-lg font-semibold mb-6 tracking-tight"
        href="/app-history"
      >
        <span>BSL Clinic</span>
      </Link>

      <nav className="space-y-2">
        <Link
          href="/app-history"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-700/60"
        >
          <HomeIcon className="h-5 w-5 text-slate-300" />
          <span>History</span>
        </Link>
        <Link
          href="/app-department"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-slate-200 hover:bg-slate-700/60"
        >
          <ClockIcon className="h-5 w-5 text-slate-300" />
          <span>Department</span>
        </Link>
      </nav>

      <div className="mt-auto pt-6">
        <button className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-100 px-4 py-2 rounded-md">
          <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
