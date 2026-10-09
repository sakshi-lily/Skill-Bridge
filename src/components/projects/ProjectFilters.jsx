import React from 'react';
import { Filter, X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { CATEGORIES, POPULAR_SKILLS, DIFFICULTIES, MODES } from '../../data/projectsData';

export default function ProjectFilters({
  filters,
  onChangeFilter,
  onResetFilters,
  isOpenMobile,
  onCloseMobile,
  totalResultsCount,
}) {
  const handleCategoryClick = (cat) => {
    onChangeFilter('category', cat);
  };

  const handleSkillToggle = (skill) => {
    const current = filters.skills || [];
    const exists = current.includes(skill);
    const updated = exists ? current.filter(s => s !== skill) : [...current, skill];
    onChangeFilter('skills', updated);
  };

  const handleDifficultyToggle = (diff) => {
    onChangeFilter('difficulty', filters.difficulty === diff ? '' : diff);
  };

  const handleModeToggle = (mode) => {
    onChangeFilter('mode', filters.mode === mode ? '' : mode);
  };

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-purple-950/60">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#803BE8] dark:text-purple-300" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Advanced Filters
          </h3>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-purple-600 dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* 1. Category Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Category
        </label>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isSelected = (filters.category || 'All Projects') === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-purple-100 dark:bg-purple-950/70 text-[#803BE8] dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800/50'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a1435]'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#803BE8] dark:text-purple-300" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Difficulty Level */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Difficulty Level
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {DIFFICULTIES.map((diff) => {
            const isSelected = filters.difficulty === diff;
            return (
              <button
                key={diff}
                type="button"
                onClick={() => handleDifficultyToggle(diff)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-[#803BE8] text-white border-[#803BE8] shadow-xs'
                    : 'bg-slate-50 dark:bg-[#1c1735] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-purple-900/40 hover:border-purple-300'
                }`}
              >
                {diff}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Availability / Mode */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Project Mode
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {MODES.map((mode) => {
            const isSelected = filters.mode === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => handleModeToggle(mode)}
                className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                  isSelected
                    ? 'bg-[#803BE8] text-white border-[#803BE8] shadow-xs'
                    : 'bg-slate-50 dark:bg-[#1c1735] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-purple-900/40 hover:border-purple-300'
                }`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Open Positions */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Open Positions
        </label>
        <select
          value={filters.openPositions || 'any'}
          onChange={(e) => onChangeFilter('openPositions', e.target.value)}
          className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-slate-50 dark:bg-[#1a1435] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
        >
          <option value="any">Any Available (1+ positions)</option>
          <option value="2plus">2 or more open positions</option>
          <option value="3plus">3 or more open positions</option>
        </select>
      </div>

      {/* 5. Required Skills Filter */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Tech Skills ({filters.skills?.length || 0})
          </label>
          {filters.skills?.length > 0 && (
            <button
              type="button"
              onClick={() => onChangeFilter('skills', [])}
              className="text-[10px] text-purple-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {POPULAR_SKILLS.map((skill) => {
            const isSelected = (filters.skills || []).includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => handleSkillToggle(skill)}
                className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-purple-100 dark:bg-purple-950/80 text-[#803BE8] dark:text-purple-200 border-[#803BE8] font-bold'
                    : 'bg-slate-50 dark:bg-[#1b1536] text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-purple-900/40 hover:border-purple-300'
                }`}
              >
                {isSelected && '✓ '}
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results counter pill */}
      <div className="pt-2">
        <div className="p-3 rounded-xl bg-purple-50/70 dark:bg-[#1a1435]/70 border border-purple-100 dark:border-purple-900/40 text-center">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {totalResultsCount} Projects Found
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-24 rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm">
          {content}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={onCloseMobile} 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            aria-hidden="true" 
          />
          <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-white dark:bg-[#151226] shadow-2xl p-6 overflow-y-auto border-l border-slate-200 dark:border-purple-900/60 z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-purple-950/60">
                <span className="text-base font-bold text-slate-900 dark:text-white">Filters</span>
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1f193d]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-purple-950/60 mt-6">
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-full py-2.5 rounded-xl bg-[#803BE8] text-white text-xs font-bold shadow-md shadow-purple-600/20"
              >
                Apply &amp; View {totalResultsCount} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
