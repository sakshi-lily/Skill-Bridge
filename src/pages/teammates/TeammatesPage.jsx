import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw, 
  GraduationCap, 
  FolderKanban, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Award
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import CandidateCard from '../../components/teammates/CandidateCard';
import StudentProfileModal from '../../components/teammates/StudentProfileModal';
import InviteToTeamModal from '../../components/teammates/InviteToTeamModal';
import { STUDENTS_DATA, CURRENT_USER } from '../../data/studentsData';
import { useProjects } from '../../context/ProjectsContext';
import { calculateSkillMatch, normalizeSkillsList } from '../../utils/skillMatching';
import { POPULAR_SKILLS } from '../../data/projectsData';

export default function TeammatesPage() {
  const { projects } = useProjects();

  // Target Project Selector (defaults to first project)
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || 'career-guidance');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [matchStrengthFilter, setMatchStrengthFilter] = useState('all'); // 'all' | 'high' | 'moderate' | 'low'

  // Modals
  const [viewingStudent, setViewingStudent] = useState(null);
  const [invitingStudent, setInvitingStudent] = useState(null);

  const selectedProject = useMemo(() => {
    return projects.find(p => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Exclude current user from candidate list (Alex Morgan shouldn't invite herself)
  const candidatePool = useMemo(() => {
    return STUDENTS_DATA.filter(s => s.id !== CURRENT_USER.id);
  }, []);

  // Calculate Match Scores and Rank Candidates
  const rankedCandidates = useMemo(() => {
    const requiredSkills = selectedProject?.requiredSkills || [];

    const evaluated = candidatePool.map(student => {
      const matchDetails = calculateSkillMatch(requiredSkills, student.skills || []);
      return {
        ...student,
        matchDetails,
        calculatedScore: matchDetails.score,
      };
    });

    // Sort by calculated match score, highest first (as strictly requested)
    evaluated.sort((a, b) => b.calculatedScore - a.calculatedScore);

    // Apply Client-Side Filters
    return evaluated.filter(student => {
      // 1. Search query (name, university, skills)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesUni = student.university.toLowerCase().includes(q);
        const matchesSkill = student.skills.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesUni && !matchesSkill) return false;
      }

      // 2. Specific Technical Skill filter
      if (selectedSkillFilter) {
        const normFilter = selectedSkillFilter.toLowerCase();
        const hasSkill = student.skills.some(s => s.toLowerCase().includes(normFilter));
        if (!hasSkill) return false;
      }

      // 3. Experience level filter
      if (selectedExperience && student.experienceLevel !== selectedExperience) {
        return false;
      }

      // 4. Availability filter
      if (selectedAvailability && student.availability !== selectedAvailability) {
        return false;
      }

      // 5. Match Strength Filter
      if (matchStrengthFilter === 'high' && student.calculatedScore < 75) return false;
      if (matchStrengthFilter === 'moderate' && (student.calculatedScore < 40 || student.calculatedScore >= 75)) return false;
      if (matchStrengthFilter === 'low' && student.calculatedScore >= 40) return false;

      return true;
    });
  }, [
    candidatePool, 
    selectedProject, 
    searchQuery, 
    selectedSkillFilter, 
    selectedExperience, 
    selectedAvailability, 
    matchStrengthFilter
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSkillFilter('');
    setSelectedExperience('');
    setSelectedAvailability('');
    setMatchStrengthFilter('all');
  };

  return (
    <DashboardLayout
      title="Find Teammates"
      breadcrumb="SkillBridge / Project Matchmaking / Teammates"
    >
      <div className="space-y-8">
        
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-[#1f193d] border border-purple-200 dark:border-purple-800/60 text-xs font-bold text-[#803BE8] dark:text-purple-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-500" />
              <span>Step 5: Smart Skill-Matching Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Find Complementary Teammates
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Our rule-based algorithm ranks student candidates by mathematically comparing their skill profiles against your target project's tech requirements.
            </p>
          </div>
        </div>

        {/* 1. Target Project Selector Box */}
        <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-7 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-purple-950/50">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#803BE8] dark:text-purple-300 block mb-1">
                Select Project To Rank Candidates Against:
              </span>
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-[#803BE8]" />
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="text-sm sm:text-base font-bold text-slate-900 dark:text-white bg-transparent border-b-2 border-purple-300 dark:border-purple-700 py-1 pr-8 focus:outline-none focus:border-[#803BE8] cursor-pointer"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id} className="dark:bg-[#151226]">
                      {p.title} ({p.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Formula Explanation Badge */}
            <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-[#1a1435]/70 border border-purple-200/70 dark:border-purple-900/40 text-[11px] text-slate-600 dark:text-slate-300">
              <span className="font-bold text-[#803BE8] dark:text-purple-300 block">
                Rule-Based Formula:
              </span>
              <code>Match Score = (Matched Skills / Total Required Skills) &times; 100</code>
            </div>
          </div>

          {/* Selected Project Required Skills Strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">
              Target Project Requirements ({selectedProject?.requiredSkills?.length || 0}):
            </span>
            {selectedProject?.requiredSkills?.map((s, idx) => (
              <span
                key={idx}
                className="font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-[#1f193d] text-[#803BE8] dark:text-purple-300 border border-purple-100 dark:border-purple-900/40"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* 2. Search & Multi-Filter Controls */}
        <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search candidates by name, college, or skill..."
                className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1b1536] text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200 dark:border-purple-900/40 focus:outline-none focus:border-[#803BE8]"
              />
            </div>

            {/* Filter by Technical Skill */}
            <div>
              <select
                value={selectedSkillFilter}
                onChange={(e) => setSelectedSkillFilter(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#1b1536] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-purple-900/40 focus:outline-none focus:border-[#803BE8]"
              >
                <option value="">All Technical Skills</option>
                {POPULAR_SKILLS.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
            </div>

            {/* Filter by Experience */}
            <div>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#1b1536] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-purple-900/40 focus:outline-none focus:border-[#803BE8]"
              >
                <option value="">Any Experience Level</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            {/* Filter by Match Strength */}
            <div>
              <select
                value={matchStrengthFilter}
                onChange={(e) => setMatchStrengthFilter(e.target.value)}
                className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-[#1b1536] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-purple-900/40 focus:outline-none focus:border-[#803BE8]"
              >
                <option value="all">Any Match Score</option>
                <option value="high">High Match (&ge; 75%)</option>
                <option value="moderate">Moderate Match (40–74%)</option>
                <option value="low">Low Match (&lt; 40%)</option>
              </select>
            </div>
          </div>

          {/* Results Bar */}
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-purple-950/40">
            <span className="text-slate-500 dark:text-slate-400">
              Showing <strong className="text-slate-900 dark:text-white">{rankedCandidates.length}</strong> candidates ranked by calculated synergy
            </span>

            {(searchQuery || selectedSkillFilter || selectedExperience || selectedAvailability || matchStrengthFilter !== 'all') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-purple-600 dark:text-purple-300 hover:text-pink-600 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Ranked Candidates Grid */}
        <div>
          {rankedCandidates.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-purple-200 dark:border-purple-900/60 bg-white/60 dark:bg-[#151226]/60 p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-[#803BE8] mx-auto opacity-70" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No student candidates matched your criteria
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try clearing your technical skill or match strength filters to view more candidates.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-[#803BE8] text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {rankedCandidates.map(student => (
                <CandidateCard
                  key={student.id}
                  student={student}
                  selectedProject={selectedProject}
                  onViewProfile={(stud) => setViewingStudent(stud)}
                  onOpenInvite={(stud) => setInvitingStudent(stud)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Student Profile Details Modal */}
      <StudentProfileModal
        student={viewingStudent}
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        onOpenInvite={(stud) => setInvitingStudent(stud)}
      />

      {/* Invite to Team Modal */}
      <InviteToTeamModal
        student={invitingStudent}
        isOpen={!!invitingStudent}
        onClose={() => setInvitingStudent(null)}
      />

    </DashboardLayout>
  );
}
