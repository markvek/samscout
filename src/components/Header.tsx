import React, { useState, useEffect } from "react";
import { Shield, Star, Clock } from "lucide-react";

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white relative overflow-hidden">
      {/* Small top decorative patriotic ribbon stripes: red, white, blue */}
      <div className="h-1.5 w-full flex">
        <div className="h-full flex-1 bg-usa-red" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-usa-blue" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Logo and Constitutional Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-usa-blue flex items-center justify-center rounded-sm shrink-0">
            <div className="w-4 h-4 border-2 border-white rotate-45" />
          </div>
          <div>
            <h1 className="text-xl font-serif text-usa-blue font-extrabold tracking-tight uppercase">
              SamScout <span className="font-sans font-normal text-xs text-gray-400 uppercase tracking-widest ml-2">v2.4</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-gray-400">
              Department of Procurement &amp; Analysis • Federal Registry
            </p>
          </div>
        </div>

        {/* Info Grid - System Status / Clock */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          {/* Active Registry Status Flag */}
          <div className="flex items-center gap-2 bg-navy-50/50 border border-gray-200 rounded px-3 py-1 font-sans text-gray-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-semibold text-gray-700 tracking-wider uppercase text-[10px]">SAM.GOV: ACTIVE</span>
          </div>

          {/* Clock */}
          <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded px-3 py-1 text-gray-600 font-mono">
            <Clock className="w-3 h-3 text-usa-blue" />
            <span className="text-[11px] font-medium">{currentTime.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
