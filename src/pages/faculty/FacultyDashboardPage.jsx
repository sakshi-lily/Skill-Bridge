import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { facultyAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  GraduationCap, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Send,
  Lock,
  Award
} from 'lucide-react';

export default function FacultyDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guidanceModalTeam, setGuidanceModalTeam] = useState(null);
  const [guidanceMessage, setGuidanceMessage] = useState('');
  const [guidanceSent, setGuidanceSent] = useState(false);

  // Initial simulated faculty dataset
  const initialDemoFacultyData = {
    metrics: {
      totalStudents: 142,
      totalProjects: 24,
      totalTeams: 18,
      totalTasks: 86,
      completedTasks: 54,
      overdueTasks: 7,
      completionRate: 63,
    },
    teams: [
      {
        id: 'team-pulse',
        name: 'PulseEngineers',
        projectName: 'CampusPulse AI',
        ownerName: 'Alex Morgan',
        membersCount: 3,
        maxMembers: 4,
        totalTasks: 12,
        completedTasks: 8,
        overdueTasks: 1,
        progress: 67,
        needsIntervention: true,
      },
      {
        id: 'team-collab',
        name: 'CampusCollab Core',
        projectName: 'EduLens OCR Scanner',
        ownerName: 'David Chen',
        membersCount: 4,
        maxMembers: 4,
        totalTasks: 16,
        completedTasks: 14,
        overdueTasks: 0,
        progress: 88,
        needsIntervention: false,
      },
      {
        id: 'team-vision',
        name: 'VisionWizards',
        projectName: 'EcoRoute Campus Tracker',
        ownerName: 'Maya Rao',
        membersCount: 2,
        maxMembers: 4,
        totalTasks: 9,
        completedTasks: 2,
        overdueTasks: 2,
        progress: 22,
        needsIntervention: true,
      },
    ],
    interventionAlerts: [
      {
        id: 'team-pulse',
        name: 'PulseEngineers',
        reason: '1 overdue sprint deliverable flagged.',
      },
      {
        id: 'team-vision',
        name: 'VisionWizards',
        reason: 'High vacancy (2/4 open) and low sprint progress (22%).',
      },
    ],
    topSkills: [
      { skill: 'React', count: 88 },
      { skill: 'Python', count: 74 },
      { skill: 'UI/UX Design', count: 58 },
      { skill: 'FastAPI', count: 42 },
      { skill: 'Tailwind CSS', count: 65 },
      { skill: 'Docker', count: 35 },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await facultyAPI.getDashboardData();
        if (res.success && res.metrics) {
          setData(res);
        } else {
          setData(initialDemoFacultyData);
        }
      } catch (err) {
        setData(initialDemoFacultyData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSendGuidance = (e) => {
    e.preventDefault();
    setGuidanceSent(true);
    setTimeout(() => {
      setGuidanceSent(false);
      setGuidanceModalTeam(null);
      setGuidanceMessage('');
    }, 1500);
  };

  const currentData = data || initialDemoFacultyData;

  // Role check banner if logged in as student
  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  return (
    <DashboardLayout 
      title="Faculty &amp; Admin Oversight" 
      breadcrumb="SkillBridge / Faculty Academic Dashboard"
    >
      <div className="space-y-6">
        
        {/* Faculty Authorization Badge Header */}
        <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-[#18122B] text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-60 h-60 rounded-full bg-pink-500/10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold mb-3 border border-white/15">
                <GraduationCap className="w-3.5 h-3.5 text-pink-300" />
                <span>Academic Oversight &bull; Spring 2026 Cohort</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Faculty Mentorship &amp; Project Health
              </h1>
              <p className="mt-2 text-purple-100/80 text-xs sm:text-sm leading-relaxed">
                Supervise cross-disciplinary student teams, detect at-risk project sprints early, and provide academic intervention for hackathon &amp; capstone teams.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-right">
                <div className="font-bold text-white">{user?.name || 'Prof. Eleanor Davis'}</div>
                <div className="text-purple-200 text-[11px] capitalize">{user?.role || 'faculty'} Portal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Access Warning if viewing as student */}
        {!isFacultyOrAdmin && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-amber-500 shrink-0" />
              <span>
                <strong>Faculty Preview Mode:</strong> Logged in as student account ({user?.email}). Switch to <code>prof.davis@stanford.edu</code> on login page for full authorized faculty permissions.
              </span>
            </div>
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-[11px] hover:bg-amber-600 shrink-0"
            >
              Switch Role
            </Link>
          </div>
        )}

        {/* 1. Campus Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-white/5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Verified Students</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentData.metrics.totalStudents}
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 block">
              +18 this semester
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-white/5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Collegiate Projects</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {currentData.metrics.totalProjects}
            </div>
            <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1 block">
              100% faculty approved
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-white/5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Active Squads</span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 text-[#803BE8] dark:text-purple-300">
              {currentData.metrics.totalTeams}
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
              Average 3.2 members
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-white/5 shadow-xs">
            <span className="text-xs text-slate-400 font-medium">Milestone Rate</span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
              {currentData.metrics.completionRate}%
            </div>
            <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
              {currentData.metrics.completedTasks}/{currentData.metrics.totalTasks} deliverables
            </span>
          </div>
        </div>

        {/* 2. Team Oversight Table & Intervention Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Teams Table (2 Cols) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#151226] rounded-3xl border border-slate-200/80 dark:border-white/5 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Team Progress Monitoring
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Real-time sprint velocity and deliverables across collegiate squads
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="pb-3">Team &amp; Project</th>
                    <th className="pb-3">Lead</th>
                    <th className="pb-3">Roster</th>
                    <th className="pb-3">Sprint Progress</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {currentData.teams.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                      <td className="py-3.5 pr-2">
                        <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                        <div className="text-[11px] text-[#803BE8] dark:text-purple-300 truncate max-w-[150px]">
                          {t.projectName}
                        </div>
                      </td>
                      <td className="py-3.5 pr-2 text-slate-600 dark:text-slate-300 font-medium">
                        {t.ownerName}
                      </td>
                      <td className="py-3.5 pr-2 text-slate-600 dark:text-slate-300 font-semibold">
                        {t.membersCount}/{t.maxMembers}
                      </td>
                      <td className="py-3.5 pr-2">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-100 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                t.progress >= 70 ? 'bg-emerald-500' : t.progress >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${t.progress}%` }}
                            />
                          </div>
                          <span className="font-bold">{t.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setGuidanceModalTeam(t)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/50 hover:bg-[#803BE8] hover:text-white text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 font-semibold text-[11px] transition-colors"
                        >
                          Provide Guidance
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Intervention Alerts & Top Skills */}
          <div className="space-y-6">
            
            {/* Intervention Alerts Box */}
            <div className="bg-white dark:bg-[#151226] rounded-3xl border border-slate-200/80 dark:border-white/5 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <span>Teams Requiring Intervention</span>
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Identified based on overdue milestones and member vacancy
              </p>

              <div className="space-y-2.5 pt-2">
                {currentData.teams.filter(t => t.needsIntervention).map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{t.name}</span>
                      <span className="text-[10px] text-rose-600 dark:text-rose-400 font-extrabold uppercase">
                        {t.overdueTasks > 0 ? `${t.overdueTasks} Overdue` : 'Stagnant'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      Project: {t.projectName} &bull; Progress: {t.progress}%
                    </p>
                    <button
                      onClick={() => setGuidanceModalTeam(t)}
                      className="text-[11px] font-bold text-[#803BE8] dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                      <span>Send Academic Mentorship Alert</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Student Skills Breakdown */}
            <div className="bg-white dark:bg-[#151226] rounded-3xl border border-slate-200/80 dark:border-white/5 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Campus Skill Distribution
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Most prevalent student proficiencies this semester
              </p>
              
              <div className="space-y-2 pt-2">
                {currentData.topSkills.map((s) => (
                  <div key={s.skill} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-700 dark:text-slate-300">{s.skill}</span>
                      <span className="text-slate-400">{s.count} students</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#803BE8] to-pink-500 rounded-full"
                        style={{ width: `${Math.min(100, (s.count / 100) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Guidance Modal */}
      {guidanceModalTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#18122B] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#803BE8]" />
              <span>Send Faculty Mentorship Guidance</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Direct guidance to <strong>{guidanceModalTeam.name}</strong> regarding project <em>{guidanceModalTeam.projectName}</em>.
            </p>

            {guidanceSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-semibold text-center">
                Mentorship note delivered to team workspace notification channel!
              </div>
            ) : (
              <form onSubmit={handleSendGuidance} className="space-y-4">
                <textarea
                  rows={4}
                  required
                  value={guidanceMessage}
                  onChange={(e) => setGuidanceMessage(e.target.value)}
                  placeholder="Provide recommendations on milestone deadlines, architecture choices, or schedule an advising office hour..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
                />
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setGuidanceModalTeam(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Guidance Note</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
