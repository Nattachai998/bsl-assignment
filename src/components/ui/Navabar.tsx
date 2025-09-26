"use client";

import Link from "next/link";
import { StarIcon } from "@heroicons/react/24/outline";

export default function Navbar() {
return (
    <header className="h-14 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4">
      <div className="font-semibold text-gray-800">BSL Clinic</div>
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-1 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md">
          <StarIcon className="h-4 w-4" />
          Star
        </button>
        <div className="ml-auto flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
              <span>  
                <img
                  src="https://api.dicebear.com/7.x/adventurer/svg?seed=panda"
                  alt="avatar"
                  className="h-10 w-10 rounded-full ring-2 ring-white"
                />
              </span>
            </div>
        </div>
      </div>
    </header>
  );
}