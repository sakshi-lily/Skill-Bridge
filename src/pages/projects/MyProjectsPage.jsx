import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  PlusCircle, 
  Search, 
  ExternalLink, 
  ShieldCheck, 
  CheckSquare, 
  Users, 
  Clock, 
  Calendar,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useProjects } from '../../context/ProjectsContext';
import { useAuth } from '../../context/AuthContext';

export default function MyProjectsPage() {
  const { projects, applications } = useProjects();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'leading' | 'joined' | 'applications'
  const [searchQuery, setSearchQuery] = useState('');

  const userName = user?.name || 'Alex Morgan';

  // Filter projects by ownership and membership
  const leadingProjects = useMemo(() => {
    return projects.filter(p => p.owner?.name === userName || p.owner === user?.id);
  }, [projects, userName, user?.id]);

  const joinedProjects = useMemo(() => {
    return projects.filter(
      p => p.members?.some(m => m.name === userName || m.user === user?.id) && 
           p.owner?.name !== userName
    );
  }, [projects, userName, user?.id]);

  const appliedProjectIds = Object.keys(applications);
  const appliedProjects = useMemo(() => {
    return projects.filter(p => appliedProjectIds.includes(p.id));
  }, [projects, appliedProjectIds]);

  // Active list based on tab
  const displayedProjects = useMemo(() => {
    let list = [];
    if (activeTab === 'all') {
      const combined = [...leadingProjects, ...joinedProjects];
      // Deduplicate by id
      const seen = new Set();
      list = combined.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });
    } else if (activeTab === 'leading') {
      list = leadingProjects;
    } else if (activeTab === 'joined') {
      list = joinedProjects;
    } else if (activeTab === 'applications') {
      list = appliedProjects;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [activeTab, leadingProjects, joinedProjects, appliedProjects, searchQuery]);

  return (
    <DashboardLayout title="My Projects" breadcrumb="Dashboard / My Projects">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-100/80 via-pink-50/70 to-purple-50/60 dark:from-[#1b1438] dark:via-[#16102e] dark:to-[#120d26] border border-purple-200/80 dark:border-purple-900/50 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-[#251e47]/80 border border-purple-200 dark:border-purple-800 text-xs font-bold text-[#803BE8] dark:text-purple-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#803BE8] dark:text-purple-400" />
            <span>Workspace Portfolio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            My Project Initiatives &amp; Squads
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-xl">
            Track initiatives you founded, teams you actively contribute to, and pending matchmaking applications.
          </p>
        </div>

        <Link
          to="/projects/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#803BE8] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-500/25 hover:bg-[#6c2bd9] transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 shadow-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All Projects', count: leadingProjects.length + joinedProjects.length },
            { id: 'leading', label: 'Leading', count: leadingProjects.length },
            { id: 'joined', label: 'Contributing', count: joinedProjects.length },
            { id: 'applications', label: 'Applications', count: appliedProjects.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#803BE8] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-purple-50/50 dark:hover:bg-[#1a1435]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-[#1f183d] text-slate-600 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my projects..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Projects Grid or Empty State */}
      {displayedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedProjects.map((project) => {
            const isOwner = project.owner?.name === userName || project.owner === user?.id;
            const appData = applications[project.id];

            return (
              <div
                key={project.id}
                className="bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-[#1f173f] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
                      {project.category || 'General'}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      isOwner
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : appData
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        : 'bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300'
                    }`}>
                      {isOwner ? 'Project Lead' : appData ? 'Applied' : 'Contributor'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#803BE8] transition-colors line-clamp-1 mb-1.5">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Required Skills */}
                  {project.requiredSkills && (
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.requiredSkills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-[#1a1435] text-slate-600 dark:text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {project.requiredSkills.length > 3 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-[#1a1435] text-slate-400">
                          +{project.requiredSkills.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-4 border-t border-slate-100 dark:border-purple-950/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{project.members?.length || project.currentMembersCount || 1}/{project.teamSize || 4}</span>
                    </span>
                    {project.deadline && (
                      <span className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{project.deadline}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-[#1c1638] text-slate-600 dark:text-slate-300 hover:text-[#803BE8] hover:bg-purple-50 transition-colors"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/teams"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#803BE8] text-white text-xs font-bold hover:bg-[#6c2bd9] transition-all shadow-xs"
                    >
                      <span>Squad</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 rounded-3xl p-12 text-center shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-50 dark:bg-[#1a1435] text-[#803BE8] flex items-center justify-center">
            <FolderKanban className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No projects found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            {searchQuery
              ? `No projects matched "${searchQuery}". Try a different keyword.`
              : activeTab === 'leading'
              ? 'You have not founded any projects yet. Turn your capstone or hackathon idea into reality!'
              : activeTab === 'applications'
              ? 'You have not applied to any project squads yet. Explore open projects and collaborate!'
              : 'You are not currently part of any project teams. Explore matchmaking recommendations or create your own.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/projects"
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-purple-900/60 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#1a1435] transition-all"
            >
              Explore Projects
            </Link>
            <Link
              to="/projects/create"
              className="px-4 py-2 rounded-xl bg-[#803BE8] text-white text-xs font-bold shadow-md hover:bg-[#6c2bd9] transition-all"
            >
              Create Project
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
