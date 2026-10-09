import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Users, Sparkles } from 'lucide-react';
import SkillBridgeLogo from './SkillBridgeLogo';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Projects', href: '#projects' },
    { name: 'Community', href: '#community' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-[#0d0b18]/85 border-b border-purple-100/80 dark:border-[#221c3d] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 focus:outline-none">
            <SkillBridgeLogo />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-[#c084fc] transition-colors duration-150 flex items-center gap-1.5"
              >
                {link.name}
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-300 border border-pink-200/50 dark:border-pink-800/40">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>

          {/* Actions & CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            <Link
              to="/login"
              className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#803BE8] dark:hover:text-purple-300 px-4 py-2.5 rounded-full transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#803BE8] hover:bg-[#6e27d5] text-white text-sm font-semibold shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#1f1a3a] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-purple-100 dark:border-[#241e42] bg-white/95 dark:bg-[#120f24]/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-[#1e183a] hover:text-[#803BE8]"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-900/60 text-pink-600 dark:text-pink-300">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-purple-100 dark:border-[#221c3e] flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-[#1e183a]"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#803BE8] text-white text-sm font-semibold shadow-md shadow-purple-500/25"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
