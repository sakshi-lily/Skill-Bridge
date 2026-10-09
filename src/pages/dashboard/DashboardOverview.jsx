import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function DashboardOverview() {
  const [showEmptyTeams, setShowEmptyTeams] = useState(false);
  const [selectedProjectModal, setSelectedProjectModal] = useState(null);

  // Mock Recommended Projects Data
  const recommendedProjects = [
    {
      id: 1,
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
      id: 2,
      title: 'EcoRoute — Campus Electric Shuttle Tracker',
      description: 'Real-time GPS tracker and crowd-density analyzer for campus shuttle stops using WebSockets and transit API feeds.',
      requiredSkills: ['React.js', 'Node.js', 'Tailwind', 'Mapbox'],
      owner: {
        name: 'Maya Rao',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      },
      teamSize: '3/4 members',
      category: 'Capstone Project',
    },
    {
      id: 3,
      title: 'PeerPeer — Decentralized Study Notes Exchange',
      description: 'A Web3 micro-credentialing and peer-reviewed lecture summary network with verified university email badges.',
      requiredSkills: ['UI/UX Design', 'Solidity', 'Next.js'],
      owner: {
        name: 'Jordan Bell',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      },
      teamSize: '1/3 members',
      category: 'Startup MVP',
    },
  ];

  // Mock Recommended Teammates Data
  const recommendedTeammates = [
    {
      id: 101,
      name: 'Sarah Patel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      university: 'MIT',
      courseAndYear: 'Design Senior &bull; Year 4',
      skills: ['Figma', 'UI/UX Design', 'Design Systems', 'User Research'],
      interests: ['AI Interfaces', 'Accessibility', 'EdTech'],
      matchScore: 98,
    },
    {
      id: 102,
      name: 'Rohan Sharma',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
      university: 'UC Berkeley',
      courseAndYear: 'EECS Junior &bull; Year 3',
      skills: ['Python', 'LangChain', 'FastAPI', 'Docker'],
      interests: ['LLMs', 'Retrieval Augmented Generation', 'FinTech'],
      matchScore: 94,
    },
    {
      id: 103,
      name: 'Chloe Kim',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      university: 'Carnegie Mellon',
      courseAndYear: 'Software Eng &bull; Year 2',
      skills: ['React Native', 'Tailwind CSS', 'GraphQL', 'Firebase'],
      interests: ['Mobile Apps', 'Open Source', 'Social Impact'],
      matchScore: 91,
    },
  ];

  // Mock Active Teams Data
  const myTeams = [
    {
      id: 201,
      teamName: 'PulseEngineers',
      projectName: 'CampusPulse AI',
      members: [
        { name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
        { name: 'Sarah Patel', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
        { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
      ],
      progress: 75,
      completedTasks: 9,
      totalTasks: 12,
    },
    {
      id: 202,
      teamName: 'BazaarSquad',
      projectName: 'DormBazaar Marketplace',
      members: [
        { name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' },
        { name: 'Jordan Bell', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
      ],
      progress: 45,
      completedTasks: 5,
      totalTasks: 11,
    },
  ];

  // Mock Upcoming Tasks Data
  const upcomingTasks = [
    {
      id: 301,
      title: 'Finalize OpenAI API streaming endpoint',
      projectName: 'CampusPulse AI',
      dueDate: 'Tomorrow',
      priority: 'High',
      status: 'In Progress',
      isOverdue: false,
    },
    {
      id: 302,
      title: 'Complete Figma responsive mobile layouts',
      projectName: 'CampusPulse AI',
      dueDate: 'Oct 14',
      priority: 'Medium',
      status: 'To Do',
      isOverdue: false,
    },
    {
      id: 303,
      title: 'Review team contract & role milestones',
      projectName: 'DormBazaar Marketplace',
      dueDate: 'Yesterday',
      priority: 'High',
      status: 'To Do',
      isOverdue: true,
    },
    {
      id: 304,
      title: 'Set up GitHub Actions CI deployment',
      projectName: 'DormBazaar Marketplace',
      dueDate: 'Oct 18',
      priority: 'Low',
      status: 'Completed',
      isOverdue: false,
    },
  ];

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
            <strong>Student Workspace Demo:</strong> Viewing dashboard for <strong>Alex Morgan</strong> (Stanford University). Match scores and activity metrics are simulated demo values.
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white dark:bg-[#251e47] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40 shrink-0 self-start sm:self-auto">
          Frontend Step 3
        </span>
      </div>

      {/* 1. Welcome Section */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-100/70 via-pink-50/60 to-purple-50/50 dark:from-[#1e173e] dark:via-[#191333] dark:to-[#141029] border border-purple-200/70 dark:border-purple-900/50 p-6 sm:p-8 md:p-10 shadow-sm">
        {/* Ambient subtle glow background */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-400/10 to-pink-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 dark:bg-[#251e47]/90 border border-purple-200/80 dark:border-purple-800/60 text-xs font-bold text-[#803BE8] dark:text-purple-300 mb-4 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Spring 2026 Season &bull; 180+ Active Hackathons</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, Alex Morgan! 👋
          </h1>

          <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            Find your next opportunity, connect with talented students, and build something amazing.
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
          </div>
        </div>
      </section>

      {/* 2. Statistics Cards */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="My Projects"
            value="3"
            label="Active collegiate projects"
            icon={FolderKanban}
            colorScheme="purple"
            trend="+1 this month"
          />
          <StatCard
            title="Active Teams"
            value="2"
            label="Cross-campus squads"
            icon={ShieldCheck}
            colorScheme="emerald"
            trend="100% attendance"
          />
          <StatCard
            title="Pending Invitations"
            value="4"
            label="2 incoming &bull; 2 sent"
            icon={Mail}
            colorScheme="pink"
            trend="Needs review"
          />
          <StatCard
            title="Tasks Completed"
            value="18"
            label="Sprint progress deliverables"
            icon={CheckSquare}
            colorScheme="indigo"
            trend="82% on schedule"
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

          {/* Section: Recommended Teammates */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Recommended Teammates
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Students with complementary skill proficiencies and mutual project goals
                </p>
              </div>

              <Link
                to="/teammates"
                className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
              >
                <span>View All Teammates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {recommendedTeammates.map((teammate) => (
                <TeammateCard
                  key={teammate.id}
                  {...teammate}
                  onViewProfile={() => {}}
                />
              ))}
            </div>
          </section>

          {/* Section: My Teams */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  My Active Teams
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Sprint tracking, milestone sync and team collaboration spaces
                </p>
              </div>

              {/* Demo Toggle to inspect Empty State */}
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

            {showEmptyTeams ? (
              /* Useful Empty State */
              <div className="rounded-2xl border-2 border-dashed border-purple-200 dark:border-purple-900/60 bg-white/60 dark:bg-[#151226]/60 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300 flex items-center justify-center mx-auto">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  You haven't joined any project teams yet
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Join an open project or create your own idea and invite complementary teammates with verified skill match scores.
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
                    to="/teammates"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 dark:bg-[#1f193d] text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bold"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Search Students</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {myTeams.map((team) => (
                  <TeamCard
                    key={team.id}
                    {...team}
                    onOpenTeam={() => {}}
                  />
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column (1 Col): Upcoming Tasks & Recent Activity */}
        <div className="space-y-8">
          
          {/* Upcoming Tasks Component */}
          <TaskList initialTasks={upcomingTasks} />

          {/* Recent Activity Feed Component */}
          <ActivityList activities={recentActivities} />

        </div>

      </div>

      {/* Modal Details Preview (Interactive demo) */}
      {selectedProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#16122c] border border-purple-200 dark:border-purple-900/60 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300">
                  {selectedProjectModal.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  {selectedProjectModal.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedProjectModal.description}
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block mb-1">
                Requested Tech Stack:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProjectModal.requiredSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-[#20183e] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-800/40"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-purple-950/60 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e173a]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSelectedProjectModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#803BE8] text-white hover:bg-[#6c27cf]"
              >
                Apply to Join Project
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
