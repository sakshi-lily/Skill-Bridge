import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useTeamTask } from '../../context/TeamTaskContext';

export default function InviteToTeamModal({ student, isOpen, onClose }) {
  const { myTeams, sendTeamInvite } = useTeamTask();

  const [selectedTeamId, setSelectedTeamId] = useState(myTeams[0]?.id || '');
  const [role, setRole] = useState(student?.preferredRoles?.[0] || 'Frontend Developer');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !student) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedTeamId) {
      setError('Please select a team to send the invitation from.');
      return;
    }

    const res = sendTeamInvite(selectedTeamId, student, role, note);
    if (!res.success) {
      setError(res.error || 'Unable to send invitation.');
      return;
    }

    setSuccess(true);
  };

  const handleClose = () => {
    setSuccess(false);
    setError('');
    setNote('');
    onClose();
  };

  const selectedTeam = myTeams.find(t => t.id === selectedTeamId);

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
                Invitation Sent!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                An invitation has been sent to <strong className="text-[#803BE8] dark:text-purple-300">{student.name}</strong> to join <strong>{selectedTeam?.name}</strong> as <strong>{role}</strong>.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-[#20183e] border border-purple-200/80 dark:border-purple-800/60 text-left text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Session Demo Notice:</span>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                  This invitation is now tracked in your team's Pending Invitations list at <strong>/teams</strong>.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold transition-all shadow-md shadow-purple-600/20"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-[10px] font-bold text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 mb-2">
                <ShieldCheck className="w-3 h-3" />
                <span>Team Invitation</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Invite {student.name} to Your Team
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {student.university} &bull; {student.courseAndYear}
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Team */}
            <div className="space-y-1.5">
              <label htmlFor="select-team" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Choose Team <span className="text-pink-500">*</span>
              </label>
              <select
                id="select-team"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
              >
                {myTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.projectName}) &bull; {t.members.length}/{t.maxMembers} members
                  </option>
                ))}
              </select>
            </div>

            {/* Role to Assign */}
            <div className="space-y-1.5">
              <label htmlFor="assign-role" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Assigned Role <span className="text-pink-500">*</span>
              </label>
              <input
                id="assign-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Frontend Developer, UI/UX Designer, ML Engineer"
                className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                required
              />
            </div>

            {/* Optional Personal Note */}
            <div className="space-y-1.5">
              <label htmlFor="invitation-note" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Invitation Note / Pitch <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="invitation-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Why do you think this student would be an awesome teammate for your squad?"
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
                className="px-5 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold shadow-md shadow-purple-600/20 hover:shadow-purple-600/35 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Invitation</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
