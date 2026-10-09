const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Core HTTP Request Wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
  };

  // Do not set Content-Type if uploading FormData
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    // If backend is unreachable, throw with clear error
    throw error;
  }
}

/* ==========================================================
   AUTHENTICATION APIS
   ========================================================== */
export const authAPI = {
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  getMe: () =>
    request('/auth/me', {
      method: 'GET',
    }),

  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),

  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token, newPassword) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),
};

/* ==========================================================
   PROJECTS APIS
   ========================================================== */
export const projectsAPI = {
  getProjects: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/projects${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getProjectById: (id) =>
    request(`/projects/${id}`, { method: 'GET' }),

  createProject: (projectData) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    }),

  updateProject: (id, updates) =>
    request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteProject: (id) =>
    request(`/projects/${id}`, { method: 'DELETE' }),

  getProjectMatches: (id) =>
    request(`/projects/${id}/matches`, { method: 'GET' }),

  applyToProject: (id, applicationData) =>
    request(`/projects/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    }),
};

/* ==========================================================
   TEAMS & INVITATIONS APIS
   ========================================================== */
export const teamsAPI = {
  getTeams: (myTeamsOnly = false) =>
    request(`/teams${myTeamsOnly ? '?myTeams=true' : ''}`, { method: 'GET' }),

  getTeamById: (id) =>
    request(`/teams/${id}`, { method: 'GET' }),

  createTeam: (teamData) =>
    request('/teams', {
      method: 'POST',
      body: JSON.stringify(teamData),
    }),

  inviteMember: (teamId, inviteData) =>
    request(`/teams/${teamId}/invite`, {
      method: 'POST',
      body: JSON.stringify(inviteData),
    }),

  respondInvitation: (inviteId, action) =>
    request(`/teams/invitations/${inviteId}`, {
      method: 'PUT',
      body: JSON.stringify({ action }),
    }),

  updateMemberRole: (teamId, userId, role) =>
    request(`/teams/${teamId}/members/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  removeMember: (teamId, userId) =>
    request(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    }),
};

/* ==========================================================
   TASKS & KANBAN APIS
   ========================================================== */
export const tasksAPI = {
  getTasks: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/tasks${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  getTaskStats: (teamId = null) =>
    request(`/tasks/stats${teamId ? `?teamId=${teamId}` : ''}`, { method: 'GET' }),

  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  updateTask: (id, updates) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, { method: 'DELETE' }),
};

/* ==========================================================
   REAL-TIME CHAT & MESSAGES APIS
   ========================================================== */
export const chatAPI = {
  getTeamMessages: (teamId) =>
    request(`/chat/teams/${teamId}`, { method: 'GET' }),

  postMessage: (teamId, messageData) =>
    request(`/chat/teams/${teamId}`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),
};

/* ==========================================================
   NOTIFICATIONS APIS
   ========================================================== */
export const notificationsAPI = {
  getNotifications: () =>
    request('/notifications', { method: 'GET' }),

  markAsRead: (id) =>
    request(`/notifications/${id}/read`, { method: 'PUT' }),

  markAllAsRead: () =>
    request('/notifications/read-all', { method: 'PUT' }),
};

/* ==========================================================
   FACULTY & ADMIN OVERSIGHT APIS
   ========================================================== */
export const facultyAPI = {
  getDashboardData: () =>
    request('/faculty/dashboard', { method: 'GET' }),
};

/* ==========================================================
   FILE SHARING APIS
   ========================================================== */
export const filesAPI = {
  uploadTeamFile: (teamId, formData) =>
    request(`/files/teams/${teamId}`, {
      method: 'POST',
      body: formData,
    }),

  getTeamFiles: (teamId) =>
    request(`/files/teams/${teamId}`, { method: 'GET' }),
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  teams: teamsAPI,
  tasks: tasksAPI,
  chat: chatAPI,
  notifications: notificationsAPI,
  faculty: facultyAPI,
  files: filesAPI,
};
