import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('skillbridge-theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('skillbridge-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('skillbridge-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative p-2 rounded-full border border-purple-200/60 dark:border-purple-900/50 bg-purple-50/60 dark:bg-[#1a1533] text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-[#251e47] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#803BE8]/40"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-pink-300 transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Sun className="w-4 h-4 text-[#803BE8] transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}
