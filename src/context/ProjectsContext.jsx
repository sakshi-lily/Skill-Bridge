import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

import { projectsAPI } from '../services/api';
import { INITIAL_PROJECTS } from '../data/projectsData';

const ProjectsContext = createContext(null);

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [applications, setApplications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load real projects from MongoDB or fallback to INITIAL_PROJECTS in standby mode
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await projectsAPI.getProjects();

      const projectList = Array.isArray(response)
        ? response
        : response?.projects || [];

      if (projectList.length > 0) {
        setProjects(projectList);
        return projectList;
      }
      setProjects(INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    } catch (err) {
      console.warn('Backend DB unavailable, continuing with demo projects:', err.message);
      setProjects(INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects().catch(() => {});
  }, [fetchProjects]);

  // Create project in MongoDB
  const addProject = async (newProjectData) => {
    setError(null);

    try {
      const availableRoles = Array.isArray(
        newProjectData.availableRoles
      )
        ? newProjectData.availableRoles
        : (newProjectData.requiredRoles || '')
            .split(',')
            .map((role) => role.trim())
            .filter(Boolean);

      const payload = {
        ...newProjectData,
        shortDescription:
          newProjectData.shortDescription ||
          newProjectData.description ||
          '',
        mode: newProjectData.mode || 'Remote',
        teamSize: Number(newProjectData.teamSize) || 4,
        availableRoles,
      };

      delete payload.requiredRoles;

      const response = await projectsAPI.createProject(payload);

      if (!response.success || !response.project) {
        throw new Error('Project was not saved.');
      }

      const savedProject = response.project;

      setProjects((prev) => [savedProject, ...prev]);

      return savedProject;
    } catch (err) {
      console.error('Project creation failed:', err);
      setError(err.message || 'Unable to create project');
      throw err;
    }
  };

  // Apply to a project using backend API
  const applyToProject = async (projectId, note = '') => {
    if (applications[projectId]) {
      return false;
    }

    try {
      const response = await projectsAPI.applyToProject(projectId, { note });

      if (!response.success) {
        throw new Error('Application could not be submitted.');
      }

      setApplications((prev) => ({
        ...prev,
        [projectId]: {
          status: response.application?.status || 'Pending',
          note,
          appliedAt: new Date().toISOString(),
        },
      }));

      return true;
    } catch (err) {
      console.error('Project application failed:', err);
      setError(err.message || 'Application failed');
      throw err;
    }
  };

  const isApplied = (projectId) => {
    return Boolean(applications[projectId]);
  };

  const getApplication = (projectId) => {
    return applications[projectId] || null;
  };

  const getProjectById = (id) => {
    return projects.find(
      (project) =>
        String(project._id) === String(id) ||
        String(project.id) === String(id)
    );
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        applications,
        loading,
        error,
        fetchProjects,
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
    throw new Error(
      'useProjects must be used within a ProjectsProvider'
    );
  }

  return context;
}
