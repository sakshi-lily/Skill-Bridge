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
      className="relative p-2 rounded-full border border-[#BAC8B1]/50 dark:border-[#404E3B]/60 bg-[#f5f7f3] dark:bg-[#182017] text-[#7B9669] dark:text-[#BAC8B1] hover:bg-[#e7ece2] dark:hover:bg-[#222c20] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#7B9669]/40"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Moon className="w-4 h-4 text-[#BAC8B1] transition-transform duration-300 rotate-0 scale-100" />
        ) : (
          <Sun className="w-4 h-4 text-[#7B9669] transition-transform duration-300 rotate-0 scale-100" />
        )}
      </div>
    </button>
  );
}
