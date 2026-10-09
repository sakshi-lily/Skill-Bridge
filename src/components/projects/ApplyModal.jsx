import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, X, ShieldCheck, Sparkles } from 'lucide-react';

export default function ApplyModal({ project, isOpen, onClose, onConfirm }) {
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !project) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      onConfirm(project.id, note);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const handleClose = () => {
    setSubmitted(false);
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#16122c] border border-purple-200 dark:border-purple-900/60 p-6 sm:p-7 shadow-2xl relative animate-in fade-in zoom-in-95">
        
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#20183e] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Application Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Your application to join <strong className="text-[#803BE8] dark:text-purple-300">{project.title}</strong> has been set to <strong>Pending</strong>.
              </p>
            </div>

            {/* Demo indicator notice */}
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-[#20183e] border border-purple-200/80 dark:border-purple-800/60 text-left text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Frontend Demo Simulation:</span>
                <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                  This application is registered in your active browser session. When the backend and database are connected, notifications will be dispatched to {project.owner?.name}.
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
                <span>Confirm Application</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Apply to Join "{project.title}"
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Project Lead: <strong className="text-slate-700 dark:text-slate-200">{project.owner?.name}</strong> &bull; {project.owner?.university}
              </p>
            </div>

            {/* Summary preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1b1535] border border-slate-200/80 dark:border-purple-900/40 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Applicant:</span>
                <span className="font-bold text-slate-900 dark:text-white">Alex Morgan (CS Junior @ Stanford)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Open Positions:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-300">{project.openPositionsCount} available ({project.availableRoles?.join(', ') || 'General'})</span>
              </div>
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                <span>Commitment:</span>
                <span>{project.weeklyCommitment || '6-8 hrs/week'}</span>
              </div>
            </div>

            {/* Optional message to lead */}
            <div className="space-y-1.5">
              <label htmlFor="apply-note" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                Brief Introduction / Note for Project Lead <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="apply-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Share your experience with the requested stack and what role you'd like to take on..."
                className="w-full text-xs sm:text-sm p-3 rounded-2xl bg-slate-50/80 dark:bg-[#1a1435] border border-slate-200 dark:border-purple-900/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#803BE8] focus:ring-2 focus:ring-[#803BE8]/25"
              />
            </div>

            {/* Demo indicator alert */}
            <div className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span>Simulated demo submission. Your status will update to <strong>Pending</strong> in this session.</span>
            </div>

            {/* Action buttons */}
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
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold shadow-md shadow-purple-600/20 hover:shadow-purple-600/35 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Confirm & Apply'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
