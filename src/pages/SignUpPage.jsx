import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Plus, 
  X, 
  ArrowRight,
  Info
} from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import Button from '../components/auth/Button';

const PRESET_SKILLS = [
  'React', 'Python', 'UI/UX Design', 'Node.js', 'Machine Learning', 
  'Java', 'Tailwind CSS', 'Figma', 'TypeScript', 'SQL'
];

export default function SignUpPage() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    university: '',
    courseAndYear: '',
    role: 'Student', // 'Student' or 'Faculty'
    skills: ['React'],
    agreeTerms: false,
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [demoNotice, setDemoNotice] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field-specific error upon typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const toggleSkill = (skill) => {
    setFormData(prev => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists 
          ? prev.skills.filter(s => s !== skill)
          : [...prev.skills, skill]
      };
    });
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, trimmed]
      }));
      setCustomSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Frontend Validation
  const validate = () => {
    const newErrors = {};

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // College Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'College email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // University
    if (!formData.university.trim()) {
      newErrors.university = 'College or university name is required';
    }

    // Course & Academic Year
    if (!formData.courseAndYear.trim()) {
      newErrors.courseAndYear = 'Course & academic year is required (e.g., B.Tech CS - Year 3)';
    }

    // Terms & Conditions
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Frontend demo notice: no backend/JWT/MongoDB yet
    setDemoNotice(
      'Frontend Demo: Client-side validation passed! In production, this data registers to MongoDB via API. Continuing to profile setup...'
    );

    // Navigate to profile setup after brief demo delay
    setTimeout(() => {
      navigate('/setup-profile');
    }, 1200);
  };

  return (
    <AuthLayout
      title="Create Your SkillBridge Account"
      subtitle="Find complementary peers, build team synergy, and launch hackathon-ready projects."
      badge="Student &amp; Faculty Registration"
      maxWidth="max-w-2xl"
    >
      {/* Demo Notice Banner */}
      {demoNotice ? (
        <div className="mb-6 p-4 rounded-2xl bg-purple-50 dark:bg-[#20183e] border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-[#803BE8] dark:text-purple-300 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-pink-500" />
          <div>
            <p className="font-semibold">{demoNotice}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Redirecting to /setup-profile...</p>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 rounded-xl bg-purple-50/70 dark:bg-[#1a1435]/70 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0" />
          <span><strong>Frontend Demo Mode:</strong> Full field validation is active. Backend APIs will connect in later phases.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        
        {/* Role Selection: Student vs Faculty */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            I am joining as a <span className="text-pink-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {['Student', 'Faculty'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, role }))}
                className={`py-2.5 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${
                  formData.role === role
                    ? 'bg-[#803BE8] text-white border-[#803BE8] shadow-sm shadow-purple-500/25'
                    : 'bg-slate-50 dark:bg-[#1c1735] text-slate-700 dark:text-slate-300 border-purple-100 dark:border-purple-900/40 hover:border-purple-300'
                }`}
              >
                <span>{role}</span>
                {formData.role === role && <CheckCircle2 className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* Row 1: Full Name & College Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="fullName"
            name="fullName"
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            icon={User}
            required
            autoComplete="name"
          />

          <InputField
            id="email"
            name="email"
            type="email"
            label="College / University Email"
            placeholder="e.g. alex@stanford.edu"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={Mail}
            required
            autoComplete="email"
            helperText="University (.edu / college domain) preferred"
          />
        </div>

        {/* Row 2: University & Course/Year */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="university"
            name="university"
            label="College / University Name"
            placeholder="e.g. Stanford University"
            value={formData.university}
            onChange={handleChange}
            error={errors.university}
            icon={GraduationCap}
            required
          />

          <InputField
            id="courseAndYear"
            name="courseAndYear"
            label="Course & Academic Year"
            placeholder="e.g. B.Tech Computer Science, 3rd Year"
            value={formData.courseAndYear}
            onChange={handleChange}
            error={errors.courseAndYear}
            icon={BookOpen}
            required
          />
        </div>

        {/* Row 3: Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            id="password"
            name="password"
            type="password"
            label="Password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={Lock}
            required
            autoComplete="new-password"
          />

          <InputField
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={Lock}
            required
            autoComplete="new-password"
          />
        </div>

        {/* Optional Skills Selection */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">
              Select Your Top Skills <span className="text-slate-400 font-normal text-xs">(Optional during registration)</span>
            </label>
            <span className="text-xs text-purple-600 dark:text-purple-300 font-medium">
              {formData.skills.length} selected
            </span>
          </div>

          {/* Preset Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_SKILLS.map((skill) => {
              const selected = formData.skills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-150 select-none ${
                    selected
                      ? 'bg-purple-100 dark:bg-purple-900/60 text-[#803BE8] dark:text-purple-200 border-[#803BE8]/60 shadow-xs'
                      : 'bg-slate-50 dark:bg-[#1a1435] text-slate-600 dark:text-slate-400 border-purple-100 dark:border-purple-900/40 hover:border-purple-300'
                  }`}
                >
                  {selected && '✓ '}
                  {skill}
                </button>
              );
            })}
          </div>

          {/* Custom Skill Input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add another skill (e.g. Flutter, Go, Docker)..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSkill(e);
                }
              }}
              className="flex-1 rounded-xl text-xs sm:text-sm px-3.5 py-2 bg-slate-50/70 dark:bg-[#1c1735]/80 border border-purple-100 dark:border-purple-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#803BE8]"
            />
            <button
              type="button"
              onClick={handleAddCustomSkill}
              className="px-3.5 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-[#803BE8] hover:text-white dark:hover:bg-[#803BE8] text-[#803BE8] dark:text-purple-200 text-xs font-bold transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          {/* Currently Selected Badges */}
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-purple-50 dark:border-purple-950/60">
              {formData.skills.map(s => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-md bg-purple-50 dark:bg-[#20183f] text-[#803BE8] dark:text-pink-300 border border-purple-200/60 dark:border-purple-800/40"
                >
                  {s}
                  <button
                    type="button"
                    onClick={() => removeSkill(s)}
                    className="hover:text-rose-500 transition-colors ml-0.5"
                    aria-label={`Remove ${s}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Terms and Conditions Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-1 h-4 w-4 rounded border-purple-300 text-[#803BE8] focus:ring-[#803BE8]/30 accent-[#803BE8]"
            />
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-snug">
              I agree to the{' '}
              <a href="#" className="font-semibold text-[#803BE8] dark:text-purple-300 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-semibold text-[#803BE8] dark:text-purple-300 hover:underline">
                Privacy Policy
              </a>
              , and confirm my affiliation with an accredited educational institution.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="mt-1.5 text-xs text-rose-500 pl-6">{errors.agreeTerms}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            icon={ArrowRight}
          >
            Create Account
          </Button>
        </div>

        {/* Link to Sign In */}
        <div className="text-center pt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Already have a SkillBridge account?{' '}
          <Link
            to="/login"
            className="font-bold text-[#803BE8] dark:text-pink-400 hover:underline transition-colors"
          >
            Sign In here
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
}
