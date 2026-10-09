import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  UserCheck, 
  Flag,
  Share2,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ApplyModal from '../../components/projects/ApplyModal';
import { useProjects } from '../../context/ProjectsContext';
import { calculateSkillMatch } from '../../utils/skillMatching';
import { CURRENT_USER } from '../../data/studentsData';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, isApplied, applyToProject } = useProjects();

  const project = getProjectById(id);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const matchResult = project 
    ? calculateSkillMatch(project.requiredSkills, CURRENT_USER.skills)
    : null;

  if (!project) {
    return (
      <DashboardLayout title="Project Not Found" breadcrumb="SkillBridge / Projects / 404">
        <div className="rounded-3xl border border-slate-200 dark:border-purple-900/60 bg-white dark:bg-[#151226] p-10 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Project "{id}" Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            The requested project might have been removed or does not exist in this demo session.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#803BE8] text-white text-xs font-bold shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Explore Projects</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const applied = isApplied(project.id);

  const difficultyColors = {
    Beginner: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200/80',
    Intermediate: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200/80',
    Advanced: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200/80',
  };

  return (
    <DashboardLayout
      title={project.title}
      breadcrumb={`SkillBridge / Explore Projects / ${project.title}`}
    >
      <div className="space-y-8">
        
        {/* Top Navigation & Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-purple-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Projects</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Project link copied to clipboard!');
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1a1435] border border-slate-200 dark:border-purple-900/50 hover:bg-slate-50 shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={() => setShowApplyModal(true)}
              disabled={applied}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md ${
                applied
                  ? 'bg-purple-100 dark:bg-purple-950/70 text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 cursor-default'
                  : 'bg-[#803BE8] hover:bg-[#6c27cf] text-white shadow-purple-600/20 hover:shadow-purple-600/35 transform hover:-translate-y-0.5'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-pink-500" />
                  <span>Application Pending</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Apply to Join</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Project Hero Banner */}
        <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
              {project.category}
            </span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${difficultyColors[project.difficulty] || difficultyColors.Intermediate}`}>
              {project.difficulty}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-[#1f193d] text-slate-700 dark:text-slate-300">
              {project.mode}
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
              Status: {project.status}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {project.shortDescription}
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-purple-950/50 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Team Size &amp; Vacancy:</span>
              <strong className="text-slate-900 dark:text-white text-sm">
                {project.currentMembersCount}/{project.teamSize} members ({project.openPositionsCount} open)
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Expected Commitment:</span>
              <strong className="text-slate-900 dark:text-white text-sm">
                {project.weeklyCommitment || '6-8 hrs/week'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Project Deadline:</span>
              <strong className="text-slate-900 dark:text-white text-sm">
                {project.deadline}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Campus Lead:</span>
              <strong className="text-slate-900 dark:text-white text-sm truncate block">
                {project.owner?.name} ({project.owner?.university})
              </strong>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Detailed Content vs Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Info Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Detailed Description */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                About the Project &bull; Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {project.detailedDescription || project.description}
              </p>
            </div>

            {/* Problem Statement and Objectives */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-8 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-[#803BE8] dark:text-purple-300">
                <Flag className="w-5 h-5 text-pink-500" />
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Problem Statement &amp; Objectives
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {project.problemStatement || 'The project aims to solve critical university and student workflows by leveraging modern software best practices.'}
              </p>
            </div>

            {/* Project Milestones */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Project Sprint Milestones
              </h2>
              <div className="space-y-3">
                {project.milestones?.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm ${
                      m.completed
                        ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-800/40 text-slate-800 dark:text-slate-200'
                        : 'bg-slate-50 dark:bg-[#1b1535] border-slate-200/80 dark:border-purple-900/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {m.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-purple-400 shrink-0" />
                      )}
                      <span className={m.completed ? 'font-semibold' : 'font-medium'}>
                        {m.title}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white dark:bg-[#251e47] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-purple-900/40 shrink-0">
                      {m.targetDate}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar Column: Skills, Roles, Owner, and Team (1 Col) */}
          <div className="space-y-6">
            
            {/* Rule-Based Match Card for Alex Morgan */}
            {matchResult && (
              <div className="rounded-3xl bg-gradient-to-br from-purple-50/80 via-white to-pink-50/40 dark:from-[#1d163a] dark:via-[#16122a] dark:to-[#1a122e] border border-purple-200/80 dark:border-purple-900/60 p-6 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#803BE8] dark:text-purple-300" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Your Skill Match
                    </h3>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${
                    matchResult.matchStrength === 'Strong'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : matchResult.matchStrength === 'Moderate'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
                  }`}>
                    {matchResult.score}% Match
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {matchResult.explanation}
                </p>

                {/* Matched skills */}
                {matchResult.matchedSkills.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                      Matched Requirements ({matchResult.matchedSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.matchedSkills.map((s, idx) => (
                        <span key={idx} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing skills */}
                {matchResult.missingSkills.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                      Missing Requirements ({matchResult.missingSkills.length}):
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {matchResult.missingSkills.map((s, idx) => (
                        <span key={idx} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Link to find teammates */}
                <div className="pt-2">
                  <Link
                    to={`/teammates?project=${project.id}`}
                    className="w-full text-xs font-bold py-2 px-3 rounded-xl bg-purple-100 hover:bg-[#803BE8] hover:text-white dark:bg-purple-950/60 dark:hover:bg-[#803BE8] text-[#803BE8] dark:text-purple-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Find Teammates For This Project</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Required Skills */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Required Skills &amp; Tech Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.requiredSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1 rounded-lg bg-purple-50 dark:bg-[#1f193d] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Available Roles */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Open Roles ({project.openPositionsCount})
              </h3>
              <div className="space-y-2">
                {project.availableRoles?.map((role, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-[#1b1535] border border-slate-200 dark:border-purple-900/40 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between"
                  >
                    <span>{role}</span>
                    <span className="text-[10px] font-bold text-[#803BE8] dark:text-purple-300">
                      Recruiting
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Project Lead */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Project Founder
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={project.owner?.avatar}
                  alt={project.owner?.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-300 dark:ring-purple-800"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {project.owner?.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {project.owner?.role || 'Project Lead'}
                  </p>
                  <p className="text-[11px] font-semibold text-[#803BE8] dark:text-purple-300">
                    {project.owner?.university}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Team Members */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Current Team Members ({project.members?.length || 1})
              </h3>
              <div className="space-y-2.5">
                {project.members?.map((member, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block truncate">
                        {member.name}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate">
                        {member.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Confirmation & Apply Modal */}
      <ApplyModal
        project={project}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onConfirm={(projectId, note) => {
          applyToProject(projectId, note);
        }}
      />
    </DashboardLayout>
  );
}
