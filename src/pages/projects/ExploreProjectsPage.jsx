import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowUpDown, 
  FolderKanban, 
  Users, 
  Sparkles,
  Info,
  CheckCircle2
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import ExploreProjectCard from '../../components/projects/ExploreProjectCard';
import ProjectFilters from '../../components/projects/ProjectFilters';
import ApplyModal from '../../components/projects/ApplyModal';
import { useProjects } from '../../context/ProjectsContext';
import { CATEGORIES } from '../../data/projectsData';

export default function ExploreProjectsPage() {
  const { projects, applyToProject } = useProjects();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Projects');
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'open-positions' | 'alpha'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Advanced Filters State
  const [advancedFilters, setAdvancedFilters] = useState({
    category: 'All Projects',
    difficulty: '',
    mode: '',
    openPositions: 'any',
    skills: [],
  });

  // Modal State for Apply to Join
  const [applyModalProject, setApplyModalProject] = useState(null);

  // Sync category bar with advanced filters
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setAdvancedFilters(prev => ({ ...prev, category }));
  };

  const handleAdvancedFilterChange = (key, value) => {
    setAdvancedFilters(prev => {
      const updated = { ...prev, [key]: value };
      if (key === 'category') {
        setSelectedCategory(value);
      }
      return updated;
    });
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Projects');
    setSortBy('recent');
    setAdvancedFilters({
      category: 'All Projects',
      difficulty: '',
      mode: '',
      openPositions: 'any',
      skills: [],
    });
  };

  // Filter & Search Engine
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesDesc = (project.shortDescription || project.description || '').toLowerCase().includes(query);
        const matchesCategory = project.category.toLowerCase().includes(query);
        const matchesSkills = project.requiredSkills?.some(s => s.toLowerCase().includes(query));

        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesSkills) {
          return false;
        }
      }

      // 2. Category Filter
      const cat = advancedFilters.category || selectedCategory;
      if (cat && cat !== 'All Projects') {
        if (project.category.toLowerCase() !== cat.toLowerCase()) {
          return false;
        }
      }

      // 3. Difficulty
      if (advancedFilters.difficulty) {
        if (project.difficulty !== advancedFilters.difficulty) {
          return false;
        }
      }

      // 4. Mode
      if (advancedFilters.mode) {
        if (project.mode !== advancedFilters.mode) {
          return false;
        }
      }

      // 5. Open Positions
      if (advancedFilters.openPositions === '2plus' && project.openPositionsCount < 2) {
        return false;
      }
      if (advancedFilters.openPositions === '3plus' && project.openPositionsCount < 3) {
        return false;
      }

      // 6. Required Skills match (if any selected, project must include at least one selected skill)
      if (advancedFilters.skills?.length > 0) {
        const hasSkill = advancedFilters.skills.some(selectedSkill =>
          project.requiredSkills?.some(projSkill => projSkill.toLowerCase() === selectedSkill.toLowerCase())
        );
        if (!hasSkill) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt || '2026-01-01') - new Date(a.createdAt || '2026-01-01');
      }
      if (sortBy === 'open-positions') {
        return (b.openPositionsCount || 0) - (a.openPositionsCount || 0);
      }
      if (sortBy === 'alpha') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [projects, searchQuery, selectedCategory, advancedFilters, sortBy]);

  // Metric tallies
  const totalProjectsCount = projects.length;
  const openProjectsCount = projects.filter(p => (p.openPositionsCount || 0) > 0).length;

  return (
    <DashboardLayout title="Explore Projects" breadcrumb="SkillBridge / Project Matchmaking / Explore">
      
      {/* Header Banner */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#1f193d] border border-purple-200 dark:border-purple-800/60 text-xs font-bold text-[#803BE8] dark:text-purple-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Project Matchmaking Discovery</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Explore Projects
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Discover exciting projects and find opportunities to collaborate with talented students.
            </p>
          </div>

          <Link
            to="/projects/create"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-200 transform hover:-translate-y-0.5 shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Project</span>
          </Link>
        </div>

        {/* Summary Row */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Total Projects:</span>
              <strong className="font-extrabold text-slate-900 dark:text-white">{totalProjectsCount}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Open for Recruitment:</span>
              <strong className="font-extrabold text-[#803BE8] dark:text-purple-300">{openProjectsCount}</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Matching Current Filters:</span>
              <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">{filteredProjects.length}</strong>
            </div>
          </div>

          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#1c1638]">
            Demo Sample Data
          </span>
        </div>
      </div>

      {/* Search & Top Category Bar */}
      <div className="space-y-4">
        {/* Search Bar + Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by name, technology, or keyword..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-2xl bg-white dark:bg-[#151226] text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200/80 dark:border-purple-950/60 focus:outline-none focus:border-[#803BE8] focus:ring-2 focus:ring-[#803BE8]/20 shadow-xs transition-all"
            />
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto text-xs font-semibold py-3 pl-3 pr-8 rounded-2xl bg-white dark:bg-[#151226] text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-purple-950/60 focus:outline-none focus:border-[#803BE8] shadow-xs cursor-pointer"
              >
                <option value="recent">Sort: Recently Added</option>
                <option value="open-positions">Sort: Most Open Positions</option>
                <option value="alpha">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden p-3 rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 text-slate-700 dark:text-slate-200 shadow-xs flex items-center gap-2 text-xs font-bold"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#803BE8]" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-150 select-none ${
                  isSelected
                    ? 'bg-[#803BE8] text-white shadow-xs font-bold'
                    : 'bg-white dark:bg-[#151226] text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#1e173a] border border-slate-200/80 dark:border-purple-950/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Project Cards Grid */}
      <div className="flex items-start gap-8">
        
        {/* Desktop Filter Sidebar & Mobile Drawer */}
        <ProjectFilters
          filters={advancedFilters}
          onChangeFilter={handleAdvancedFilterChange}
          onResetFilters={handleResetFilters}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
          totalResultsCount={filteredProjects.length}
        />

        {/* Project Cards Grid / Empty State */}
        <div className="flex-1 min-w-0">
          {filteredProjects.length === 0 ? (
            /* Clear Results Empty State */
            <div className="rounded-3xl border-2 border-dashed border-purple-200 dark:border-purple-900/60 bg-white/60 dark:bg-[#151226]/60 p-10 sm:p-14 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300 flex items-center justify-center mx-auto">
                <FolderKanban className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  No projects match your current filters
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Try adjusting your search query, selecting "All Projects", or resetting your tech skill and difficulty filters.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs font-bold shadow-xs transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            </div>
          ) : (
            /* Project Grid (2 or 3 columns) */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {filteredProjects.map((project) => (
                <ExploreProjectCard
                  key={project.id}
                  project={project}
                  onOpenApply={(proj) => setApplyModalProject(proj)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Confirmation & Apply Dialog Modal */}
      <ApplyModal
        project={applyModalProject}
        isOpen={!!applyModalProject}
        onClose={() => setApplyModalProject(null)}
        onConfirm={(projectId, note) => {
          applyToProject(projectId, note);
        }}
      />

    </DashboardLayout>
  );
}
