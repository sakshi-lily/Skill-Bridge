import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Info, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import Button from '../components/auth/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (serverError) {
      setServerError(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setLoading(true);
    setServerError(null);

    const result = await login(formData.email.trim(), formData.password);
    setLoading(false);

    if (result.success) {
      if (result.user?.role === 'faculty') {
        navigate('/faculty');
      } else {
        navigate('/dashboard');
      }
    } else {
      setServerError(result.message || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const fillTestCredentials = (email, password) => {
    setFormData({
      email,
      password,
      rememberMe: true,
    });
    setErrors({});
    setServerError(null);
  };

  return (
    <AuthLayout
      title="Welcome Back to SkillBridge"
      subtitle="Sign in to collaborate on campus projects, match with peers, and manage milestones."
      badge="Student &amp; Faculty Portal"
      maxWidth="max-w-md"
    >
      {/* Backend Status Notice */}
      <div className="mb-6 p-3 rounded-xl bg-purple-50/80 dark:bg-[#1a1435]/80 border border-purple-200/80 dark:border-purple-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0" />
          <span><strong>JWT Authentication:</strong> Secure password hashing &amp; token sessions active.</span>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 shrink-0">
          Connected
        </span>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Authentication Error</p>
            <p className="mt-0.5">{serverError}</p>
          </div>
        </div>
      )}

      {/* Quick Test Accounts Helper */}
      <div className="mb-6 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#151226] border border-slate-200/80 dark:border-white/5 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
          Quick Demo Accounts:
        </span>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => fillTestCredentials('alex.morgan@stanford.edu', 'password123')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-purple-400 font-medium transition-colors"
          >
            Alex (Student)
          </button>
          <button
            type="button"
            onClick={() => fillTestCredentials('prof.davis@stanford.edu', 'password123')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-purple-400 font-medium transition-colors"
          >
            Prof. Davis (Faculty)
          </button>
          <button
            type="button"
            onClick={() => fillTestCredentials('admin@skillbridge.edu', 'admin123')}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 hover:border-purple-400 font-medium transition-colors"
          >
            Admin
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Email Address */}
        <InputField
          label="College Email Address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="e.g. alex.morgan@stanford.edu"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        {/* Password */}
        <InputField
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
        />

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300 text-[#803BE8] focus:ring-[#803BE8] dark:bg-[#151226] dark:border-purple-900/50"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-[#803BE8] dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Sign In Button */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to SkillBridge'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </form>

      {/* Don't have an account link */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-purple-950/40 text-center text-xs text-slate-600 dark:text-slate-400">
        <span>Don't have an account yet? </span>
        <Link
          to="/signup"
          className="font-bold text-[#803BE8] dark:text-purple-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
        >
          Create student account
        </Link>
      </div>
    </AuthLayout>
  );
}
