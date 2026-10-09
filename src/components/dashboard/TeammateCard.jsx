import React, { useState } from 'react';
import { Sparkles, Check, Send, Award, GraduationCap } from 'lucide-react';

export default function TeammateCard({
  id,
  name,
  avatar,
  university,
  courseAndYear,
  skills = [],
  interests = [],
  matchScore = 95,
  onViewProfile,
}) {
  const [invited, setInvited] = useState(false);

  const handleInvite = () => {
    setInvited(true);
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top: Avatar, name, college, match score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 dark:ring-purple-900 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#151226]"></span>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-purple-300 transition-colors">
                {name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                <span>{university} &bull; {courseAndYear}</span>
              </p>
            </div>
          </div>

          {/* Match Score Badge */}
          <div className="flex flex-col items-end">
            <span className="inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>{matchScore}% Match</span>
            </span>
            <span className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              Simulated Demo
            </span>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-1.5 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Skills:
          </span>
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-purple-50 dark:bg-[#1e173a] text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-900/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Interests */}
        {interests.length > 0 && (
          <div className="space-y-1 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Interested in:
            </span>
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">
              {interests.join(' &bull; ')}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-purple-950/50 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onViewProfile}
          className="flex-1 text-xs font-semibold py-2 px-3 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1e173a] transition-colors border border-slate-200 dark:border-purple-900/40 text-center"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={handleInvite}
          className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
            invited
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40'
              : 'bg-[#803BE8] hover:bg-[#6c27cf] text-white shadow-xs'
          }`}
        >
          {invited ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Invited</span>
            </>
          ) : (
            <>
              <Send className="w-3 h-3" />
              <span>Invite</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
