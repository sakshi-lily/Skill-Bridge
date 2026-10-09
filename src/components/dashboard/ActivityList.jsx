import React from 'react';
import { Mail, CheckSquare, UserPlus, Flag, Sparkles } from 'lucide-react';

export default function ActivityList({ activities = [] }) {
  const iconMap = {
    invite: {
      icon: Mail,
      color: 'bg-purple-100 text-[#803BE8] dark:bg-purple-950/60 dark:text-purple-300',
    },
    task: {
      icon: CheckSquare,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
    },
    member: {
      icon: UserPlus,
      color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    milestone: {
      icon: Flag,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-950/60 dark:text-pink-300',
    },
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Recent Activity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time feed of campus project updates
          </p>
        </div>

        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-[#1f193d] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
          Live Feed Demo
        </span>
      </div>

      <div className="relative pl-2 space-y-4 before:absolute before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-purple-950/50">
        {activities.map((item) => {
          const conf = iconMap[item.type] || iconMap.task;
          const Icon = conf.icon;

          return (
            <div key={item.id} className="relative flex items-start gap-3.5 group">
              <div className={`relative z-10 p-2 rounded-xl ${conf.color} shadow-xs ring-4 ring-white dark:ring-[#151226] shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-snug">
                  <span className="font-bold text-slate-900 dark:text-white mr-1">
                    {item.actor}
                  </span>
                  {item.action}{' '}
                  <span className="font-semibold text-[#803BE8] dark:text-purple-300">
                    {item.target}
                  </span>
                </p>

                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                  {item.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
