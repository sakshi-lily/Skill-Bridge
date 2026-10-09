import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { useProjects } from '../../context/ProjectsContext';

export default function ExploreProjectCard({ project, onOpenApply }) {
  const { isApplied } = useProjects();
  const applied = isApplied(project.id);

  const difficultyColors = {
    Beginner: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/40',
    Intermediate: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/40',
    Advanced: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/40',
  };

  const modeColors = {
    Remote: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300',
    Hybrid: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
    'On-campus': 'bg-pink-50 text-pink-700 dark:bg-pink-950/50 dark:text-pink-300',
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      <div>
        
        {/* Top bar: Category + Difficulty + Mode */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/50 text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
            {project.category}
          </span>

          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${difficultyColors[project.difficulty] || difficultyColors.Intermediate}`}>
              {project.difficulty}
            </span>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${modeColors[project.mode] || modeColors.Remote}`}>
              {project.mode}
            </span>
          </div>
        </div>

        {/* Project Title */}
        <Link 
          to={`/projects/${project.id}`}
          className="block group-hover:text-[#803BE8] dark:group-hover:text-purple-300 transition-colors"
        >
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
            {project.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
          {project.shortDescription || project.description}
        </p>

        {/* Required skills tags */}
        <div className="mt-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
            Required Tech Stack:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills?.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#1f193d] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-purple-900/40"
              >
                {skill}
              </span>
            ))}
            {project.requiredSkills?.length > 4 && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 text-slate-400">
                +{project.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Team metrics row */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-950/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {project.currentMembersCount}/{project.teamSize} members{' '}
              <strong className="text-purple-600 dark:text-purple-300 font-bold">
                ({project.openPositionsCount} open)
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{project.deadline}</span>
          </div>
        </div>

      </div>

      {/* Footer: Owner info & Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-purple-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Owner */}
        <div className="flex items-center gap-2">
          <img
            src={project.owner?.avatar}
            alt={project.owner?.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-300 dark:ring-purple-800"
          />
          <div className="min-w-0">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
              {project.owner?.name}
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block truncate">
              {project.owner?.university}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            to={`/projects/${project.id}`}
            className="flex-1 sm:flex-initial text-xs font-semibold py-2 px-3.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1e173a] transition-colors border border-slate-200 dark:border-purple-900/40 text-center"
          >
            Details
          </Link>

          <button
            type="button"
            onClick={() => onOpenApply(project)}
            disabled={applied}
            className={`flex-1 sm:flex-initial text-xs font-bold py-2 px-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
              applied
                ? 'bg-purple-100 dark:bg-purple-950/70 text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 cursor-default'
                : 'bg-[#803BE8] hover:bg-[#6c27cf] text-white shadow-xs'
            }`}
          >
            {applied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-pink-500" />
                <span>Pending</span>
              </>
            ) : (
              <span>Apply to Join</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
