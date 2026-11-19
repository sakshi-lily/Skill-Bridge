import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SkillBridgeLogo({ className = "h-8 w-8" }) {
  return (
    <div className="flex items-center gap-2.5 group cursor-pointer select-none">
      <div className="relative flex items-center justify-center">
        {/* Glow backdrop */}
        <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#7B9669] to-[#6C8480] opacity-60 blur-sm group-hover:opacity-90 transition duration-300"></div>
        {/* Icon container */}
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#404E3B] via-[#7B9669] to-[#6C8480] text-white shadow-md">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5 text-white transform -rotate-6 group-hover:rotate-0 transition-transform duration-300"
          >
            {/* Bridge arc with node connections */}
            <path d="M3 17c3.5-6 14.5-6 18 0" />
            <circle cx="5" cy="17" r="2" fill="white" />
            <circle cx="19" cy="17" r="2" fill="white" />
            <circle cx="12" cy="10" r="2.5" fill="white" />
            <path d="M12 10v4" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-sans flex items-center gap-1">
          Skill<span className="text-[#7B9669] dark:text-[#BAC8B1]">Bridge</span>
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#6C8480] ml-0.5"></span>
        </span>
        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-400 -mt-1">
          Match &amp; Build
        </span>
      </div>
    </div>
  );
}
