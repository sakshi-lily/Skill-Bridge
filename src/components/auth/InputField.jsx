import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function InputField({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  autoComplete,
  disabled = false,
  helperText,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200"
        >
          {label}
          {required && <span className="text-pink-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={id}
          name={name || id}
          type={effectiveType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            w-full rounded-xl text-sm transition-all duration-150
            bg-slate-50/70 dark:bg-[#1c1735]/80
            text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500
            py-2.5 sm:py-3
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${isPassword ? 'pr-11' : 'pr-3.5'}
            border
            ${
              error
                ? 'border-rose-400 dark:border-rose-500 focus:ring-2 focus:ring-rose-400/20 focus:border-rose-500'
                : 'border-purple-100 dark:border-purple-900/60 focus:border-[#803BE8] focus:ring-2 focus:ring-[#803BE8]/25 hover:border-purple-200 dark:hover:border-purple-800'
            }
            focus:outline-none focus:bg-white dark:focus:bg-[#1a1435]
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#803BE8] dark:hover:text-purple-300 transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {helperText && !error && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 pl-0.5">
          {helperText}
        </p>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-500 dark:text-rose-400 pl-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
