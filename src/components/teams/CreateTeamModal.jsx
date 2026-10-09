import React, { useState } from 'react';
import { X, Users, CheckCircle2, AlertCircle, ShieldCheck, FolderKanban } from 'lucide-react';
import { useTeamTask } from '../../context/TeamTaskContext';
import { useProjects } from '../../context/ProjectsContext';

export default function CreateTeamModal({ isOpen, onClose, defaultProjectId }) {
  const { createTeam } = useTeamTask();
  const { projects } = useProjects();

  const [name, setName] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [description, setDescription] = useState('');
  const [creatorRole, setCreatorRole] = useState('Team Lead / Full-Stack');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedProject = projects.find(p => p.id === projectId) || projects[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a team name.');
      return;
    }

    if (!projectId) {
      setError('Please associate this team with an active project.');
      return;
    }

    createTeam({
      name: name.trim(),
      projectId: selectedProject.id,
      projectName: selectedProject.title,
      description: description.trim(),
      creatorRole: creatorRole.trim(),
      maxMembers: selectedProject.teamSize || 4,
    });

    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#16122c] border border-purple-200 dark:border-purple-900/60 p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#20183e] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Team Created!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Team <strong className="text-[#803BE8] dark:text-purple-300">{name}</strong> has been formed for project <strong>{selectedProject?.title}</strong>. You are the designated Team Owner.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
              >
                View Teams
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[10px] font-bold text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 mb-2">
                <ShieldCheck className="w-3 h-3" />
                <span>Form New Squad</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Create a Collaborative Team
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Establish an authorized squad to invite student candidates and manage project sprint tasks.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Team Name */}
            <div className="space-y-1.5">
              <label htmlFor="team-name" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Team Name <span className="text-pink-500">*</span>
              </label>
              <input
                id="team-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. ApexInnovators, LambdaSquad"
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                required
              />
            </div>

            {/* Associated Project */}
            <div className="space-y-1.5">
              <label htmlFor="assoc-project" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Associated Project <span className="text-pink-500">*</span>
              </label>
              <select
                id="assoc-project"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.title} (Max size: {p.teamSize} members)
                  </option>
                ))}
              </select>
            </div>

            {/* Creator Assigned Role */}
            <div className="space-y-1.5">
              <label htmlFor="creator-role" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Your Role as Creator
              </label>
              <input
                id="creator-role"
                type="text"
                value={creatorRole}
                onChange={(e) => setCreatorRole(e.target.value)}
                placeholder="e.g. Team Lead, Frontend Architect"
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
              />
            </div>

            {/* Team Description */}
            <div className="space-y-1.5">
              <label htmlFor="team-desc" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Team Description / Sprint Goal <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="team-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief mission statement or weekly meeting cadence..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f193d]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold shadow-md shadow-purple-600/20 hover:shadow-purple-600/35 transition-all flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Create Team</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
