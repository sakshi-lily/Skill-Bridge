import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Compass, 
  Users, 
  ShieldCheck, 
  FolderKanban, 
  CheckSquare, 
  MessageSquare, 
  Bell, 
  User, 
  Settings 
} from 'lucide-react';

// Context
import { ProjectsProvider } from './context/ProjectsContext';

// Landing & Auth Pages
import LandingPage from './pages/LandingPage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import SetupProfilePage from './pages/SetupProfilePage';

// Dashboard Overview
import DashboardOverview from './pages/dashboard/DashboardOverview';
import DashboardPlaceholderPage from './pages/dashboard/DashboardPlaceholderPage';

// Step 4: Explore Projects, Details & Create Project Pages
import ExploreProjectsPage from './pages/projects/ExploreProjectsPage';
import ProjectDetailsPage from './pages/projects/ProjectDetailsPage';
import CreateProjectPage from './pages/projects/CreateProjectPage';

export default function App() {
  return (
    <ProjectsProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/setup-profile" element={<SetupProfilePage />} />

          {/* Main Student Dashboard */}
          <Route path="/dashboard" element={<DashboardOverview />} />

          {/* Step 4: Project Matchmaking Discovery Routes */}
          <Route path="/projects" element={<ExploreProjectsPage />} />
          <Route path="/projects/create" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />

          {/* Sub-routes sharing DashboardLayout */}
          <Route
            path="/teammates"
            element={
              <DashboardPlaceholderPage
                title="Find Teammates"
                breadcrumb="Dashboard / Find Teammates"
                description="Discover student builders with complementary skill gap matches across top engineering and design universities."
                icon={Users}
                sampleItems={[
                  'AI-driven skill gap recommendations',
                  'Filter by university & major',
                  'Instant peer match invitation messenger',
                  'Verified GitHub & LinkedIn portfolio previews',
                ]}
              />
            }
          />

          <Route
            path="/teams"
            element={
              <DashboardPlaceholderPage
                title="My Teams"
                breadcrumb="Dashboard / My Teams"
                description="Manage team formation, shared workspaces, role assignments, and synchronized team milestone trackers."
                icon={ShieldCheck}
                sampleItems={[
                  'Team member role permissions',
                  'Sprint milestone checklists',
                  'In-workspace group collaboration',
                  'Project repository link manager',
                ]}
              />
            }
          />

          <Route
            path="/my-projects"
            element={
              <DashboardPlaceholderPage
                title="My Projects"
                breadcrumb="Dashboard / My Projects"
                description="Manage and track projects you have created, monitor incoming team applications, and edit project recruitment slots."
                icon={FolderKanban}
                sampleItems={[
                  'Create new project pitch workflow',
                  'Review pending applicant profiles',
                  'Manage team vacancy slots',
                  'Project visibility settings',
                ]}
              />
            }
          />

          <Route
            path="/tasks"
            element={
              <DashboardPlaceholderPage
                title="Tasks & Sprints"
                breadcrumb="Dashboard / Tasks"
                description="Organize your personal deliverables, team kanban boards, and project sprint deadlines in one unified board."
                icon={CheckSquare}
                sampleItems={[
                  'Personal & team task views',
                  'Overdue task notification alerts',
                  'Priority tags (High, Medium, Low)',
                  'GitHub issue synchronization',
                ]}
              />
            }
          />

          <Route
            path="/messages"
            element={
              <DashboardPlaceholderPage
                title="Team Messages"
                breadcrumb="Dashboard / Messages"
                description="Real-time communication channels with project teams, direct matchmaking conversations, and campus group chats."
                icon={MessageSquare}
                sampleItems={[
                  'Direct matchmaking messaging',
                  'Project team group channels',
                  'Code snippet & file attachment sharing',
                  'Verified student online presence status',
                ]}
              />
            }
          />

          <Route
            path="/notifications"
            element={
              <DashboardPlaceholderPage
                title="Notifications"
                breadcrumb="Dashboard / Notifications"
                description="Activity alerts, incoming project team invitations, milestone announcements, and campus updates."
                icon={Bell}
                sampleItems={[
                  'Team invite response actions',
                  'Task assignment reminders',
                  'Project milestone alerts',
                  'Push notification preferences',
                ]}
              />
            }
          />

          <Route
            path="/profile"
            element={
              <DashboardPlaceholderPage
                title="My Builder Profile"
                breadcrumb="Dashboard / Profile"
                description="View and customize your verified student skills, portfolio projects, university details, and matchmaking availability."
                icon={User}
                sampleItems={[
                  'Skill proficiency endorsements',
                  'University email verification badge',
                  'Linked GitHub & LinkedIn stats',
                  'Matchmaking status toggle (Active/Paused)',
                ]}
              />
            }
          />

          <Route
            path="/settings"
            element={
              <DashboardPlaceholderPage
                title="Account Settings"
                breadcrumb="Dashboard / Settings"
                description="Manage security preferences, notification channels, linked accounts, and appearance options."
                icon={Settings}
                sampleItems={[
                  'Profile visibility privacy controls',
                  'Email notification digests',
                  'Dark mode system defaults',
                  'University credential management',
                ]}
              />
            }
          />

          {/* Fallback back to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProjectsProvider>
  );
}
