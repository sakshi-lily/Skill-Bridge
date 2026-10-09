import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  FolderKanban, 
  Sparkles, 
  Mail, 
  UserPlus, 
  LogOut, 
  Trash2,
  Lock,
  Clock,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import CreateTeamModal from '../../components/teams/CreateTeamModal';
import { useTeamTask } from '../../context/TeamTaskContext';
import { useProjects } from '../../context/ProjectsContext';

export default function TeamsPage() {
  const { 
    currentUser, 
    teams, 
    myTeams, 
    userInvitations, 
    acceptUserInvite, 
    rejectUserInvite,
    leaveTeam,
    removeMember,
    getTeamProgress
  } = useTeamTask();

  const [activeTab, setActiveTab] = useState('my-teams'); // 'my-teams' | 'invitations' | 'all-teams'
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <DashboardLayout
      title="Team Formation & Management"
      breadcrumb="SkillBridge / Collaboration / Teams"
    >
      <div className="space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#1f193d] border border-purple-200 dark:border-purple-800/60 text-xs font-bold text-[#803BE8] dark:text-purple-300 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-pink-500" />
              <span>Step 6: Verified Team Formation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Teams &amp; Squad Workspace
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Form cross-functional teams, manage role assignments, handle incoming invitations, and coordinate project sprint milestones.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 transform hover:-translate-y-0.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Team</span>
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-purple-950/60 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('my-teams')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'my-teams'
                ? 'bg-[#803BE8] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a1435]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>My Active Teams ({myTeams.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('invitations')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 relative ${
              activeTab === 'invitations'
                ? 'bg-[#803BE8] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a1435]'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Pending Invitations ({userInvitations.length})</span>
            {userInvitations.length > 0 && (
              <span className={`w-2 h-2 rounded-full ${activeTab === 'invitations' ? 'bg-pink-300' : 'bg-pink-500 animate-pulse'}`}></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all-teams')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'all-teams'
                ? 'bg-[#803BE8] text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1a1435]'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>All Campus Teams ({teams.length})</span>
          </button>
        </div>

        {/* TAB 1: MY ACTIVE TEAMS */}
        {activeTab === 'my-teams' && (
          <div className="space-y-6">
            {myTeams.length === 0 ? (
              <div className="rounded-3xl border-2 border-dashed border-purple-200 dark:border-purple-900/60 bg-white/60 dark:bg-[#151226]/60 p-12 text-center space-y-3">
                <Users className="w-12 h-12 text-[#803BE8] mx-auto opacity-70" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  You are not a member of any teams yet
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create a squad for your project or accept pending team invitations below.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(true)}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-[#803BE8] text-white text-xs font-bold shadow-xs"
                >
                  Create Your First Team
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myTeams.map(team => {
                  const isOwner = team.ownerId === currentUser.id;
                  const progress = getTeamProgress(team.id);

                  return (
                    <div
                      key={team.id}
                      className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
                    >
                      <div>
                        {/* Team Title & Ownership Badge */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {team.name}
                              </h3>
                              {isOwner ? (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/70 text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/40">
                                  Team Owner
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-[#1c1638] text-slate-600 dark:text-slate-400">
                                  Member
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Project: <strong className="text-slate-700 dark:text-slate-200">{team.projectName}</strong>
                            </p>
                          </div>

                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-purple-50 dark:bg-[#1e173a] px-2.5 py-1 rounded-full border border-purple-100 dark:border-purple-900/40 shrink-0">
                            {team.members.length}/{team.maxMembers} Members
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mt-2">
                          {team.description}
                        </p>

                        {/* Members Stack with Roles */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-950/40 space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                            Active Roster ({team.members.length}):
                          </span>
                          <div className="space-y-1.5">
                            {team.members.map((member) => (
                              <div
                                key={member.studentId}
                                className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-xs"
                              >
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    className="w-7 h-7 rounded-full object-cover ring-1 ring-purple-200 dark:ring-purple-800"
                                  />
                                  <div>
                                    <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                                      {member.name} {member.studentId === currentUser.id && '(You)'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      {member.university}
                                    </span>
                                  </div>
                                </div>

                                <span className="text-[11px] font-semibold text-[#803BE8] dark:text-purple-300 bg-purple-50 dark:bg-[#221840] px-2 py-0.5 rounded-md border border-purple-100 dark:border-purple-900/40">
                                  {member.role}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sprint Progress Bar */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-950/40 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                            <span>Project Sprint Progress</span>
                            <span className="text-[#803BE8] dark:text-purple-300 font-bold">{progress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-[#1f193d] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#803BE8] to-pink-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-slate-100 dark:border-purple-950/50 flex items-center justify-between gap-3">
                        {!isOwner && (
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Are you sure you want to leave ${team.name}?`)) {
                                leaveTeam(team.id, currentUser.id);
                              }
                            }}
                            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>Leave Team</span>
                          </button>
                        )}

                        <div className="flex items-center gap-2 ml-auto">
                          <Link
                            to={`/teams/${team.id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold shadow-xs transition-all"
                          >
                            <span>Team Workspace &rarr;</span>
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENDING INCOMING INVITATIONS */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-[#1a1435]/70 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0" />
              <span>
                These are verified team invitations addressed to <strong>{currentUser.name}</strong>. Accept to immediately join the team roster and gain task board access.
              </span>
            </div>

            {userInvitations.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 dark:border-purple-950/60 bg-white dark:bg-[#151226] p-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  No Pending Invitations
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  You are all caught up! Browse open campus projects to find new collaboration squads.
                </p>
                <Link
                  to="/projects"
                  className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#803BE8] text-white text-xs font-bold"
                >
                  Explore Projects
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userInvitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="rounded-3xl bg-white dark:bg-[#151226] border border-purple-100 dark:border-purple-900/40 p-6 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={inv.invitedByAvatar}
                          alt={inv.invitedBy}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-800"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {inv.teamName}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Invited by <strong className="text-slate-700 dark:text-slate-300">{inv.invitedBy}</strong>
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-300">
                        {inv.status}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1b1535] border border-slate-200/70 dark:border-purple-900/40 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Project:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{inv.projectName}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Offered Role:</span>
                        <span className="font-bold text-[#803BE8] dark:text-purple-300">{inv.offeredRole}</span>
                      </div>
                      {inv.message && (
                        <p className="pt-1.5 text-[11px] text-slate-500 dark:text-slate-400 italic border-t border-slate-200/50 dark:border-purple-950/50">
                          "{inv.message}"
                        </p>
                      )}
                    </div>

                    {/* Accept / Reject Buttons */}
                    <div className="flex items-center justify-end gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => rejectUserInvite(inv.id)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e173a] transition-colors"
                      >
                        Decline
                      </button>

                      <button
                        type="button"
                        onClick={() => acceptUserInvite(inv.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept &amp; Join Team</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALL CAMPUS TEAMS */}
        {activeTab === 'all-teams' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {teams.map(team => {
              const isMember = team.members.some(m => m.studentId === currentUser.id);
              const isFull = team.members.length >= team.maxMembers;

              return (
                <div
                  key={team.id}
                  className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300">
                        {team.projectName}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isFull ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {isFull ? 'Team Full' : `${team.maxMembers - team.members.length} slots open`}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {team.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-purple-950/40 text-xs space-y-1">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Team Lead:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{team.ownerName}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-purple-950/50 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      {team.members.length}/{team.maxMembers} Members
                    </span>

                    {isMember ? (
                      <Link
                        to={`/teams/${team.id}`}
                        className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:underline flex items-center gap-1"
                      >
                        <span>Open Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Private &bull; Invite Only</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Create Team Modal */}
      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </DashboardLayout>
  );
}
