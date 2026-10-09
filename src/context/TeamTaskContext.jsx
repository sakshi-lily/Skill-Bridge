import React, { createContext, useContext, useState, useMemo } from 'react';
import { INITIAL_TEAMS, INITIAL_USER_INVITATIONS } from '../data/teamsData';
import { INITIAL_TASKS } from '../data/tasksData';
import { CURRENT_USER } from '../data/studentsData';

const TeamTaskContext = createContext(null);

export function TeamTaskProvider({ children }) {
  const [currentUser] = useState(CURRENT_USER);
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [userInvitations, setUserInvitations] = useState(INITIAL_USER_INVITATIONS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  // Reference date for overdue detection (fixed to current mock environment: 2026-10-10)
  const CURRENT_DATE_STRING = '2026-10-10';

  // Helper: check if a due date is overdue compared to CURRENT_DATE_STRING
  const checkIsOverdue = (dueDate, status) => {
    if (!dueDate || status === 'Completed') return false;
    return dueDate < CURRENT_DATE_STRING;
  };

  /* ==========================================================
     TEAM FORMATION ACTIONS
     ========================================================== */

  const createTeam = (teamData) => {
    const slug = `team-${teamData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const newTeam = {
      id: slug,
      name: teamData.name.trim(),
      description: teamData.description?.trim() || '',
      projectId: teamData.projectId,
      projectName: teamData.projectName,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      maxMembers: Number(teamData.maxMembers) || 4,
      members: [
        {
          studentId: currentUser.id,
          name: currentUser.name,
          role: teamData.creatorRole || 'Team Lead',
          avatar: currentUser.avatar,
          university: currentUser.university,
          joinedAt: CURRENT_DATE_STRING,
          isOwner: true,
        },
      ],
      pendingInvitations: [],
      createdAt: CURRENT_DATE_STRING,
    };

    setTeams(prev => [newTeam, ...prev]);
    return newTeam;
  };

  const removeMember = (teamId, studentId) => {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          // Prevent removing the owner
          if (studentId === team.ownerId) return team;
          return {
            ...team,
            members: team.members.filter(m => m.studentId !== studentId),
          };
        }
        return team;
      })
    );
  };

  const updateMemberRole = (teamId, studentId, newRole) => {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            members: team.members.map(m =>
              m.studentId === studentId ? { ...m, role: newRole } : m
            ),
          };
        }
        return team;
      })
    );
  };

  const leaveTeam = (teamId, studentId) => {
    removeMember(teamId, studentId);
  };

  const sendTeamInvite = (teamId, student, role, note = '') => {
    let result = { success: false, error: '' };

    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          // Check team size limit
          if (team.members.length >= team.maxMembers) {
            result = { success: false, error: `Team has reached its maximum size limit (${team.maxMembers} members).` };
            return team;
          }

          // Check if already a member
          if (team.members.some(m => m.studentId === student.id)) {
            result = { success: false, error: `${student.name} is already a member of this team.` };
            return team;
          }

          // Check if already invited
          if (team.pendingInvitations.some(inv => inv.studentId === student.id)) {
            result = { success: false, error: `An invitation is already pending for ${student.name}.` };
            return team;
          }

          const newInvite = {
            id: `inv-${Date.now()}`,
            studentId: student.id,
            studentName: student.name,
            studentAvatar: student.avatar,
            role: role || 'Co-builder',
            note,
            invitedBy: currentUser.name,
            invitedAt: CURRENT_DATE_STRING,
            status: 'Pending',
          };

          result = { success: true, invite: newInvite };

          return {
            ...team,
            pendingInvitations: [...team.pendingInvitations, newInvite],
          };
        }
        return team;
      })
    );

    return result;
  };

  const cancelTeamInvite = (teamId, inviteId) => {
    setTeams(prev =>
      prev.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            pendingInvitations: team.pendingInvitations.filter(i => i.id !== inviteId),
          };
        }
        return team;
      })
    );
  };

  const acceptUserInvite = (inviteId) => {
    const invite = userInvitations.find(inv => inv.id === inviteId);
    if (!invite) return;

    // Add user to the target team if not already present
    setTeams(prev =>
      prev.map(team => {
        if (team.id === invite.teamId) {
          if (team.members.some(m => m.studentId === currentUser.id)) return team;
          return {
            ...team,
            members: [
              ...team.members,
              {
                studentId: currentUser.id,
                name: currentUser.name,
                role: invite.offeredRole,
                avatar: currentUser.avatar,
                university: currentUser.university,
                joinedAt: CURRENT_DATE_STRING,
                isOwner: false,
              },
            ],
          };
        }
        return team;
      })
    );

    // Remove from user incoming invites
    setUserInvitations(prev => prev.filter(inv => inv.id !== inviteId));
  };

  const rejectUserInvite = (inviteId) => {
    setUserInvitations(prev => prev.filter(inv => inv.id !== inviteId));
  };

  /* ==========================================================
     KANBAN TASK MANAGEMENT ACTIONS
     ========================================================== */

  const createTask = (taskData) => {
    const slug = `task-${Date.now()}`;
    const newTask = {
      id: slug,
      title: taskData.title.trim(),
      description: taskData.description?.trim() || '',
      teamId: taskData.teamId,
      teamName: taskData.teamName || 'Team Project',
      projectId: taskData.projectId,
      projectName: taskData.projectName || 'Active Project',
      assignedTo: taskData.assignedTo || {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'To Do',
      dueDate: taskData.dueDate,
      isOverdue: checkIsOverdue(taskData.dueDate, taskData.status || 'To Do'),
      createdAt: CURRENT_DATE_STRING,
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const updated = { ...task, ...updates };
          updated.isOverdue = checkIsOverdue(updated.dueDate, updated.status);
          return updated;
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const moveTaskStatus = (taskId, newStatus) => {
    updateTask(taskId, { status: newStatus });
  };

  /* ==========================================================
     QUERY & CALCULATION HELPERS
     ========================================================== */

  const getTeamById = (teamId) => {
    return teams.find(t => t.id === teamId);
  };

  const getTasksByTeam = (teamId) => {
    return tasks.filter(t => t.id === teamId || t.teamId === teamId);
  };

  const getTeamProgress = (teamId) => {
    const teamTasks = getTasksByTeam(teamId);
    if (teamTasks.length === 0) return 0;
    const completed = teamTasks.filter(t => t.status === 'Completed').length;
    return Math.round((completed / teamTasks.length) * 100);
  };

  const myTeams = useMemo(() => {
    return teams.filter(t => t.members.some(m => m.studentId === currentUser.id));
  }, [teams, currentUser.id]);

  const myAssignedTasks = useMemo(() => {
    return tasks.filter(t => t.assignedTo?.id === currentUser.id);
  }, [tasks, currentUser.id]);

  return (
    <TeamTaskContext.Provider
      value={{
        currentUser,
        teams,
        myTeams,
        userInvitations,
        tasks,
        myAssignedTasks,
        // Team operations
        createTeam,
        removeMember,
        updateMemberRole,
        leaveTeam,
        sendTeamInvite,
        cancelTeamInvite,
        acceptUserInvite,
        rejectUserInvite,
        getTeamById,
        getTeamProgress,
        // Task operations
        createTask,
        updateTask,
        deleteTask,
        moveTaskStatus,
        getTasksByTeam,
      }}
    >
      {children}
    </TeamTaskContext.Provider>
  );
}

export function useTeamTask() {
  const context = useContext(TeamTaskContext);
  if (!context) {
    throw new Error('useTeamTask must be used within a TeamTaskProvider');
  }
  return context;
}
