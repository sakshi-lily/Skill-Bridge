import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  ShieldCheck, 
  UserPlus, 
  CheckCircle2, 
  Trash2, 
  LogOut, 
  PlusCircle, 
  FolderKanban, 
  ExternalLink,
  Clock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';
import TeamFileManager from '../../components/files/TeamFileManager';
import { useTeamTask } from '../../context/TeamTaskContext';
import { useProjects } from '../../context/ProjectsContext';
import { KANBAN_COLUMNS } from '../../data/tasksData';

export default function TeamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentUser, 
    getTeamById, 
    getTasksByTeam, 
    getTeamProgress, 
    removeMember, 
    updateMemberRole,
    leaveTeam,
    cancelTeamInvite,
    moveTaskStatus,
    deleteTask,
  } = useTeamTask();

  const team = getTeamById(id);
  const teamTasks = getTasksByTeam(id);
  const progress = team ? getTeamProgress(team.id) : 0;

  // Task Modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Destructive Confirmation Modal
  const [confirmAction, setConfirmAction] = useState(null);

  if (!team) {
    return (
      <DashboardLayout title="Team Not Found" breadcrumb="SkillBridge / Teams / 404">
        <div className="rounded-3xl border border-slate-200 dark:border-purple-900/60 bg-white dark:bg-[#151226] p-10 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Team Not Found
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            The requested team does not exist or you do not have permission to access it.
          </p>
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#803BE8] text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Teams Hub</span>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isOwner = team.ownerId === currentUser.id;
  const isMember = team.members.some(m => m.studentId === currentUser.id);

  // Task tallies
  const todoTasks = teamTasks.filter(t => t.status === 'To Do');
  const inProgressTasks = teamTasks.filter(t => t.status === 'In Progress');
  const reviewTasks = teamTasks.filter(t => t.status === 'Review');
  const completedTasks = teamTasks.filter(t => t.status === 'Completed');

  const availableRolesList = [
    'Team Lead',
    'Frontend Developer',
    'Backend Architect',
    'UI/UX Designer',
    'ML/LLM Engineer',
    'Mobile Developer',
    'QA & Tester',
  ];

  return (
    <DashboardLayout
      title={team.name}
      breadcrumb={`SkillBridge / Teams / ${team.name}`}
    >
      <div className="space-y-8">
        
        {/* Navigation & Actions Topbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            to="/teams"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-purple-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Teams</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <Link
              to={`/projects/${team.projectId}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#1a1435] border border-slate-200 dark:border-purple-900/50 hover:bg-slate-50 transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5 text-[#803BE8]" />
              <span>View Associated Project</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>

            <Link
              to="/teammates"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold shadow-xs transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Find More Candidates</span>
            </Link>
          </div>
        </div>

        {/* Team Overview Banner */}
        <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40">
                Project: {team.projectName}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300">
                {team.members.length}/{team.maxMembers} Members Enrolled
              </span>
              {isOwner && (
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-300">
                  You are Team Owner
                </span>
              )}
            </div>

            <span className="text-xs text-slate-400">
              Formed {team.createdAt}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {team.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            {team.description || 'Sprint team actively building and collaborating on course deliverables.'}
          </p>

          {/* Sprint Progress Bar */}
          <div className="pt-4 border-t border-slate-100 dark:border-purple-950/50 space-y-2 max-w-xl">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Overall Team Sprint Progress</span>
              <span className="text-[#803BE8] dark:text-purple-300 font-extrabold text-sm">{progress}% Complete</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#1f193d] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#803BE8] to-pink-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{completedTasks.length} of {teamTasks.length} tasks completed</span>
              <span>{inProgressTasks.length} in progress &bull; {reviewTasks.length} in review</span>
            </div>
          </div>
        </div>

        {/* 2-Column: Team Member Roster & Pending Invitations */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Member Roster (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Team Member Roster ({team.members.length}/{team.maxMembers})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Assigned roles and permissions for this squad
                  </p>
                </div>

                {team.members.length < team.maxMembers && isOwner && (
                  <Link
                    to="/teammates"
                    className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:underline flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite Candidate</span>
                  </Link>
                )}
              </div>

              <div className="space-y-3">
                {team.members.map((member) => {
                  const isMemberOwner = member.studentId === team.ownerId;
                  const isCurrent = member.studentId === currentUser.id;

                  return (
                    <div
                      key={member.studentId}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1a1435] border border-slate-200/80 dark:border-purple-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-purple-200 dark:ring-purple-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {member.name}
                            </h4>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-purple-100 text-[#803BE8]">
                                You
                              </span>
                            )}
                            {isMemberOwner && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-pink-100 text-pink-600">
                                Owner
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {member.university} &bull; Joined {member.joinedAt}
                          </span>
                        </div>
                      </div>

                      {/* Role selection & Management Actions */}
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {isOwner ? (
                          <select
                            value={member.role}
                            onChange={(e) => updateMemberRole(team.id, member.studentId, e.target.value)}
                            className="text-xs font-bold py-1.5 px-3 rounded-xl bg-white dark:bg-[#251e47] text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800 focus:outline-none"
                          >
                            {availableRolesList.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-xs font-bold text-[#803BE8] dark:text-purple-300 bg-purple-50 dark:bg-[#20183e] px-3 py-1 rounded-xl">
                            {member.role}
                          </span>
                        )}

                        {/* Remove button (authorized owner can remove other members) */}
                        {isOwner && !isMemberOwner && (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmAction({
                                title: 'Remove Team Member',
                                message: `Are you sure you want to remove ${member.name} from ${team.name}? They will lose access to team channels and files.`,
                                confirmText: 'Remove Member',
                                onConfirm: () => {
                                  removeMember(team.id, member.studentId);
                                  setConfirmAction(null);
                                },
                              });
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title={`Remove ${member.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Task Board Preview */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-7 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Team Sprint Tasks ({teamTasks.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Live tasks assigned within {team.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTask(null);
                      setTaskModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#803BE8] text-white text-xs font-bold hover:bg-[#6c27cf]"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>New Task</span>
                  </button>

                  <Link
                    to="/tasks"
                    className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:underline px-2 py-1"
                  >
                    Open Full Kanban &rarr;
                  </Link>
                </div>
              </div>

              {teamTasks.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No tasks created yet for this squad. Click "New Task" to create your first sprint item!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {teamTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={(t) => {
                        setEditingTask(t);
                        setTaskModalOpen(true);
                      }}
                      onDelete={(tId) => deleteTask(tId)}
                      onMoveStatus={(tId, s) => moveTaskStatus(tId, s)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Shared Team Documents & Assets */}
            <TeamFileManager teamId={team.id} canUpload={isOwner || isMember} />

          </div>

          {/* Sidebar Column: Pending Invitations & Management (1 Col) */}
          <div className="space-y-6">
            
            {/* Pending Outgoing Invitations */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Pending Invitations ({team.pendingInvitations?.length || 0})
              </h3>

              {team.pendingInvitations?.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No outgoing invitations waiting for response.
                </p>
              ) : (
                <div className="space-y-3">
                  {team.pendingInvitations?.map(inv => (
                    <div
                      key={inv.id}
                      className="p-3 rounded-2xl bg-purple-50/50 dark:bg-[#1b1536] border border-purple-100 dark:border-purple-900/40 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={inv.studentAvatar}
                            alt={inv.studentName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {inv.studentName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Role: {inv.role}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                          Pending
                        </span>
                      </div>

                      {isOwner && (
                        <div className="pt-2 border-t border-purple-100 dark:border-purple-950/60 flex justify-end">
                          <button
                            type="button"
                            onClick={() => cancelTeamInvite(team.id, inv.id)}
                            className="text-[11px] font-semibold text-rose-500 hover:underline"
                          >
                            Cancel Invitation
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions / Team Membership Card */}
            <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Membership Actions
              </h3>
              
              {!isOwner && isMember && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmAction({
                      title: 'Leave Team Squad',
                      message: `Are you sure you want to leave ${team.name}? You will lose access to the team channels and task assignments.`,
                      confirmText: 'Leave Team',
                      onConfirm: () => {
                        leaveTeam(team.id, currentUser.id);
                        setConfirmAction(null);
                        navigate('/teams');
                      },
                    });
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Leave Team</span>
                </button>
              )}

              <Link
                to="/tasks"
                className="w-full py-2.5 px-3 rounded-xl bg-purple-50 dark:bg-[#1e173a] text-[#803BE8] dark:text-purple-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 block text-center"
              >
                <span>View Global Tasks Board &rarr;</span>
              </Link>
            </div>

          </div>

        </div>

      </div>

      {/* Task Creation Modal */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
        defaultTeamId={team.id}
      />

      {/* Destructive Action Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#18122B] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-purple-950/60 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {confirmAction.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {confirmAction.message}
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-purple-900/60 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-purple-950/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAction.onConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-colors"
              >
                {confirmAction.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
