import React from 'react';
import { 
  X, 
  GraduationCap, 
  Mail, 
  Globe, 
  Clock, 
  Award, 
  Send, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function StudentProfileModal({ student, isOpen, onClose, onOpenInvite }) {
  if (!isOpen || !student) return null;

  const proficiencyColors = {
    Beginner: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300',
    Intermediate: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300',
    Advanced: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300',
    Expert: 'text-pink-600 bg-pink-50 dark:bg-pink-950/60 dark:text-pink-300',
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#16122c] border border-purple-200 dark:border-purple-900/60 p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 space-y-6">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#20183e] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-slate-100 dark:border-purple-950/60 text-center sm:text-left">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-20 h-20 rounded-full object-cover ring-4 ring-purple-100 dark:ring-purple-900 shadow-md"
          />

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {student.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-1">
              <GraduationCap className="w-4 h-4 text-[#803BE8]" />
              <span dangerouslySetInnerHTML={{ __html: `${student.university} &bull; ${student.courseAndYear}` }} />
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {student.email}
            </p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            About / Elevator Pitch
          </h3>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#1a1435] p-3.5 rounded-2xl border border-slate-200/80 dark:border-purple-900/40">
            {student.bio || 'Active student builder looking for complementary teams and hackathon projects.'}
          </p>
        </div>

        {/* Technical Skills with Proficiency */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Skills &amp; Verified Proficiency
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {student.skills?.map(skill => {
              const prof = student.proficiency?.[skill] || student.experienceLevel || 'Intermediate';
              return (
                <div
                  key={skill}
                  className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-[#1f183d] border border-purple-100 dark:border-purple-900/40 flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {skill}
                  </span>
                  <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md ${proficiencyColors[prof] || proficiencyColors.Intermediate}`}>
                    {prof}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interests & Preferred Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Preferred Roles:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {student.preferredRoles?.map((r, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-900/40"
                >
                  {r}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
              Availability:
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Clock className="w-4 h-4 text-[#803BE8]" />
              <span>{student.availability || '10-15 hrs/week'}</span>
            </div>
          </div>
        </div>

        {/* Portfolio & Social Links */}
        <div className="space-y-2 pt-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
            Portfolio &amp; External Profiles:
          </span>
          <div className="flex flex-wrap gap-3 text-xs">
            {student.github && (
              <a
                href={student.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1435] text-slate-700 dark:text-slate-300 hover:text-[#803BE8] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>GitHub Profile</span>
              </a>
            )}
            {student.linkedin && (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#1a1435] text-slate-700 dark:text-slate-300 hover:text-[#803BE8] transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
              </a>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-purple-950/60 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e173a]"
          >
            Close
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenInvite(student);
            }}
            className="px-6 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold shadow-md shadow-purple-600/20 flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invite to Team</span>
          </button>
        </div>

      </div>
    </div>
  );
}
