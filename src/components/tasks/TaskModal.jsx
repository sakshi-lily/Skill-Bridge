import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Flag, 
  UserCheck, 
  Folder,
  FileText
} from 'lucide-react';
import { useTeamTask } from '../../context/TeamTaskContext';

export default function TaskModal({ 
  isOpen, 
  onClose, 
  initialTask = null, 
  defaultTeamId = null,
  defaultStatus = 'To Do'
}) {
  const { teams, myTeams, createTask, updateTask, currentUser } = useTeamTask();

  // If user belongs to teams, prioritize myTeams, else fallback to all teams
  const availableTeams = myTeams.length > 0 ? myTeams : teams;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamId: '',
    assignedMemberId: '',
    priority: 'Medium',
    status: defaultStatus,
    dueDate: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setFormData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        teamId: initialTask.teamId || '',
        assignedMemberId: initialTask.assignedTo?.id || '',
        priority: initialTask.priority || 'Medium',
        status: initialTask.status || defaultStatus,
        dueDate: initialTask.dueDate || '',
      });
    } else {
      const selectedTeam = defaultTeamId 
        ? availableTeams.find(t => t.id === defaultTeamId) 
        : availableTeams[0];

      setFormData({
        title: '',
        description: '',
        teamId: selectedTeam ? selectedTeam.id : '',
        assignedMemberId: currentUser.id,
        priority: 'Medium',
        status: defaultStatus,
        dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      });
    }
    setErrors({});
  }, [initialTask, isOpen, defaultTeamId, defaultStatus]);

  if (!isOpen) return null;

  // Selected team object to populate member choices
  const currentTeam = availableTeams.find(t => t.id === formData.teamId) || availableTeams[0];
  const teamMembers = currentTeam ? currentTeam.members : [
    { studentId: currentUser.id, name: currentUser.name, avatar: currentUser.avatar }
  ];

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Task title is required.';
    }
    if (!formData.teamId) {
      errs.teamId = 'Please select an associated project team.';
    }
    if (!formData.dueDate) {
      errs.dueDate = 'Due date is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Find assigned member details
    const memberObj = teamMembers.find(m => m.studentId === formData.assignedMemberId);
    const assignedTo = memberObj
      ? { id: memberObj.studentId, name: memberObj.name, avatar: memberObj.avatar }
      : { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar };

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      teamId: currentTeam?.id || formData.teamId,
      teamName: currentTeam?.name || 'SkillBridge Team',
      projectId: currentTeam?.projectId || 'proj-general',
      projectName: currentTeam?.projectName || currentTeam?.name || 'Project Mission',
      assignedTo,
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate,
    };

    if (initialTask) {
      updateTask(initialTask.id, payload);
    } else {
      createTask(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white dark:bg-[#18122B] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-white/10 flex items-center justify-between bg-gradient-to-r from-purple-50/50 to-pink-50/30 dark:from-purple-950/20 dark:to-pink-950/10">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-2 bg-[#803BE8]/10 text-[#803BE8] rounded-xl">
                <FileText className="w-5 h-5" />
              </span>
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {initialTask 
                ? 'Update task status, priority, or assignee.' 
                : 'Define project deliverables and assign them to team members.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Design responsive student navigation bar"
              className={`w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8] transition-colors ${
                errors.title 
                  ? 'border-rose-400 focus:ring-rose-400' 
                  : 'border-slate-200 dark:border-white/10'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Specify requirements, acceptance criteria, or links to references..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8] transition-colors resize-none"
            />
          </div>

          {/* Associated Team & Project */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5 text-purple-500" />
                Team & Project <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.teamId}
                onChange={(e) => {
                  const newTeamId = e.target.value;
                  const chosen = availableTeams.find(t => t.id === newTeamId);
                  setFormData({
                    ...formData,
                    teamId: newTeamId,
                    assignedMemberId: chosen?.members[0]?.studentId || currentUser.id,
                  });
                }}
                className={`w-full px-3 py-2.5 rounded-xl border bg-slate-50 dark:bg-[#1f1737] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8] transition-colors ${
                  errors.teamId 
                    ? 'border-rose-400' 
                    : 'border-slate-200 dark:border-white/10'
                }`}
              >
                {availableTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.projectName || 'Project'})
                  </option>
                ))}
              </select>
              {errors.teamId && (
                <p className="text-xs text-rose-500 mt-1">{errors.teamId}</p>
              )}
            </div>

            {/* Assignee */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-purple-500" />
                Assigned Member
              </label>
              <select
                value={formData.assignedMemberId}
                onChange={(e) => setFormData({ ...formData, assignedMemberId: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1f1737] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8] transition-colors"
              >
                {teamMembers.map(m => (
                  <option key={m.studentId} value={m.studentId}>
                    {m.name} {m.studentId === currentUser.id ? '(You)' : `— ${m.role || 'Member'}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority, Status, Due Date Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Flag className="w-3.5 h-3.5 text-purple-500" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1f1737] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#1f1737] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Review">Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border bg-slate-50 dark:bg-[#1f1737] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8] ${
                  errors.dueDate 
                    ? 'border-rose-400' 
                    : 'border-slate-200 dark:border-white/10'
                }`}
              />
              {errors.dueDate && (
                <p className="text-xs text-rose-500 mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#803BE8] to-[#9B51E0] hover:from-[#722ed1] hover:to-[#8a3fd6] text-white text-sm font-semibold shadow-md shadow-purple-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {initialTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
