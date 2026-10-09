import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Compass, Construction } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

export default function DashboardPlaceholderPage({
  title = "Module",
  breadcrumb = "Dashboard / Module",
  description = "This section will be fully developed in subsequent development steps.",
  icon: Icon = Construction,
  actionText = "Back to Overview",
  actionLink = "/dashboard",
  sampleItems = [],
}) {
  return (
    <DashboardLayout title={title} breadcrumb={breadcrumb}>
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-[#1c1538] border border-purple-200/70 dark:border-purple-800/40 text-[10px] font-bold text-[#803BE8] dark:text-purple-300 mb-1">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>Next Phase Roadmap</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          <Link
            to={actionLink}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-50 dark:bg-[#1f193d] hover:bg-[#803BE8] hover:text-white dark:hover:bg-[#803BE8] text-[#803BE8] dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/50 text-xs font-bold transition-all shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{actionText}</span>
          </Link>
        </div>
      </div>

      {/* Preview Content Cards */}
      <div className="rounded-3xl border-2 border-dashed border-purple-200/90 dark:border-purple-900/40 bg-white/50 dark:bg-[#120e24]/40 p-8 sm:p-12 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#803BE8]/10 to-pink-500/10 dark:from-purple-950/60 dark:to-pink-950/40 text-[#803BE8] dark:text-pink-300 flex items-center justify-center mx-auto">
          <Icon className="w-7 h-7" />
        </div>

        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {title} Workspace Ready for Implementation
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Per the project requirements, Step 3 focuses on the core student dashboard layout and overview at <code className="text-[#803BE8] dark:text-purple-300 font-mono">/dashboard</code>. Full implementation of this module will be connected in future development phases.
          </p>
        </div>

        {sampleItems.length > 0 && (
          <div className="max-w-lg mx-auto pt-4 text-left">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2">
              Preview Capabilities Planned:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white dark:bg-[#16112c] border border-slate-200/70 dark:border-purple-900/30 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#803BE8]"></span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#803BE8] text-white hover:bg-[#6c27cf] text-xs font-bold shadow-md shadow-purple-600/20"
          >
            <span>Return to Dashboard Overview</span>
          </Link>
        </div>
      </div>

    </DashboardLayout>
  );
}
