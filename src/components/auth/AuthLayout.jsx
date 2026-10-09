import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import SkillBridgeLogo from '../SkillBridgeLogo';
import ThemeToggle from '../ThemeToggle';

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  badge = "SkillBridge Auth",
  maxWidth = "max-w-xl" 
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#faf8ff] dark:bg-[#0c0a17] text-slate-800 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      
      {/* Background soft lavender & light pink ambient gradient blurs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/4 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-3xl opacity-75"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-pink-200/40 dark:bg-pink-900/15 rounded-full blur-3xl opacity-75"></div>
        <div className="absolute inset-0 bg-hero-radial"></div>
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-[#a872fd] transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className={`w-full ${maxWidth} mx-auto`}>
          
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Link to="/" className="mb-4 inline-block focus:outline-none">
              <SkillBridgeLogo />
            </Link>

            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#1c1538] border border-purple-200 dark:border-purple-800/60 text-xs font-semibold text-[#803BE8] dark:text-purple-300 mb-2 shadow-sm">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>{badge}</span>
              </div>
            )}

            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
                {subtitle}
              </p>
            )}
          </div>

          {/* Card Box */}
          <div className="rounded-3xl bg-white dark:bg-[#151226] border border-purple-100/90 dark:border-[#262045] p-6 sm:p-9 shadow-card">
            {children}
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} SkillBridge &bull; Student Skill &amp; Project Matchmaking Platform
          </p>
        </div>
      </main>

      <div className="h-6"></div>
    </div>
  );
}
