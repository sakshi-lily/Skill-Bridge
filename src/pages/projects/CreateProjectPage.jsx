import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  FolderPlus,
  Info
} from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useProjects } from '../../context/ProjectsContext';
import { CATEGORIES, POPULAR_SKILLS, DIFFICULTIES, MODES } from '../../data/projectsData';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const selectableCategories = CATEGORIES.filter(c => c !== 'All Projects');

  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    detailedDescription: '',
    problemStatement: '',
    category: 'Web Development',
    difficulty: 'Intermediate',
    mode: 'Remote',
    teamSize: 4,
    requiredRoles: 'Frontend Developer, Backend Engineer',
    deadline: '2026-11-30',
    weeklyCommitment: '6-8 hrs/week',
    requiredSkills: ['React', 'Node.js'],
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [errors, setErrors] = useState({});
  const [demoNotice, setDemoNotice] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.requiredSkills.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, trimmed]
      }));
      setCustomSkillInput('');
      if (errors.requiredSkills) {
        setErrors(prev => ({ ...prev, requiredSkills: undefined }));
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(s => s !== skillToRemove)
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Project title should be at least 5 characters';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.trim().length < 20) {
      newErrors.shortDescription = 'Please provide at least 20 characters summarizing the project';
    }

    if (!formData.detailedDescription.trim()) {
      newErrors.detailedDescription = 'Detailed description is required';
    }

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement = 'Problem statement is required';
    }

    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      newErrors.requiredSkills = 'Please add at least one required technology or skill';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Project deadline date is required';
    }

    if (!formData.requiredRoles.trim()) {
      newErrors.requiredRoles = 'Please specify the positions or roles you are recruiting';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const availableRolesArray = formData.requiredRoles
      .split(',')
      .map(r => r.trim())
      .filter(Boolean);

    const created = addProject({
      ...formData,
      teamSize: Number(formData.teamSize) || 4,
      availableRoles: availableRolesArray.length > 0 ? availableRolesArray : ['Co-builder'],
    });

    setDemoNotice(
      `Project "${created.title}" successfully created for this demo session! In production, this persists to MongoDB. Redirecting to project exploration...`
    );

    setTimeout(() => {
      navigate('/projects');
    }, 1500);
  };

  return (
    <DashboardLayout
      title="Create New Project"
      breadcrumb="SkillBridge / Project Matchmaking / Create"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#803BE8] dark:hover:text-purple-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Cancel &amp; Back to Projects</span>
          </Link>
        </div>

        {/* Demo Notice Banner */}
        {demoNotice && (
          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-[#20183e] border border-purple-200 dark:border-purple-800 text-xs sm:text-sm text-[#803BE8] dark:text-purple-300 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{demoNotice}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Returning to /projects...</p>
            </div>
          </div>
        )}

        <div className="rounded-3xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-9 shadow-sm">
          
          <div className="pb-6 mb-6 border-b border-slate-100 dark:border-purple-950/50">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-xs font-bold text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 mb-2">
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Project Pitch &amp; Recruitment Form</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Post an Idea &bull; Recruit Your Dream Team
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Define your vision, required technology stack, and open vacancies to connect with complementary student builders across campuses.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            
            {/* 1. Project Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                Project Title <span className="text-pink-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. EduSync — AI Autonomous Lecture Note-Taker"
                className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border ${
                  errors.title ? 'border-rose-400' : 'border-slate-200 dark:border-purple-900/50'
                } focus:outline-none focus:border-[#803BE8] focus:ring-2 focus:ring-[#803BE8]/20`}
              />
              {errors.title && <p className="text-xs text-rose-500">{errors.title}</p>}
            </div>

            {/* 2. Short Description */}
            <div className="space-y-1.5">
              <label htmlFor="shortDescription" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                Short Description / Elevator Pitch <span className="text-pink-500">*</span>
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={2}
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief 1-2 sentence overview of what the project does..."
                className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border ${
                  errors.shortDescription ? 'border-rose-400' : 'border-slate-200 dark:border-purple-900/50'
                } focus:outline-none focus:border-[#803BE8] focus:ring-2 focus:ring-[#803BE8]/20`}
              />
              {errors.shortDescription && <p className="text-xs text-rose-500">{errors.shortDescription}</p>}
            </div>

            {/* 3. Detailed Description & Problem Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="problemStatement" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Problem Statement <span className="text-pink-500">*</span>
                </label>
                <textarea
                  id="problemStatement"
                  name="problemStatement"
                  rows={4}
                  value={formData.problemStatement}
                  onChange={handleChange}
                  placeholder="What friction or student challenge does this solve?"
                  className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border ${
                    errors.problemStatement ? 'border-rose-400' : 'border-slate-200 dark:border-purple-900/50'
                  } focus:outline-none focus:border-[#803BE8]`}
                />
                {errors.problemStatement && <p className="text-xs text-rose-500">{errors.problemStatement}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="detailedDescription" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Detailed Implementation Vision <span className="text-pink-500">*</span>
                </label>
                <textarea
                  id="detailedDescription"
                  name="detailedDescription"
                  rows={4}
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  placeholder="Explain architecture plans, key deliverables, and target milestone objectives..."
                  className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border ${
                    errors.detailedDescription ? 'border-rose-400' : 'border-slate-200 dark:border-purple-900/50'
                  } focus:outline-none focus:border-[#803BE8]`}
                />
                {errors.detailedDescription && <p className="text-xs text-rose-500">{errors.detailedDescription}</p>}
              </div>
            </div>

            {/* 4. Category, Difficulty, Mode, Team Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="space-y-1.5">
                <label htmlFor="category" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                >
                  {selectableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="difficulty" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                >
                  {DIFFICULTIES.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mode" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Project Mode
                </label>
                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                >
                  {MODES.map(mode => (
                    <option key={mode} value={mode}>{mode}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="teamSize" className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Target Team Size
                </label>
                <input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  min={2}
                  max={8}
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                />
              </div>

            </div>

            {/* 5. Required Roles & Expected Commitment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="requiredRoles" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Required Roles (comma-separated) <span className="text-pink-500">*</span>
                </label>
                <input
                  id="requiredRoles"
                  name="requiredRoles"
                  type="text"
                  value={formData.requiredRoles}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Dev, ML Engineer, UI/UX Lead"
                  className={`w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border ${
                    errors.requiredRoles ? 'border-rose-400' : 'border-slate-200 dark:border-purple-900/50'
                  } focus:outline-none focus:border-[#803BE8]`}
                />
                {errors.requiredRoles && <p className="text-xs text-rose-500">{errors.requiredRoles}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="weeklyCommitment" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Weekly Commitment
                </label>
                <input
                  id="weeklyCommitment"
                  name="weeklyCommitment"
                  type="text"
                  value={formData.weeklyCommitment}
                  onChange={handleChange}
                  placeholder="e.g. 6-8 hrs/week"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                />
              </div>
            </div>

            {/* 6. Deadline */}
            <div className="space-y-1.5">
              <label htmlFor="deadline" className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                Project Sprint / Submission Deadline <span className="text-pink-500">*</span>
              </label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className={`w-full sm:w-64 text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border ${
                  errors.deadline ? 'border-rose-400' : 'border-slate-200 dark:border-purple-900/50'
                } focus:outline-none focus:border-[#803BE8]`}
              />
              {errors.deadline && <p className="text-xs text-rose-500">{errors.deadline}</p>}
            </div>

            {/* 7. Required Skills Management */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Required Technology Stack &bull; Skill Tags <span className="text-pink-500">*</span>
                </label>
                <span className="text-xs text-[#803BE8] font-bold">
                  {formData.requiredSkills.length} selected
                </span>
              </div>

              {/* Quick Add Presets */}
              <div className="flex flex-wrap gap-1.5 pb-2">
                {POPULAR_SKILLS.slice(0, 8).map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1f193d] hover:bg-purple-100 hover:text-[#803BE8] dark:hover:bg-[#251e4a] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-purple-900/40 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(customSkillInput);
                    }
                  }}
                  placeholder="Type any skill or framework (e.g. Next.js, Docker, WebSockets)..."
                  className="flex-1 text-xs sm:text-sm p-3 rounded-xl bg-slate-50/70 dark:bg-[#1a1435] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-900/50 focus:outline-none focus:border-[#803BE8]"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill(customSkillInput)}
                  className="px-4 py-3 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-[#803BE8] hover:text-white dark:hover:bg-[#803BE8] text-[#803BE8] dark:text-purple-200 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Tag</span>
                </button>
              </div>

              {/* Current Skill Badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.requiredSkills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-[#20183f] text-[#803BE8] dark:text-pink-300 border border-purple-200 dark:border-purple-800/40"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-rose-500 transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {errors.requiredSkills && (
                <p className="text-xs text-rose-500 pt-1">{errors.requiredSkills}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-purple-950/50 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Link
                to="/projects"
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1e173a] text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] text-white text-xs sm:text-sm font-bold shadow-md shadow-purple-600/25 hover:shadow-purple-600/40 transition-all transform hover:-translate-y-0.5"
              >
                Create Project
              </button>
            </div>

          </form>

        </div>

      </div>
    </DashboardLayout>
  );
}
