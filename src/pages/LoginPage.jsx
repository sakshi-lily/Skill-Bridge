import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  AlertCircle, 
  GraduationCap, 
  BookOpen, 
  ShieldCheck, 
  Check, 
  LockKeyhole 
} from 'lucide-react';
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

  const [activeDemo, setActiveDemo] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: 'Student',
      name: 'Alex Morgan',
      email: 'alex.morgan@stanford.edu',
      password: 'password123',
      icon: GraduationCap,
      badge: 'Stanford CS',
    },
    {
      role: 'Faculty',
      name: 'Prof. Davis',
      email: 'prof.davis@stanford.edu',
      password: 'password123',
      icon: BookOpen,
      badge: 'Advisor',
    },
    {
      role: 'Admin',
      name: 'Admin',
      email: 'admin@skillbridge.edu',
      password: 'admin123',
      icon: ShieldCheck,
      badge: 'Platform',
    },
  ];

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

  const handleSelectDemo = (account) => {
    setActiveDemo(account.role);
    setFormData({
      email: account.email,
      password: account.password,
      rememberMe: true,
    });
    setErrors({});
    setServerError(null);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your SkillBridge account to discover projects and collaborate with teammates."
      badge="Student &amp; Faculty Portal"
      maxWidth="max-w-md"
    >
      {/* Interactive Quick Demo Login Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-0.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            One-Click Demo Sign In:
          </span>
          <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
            Auto-fills credentials
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            const isSelected = activeDemo === account.role;
            return (
              <button
                key={account.role}
                type="button"
                onClick={() => handleSelectDemo(account)}
                className={`
                  relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 border text-center group
                  ${
                    isSelected
                      ? 'bg-[#7B9669]/10 dark:bg-[#7B9669]/20 border-[#7B9669] text-[#404E3B] dark:text-[#BAC8B1] shadow-xs'
                      : 'bg-slate-50/80 dark:bg-[#222c20]/60 hover:bg-[#BAC8B1]/20 dark:hover:bg-[#283426] border-slate-200/80 dark:border-[#2e3b2b] text-slate-700 dark:text-slate-200'
                  }
                `}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#7B9669] text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <div className={`p-1.5 rounded-xl mb-1 transition-colors ${
                  isSelected 
                    ? 'bg-[#7B9669] text-white' 
                    : 'bg-white dark:bg-[#182017] text-[#7B9669] dark:text-[#BAC8B1] shadow-2xs group-hover:scale-105'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold leading-tight truncate w-full">
                  {account.role}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                  {account.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Authentication Error</p>
            <p className="mt-0.5 leading-relaxed">{serverError}</p>
          </div>
        </div>
      )}

      {/* Main Login Form */}
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
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 rounded border-slate-300 text-[#7B9669] focus:ring-[#7B9669] dark:bg-[#182017] dark:border-[#2e3b2b]"
            />
            <span>Remember me</span>
          </label>

          <Link
            to="/forgot-password"
            className="font-semibold text-[#7B9669] dark:text-[#BAC8B1] hover:text-[#404E3B] dark:hover:text-white transition-colors"
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
            className="py-3.5 shadow-md shadow-[#7B9669]/25 hover:shadow-lg hover:shadow-[#7B9669]/35"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to SkillBridge'}</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </form>

      {/* Subtle Security Footnote */}
      <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
        <LockKeyhole className="w-3.5 h-3.5 text-[#7B9669] dark:text-[#BAC8B1]" />
        <span>End-to-end encrypted session &bull; University SSO compatible</span>
      </div>

      {/* Don't have an account link */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-[#2e3b2b] text-center text-xs text-slate-600 dark:text-slate-400">
        <span>Don't have an account yet? </span>
        <Link
          to="/signup"
          className="font-bold text-[#7B9669] dark:text-[#BAC8B1] hover:text-[#404E3B] dark:hover:text-white transition-colors ml-1"
        >
          Create student account &rarr;
        </Link>
      </div>
    </AuthLayout>
  );
}
