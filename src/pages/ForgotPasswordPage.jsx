import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2, Info } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import InputField from '../components/auth/InputField';
import Button from '../components/auth/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setError('Email address is required');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setSubmitted(true);
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your verified college email address and we will generate instructions to reset your account credentials."
      badge="Account Recovery"
      maxWidth="max-w-md"
    >
      {submitted ? (
        <div className="space-y-5 text-center py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reset Request Simulated
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              If an account with <strong className="text-purple-600 dark:text-purple-300">{email}</strong> exists, a password reset link will be sent.
            </p>
          </div>

          {/* Explicit demo note */}
          <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-[#1f193d] border border-purple-200/80 dark:border-purple-800/50 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5 text-left">
            <Info className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Frontend Demo Notice:</span>
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">
                Email dispatch APIs will be enabled once backend mailer services are connected.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setSubmitted(false);
                setEmail('');
              }}
            >
              Try another email
            </Button>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-[#803BE8] dark:text-pink-400 hover:underline py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          
          <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-[#1a1435]/70 border border-purple-100 dark:border-purple-900/40 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#803BE8] dark:text-pink-400 shrink-0" />
            <span>Enter your registered student email to receive recovery instructions.</span>
          </div>

          <InputField
            id="email"
            name="email"
            type="email"
            label="College / Email Address"
            placeholder="e.g. yourname@university.edu"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
            error={error}
            icon={Mail}
            required
            autoComplete="email"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              icon={Send}
            >
              Send Reset Link
            </Button>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-pink-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>

        </form>
      )}
    </AuthLayout>
  );
}
