import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8FF] dark:bg-[#0B0814] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-[#803BE8] animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Verifying SkillBridge session...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required (e.g., faculty or admin)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role || 'student';
    if (!allowedRoles.includes(userRole)) {
      return (
        <div className="min-h-screen bg-[#FDF8FF] dark:bg-[#0B0814] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-[#120E24] border border-rose-200 dark:border-rose-900/50 rounded-2xl p-8 text-center shadow-xl">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-rose-100 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Restricted Portal Access
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              This section is reserved for verified <strong>{allowedRoles.join(' / ')}</strong> accounts. Your current profile role is <strong>{userRole}</strong>.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#803BE8] text-white text-sm font-bold shadow-md hover:bg-[#6c2bd9] transition-all"
            >
              Return to Student Dashboard
            </a>
          </div>
        </div>
      );
    }
  }

  return children;
}
