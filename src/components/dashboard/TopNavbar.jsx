import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut, 
  X,
  CheckCircle2,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import { getSocket } from '../../services/socket';

export default function TopNavbar({ 
  onOpenSidebar, 
  title = "Overview", 
  breadcrumb = "Dashboard / Overview" 
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [liveNotifications, setLiveNotifications] = useState([]);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Load notifications
  useEffect(() => {
    const loadNotifs = async () => {
      try {
        const res = await notificationsAPI.getNotifications();
        if (res.success && res.notifications) {
          setLiveNotifications(res.notifications);
        }
      } catch (err) {
        // Fallback
      }
    };
    loadNotifs();

    const socket = getSocket();
    if (socket) {
      const onNotif = (notif) => {
        setLiveNotifications(prev => [notif, ...prev]);
      };
      socket.on('new_notification', onNotif);
      return () => socket.off('new_notification', onNotif);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = liveNotifications.length > 0 ? liveNotifications : [
    {
      _id: '1',
      title: 'New Teammate Invite',
      message: 'Sarah Patel invited you to join "CampusPulse".',
      createdAt: '12m ago',
      isRead: false,
    },
    {
      _id: '2',
      title: 'Milestone Completed',
      message: 'DevMentor finished "API Schema Review".',
      createdAt: '1h ago',
      isRead: false,
    },
    {
      _id: '3',
      title: 'New Skill Match',
      message: '3 new students matched your Python/AI profile.',
      createdAt: '3h ago',
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 h-18 bg-white/90 dark:bg-[#120e24]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-purple-950/60 px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-colors">
      
      {/* Left: Mobile Toggle & Page Title / Breadcrumb */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1638] focus:outline-none"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 hidden sm:block">
            {breadcrumb}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Middle: Interactive Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, teammates, tech stacks..."
            className="w-full text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl bg-slate-100/80 dark:bg-[#1a1435] text-slate-900 dark:text-white placeholder:text-slate-400 border border-slate-200/70 dark:border-purple-900/40 focus:outline-none focus:border-[#803BE8] focus:bg-white dark:focus:bg-[#15102c] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right: Actions, Theme Toggle, Notification & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        
        {/* Light / Dark Mode Toggle */}
        <ThemeToggle />

        {/* Notifications Icon & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1638] transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 px-1.5 py-0.2 min-w-[18px] text-[10px] font-bold rounded-full bg-pink-500 text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#17122e] border border-slate-200 dark:border-purple-900/60 shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-purple-950/60 px-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Live Notifications ({unreadCount} unread)
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await notificationsAPI.markAllAsRead().catch(() => {});
                    setLiveNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                  }}
                  className="text-[10px] font-semibold text-[#803BE8] dark:text-purple-300 cursor-pointer hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.slice(0, 5).map((n) => (
                  <div
                    key={n._id || n.id}
                    onClick={async () => {
                      if (!n.isRead && n._id) {
                        await notificationsAPI.markAsRead(n._id).catch(() => {});
                        setLiveNotifications(prev => prev.map(item => item._id === n._id ? { ...item, isRead: true } : item));
                      }
                    }}
                    className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      !n.isRead
                        ? 'bg-purple-50/70 dark:bg-purple-950/40 text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1e183a]'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {n.message || n.desc}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-purple-950/60 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:underline"
                >
                  View All Notifications &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#1a1435] transition-colors focus:outline-none"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
              alt={user?.name || "User Avatar"}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#803BE8]/50"
            />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 hidden md:block">
              {user?.name ? user.name.split(' ')[0] : 'Alex'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#17122e] border border-slate-200 dark:border-purple-900/60 shadow-xl p-2 z-50">
              <div className="p-2.5 border-b border-slate-100 dark:border-purple-950/60">
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {user?.name || 'Alex Morgan'}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 truncate">
                  {user?.email || 'alex.morgan@stanford.edu'}
                </p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-[#803BE8] dark:text-purple-300 capitalize">
                  {user?.role === 'faculty' ? 'Faculty Advisor' : user?.role === 'admin' ? 'System Admin' : 'Student Builder'}
                </span>
              </div>

              <div className="py-1 space-y-0.5">
                {(user?.role === 'faculty' || user?.role === 'admin') && (
                  <Link
                    to="/faculty"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#803BE8] dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-[#201940]"
                  >
                    <GraduationCap className="w-4 h-4 text-[#803BE8]" />
                    <span>Faculty Oversight</span>
                  </Link>
                )}

                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#201940] hover:text-[#803BE8]"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </Link>

                <Link
                  to="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-[#201940] hover:text-[#803BE8]"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-purple-950/60">
                <button
                  type="button"
                  onClick={async () => {
                    setShowProfileMenu(false);
                    await logout();
                    navigate('/login');
                  }}
                  className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
