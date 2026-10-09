import React from 'react';
import { Sparkles, Check, Send, Award, GraduationCap, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CandidateCard({
  student,
  selectedProject,
  onViewProfile,
  onOpenInvite,
}) {
  const match = student.matchDetails;
  const score = match ? match.score : 0;

  // Visual badge style based on calculated score without changing the score
  const strengthStyles = {
    High: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/50',
    Moderate: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/50',
    Low: 'bg-slate-100 text-slate-600 dark:bg-[#1f193d] dark:text-slate-400 border-slate-200 dark:border-purple-900/40',
  };

  const strength = match?.matchStrength || (score >= 75 ? 'High' : score >= 40 ? 'Moderate' : 'Low');

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top: Avatar, Name, College, and Calculated Match Score */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-100 dark:ring-purple-900 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#151226]" title="Available for Matchmaking"></span>
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] dark:group-hover:text-purple-300 transition-colors">
                {student.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#803BE8]" />
                <span dangerouslySetInnerHTML={{ __html: `${student.university} &bull; ${student.courseAndYear}` }} />
              </p>
            </div>
          </div>

          {/* Genuine Calculated Match Score Badge */}
          <div className="flex flex-col items-end shrink-0">
            <span className={`inline-flex items-center gap-1 text-xs font-extrabold px-2.5 py-1 rounded-full border ${strengthStyles[strength]}`}>
              <Sparkles className="w-3 h-3" />
              <span>{score}% Match</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              {strength} Synergy
            </span>
          </div>
        </div>

        {/* Short Recommendation Explanation */}
        <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-[#1c1638] border border-purple-100/80 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
          <p>
            <strong className="text-[#803BE8] dark:text-purple-300 font-bold">Why recommended: </strong>
            {match?.explanation || 'Evaluated against selected project requirements.'}
          </p>
        </div>

        {/* Matched vs Missing Skills breakdown */}
        {selectedProject && (
          <div className="space-y-3 mb-4">
            {/* Matched Skills */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                ✓ Matched Skills ({match?.matchedSkills?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {match?.matchedSkills && match.matchedSkills.length > 0 ? (
                  match.matchedSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/50"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">None matched</span>
                )}
              </div>
            </div>

            {/* Missing Required Skills */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 block mb-1">
                ✕ Missing Skills ({match?.missingSkills?.length || 0}):
              </span>
              <div className="flex flex-wrap gap-1">
                {match?.missingSkills && match.missingSkills.length > 0 ? (
                  match.missingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#20183e] text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-purple-900/30"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">No missing skills! Fully covered.</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Student Skills */}
        <div className="space-y-1.5 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Student Technical Skills:
          </span>
          <div className="flex flex-wrap gap-1">
            {student.skills?.map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-50 dark:bg-[#1a1435] text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-purple-900/40"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Extra info: Availability & Roles */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-purple-950/40">
          <span className="flex items-center gap-1 text-[11px]">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{student.availability}</span>
          </span>
          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-300 truncate max-w-[170px]">
            {student.preferredRoles?.[0] || 'General Co-builder'}
          </span>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-purple-950/50 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={() => onViewProfile(student)}
          className="flex-1 text-xs font-semibold py-2 px-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1e173a] transition-colors border border-slate-200 dark:border-purple-900/40 text-center"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={() => onOpenInvite(student)}
          className="flex-1 text-xs font-bold py-2 px-3.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Invite to Team</span>
        </button>
      </div>
    </div>
  );
}
