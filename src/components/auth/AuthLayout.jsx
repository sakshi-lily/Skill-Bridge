import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles } from 'lucide-react';
import SkillBridgeLogo from '../SkillBridgeLogo';
import ThemeToggle from '../ThemeToggle';

const CURRENT_YEAR = new Date().getFullYear();

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  badge = "SkillBridge Auth",
  maxWidth = "max-w-md" 
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#f7f9f6] dark:bg-[#121711] text-slate-800 dark:text-slate-100 transition-colors duration-200 relative overflow-hidden">
      
      {/* Background ambient gradient blurs in Sage & Forest palette */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none -z-10 overflow-hidden">
        {/* Soft Celadon / Sage glow */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-[#BAC8B1]/35 dark:bg-[#404E3B]/25 rounded-full blur-3xl opacity-75"></div>
        {/* Slate teal ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 sm:w-[480px] sm:h-[480px] bg-[#6C8480]/20 dark:bg-[#6C8480]/15 rounded-full blur-3xl opacity-75"></div>
        {/* Radial background overlay */}
        <div className="absolute inset-0 bg-hero-radial"></div>
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-[#7B9669] dark:hover:text-[#BAC8B1] transition-colors group px-3 py-1.5 rounded-full hover:bg-white/80 dark:hover:bg-[#182017]/80 backdrop-blur-xs"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Centered Auth Card Container */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6">
        <div className={`w-full ${maxWidth} mx-auto`}>
          
          {/* Brand Logo Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Link to="/" className="mb-3 inline-block focus:outline-none transform hover:scale-105 transition-transform duration-200">
              <SkillBridgeLogo />
            </Link>

            {badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#BAC8B1]/30 dark:bg-[#182017] border border-[#BAC8B1]/60 dark:border-[#2e3b2b] text-[11px] font-semibold text-[#404E3B] dark:text-[#BAC8B1] mb-2 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#7B9669] dark:text-[#BAC8B1]" />
                <span>{badge}</span>
              </div>
            )}

            {title && (
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {title}
              </h1>
            )}

            {subtitle && (
              <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
                {subtitle}
              </p>
            )}
          </div>

          {/* Card Box */}
          <div className="rounded-3xl bg-white/95 dark:bg-[#182017]/95 backdrop-blur-xl border border-[#E6E6E6] dark:border-[#2e3b2b] p-6 sm:p-8 shadow-card relative">
            {/* Subtle top accent bar */}
            <div className="absolute top-0 left-8 right-8 h-1 rounded-b-full bg-gradient-to-r from-[#7B9669] via-[#BAC8B1] to-[#6C8480]"></div>
            {children}
          </div>

          {/* Footer note */}
          <p className="mt-5 text-center text-xs text-slate-400 dark:text-slate-500">
            &copy; {CURRENT_YEAR} SkillBridge
          </p>
        </div>
      </main>

      <div className="h-4"></div>
    </div>
  );
}
