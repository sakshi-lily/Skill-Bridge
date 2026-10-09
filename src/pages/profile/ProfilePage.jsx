import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  GraduationCap, 
  MapPin, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  Plus, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Briefcase, 
  Clock, 
  Heart 
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

function GithubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Edit form state
  const [formData, setFormData] = useState({
    name: user?.name || 'Alex Morgan',
    bio: user?.bio || 'Full-stack builder passionate about developer tooling, real-time collaboration, and accessible design systems.',
    university: user?.academic?.university || user?.university || 'Stanford University',
    courseAndYear: user?.academic?.course || user?.courseAndYear || 'CS Junior • Year 3',
    availability: user?.availability || '10-15 hrs/week',
    experienceLevel: user?.experienceLevel || 'Intermediate',
    github: user?.github || 'https://github.com',
    linkedin: user?.linkedin || 'https://linkedin.com',
  });

  // Skills state
  const [skills, setSkills] = useState(user?.skills || ['React', 'Python', 'FastAPI', 'Tailwind CSS', 'PostgreSQL', 'UI/UX Design']);
  const [newSkillInput, setNewSkillInput] = useState('');

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (!newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    if (!skills.includes(trimmed)) {
      const updated = [...skills, trimmed];
      setSkills(updated);
      updateProfile({ skills: updated });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = skills.filter(s => s !== skillToRemove);
    setSkills(updated);
    updateProfile({ skills: updated });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      await updateProfile({
        ...formData,
        skills,
      });
      setSuccessMsg('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="My Builder Profile" breadcrumb="Dashboard / Profile">
      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        {/* Ambient Top Background */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-600/10 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
                alt={user?.name || "Student"}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-[#120e24] shadow-lg"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#120e24]" title="Active Matchmaking Status" />
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {user?.name || "Alex Morgan"}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-[#803BE8] dark:text-purple-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Builder</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                {formData.courseAndYear} &bull; {formData.university}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#803BE8]" />
                  <span>{user?.email || "alex.morgan@stanford.edu"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-500" />
                  <span>{formData.availability}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-purple-900/60 bg-white dark:bg-[#1a1435] text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#803BE8] hover:text-[#803BE8] transition-all shadow-xs shrink-0 self-center sm:self-auto"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Form Modal / Drawer */}
      {isEditing && (
        <form
          onSubmit={handleSaveProfile}
          className="bg-white dark:bg-[#120e24] border border-[#803BE8]/30 rounded-3xl p-6 sm:p-8 shadow-md space-y-5 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-purple-950/40 pb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#803BE8]" />
              <span>Customize Builder Profile</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                University / Institution
              </label>
              <input
                type="text"
                value={formData.university}
                onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Academic Program &amp; Year
              </label>
              <input
                type="text"
                value={formData.courseAndYear}
                onChange={(e) => setFormData({ ...formData, courseAndYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Weekly Availability
              </label>
              <input
                type="text"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Builder Biography &amp; Goals
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="url"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-5 py-2 rounded-xl border border-slate-200 dark:border-purple-900/60 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-xl bg-[#803BE8] text-white text-xs font-bold shadow-md hover:bg-[#6c2bd9] transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio & Skills */}
        <div className="lg:col-span-2 space-y-6">
          {/* Biography */}
          <div className="bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#803BE8]" />
              <span>About Me</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {formData.bio}
            </p>
          </div>

          {/* Verified Skills & Matchmaking Tags */}
          <div className="bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#803BE8]" />
                  <span>Technical Skills &amp; Stack</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Used by SkillBridge matchmaking algorithms to pair you with high-affinity projects.
                </p>
              </div>
            </div>

            {/* Skills Pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-[#1c1638] text-slate-800 dark:text-slate-200 border border-purple-100 dark:border-purple-900/50 text-xs font-semibold group"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="p-0.5 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
                    title={`Remove ${skill}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Skill Input */}
            <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                placeholder="Add skill (e.g., Docker, Next.js, Figma)..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#181232] border border-slate-200 dark:border-purple-900/60 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#803BE8]/30"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#803BE8] text-white text-xs font-bold hover:bg-[#6c2bd9] transition-all shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Experience & Socials */}
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Matchmaking Profile
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1435]">
                <span className="text-slate-500 dark:text-slate-400">Experience Tier</span>
                <span className="font-bold text-slate-900 dark:text-white">{formData.experienceLevel}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1435]">
                <span className="text-slate-500 dark:text-slate-400">Match Status</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Open to Invites</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#1a1435]">
                <span className="text-slate-500 dark:text-slate-400">Preferred Roles</span>
                <span className="font-bold text-slate-900 dark:text-white">Full-Stack &bull; Lead</span>
              </div>
            </div>
          </div>

          {/* Connected Profiles */}
          <div className="bg-white dark:bg-[#120e24] border border-slate-200/80 dark:border-purple-950/60 rounded-3xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Linked Portfolios
            </h3>

            <div className="space-y-2.5">
              <a
                href={formData.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-purple-950/50 hover:border-[#803BE8] transition-all group"
              >
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <GithubIcon className="w-4 h-4 text-slate-600 dark:text-slate-400 group-hover:text-[#803BE8]" />
                  <span>GitHub Repository</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#803BE8]" />
              </a>

              <a
                href={formData.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-purple-950/50 hover:border-[#803BE8] transition-all group"
              >
                <div className="flex items-center gap-2.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <LinkedinIcon className="w-4 h-4 text-sky-600 group-hover:text-[#803BE8]" />
                  <span>LinkedIn Network</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#803BE8]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
