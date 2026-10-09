import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import Button from '../components/auth/Button';

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [demoNotice, setDemoNotice] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    // Explicit demo message as required: no fake success banner, clearly marked demo
    setDemoNotice(
      `Frontend Demo Mode: Client validation succeeded for ${formData.email}. Connecting to the student dashboard...`
    );

    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <AuthLayout
      title="Welcome Back to SkillBridge"
      subtitle="Sign in to collaborate on campus projects, match with peers, and manage milestones."
      badge="Student &amp; Faculty Portal"
      maxWidth="max-w-md"
    >
      {/* Demo Notice Banner */}
      {demoNotice ? (
        <div className="mb-6 p-4 rounded-2xl bg-purple-50 dark:bg-[#20183e] border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-[#803BE8] dark:text-purple-300 flex items-start gap-3">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-pink-500" />
          <div>
            <p className="font-semibold">{demoNotice}</p>
            <div className="mt-2.5 flex flex-wrap gap-2.5">
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-1 text-xs font-bold text-white bg-[#803BE8] px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#6c27cf]"
              >
                <span>Enter Dashboard &rarr;</span>
              </Link>
              <Link
                to="/setup-profile"
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#803BE8] px-2 py-1.5"
              >
                <span>Profile Setup</span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 p-3 rounded-xl bg-purple-50/70 dark:bg-[#1a1435]/70 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0" />
          <span><strong>Frontend Demo Mode:</strong> Client-side validation active. Backend authentication connects in later steps.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* Email Address */}
        <InputField
          id="email"
          name="email"
          type="email"
          label="College / Email Address"
          placeholder="e.g. alex@university.edu"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={Mail}
          required
          autoComplete="email"
        />

        {/* Password */}
        <InputField
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={Lock}
          required
          autoComplete="current-password"
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between pt-1 text-xs sm:text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 rounded border-purple-300 text-[#803BE8] focus:ring-[#803BE8]/30 accent-[#803BE8]"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-medium text-[#803BE8] dark:text-pink-400 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <div className="pt-3">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            icon={ArrowRight}
          >
            Sign In
          </Button>
        </div>

        {/* Quick Demo Pre-fill Links for convenience */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setFormData({
                email: 'alex.student@stanford.edu',
                password: 'password123',
                rememberMe: true,
              });
              setErrors({});
            }}
            className="text-[11px] text-purple-600 dark:text-purple-300 hover:underline"
          >
            Fill Demo Student Credentials
          </button>
        </div>

        {/* Link to Sign Up */}
        <div className="text-center pt-3 border-t border-purple-50 dark:border-purple-950/60 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Don't have a SkillBridge account yet?{' '}
          <Link
            to="/signup"
            className="font-bold text-[#803BE8] dark:text-pink-400 hover:underline transition-colors"
          >
            Create an Account
          </Link>
        </div>

      </form>
    </AuthLayout>
  );
}
