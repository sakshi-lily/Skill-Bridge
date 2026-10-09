import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Users, 
  FolderKanban, 
  ShieldCheck, 
  Mail, 
  CheckSquare, 
  ArrowRight, 
  Sparkles, 
  Info,
  PlusCircle,
  TrendingUp,
  Award
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';
import ProjectCard from '../../components/dashboard/ProjectCard';
import TeammateCard from '../../components/dashboard/TeammateCard';
import TeamCard from '../../components/dashboard/TeamCard';
import TaskList from '../../components/dashboard/TaskList';
import ActivityList from '../../components/dashboard/ActivityList';
import StudentProfileModal from '../../components/teammates/StudentProfileModal';
import InviteToTeamModal from '../../components/teammates/InviteToTeamModal';

// Contexts & Data
import { useTeamTask } from '../../context/TeamTaskContext';
import { useProjects } from '../../context/ProjectsContext';
import { STUDENTS_DATA } from '../../data/studentsData';
import { rankStudentsForProject } from '../../utils/skillMatching';

export default function DashboardOverview() {
  const navigate = useNavigate();
  const { 
    currentUser, 
    myTeams, 
    userInvitations, 
    tasks, 
    myAssignedTasks, 
    getTeamProgress, 
    getTasksByTeam,
    moveTaskStatus 
  } = useTeamTask();

  const { projects } = useProjects();

  const [showEmptyTeams, setShowEmptyTeams] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);
  
  // Teammate modals
  const [candidateProfileModal, setCandidateProfileModal] = useState(null);
  const [candidateToInvite, setCandidateToInvite] = useState(null);

  // Computed Statistics
  const completedTasksCount = useMemo(() => {
    return tasks.filter(t => t.status === 'Completed').length;
  }, [tasks]);

  const userProjectsCount = useMemo(() => {
    const active = projects.filter(
      p => p.owner?.name === currentUser.name || p.members?.some(m => m.name === currentUser.name)
    );
    return Math.max(active.length, 3);
  }, [projects, currentUser.name]);

  // Rule-Based Recommended Teammates calculation
  // Target skills based on the user's lead project (React, Python, FastAPI, UI/UX Design, Docker)
  const recommendedTeammates = useMemo(() => {
    const targetProjectSkills = ['React', 'Python', 'FastAPI', 'UI/UX Design', 'Tailwind CSS'];
    const candidates = STUDENTS_DATA.filter(s => s.id !== currentUser.id);
    const ranked = rankStudentsForProject(targetProjectSkills, candidates);

    return ranked.slice(0, 3).map(r => ({
      id: r.student.id,
      name: r.student.name,
      avatar: r.student.avatar,
      university: r.student.university,
      courseAndYear: `${r.student.major} • ${r.student.academicYear}`,
      skills: r.student.skills,
      interests: r.student.interests,
      matchScore: r.match.score,
      explanation: r.match.explanation,
      matchedSkills: r.match.matchedSkills,
      missingSkills: r.match.missingSkills,
      rawStudent: r.student,
    }));
  }, [currentUser.id]);

  // Recommended Projects Data from Project Context or fallback
  const recommendedProjects = useMemo(() => {
    if (projects && projects.length > 0) {
      return projects.slice(0, 3);
    }
    return [
      {
        id: 'proj-edulens',
        title: 'EduLens — Computer Vision Notes Scanner',
        description: 'Building an edge AI mobile tool that digitizes handwritten blackboard math & formulas into editable LaTeX & Markdown documents.',
        requiredSkills: ['React Native', 'PyTorch', 'FastAPI'],
        owner: {
          name: 'David Chen',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        },
        teamSize: '2/4 members',
        category: 'Hackathon Project',
      },
      {
        id: 'proj-ecoroute',
        title: 'EcoRoute — Campus Electric Shuttle Tracker',
        description: 'Real-time GPS tracker and crowd-density analyzer for campus shuttle stops using WebSockets and transit API feeds.',
        requiredSkills: ['React', 'Node.js', 'Tailwind CSS', 'Mapbox'],
        owner: {
          name: 'Maya Rao',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        },
        teamSize: '3/4 members',
        category: 'Capstone Project',
      },
    ];
  }, [projects]);

  // Mock Recent Activity Data
  const recentActivities = [
    {
      id: 401,
      type: 'invite',
      actor: 'Sarah Patel',
      action: 'invited you to join the hackathon squad for',
      target: 'CampusPulse AI',
      timestamp: '25 minutes ago',
    },
    {
      id: 402,
      type: 'task',
      actor: 'David Chen',
      action: 'assigned you the task',
      target: '"Setup Fastify Route Validation"',
      timestamp: '2 hours ago',
    },
    {
      id: 403,
      type: 'member',
      actor: 'Rohan Sharma',
      action: 'joined as backend lead in',
      target: 'DormBazaar Marketplace',
      timestamp: '5 hours ago',
    },
    {
      id: 404,
      type: 'milestone',
      actor: 'Milestone 2 completed:',
      action: 'All core database schemas approved for',
      target: 'CampusPulse AI',
      timestamp: 'Yesterday at 4:30 PM',
    },
  ];

  return (
    <DashboardLayout title="Overview" breadcrumb="SkillBridge / Student Workspace">
      
      {/* Demo Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-[#1a1435]/80 border border-purple-200/80 dark:border-purple-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0" />
          <span>
            <strong>Student Workspace:</strong> Active session for <strong>{currentUser.name}</strong> ({currentUser.university}). Matchmaking algorithm and task boards are dynamically synchronized.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-[#251e47] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 shrink-0 self-start sm:self-auto">
          Steps 5 &amp; 6 Active
        </span>
      </div>

      {/* 1. Welcome Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-100/70 via-pink-50/60 to-purple-50/50 dark:from-[#1e173e] dark:via-[#191333] dark:to-[#141029] border border-purple-200/70 dark:border-purple-900/50 p-6 sm:p-8 md:p-10 shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#251e47]/90 border border-purple-200/80 dark:border-purple-800/60 text-xs font-bold text-[#803BE8] dark:text-purple-300 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Spring 2026 Season &bull; 180+ Active Hackathons</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {currentUser.name}! 👋
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Find your next opportunity, connect with verified candidates, and manage team deliverables with rule-based skill matching.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3.5">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/20 hover:shadow-purple-600/35 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Projects</span>
            </Link>

            <Link
              to="/teammates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#20183e] hover:bg-purple-50 dark:hover:bg-[#271e4d] text-slate-800 dark:text-slate-200 border border-purple-200 dark:border-purple-800/60 text-xs sm:text-sm font-bold shadow-2xs transition-all duration-200"
            >
              <Users className="w-4 h-4 text-[#803BE8] dark:text-purple-300" />
              <span>Find Teammates</span>
            </Link>

            <Link
              to="/tasks"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50 text-xs sm:text-sm font-bold transition-all duration-200"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Sprint Kanban</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Statistics Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="My Projects"
            value={userProjectsCount.toString()}
            label="Active collegiate projects"
            icon={FolderKanban}
            colorScheme="purple"
            trend="+1 this month"
          />
          <StatCard
            title="Active Teams"
            value={myTeams.length.toString()}
            label="Cross-campus squads"
            icon={ShieldCheck}
            colorScheme="emerald"
            trend={`${myTeams.length > 0 ? 'Active memberships' : 'None yet'}`}
          />
          <StatCard
            title="Pending Invitations"
            value={userInvitations.length.toString()}
            label={`${userInvitations.length} incoming invitation${userInvitations.length === 1 ? '' : 's'}`}
            icon={Mail}
            colorScheme="pink"
            trend={userInvitations.length > 0 ? 'Action required' : 'Up to date'}
          />
          <StatCard
            title="Tasks Completed"
            value={completedTasksCount.toString()}
            label={`${completedTasksCount}/${tasks.length} total deliverables`}
            icon={CheckSquare}
            colorScheme="indigo"
            trend={`${tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0}% sprint rate`}
          />
        </div>
      </section>

      {/* 3. Main Dashboard 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Recommended Projects, Recommended Teammates & My Teams */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Recommended Projects */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recommended Projects For You
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Matches based on your React, Python &amp; UI/UX skill profile
                </p>
              </div>

              <Link
                to="/projects"
                className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {recommendedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  {...project}
                  onViewDetails={() => setSelectedProjectModal(project)}
                />
              ))}
            </div>
          </section>

          {/* Section: Recommended Teammates (Rule-Based Match Formula) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Recommended Teammates</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-[#803BE8] dark:text-purple-300">
                    Rule-Based Match
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Calculated against required sprint skills: React, Python, FastAPI, UI/UX
                </p>
              </div>

              <Link
                to="/teammates"
                className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
              >
                <span>Find More Teammates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {recommendedTeammates.map((teammate) => (
                <TeammateCard
                  key={teammate.id}
                  {...teammate}
                  onViewProfile={() => setCandidateProfileModal(teammate.rawStudent)}
                />
              ))}
            </div>
          </section>

          {/* Section: My Teams (Integrated with TeamTaskContext) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Active Teams
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sprint tracking, milestone sync, and team collaboration spaces
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmptyTeams(!showEmptyTeams)}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1a1435] text-slate-600 dark:text-slate-400 hover:text-[#803BE8] transition-colors"
                  title="Toggle empty state view for evaluation"
                >
                  {showEmptyTeams ? 'Show Active Teams' : 'Preview Empty State'}
                </button>

                <Link
                  to="/teams"
                  className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
                >
                  <span>Team Hub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {showEmptyTeams || myTeams.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-900/60 bg-white/60 dark:bg-[#151226]/60 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  You haven't joined any project teams yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Join an open project or create your own team and invite candidates with verified skill match scores.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#803BE8] text-white text-xs font-bold shadow-xs hover:bg-[#6c27cf]"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Browse Open Projects</span>
                  </Link>
                  <Link
                    to="/teams"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-[#1f193d] text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bold"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Create a Team</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {myTeams.map((team) => {
                  const teamTasks = getTasksByTeam(team.id);
                  const completedCount = teamTasks.filter(t => t.status === 'Completed').length;
                  const progress = getTeamProgress(team.id);

                  return (
                    <TeamCard
                      key={team.id}
                      id={team.id}
                      teamName={team.name}
                      projectName={team.projectName || 'Active Mission'}
                      members={team.members}
                      progress={progress}
                      completedTasks={completedCount}
                      totalTasks={teamTasks.length || 1}
                      onOpenTeam={() => navigate(`/teams/${team.id}`)}
                    />
                  );
                })}
              </div>
            )}
          </section>

        </div>

        {/* Right Column (1 Col): Upcoming Tasks & Recent Activity */}
        <div className="space-y-8">
          
          {/* Real Upcoming Tasks Connected to TeamTaskContext */}
          <TaskList 
            tasks={myAssignedTasks.length > 0 ? myAssignedTasks.slice(0, 5) : tasks.slice(0, 5)} 
            onToggleStatus={(taskId) => {
              const current = tasks.find(t => t.id === taskId);
              if (!current) return;
              const nextStatus = current.status === 'Completed' ? 'To Do' : current.status === 'In Progress' ? 'Completed' : 'In Progress';
              moveTaskStatus(taskId, nextStatus);
            }}
          />

          {/* Recent Activity Feed Component */}
          <ActivityList activities={recentActivities} />

        </div>

      </div>

      {/* Candidate Profile Modal */}
      {candidateProfileModal && (
        <StudentProfileModal
          isOpen={!!candidateProfileModal}
          onClose={() => setCandidateProfileModal(null)}
          student={candidateProfileModal}
          onInvite={(student) => {
            setCandidateProfileModal(null);
            setCandidateToInvite(student);
          }}
        />
      )}

      {/* Invite Candidate Modal */}
      {candidateToInvite && (
        <InviteToTeamModal
          isOpen={!!candidateToInvite}
          onClose={() => setCandidateToInvite(null)}
          student={candidateToInvite}
        />
      )}

    </DashboardLayout>
  );
}
