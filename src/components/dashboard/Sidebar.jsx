import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Users, 
  ShieldCheck, 
  FolderKanban, 
  CheckSquare, 
  MessageSquare, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  X,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import SkillBridgeLogo from '../SkillBridgeLogo';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isFacultyOrAdmin = user?.role === 'faculty' || user?.role === 'admin';

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    ...(isFacultyOrAdmin ? [
      { name: 'Faculty Oversight', path: '/faculty', icon: GraduationCap, badge: 'Portal' }
    ] : []),
    { name: 'Explore Projects', path: '/projects', icon: Compass },
    { name: 'Find Teammates', path: '/teammates', icon: Users },
    { name: 'My Teams', path: '/teams', icon: ShieldCheck },
    { name: 'My Projects', path: '/my-projects', icon: FolderKanban },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, badge: '4' },
    { name: 'Messages', path: '/messages', icon: MessageSquare, badge: 'Live' },
    { name: 'Notifications', path: '/notifications', icon: Bell, badge: '3' },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 sm:w-72 
          bg-white dark:bg-[#120e24] border-r border-slate-200/80 dark:border-purple-950/60
          flex flex-col justify-between transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Top: Logo & Close Button */}
        <div>
          <div className="h-18 px-5 flex items-center justify-between border-b border-slate-100 dark:border-purple-950/40">
            <Link to="/dashboard" onClick={onClose} className="focus:outline-none">
              <SkillBridgeLogo />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1435]"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items List */}
          <nav className="p-3.5 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 py-1.5 block">
              Main Menu
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) => `
                    flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 group
                    ${
                      isActive
                        ? 'bg-[#803BE8] text-white shadow-sm shadow-purple-500/25'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#1c1638] hover:text-[#803BE8] dark:hover:text-purple-300'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 dark:text-slate-500 group-hover:text-[#803BE8] dark:group-hover:text-purple-300'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-pink-100 dark:bg-pink-950/70 text-pink-600 dark:text-pink-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Card & Logout Button */}
        <div className="p-3.5 border-t border-slate-100 dark:border-purple-950/40 space-y-2 bg-slate-50/50 dark:bg-[#0f0c1e]/50">
          {/* Student Profile Snapshot */}
          <Link
            to="/profile"
            onClick={onClose}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white dark:hover:bg-[#1a1435] transition-colors group"
          >
            <div className="relative">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                alt={user?.name || "Student"}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-300 dark:ring-purple-800"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#120e24]"></span>
            </div>
            <div className="min-w-0 flex-1">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-[#803BE8] transition-colors">
                {user?.name || "Student Builder"}
              </h5>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate capitalize">
                {user?.academic?.course || user?.role || "Student"} &bull; {user?.university || "SkillBridge"}
              </p>
            </div>
          </Link>

          {/* Logout Action */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
