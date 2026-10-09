import React, { useState } from 'react';
import { Users, Tag, Check, Sparkles, ArrowRight } from 'lucide-react';

export default function ProjectCard({
  id,
  title,
  description,
  requiredSkills = [],
  owner = { name: 'Anonymous', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
  teamSize = '2/4 members',
  category = 'Hackathon',
  onViewDetails,
}) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    setTimeout(() => {
      // Keep applied state for UI demonstration
    }, 500);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top bar: Category badge & team size */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
            {category}
          </span>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-50 dark:bg-[#1a1435] px-2.5 py-1 rounded-full">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{teamSize}</span>
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-purple-300 transition-colors line-clamp-1">
          {title}
        </h4>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Required skills tags */}
        <div className="mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
            Looking for:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#20183e] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-purple-900/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Owner info & Action buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-purple-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src={owner.avatar}
            alt={owner.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-200 dark:ring-purple-800"
          />
          <div className="text-left">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block leading-tight">
              {owner.name}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Project Lead
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={onViewDetails}
            className="flex-1 sm:flex-initial text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1e173a] transition-colors border border-slate-200 dark:border-purple-900/40"
          >
            Details
          </button>
          <button
            type="button"
            onClick={handleApply}
            className={`flex-1 sm:flex-initial text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1 ${
              applied
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                : 'bg-[#803BE8] hover:bg-[#6c27cf] text-white shadow-xs'
            }`}
          >
            {applied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Applied</span>
              </>
            ) : (
              <span>Apply</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
