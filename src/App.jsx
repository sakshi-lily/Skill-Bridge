import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { 
  User, 
  Settings 
} from 'lucide-react';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { ProjectsProvider } from './context/ProjectsContext';
import { TeamTaskProvider } from './context/TeamTaskContext';

// Protected Route Guard
import ProtectedRoute from './components/auth/ProtectedRoute';

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

// Step 5 & 6: Matchmaking & Team/Task Management Pages
import TeammatesPage from './pages/teammates/TeammatesPage';
import TeamsPage from './pages/teams/TeamsPage';
import TeamDetailsPage from './pages/teams/TeamDetailsPage';
import TasksPage from './pages/tasks/TasksPage';

// Step 8: Real-Time Chat, Notifications & Faculty Dashboard
import MessagesPage from './pages/messages/MessagesPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import FacultyDashboardPage from './pages/faculty/FacultyDashboardPage';

// Step 9 & 10: My Projects & Builder Profile
import MyProjectsPage from './pages/projects/MyProjectsPage';
import ProfilePage from './pages/profile/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <TeamTaskProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Landing Page */}
              <Route path="/" element={<LandingPage />} />

              {/* Authentication Routes */}
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/setup-profile" element={<SetupProfilePage />} />

              {/* Main Student Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardOverview />
                  </ProtectedRoute>
                }
              />

              {/* Step 4: Project Matchmaking Discovery Routes */}
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <ExploreProjectsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/create"
                element={
                  <ProtectedRoute>
                    <CreateProjectPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <ProjectDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Step 5: Rule-Based Skill-Matching Teammates Route */}
              <Route
                path="/teammates"
                element={
                  <ProtectedRoute>
                    <TeammatesPage />
                  </ProtectedRoute>
                }
              />

              {/* Step 6: Team Formation & Details Routes */}
              <Route
                path="/teams"
                element={
                  <ProtectedRoute>
                    <TeamsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/teams/:id"
                element={
                  <ProtectedRoute>
                    <TeamDetailsPage />
                  </ProtectedRoute>
                }
              />

              {/* Step 6: Kanban Task Management Route */}
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <TasksPage />
                  </ProtectedRoute>
                }
              />

              {/* Step 8: Real-Time Team Chat Route */}
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <MessagesPage />
                  </ProtectedRoute>
                }
              />

              {/* Step 8: Real-Time Notifications Center Route */}
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <NotificationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Step 8: Faculty & Admin Oversight Dashboard */}
              <Route
                path="/faculty"
                element={
                  <ProtectedRoute allowedRoles={['faculty', 'admin']}>
                    <FacultyDashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/my-projects"
                element={
                  <ProtectedRoute>
                    <MyProjectsPage />
                  </ProtectedRoute>
                }
              />

              {/* User Profile & Settings */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
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
                  </ProtectedRoute>
                }
              />

              {/* Fallback back to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </TeamTaskProvider>
      </ProjectsProvider>
    </AuthProvider>
  );
}
