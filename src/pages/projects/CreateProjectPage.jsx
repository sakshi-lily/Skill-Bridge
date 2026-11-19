import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  FolderPlus,
} from 'lucide-react';

import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useProjects } from '../../context/ProjectsContext';
import {
  CATEGORIES,
  POPULAR_SKILLS,
  DIFFICULTIES,
  MODES,
} from '../../data/projectsData';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { addProject } = useProjects();

  const selectableCategories = CATEGORIES.filter(
    (category) => category !== 'All Projects'
  );

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
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    setNotice(null);
  };

  // Add required skill
  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();

    if (!trimmed) return;

    const alreadyExists = formData.requiredSkills.some(
      (existing) =>
        existing.toLowerCase() === trimmed.toLowerCase()
    );

    if (alreadyExists) {
      setCustomSkillInput('');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      requiredSkills: [...prev.requiredSkills, trimmed],
    }));

    setCustomSkillInput('');

    setErrors((prev) => ({
      ...prev,
      requiredSkills: undefined,
    }));
  };

  // Remove required skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  // Form validation
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title =
        'Project title must contain at least 5 characters';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription =
        'Short description is required';
    } else if (formData.shortDescription.trim().length < 20) {
      newErrors.shortDescription =
        'Please enter at least 20 characters';
    }

    if (!formData.detailedDescription.trim()) {
      newErrors.detailedDescription =
        'Detailed description is required';
    }

    if (!formData.problemStatement.trim()) {
      newErrors.problemStatement =
        'Problem statement is required';
    }

    if (formData.requiredSkills.length === 0) {
      newErrors.requiredSkills =
        'Please select at least one skill';
    }

    const teamSize = Number(formData.teamSize);

    if (
      !Number.isInteger(teamSize) ||
      teamSize < 2 ||
      teamSize > 8
    ) {
      newErrors.teamSize =
        'Team size must be between 2 and 8';
    }

    if (!formData.requiredRoles.trim()) {
      newErrors.requiredRoles =
        'Please specify required roles';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit project to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setNotice(null);

    if (!validate()) return;

    const token = localStorage.getItem('token');

    if (!token) {
      setNotice({
        type: 'error',
        message: 'Please log in before creating a project.',
      });
      return;
    }

    const availableRoles = formData.requiredRoles
      .split(',')
      .map((role) => role.trim())
      .filter(Boolean);

    const projectData = {
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      detailedDescription:
        formData.detailedDescription.trim(),
      problemStatement: formData.problemStatement.trim(),
      category: formData.category,
      difficulty: formData.difficulty,
      mode: formData.mode,
      teamSize: Number(formData.teamSize),
      availableRoles,
      deadline: formData.deadline,
      weeklyCommitment: formData.weeklyCommitment.trim(),
      requiredSkills: formData.requiredSkills,
    };

    setIsSubmitting(true);

    try {
      // addProject calls backend API through ProjectsContext
      const createdProject = await addProject(projectData);

      if (!createdProject) {
        throw new Error('Project creation failed.');
      }

      setNotice({
        type: 'success',
        message:
          'Project successfully saved to MongoDB! Redirecting...',
      });

      navigate('/projects');
    } catch (error) {
      console.error('Create project error:', error);

      setNotice({
        type: 'error',
        message:
          error.message ||
          'Failed to create project. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `w-full text-xs sm:text-sm p-3 rounded-xl
    bg-slate-50/70 dark:bg-[#1e261d]
    text-slate-900 dark:text-white
    border ${
      errors[field]
        ? 'border-rose-400'
        : 'border-slate-200 dark:border-purple-900/50'
    }
    focus:outline-none focus:border-[#7B9669]
    focus:ring-2 focus:ring-[#7B9669]/20`;

  const labelClass =
    'block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200';

  return (
    <DashboardLayout
      title="Create New Project"
      breadcrumb="SkillBridge / Project Matchmaking / Create"
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#7B9669] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Cancel & Back to Projects</span>
          </Link>
        </div>

        {/* Success / Error Notice */}
        {notice && (
          <div
            role="alert"
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              notice.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300'
            }`}
          >
            {notice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}

            <p className="text-sm font-semibold">
              {notice.message}
            </p>
          </div>
        )}

        {/* Main Form Container */}
        <div className="rounded-3xl bg-white dark:bg-[#182017] border border-slate-200/80 dark:border-purple-950/60 p-6 sm:p-9 shadow-sm">

          {/* Header */}
          <div className="pb-6 mb-6 border-b border-slate-100 dark:border-purple-950/50">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-xs font-bold text-[#7B9669] dark:text-purple-300 border border-purple-200 dark:border-purple-800/50 mb-2">
              <FolderPlus className="w-3.5 h-3.5" />
              <span>Project Pitch & Recruitment Form</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Post an Idea • Recruit Your Dream Team
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
              Define your project idea, required skills, and
              available positions to find suitable teammates.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            noValidate
          >

            {/* Project Title */}
            <div className="space-y-1.5">
              <label htmlFor="title" className={labelClass}>
                Project Title <span className="text-pink-500">*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Smart Study Planner"
                className={inputClass('title')}
              />

              {errors.title && (
                <p className="text-xs text-rose-500">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Short Description */}
            <div className="space-y-1.5">
              <label
                htmlFor="shortDescription"
                className={labelClass}
              >
                Short Description
                <span className="text-pink-500"> *</span>
              </label>

              <textarea
                id="shortDescription"
                name="shortDescription"
                rows={2}
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Briefly describe your project..."
                className={inputClass('shortDescription')}
              />

              {errors.shortDescription && (
                <p className="text-xs text-rose-500">
                  {errors.shortDescription}
                </p>
              )}
            </div>

            {/* Description and Problem Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <label
                  htmlFor="problemStatement"
                  className={labelClass}
                >
                  Problem Statement
                  <span className="text-pink-500"> *</span>
                </label>

                <textarea
                  id="problemStatement"
                  name="problemStatement"
                  rows={4}
                  value={formData.problemStatement}
                  onChange={handleChange}
                  placeholder="What problem does your project solve?"
                  className={inputClass('problemStatement')}
                />

                {errors.problemStatement && (
                  <p className="text-xs text-rose-500">
                    {errors.problemStatement}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="detailedDescription"
                  className={labelClass}
                >
                  Detailed Implementation Vision
                  <span className="text-pink-500"> *</span>
                </label>

                <textarea
                  id="detailedDescription"
                  name="detailedDescription"
                  rows={4}
                  value={formData.detailedDescription}
                  onChange={handleChange}
                  placeholder="Explain features, technology and goals..."
                  className={inputClass('detailedDescription')}
                />

                {errors.detailedDescription && (
                  <p className="text-xs text-rose-500">
                    {errors.detailedDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Category, Difficulty, Mode, Team Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              <div className="space-y-1.5">
                <label
                  htmlFor="category"
                  className={labelClass}
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={inputClass('category')}
                >
                  {selectableCategories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="difficulty"
                  className={labelClass}
                >
                  Difficulty Level
                </label>

                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className={inputClass('difficulty')}
                >
                  {DIFFICULTIES.map((difficulty) => (
                    <option
                      key={difficulty}
                      value={difficulty}
                    >
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="mode" className={labelClass}>
                  Project Mode
                </label>

                <select
                  id="mode"
                  name="mode"
                  value={formData.mode}
                  onChange={handleChange}
                  className={inputClass('mode')}
                >
                  {MODES.map((mode) => (
                    <option key={mode} value={mode}>
                      {mode}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="teamSize"
                  className={labelClass}
                >
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
                  className={inputClass('teamSize')}
                />

                {errors.teamSize && (
                  <p className="text-xs text-rose-500">
                    {errors.teamSize}
                  </p>
                )}
              </div>
            </div>

            {/* Required Roles and Weekly Commitment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <label
                  htmlFor="requiredRoles"
                  className={labelClass}
                >
                  Required Roles
                  <span className="text-pink-500"> *</span>
                </label>

                <input
                  id="requiredRoles"
                  name="requiredRoles"
                  type="text"
                  value={formData.requiredRoles}
                  onChange={handleChange}
                  placeholder="Frontend Developer, Backend Developer"
                  className={inputClass('requiredRoles')}
                />

                {errors.requiredRoles && (
                  <p className="text-xs text-rose-500">
                    {errors.requiredRoles}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="weeklyCommitment"
                  className={labelClass}
                >
                  Weekly Commitment
                </label>

                <input
                  id="weeklyCommitment"
                  name="weeklyCommitment"
                  type="text"
                  value={formData.weeklyCommitment}
                  onChange={handleChange}
                  placeholder="e.g. 6-8 hrs/week"
                  className={inputClass('weeklyCommitment')}
                />
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label
                htmlFor="deadline"
                className={labelClass}
              >
                Project Deadline
                <span className="text-pink-500"> *</span>
              </label>

              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                className={`${inputClass('deadline')} sm:w-64`}
              />

              {errors.deadline && (
                <p className="text-xs text-rose-500">
                  {errors.deadline}
                </p>
              )}
            </div>

            {/* Required Skills */}
            <div className="space-y-3 pt-2">

              <div className="flex items-center justify-between">
                <label className={labelClass}>
                  Required Technology Stack
                  <span className="text-pink-500"> *</span>
                </label>

                <span className="text-xs text-[#7B9669] font-bold">
                  {formData.requiredSkills.length} selected
                </span>
              </div>

              {/* Popular Skills */}
              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.slice(0, 8).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#222c20] hover:bg-purple-100 hover:text-[#7B9669] text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-purple-900/40 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>

              {/* Custom Skill */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) =>
                    setCustomSkillInput(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill(customSkillInput);
                    }
                  }}
                  placeholder="e.g. Next.js, MongoDB, Docker"
                  className={inputClass('requiredSkills')}
                />

                <button
                  type="button"
                  onClick={() =>
                    handleAddSkill(customSkillInput)
                  }
                  className="px-4 py-3 rounded-xl bg-purple-100 dark:bg-purple-900/50 hover:bg-[#7B9669] hover:text-white text-[#7B9669] dark:text-purple-200 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </button>
              </div>

              {/* Selected Skills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-[#1e261d] text-[#7B9669] dark:text-pink-300 border border-purple-200 dark:border-purple-800/40"
                  >
                    {skill}

                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveSkill(skill)
                      }
                      aria-label={`Remove ${skill}`}
                      className="hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>

              {errors.requiredSkills && (
                <p className="text-xs text-rose-500">
                  {errors.requiredSkills}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-slate-100 dark:border-purple-950/50 flex flex-col sm:flex-row items-center justify-end gap-3">

              <Link
                to="/projects"
                className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#222c20] text-center"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#7B9669] hover:bg-[#404E3B] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-bold shadow-md shadow-[#7B9669]/25 transition-all"
              >
                {isSubmitting
                  ? 'Creating Project...'
                  : 'Create Project'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
