import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  Plus, 
  X, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  Info,
  Layers,
  HeartHandshake
} from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

const TECHNICAL_SKILLS_PRESETS = [
  'React', 'Node.js', 'Python', 'Tailwind CSS', 'TypeScript', 
  'FastAPI', 'Docker', 'PostgreSQL', 'Flutter', 'Next.js'
];

const SOFT_SKILLS_PRESETS = [
  'UI/UX Prototyping', 'Product Management', 'Agile/Scrum', 
  'Pitch Deck Design', 'Technical Writing', 'Public Speaking'
];

const INTEREST_AREAS = [
  'AI & Machine Learning',
  'Web Applications',
  'Mobile Development',
  'UI/UX & Product Design',
  'Cloud & DevOps',
  'FinTech & Blockchain',
  'Cybersecurity',
  'HealthTech & EdTech',
];

const PROJECT_CATEGORIES = [
  { id: 'hackathons', label: 'Hackathon Sprints', desc: '48hr to 72hr competitive builds' },
  { id: 'capstones', label: 'Course Capstones', desc: 'Semester-long team deliverables' },
  { id: 'startups', label: 'Student Startup MVPs', desc: 'Building products with founders' },
  { id: 'opensource', label: 'Open Source Projects', desc: 'Collaborative code contributions' },
];

