import React, { createContext, useContext, useState } from 'react';
import { INITIAL_PROJECTS } from '../data/projectsData';

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  
  // Track applied projects: { [projectId]: { status: 'Pending', note: string, appliedAt: string } }
  const [applications, setApplications] = useState({});

  const addProject = (newProjectData) => {
    const slug = newProjectData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `project-${Date.now()}`;

    const newProject = {
      ...newProjectData,
      id: slug,
      currentMembersCount: 1,
      openPositionsCount: Math.max(1, (newProjectData.teamSize || 4) - 1),
      status: 'Recruiting',
      createdAt: new Date().toISOString().split('T')[0],
      owner: {
        name: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        university: 'Stanford University',
        role: 'Project Founder',
      },
      members: [
        {
          name: 'Alex Morgan',
          role: 'Project Founder',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        },
      ],
      milestones: [
        { id: 1, title: 'Project Kickoff & Architecture Plan', completed: true, targetDate: 'Sprint 1' },
        { id: 2, title: 'Core MVP Features Development', completed: false, targetDate: 'Sprint 2' },
        { id: 3, title: 'User Testing & Demo Presentation', completed: false, targetDate: 'Sprint 3' },
      ],
    };

    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const applyToProject = (projectId, note = '') => {
    if (applications[projectId]) {
      return false; // Already applied
    }

    setApplications(prev => ({
      ...prev,
      [projectId]: {
        status: 'Pending',
        note,
        appliedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
    }));
    return true;
  };

  const isApplied = (projectId) => {
    return !!applications[projectId];
  };

  const getApplication = (projectId) => {
    return applications[projectId] || null;
  };

  const getProjectById = (id) => {
    return projects.find(p => p.id === id);
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        applications,
        addProject,
        applyToProject,
        isApplied,
        getApplication,
        getProjectById,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
}
