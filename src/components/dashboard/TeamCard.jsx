import React from 'react';
import { ArrowUpRight, CheckCircle2, Users } from 'lucide-react';

export default function TeamCard({
  id,
  teamName,
  projectName,
  members = [],
  progress = 65,
  completedTasks = 8,
  totalTasks = 12,
  onOpenTeam,
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-purple-300 transition-colors">
              {teamName}
            </h4>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              Project: <span className="text-[#803BE8] dark:text-purple-300 font-semibold">{projectName}</span>
            </p>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
            Active Team
          </span>
        </div>

        {/* Member Avatars Stack */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex -space-x-2 overflow-hidden">
            {members.map((member, i) => (
              <img
                key={i}
                src={member.avatar}
                alt={member.name}
                title={member.name}
                className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#151226] object-cover"
              />
            ))}
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium pl-1">
            {members.length} Collaborators
          </span>
        </div>

        {/* Progress Bar & Tasks */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Sprint Progress</span>
            <span className="text-[#803BE8] dark:text-purple-300">{progress}%</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-[#1f193d] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#803BE8] to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{completedTasks}/{totalTasks} tasks completed</span>
            </span>
            <span>Demo Tracker</span>
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-purple-950/50">
        <button
          type="button"
          onClick={onOpenTeam}
          className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-[#803BE8] hover:text-white dark:bg-[#1d163a] dark:hover:bg-[#803BE8] text-[#803BE8] dark:text-purple-200 border border-purple-200/80 dark:border-purple-900/50 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Open Team Workspace</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
