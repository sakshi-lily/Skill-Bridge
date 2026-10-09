import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useTeamTask } from '../../context/TeamTaskContext';
import { useAuth } from '../../context/AuthContext';
import { getSocket } from '../../services/socket';
import { chatAPI } from '../../services/api';
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Users, 
  Clock, 
  Smile, 
  Folder,
  Circle,
  AlertCircle
} from 'lucide-react';

export default function MessagesPage() {
  const { myTeams, teams } = useTeamTask();
  const { user } = useAuth();
  const availableTeams = myTeams.length > 0 ? myTeams : teams;

  const [selectedTeam, setSelectedTeam] = useState(availableTeams[0] || null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial simulated messages for each team if empty
  const defaultTeamMessages = {
    'team-pulse': [
      {
        id: 'msg-1',
        senderName: 'Sarah Patel',
        senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        content: 'Hey team! I just finalized the Figma design system components for the student navbar and team cards.',
        createdAt: '10:30 AM',
        isSelf: false,
      },
      {
        id: 'msg-2',
        senderName: 'David Chen',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        content: 'Awesome work Sarah. The FastAPI route validation for JWT tokens is also merged into develop branch.',
        createdAt: '10:34 AM',
        isSelf: false,
      },
      {
        id: 'msg-3',
        senderName: 'Alex Morgan',
        senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
        content: 'Great velocity everyone! Let us review the sprint deliverables before the faculty advisor check-in tomorrow.',
        createdAt: '10:40 AM',
        isSelf: true,
      },
    ],
  };

  useEffect(() => {
    if (availableTeams.length > 0 && !selectedTeam) {
      setSelectedTeam(availableTeams[0]);
    }
  }, [availableTeams]);

  // Load messages and listen to Socket.IO events for active team
  useEffect(() => {
    if (!selectedTeam) return;

    const teamId = selectedTeam.id || selectedTeam._id;
    let isSubscribed = true;

    // Fetch messages from backend
    const loadMessages = async () => {
      try {
        const res = await chatAPI.getTeamMessages(teamId);
        if (isSubscribed && res.success && res.messages && res.messages.length > 0) {
          setMessages(res.messages.map(m => ({
            ...m,
            isSelf: m.sender === user?._id || m.senderName === user?.name,
          })));
        } else if (isSubscribed) {
          setMessages(defaultTeamMessages[teamId] || [
            {
              id: 'init-1',
              senderName: selectedTeam.ownerName || 'Team Lead',
              senderAvatar: '',
              content: `Welcome to the ${selectedTeam.name} collaboration room! Post updates, share deliverables, and coordinate sprints here.`,
              createdAt: 'Today',
              isSelf: false,
            }
          ]);
        }
      } catch (err) {
        if (isSubscribed) {
          setMessages(defaultTeamMessages[teamId] || []);
        }
      }
    };

    loadMessages();

    // Socket.IO Room Joining and Listener
    const socket = getSocket();
    if (socket) {
      socket.emit('join_team', { teamId });

      const handleIncomingMessage = (newMsg) => {
        if (newMsg.team === teamId) {
          setMessages(prev => [
            ...prev,
            {
              ...newMsg,
              isSelf: newMsg.sender === user?._id || newMsg.senderName === user?.name,
            },
          ]);
        }
      };

      socket.on('team_message', handleIncomingMessage);

      return () => {
        isSubscribed = false;
        socket.emit('leave_team', { teamId });
        socket.off('team_message', handleIncomingMessage);
      };
    }
  }, [selectedTeam, user]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedTeam) return;

    const text = inputMessage.trim();
    setInputMessage('');
    setSending(true);

    const teamId = selectedTeam.id || selectedTeam._id;
    const socket = getSocket();

    const newMsgPayload = {
      teamId,
      senderName: user?.name || 'Alex Morgan',
      senderAvatar: user?.avatar || '',
      content: text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistic UI update
    setMessages(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        ...newMsgPayload,
        isSelf: true,
      },
    ]);

    // Send via Socket.IO
    if (socket) {
      socket.emit('send_team_message', newMsgPayload);
    }

    // Persist to backend API
    try {
      await chatAPI.postMessage(teamId, { content: text });
    } catch (err) {
      // Handled gracefully in offline mode
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout 
      title="Team Messages" 
      breadcrumb="Dashboard / Team Messages & Real-Time Chat"
    >
      <div className="bg-white dark:bg-[#151226] rounded-3xl border border-slate-200/80 dark:border-purple-950/60 shadow-sm overflow-hidden h-[calc(100vh-180px)] min-h-[580px] flex flex-col md:flex-row">
        
        {/* Left Sidebar: Team Channels */}
        <div className="w-full md:w-80 border-r border-slate-200/80 dark:border-white/5 flex flex-col bg-slate-50/50 dark:bg-[#120e24]">
          <div className="p-4 border-b border-slate-200/80 dark:border-white/5">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#803BE8]" />
              <span>Project Team Channels</span>
            </h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Select an active squad to collaborate
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {availableTeams.map((team) => {
              const isSelected = selectedTeam?.id === team.id || selectedTeam?._id === team._id;
              return (
                <button
                  key={team.id || team._id}
                  onClick={() => setSelectedTeam(team)}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-150 flex items-start gap-3 ${
                    isSelected
                      ? 'bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-950 dark:text-white shadow-xs'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#803BE8]/10 text-[#803BE8] dark:text-purple-300 flex items-center justify-center font-bold text-sm shrink-0">
                    {team.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm truncate">{team.name}</h4>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {team.projectName || 'Active Mission'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Area: Chat Workspace */}
        <div className="flex-1 flex flex-col bg-white dark:bg-[#18122B] min-w-0">
          {selectedTeam ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/30 dark:bg-white/[0.02]">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#803BE8] to-[#9B51E0] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                    {selectedTeam.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base truncate flex items-center gap-2">
                      <span>{selectedTeam.name}</span>
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/60">
                        <Circle className="w-2 h-2 fill-emerald-500" />
                        Live Room
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      Project: <span className="font-medium text-[#803BE8] dark:text-purple-300">{selectedTeam.projectName}</span> &bull; {selectedTeam.members?.length || 3} Collaborators
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/20 dark:bg-[#130f24]/50">
                {messages.map((msg, index) => {
                  const isSelf = msg.isSelf;
                  return (
                    <div
                      key={msg.id || msg._id || index}
                      className={`flex gap-3 max-w-[80%] ${
                        isSelf ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      {/* Avatar */}
                      {msg.senderAvatar ? (
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-purple-200 dark:ring-purple-800"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {msg.senderName?.charAt(0) || 'U'}
                        </div>
                      )}

                      {/* Bubble */}
                      <div className="space-y-1">
                        <div className={`flex items-center gap-2 text-[10px] ${isSelf ? 'justify-end text-slate-400' : 'text-slate-500'}`}>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{msg.senderName}</span>
                          <span>{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}</span>
                        </div>
                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                            isSelf
                              ? 'bg-[#803BE8] text-white rounded-tr-xs'
                              : 'bg-white dark:bg-[#1f1737] text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-white/5 rounded-tl-xs'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-[#18122B] flex items-center gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={`Message #${selectedTeam.name}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || sending}
                  className="px-5 py-2.5 rounded-xl bg-[#803BE8] hover:bg-[#6c27cf] disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-purple-500/20 flex items-center gap-1.5 shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <Users className="w-12 h-12 stroke-[1.5] mb-2 text-purple-400" />
              <h3 className="font-bold text-slate-800 dark:text-white">No Team Selected</h3>
              <p className="text-xs mt-1">Join or create a team to start real-time squad collaboration.</p>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
