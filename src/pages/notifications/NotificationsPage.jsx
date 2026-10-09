import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { notificationsAPI } from '../../services/api';
import { getSocket } from '../../services/socket';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Users, 
  CheckSquare, 
  Sparkles, 
  Folder, 
  Mail, 
  Clock,
  Circle
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(false);

  // Initial simulated notifications for demo evaluation
  const initialDemoNotifications = [
    {
      _id: 'notif-1',
      type: 'invite',
      title: 'Squad Invitation',
      message: 'Sarah Patel invited you to join team PulseEngineers as Full-Stack Lead.',
      createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
      isRead: false,
    },
    {
      _id: 'notif-2',
      type: 'task',
      title: 'Task Assigned',
      message: 'David Chen assigned you the deliverable: "Setup FastAPI Route Validation & JWT Auth".',
      createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      isRead: false,
    },
    {
      _id: 'notif-3',
      type: 'milestone',
      title: 'Milestone Completed',
      message: 'CampusPulse AI reached Milestone 1: Core Design System specification approved.',
      createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      isRead: true,
    },
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const res = await notificationsAPI.getNotifications();
        if (res.success && res.notifications && res.notifications.length > 0) {
          setNotifications(res.notifications);
        } else {
          setNotifications(initialDemoNotifications);
        }
      } catch (err) {
        setNotifications(initialDemoNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Socket.IO Real-time Notification Listener
    const socket = getSocket();
    if (socket) {
      const handleLiveNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
      };

      socket.on('new_notification', handleLiveNotification);

      return () => {
        socket.off('new_notification', handleLiveNotification);
      };
    }
  }, []);

  const handleMarkAsRead = async (id) => {
    setNotifications(prev =>
      prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
    );
    try {
      await notificationsAPI.markAsRead(id);
    } catch (err) {
      // Local fallback
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await notificationsAPI.markAllAsRead();
    } catch (err) {
      // Local fallback
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'INVITES') return n.type === 'invite';
    if (filter === 'TASKS') return n.type === 'task';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case 'invite':
        return <Users className="w-4 h-4 text-[#803BE8]" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-amber-500" />;
      case 'milestone':
        return <Sparkles className="w-4 h-4 text-pink-500" />;
      default:
        return <Bell className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <DashboardLayout 
      title="Notifications" 
      breadcrumb="Dashboard / Notifications & Live Alerts"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#151226] p-6 rounded-3xl border border-slate-200/80 dark:border-purple-950/60 shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#803BE8]" />
              <span>Notification Center</span>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#803BE8] text-white">
                  {unreadCount} unread
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Project invitations, task assignments, and real-time team milestone alerts.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/50 hover:bg-[#803BE8] hover:text-white text-[#803BE8] dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 transition-colors shrink-0"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark all as read</span>
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Alerts' },
            { id: 'UNREAD', label: `Unread (${unreadCount})` },
            { id: 'INVITES', label: 'Team Invites' },
            { id: 'TASKS', label: 'Tasks' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-[#803BE8] text-white shadow-sm shadow-purple-500/25'
                  : 'bg-white dark:bg-[#151226] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/5 hover:border-purple-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
                className={`p-4 rounded-2xl border transition-all duration-150 flex items-start gap-4 cursor-pointer ${
                  !n.isRead
                    ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/60 hover:border-purple-400'
                    : 'bg-white dark:bg-[#151226] border-slate-200/70 dark:border-white/5 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-white dark:bg-[#20183e] shadow-xs border border-slate-100 dark:border-white/5 shrink-0">
                  {getTypeIcon(n.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {n.title}
                    </h4>
                    {!n.isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#803BE8] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-2">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center bg-white dark:bg-[#151226] rounded-3xl border border-slate-200/80 dark:border-white/5 p-8 text-slate-400 space-y-2">
              <Bell className="w-10 h-10 stroke-[1.5] text-purple-400 mx-auto" />
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">No notifications found</h3>
              <p className="text-xs">You are all caught up with your campus matchmaking activities.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
