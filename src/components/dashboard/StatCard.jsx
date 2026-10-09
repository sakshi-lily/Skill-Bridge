import React from 'react';

export default function StatCard({
  title,
  value,
  label,
  icon: Icon,
  trend,
  colorScheme = 'purple',
}) {
  const colorMap = {
    purple: {
      iconBg: 'bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300',
      accent: 'border-t-purple-500',
    },
    pink: {
      iconBg: 'bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-300',
      accent: 'border-t-pink-500',
    },
    indigo: {
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300',
      accent: 'border-t-indigo-500',
    },
    emerald: {
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300',
      accent: 'border-t-emerald-500',
    },
  };

  const scheme = colorMap[colorScheme] || colorMap.purple;

  return (
    <div className={`relative rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 border-t-2 ${scheme.accent} group`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl ${scheme.iconBg} group-hover:scale-105 transition-transform duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {trend && (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {trend}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {label}
        </span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
          Demo Metric
        </span>
      </div>
    </div>
  );
}
