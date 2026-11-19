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
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 dark:bg-[#121711]/85 border-b border-purple-100/80 dark:border-[#2e3b2b] transition-colors duration-200">
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
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-[#7B9669] dark:hover:text-[#BAC8B1] transition-colors duration-150 flex items-center gap-1.5"
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
              className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-[#7B9669] dark:hover:text-purple-300 px-4 py-2.5 rounded-full transition-colors"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#7B9669] hover:bg-[#404E3B] text-white text-sm font-semibold shadow-md shadow-[#7B9669]/20 hover:shadow-[#7B9669]/35 transition-all duration-200 transform hover:-translate-y-0.5"
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
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#222c20] transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-purple-100 dark:border-[#2e3b2b] bg-white/95 dark:bg-[#121711]/95 backdrop-blur-lg px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-[#222c20] hover:text-[#7B9669]"
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

          <div className="pt-4 border-t border-purple-100 dark:border-[#2e3b2b] flex flex-col gap-2.5">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-[#222c20]"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#7B9669] text-white text-sm font-semibold shadow-md shadow-[#7B9669]/25"
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
