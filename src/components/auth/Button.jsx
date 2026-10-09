import React from 'react';

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  fullWidth = true,
  disabled = false,
  onClick,
  icon: Icon,
  className = '',
}) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 font-semibold text-sm sm:text-base py-3 px-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#803BE8]/40 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    primary:
      'bg-[#803BE8] hover:bg-[#6e27d5] text-white rounded-xl sm:rounded-2xl shadow-md shadow-purple-600/25 hover:shadow-lg hover:shadow-purple-600/35 hover:-translate-y-0.5',
    secondary:
      'bg-purple-50 dark:bg-[#1f193d] hover:bg-purple-100 dark:hover:bg-[#28204e] text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 rounded-xl sm:rounded-2xl',
    outline:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-[#1a1435] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-purple-900/50 rounded-xl sm:rounded-2xl',
    ghost:
      'bg-transparent hover:bg-purple-50 dark:hover:bg-[#1a1435] text-slate-600 dark:text-slate-300 hover:text-[#803BE8] rounded-xl',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant] || variants.primary}
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