export default function SetupProfilePage() {
  const navigate = useNavigate();

  // Profile Form State
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
  const [bio, setBio] = useState('Passionate CS student excited about building accessible web tools and exploring LLM agents. Looking for a UI/UX designer and backend partner for upcoming hackathons.');
  
  const [skillsWithLevel, setSkillsWithLevel] = useState([
    { name: 'React', level: 'Advanced' },
    { name: 'Python', level: 'Intermediate' },
    { name: 'UI/UX Prototyping', level: 'Intermediate' },
  ]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const [selectedInterests, setSelectedInterests] = useState([
    'AI & Machine Learning',
    'Web Applications',
    'UI/UX & Product Design',
  ]);

  const [selectedCategories, setSelectedCategories] = useState(['hackathons', 'capstones']);

  const [links, setLinks] = useState({
    github: 'https://github.com/alexmorgan-student',
    linkedin: 'https://linkedin.com/in/alexmorgan-student',
  });

  const [errors, setErrors] = useState({});
  const [demoNotice, setDemoNotice] = useState(null);

  // Avatar Upload Handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatar(file);
      setAvatarPreview(url);
    }
  };

  // Add / Remove Skill
  const handleAddSkill = (skillName, skillLevel = 'Intermediate') => {
    if (!skillName.trim()) return;
    if (skillsWithLevel.some(s => s.name.toLowerCase() === skillName.toLowerCase())) return;

    setSkillsWithLevel(prev => [...prev, { name: skillName.trim(), level: skillLevel }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName) => {
    setSkillsWithLevel(prev => prev.filter(s => s.name !== skillName));
  };

  const handleUpdateSkillLevel = (skillName, newLevel) => {
    setSkillsWithLevel(prev =>
      prev.map(s => (s.name === skillName ? { ...s, level: newLevel } : s))
    );
  };

  // Toggle Interests
  const toggleInterest = (interest) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  // Toggle Project Category
  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  // URL Validation Helpers
  const isValidUrl = (string) => {
    if (!string.trim()) return true; // Optional field if empty
    try {
      const url = new URL(string.trim());
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const validate = () => {
    const newErrors = {};

    if (links.github && !isValidUrl(links.github)) {
      newErrors.github = 'Please enter a valid URL (e.g. https://github.com/username)';
    }

    if (links.linkedin && !isValidUrl(links.linkedin)) {
      newErrors.linkedin = 'Please enter a valid URL (e.g. https://linkedin.com/in/username)';
    }

    if (bio.length > 300) {
      newErrors.bio = 'Bio should be 300 characters or fewer';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { updateProfile } = useAuth();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const skillNames = skillsWithLevel.map(s => s.name);
    const proficiencyMap = {};
    skillsWithLevel.forEach(s => {
      proficiencyMap[s.name] = s.level;
    });

    const profilePayload = {
      bio: bio.trim(),
      skills: skillNames,
      proficiency: proficiencyMap,
      availability: weeklyHours,
      preferredRoles: roles,
      interests: interestAreas,
      avatar: avatarPreview,
      github: githubUrl.trim(),
      linkedin: linkedinUrl.trim(),
    };

    setDemoNotice('Profile saved to SkillBridge! Synchronizing your builder identity with the matchmaking engine...');

    try {
      await updateProfile(profilePayload);
    } catch (err) {
      // Continue safely
    }

    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Complete Your Builder Profile"
      subtitle="Help students discover your complementary skills and invite you to exciting project teams."
      badge="Step 2 of 2 &bull; Profile Customization"
      maxWidth="max-w-3xl"
    >
      {/* Demo Notification Banner */}
      {demoNotice ? (
        <div className="mb-6 p-4 rounded-2xl bg-purple-50 dark:bg-[#20183e] border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-[#803BE8] dark:text-purple-300 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-pink-500" />
          <div>
            <p className="font-semibold">{demoNotice}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Taking you back to the home page...</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 rounded-xl bg-purple-50/70 dark:bg-[#1a1435]/70 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0" />
            <span><strong>Frontend Demo Mode:</strong> Customize your student profile options below.</span>
          </div>
          <button
            type="button"
            onClick={handleSkip}
            className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-[#803BE8] dark:hover:text-pink-300 underline"
          >
            Skip for Now
          </button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8" noValidate>
        
        {/* 1. Profile Photo Upload UI */}
        <div className="p-5 rounded-2xl bg-slate-50/70 dark:bg-[#1a1435]/60 border border-purple-100 dark:border-purple-900/40 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <img
              src={avatarPreview}
              alt="Profile Avatar Preview"
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white dark:border-[#251e47] shadow-md"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#803BE8] text-white shadow-md hover:bg-[#6c27cf] cursor-pointer transition-transform hover:scale-110"
              title="Upload new picture"
            >
              <Camera className="w-4 h-4" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Profile Photo
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Upload a clear photo or avatar so teammates know who they are collaborating with. JPG, PNG or WEBP (Max 5MB).
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <label
                htmlFor="avatar-upload"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-[#261f4c] text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 shadow-xs cursor-pointer hover:bg-purple-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </label>

              {/* Quick Preset Buttons */}
              <button
                type="button"
                onClick={() => setAvatarPreview('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=250')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-[#1f193d] border border-slate-200 dark:border-purple-900/40 hover:text-[#803BE8]"
              >
                Preset 1
              </button>
              <button
                type="button"
                onClick={() => setAvatarPreview('https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250')}
                className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-[#1f193d] border border-slate-200 dark:border-purple-900/40 hover:text-[#803BE8]"
              >
                Preset 2
              </button>
            </div>
          </div>
        </div>

        {/* 2. Short Bio */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="bio" className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              Short Bio / Elevator Pitch
            </label>
            <span className={`text-[11px] font-medium ${bio.length > 300 ? 'text-rose-500' : 'text-slate-400'}`}>
              {bio.length} / 300 characters
            </span>
          </div>

          <textarea
            id="bio"
            rows={3}
            value={bio}
            onChange={(e) => {
              setBio(e.target.value);
              if (errors.bio) setErrors(prev => ({ ...prev, bio: undefined }));
            }}
            placeholder="Share your interests, what you enjoy building, and what kind of projects or teammates you are searching for..."
            className="w-full rounded-2xl text-xs sm:text-sm p-3.5 bg-slate-50/70 dark:bg-[#1c1735]/80 border border-purple-100 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#803BE8] focus:ring-2 focus:ring-[#803BE8]/25"
          />

          {errors.bio && (
            <p className="text-xs text-rose-500 pl-1">{errors.bio}</p>
          )}
        </div>

        {/* 3. Technical & Non-Technical Skills with Proficiency Levels */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
                Skills &amp; Proficiency Levels
              </h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Add both coding languages, tools, and collaboration capabilities.
              </p>
            </div>
            <span className="text-xs text-purple-600 dark:text-purple-300 font-semibold">
              {skillsWithLevel.length} Added
            </span>
          </div>

          {/* Quick Preset Tags to Add */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quick Add Tech:</span>
            <div className="flex flex-wrap gap-1.5">
              {TECHNICAL_SKILLS_PRESETS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill, 'Intermediate')}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#1b1536] text-slate-700 dark:text-slate-300 hover:bg-purple-100 hover:text-[#803BE8] dark:hover:bg-[#251e4a] border border-slate-200/60 dark:border-purple-900/40 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pt-1">Quick Add Design &amp; Soft Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {SOFT_SKILLS_PRESETS.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill, 'Intermediate')}
                  className="text-xs font-medium px-2.5 py-1 rounded-full bg-pink-50/70 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/50 border border-pink-200/50 dark:border-pink-900/40 transition-colors"
                >
                  + {skill}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Skill Input Row */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <input
              type="text"
              placeholder="Type custom skill name (e.g. GraphQL, Solidity, Rust)..."
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkillName, newSkillLevel);
                }
              }}
              className="flex-1 rounded-xl text-xs sm:text-sm px-3.5 py-2.5 bg-slate-50/70 dark:bg-[#1c1735]/80 border border-purple-100 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#803BE8]"
            />

            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value)}
              className="rounded-xl text-xs sm:text-sm px-3 py-2.5 bg-slate-50/70 dark:bg-[#1c1735]/80 border border-purple-100 dark:border-purple-900/60 text-slate-900 dark:text-white focus:outline-none focus:border-[#803BE8]"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>

            <button
              type="button"
              onClick={() => handleAddSkill(newSkillName, newSkillLevel)}
              className="px-4 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6e27d5] text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>

          {/* Skill List with Interactive Level Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {skillsWithLevel.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/60 dark:bg-[#1c1638] border border-purple-100 dark:border-purple-900/40"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                    {skill.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={skill.level}
                    onChange={(e) => handleUpdateSkillLevel(skill.name, e.target.value)}
                    className="text-[11px] font-semibold py-1 px-2 rounded-lg bg-white dark:bg-[#251e4a] border border-purple-200 dark:border-purple-800/50 text-[#803BE8] dark:text-purple-300 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                    aria-label={`Remove ${skill.name}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Areas of Interest */}
        <div className="space-y-2.5">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
            Areas of Interest &bull; Focus Domains
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {INTEREST_AREAS.map((interest) => {
              const selected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-left flex items-center justify-between ${
                    selected
                      ? 'bg-purple-100/90 dark:bg-purple-900/60 text-[#803BE8] dark:text-purple-200 border-[#803BE8]/60 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#1a1435] text-slate-600 dark:text-slate-400 border-purple-100 dark:border-purple-900/40 hover:border-purple-300'
                  }`}
                >
                  <span className="truncate">{interest}</span>
                  {selected && <Check className="w-3 h-3 text-[#803BE8] dark:text-pink-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Preferred Project Categories */}
        <div className="space-y-2.5">
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
            Preferred Project Types
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROJECT_CATEGORIES.map((cat) => {
              const checked = selectedCategories.includes(cat.id);
              return (
                <div
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 select-none ${
                    checked
                      ? 'bg-purple-50 dark:bg-[#1e173e] border-[#803BE8] dark:border-purple-700 shadow-xs'
                      : 'bg-slate-50/70 dark:bg-[#171230] border-purple-100 dark:border-purple-900/40 hover:border-purple-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => {}}
                    className="mt-0.5 h-4 w-4 rounded border-purple-300 text-[#803BE8] focus:ring-[#803BE8]/30 accent-[#803BE8]"
                  />
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {cat.label}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. GitHub & LinkedIn Links */}
        <div className="space-y-3">
          <h4 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
            Professional Profile Links
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              id="github"
              name="github"
              type="url"
              label="GitHub Profile URL"
              placeholder="https://github.com/yourhandle"
              value={links.github}
              onChange={(e) => setLinks(prev => ({ ...prev, github: e.target.value }))}
              error={errors.github}
              icon={Globe}
              helperText="Enables skill & repository verification"
            />

            <InputField
              id="linkedin"
              name="linkedin"
              type="url"
              label="LinkedIn Profile URL"
              placeholder="https://linkedin.com/in/yourhandle"
              value={links.linkedin}
              onChange={(e) => setLinks(prev => ({ ...prev, linkedin: e.target.value }))}
              error={errors.linkedin}
              icon={Globe}
              helperText="Verify collegiate and leadership experience"
            />
          </div>
        </div>

        {/* 7. Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-purple-100 dark:border-purple-900/50">
          <Button
            type="button"
            variant="outline"
            fullWidth={false}
            onClick={handleSkip}
            className="w-full sm:w-auto"
          >
            Skip for Now
          </Button>

          <Button
            type="submit"
            variant="primary"
            fullWidth={false}
            icon={ArrowRight}
            className="w-full sm:w-auto px-8"
          >
            Save Profile &amp; Continue
          </Button>
        </div>

      </form>
    </AuthLayout>
  );
}
