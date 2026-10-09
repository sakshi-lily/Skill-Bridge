import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import TaskCard from '../../components/tasks/TaskCard';
import TaskModal from '../../components/tasks/TaskModal';
import { useTeamTask } from '../../context/TeamTaskContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Kanban,
  Layers,
  Sparkles,
  Trash2,
  AlertCircle
} from 'lucide-react';

export default function TasksPage() {
  const { 
    tasks, 
    teams, 
    myTeams, 
    currentUser, 
    moveTaskStatus, 
    deleteTask 
  } = useTeamTask();

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [defaultColumnStatus, setDefaultColumnStatus] = useState('To Do');
  
  // Delete confirmation modal state
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState('ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);

  // Drag over tracking
  const [dragOverCol, setDragOverCol] = useState(null);

  const columns = [
    { id: 'To Do', title: 'To Do', dotColor: 'bg-slate-400', headerBg: 'border-slate-300 dark:border-slate-700' },
    { id: 'In Progress', title: 'In Progress', dotColor: 'bg-amber-400', headerBg: 'border-amber-400 dark:border-amber-600' },
    { id: 'Review', title: 'Review', dotColor: 'bg-purple-500', headerBg: 'border-purple-400 dark:border-purple-600' },
    { id: 'Completed', title: 'Completed', dotColor: 'bg-emerald-400', headerBg: 'border-emerald-400 dark:border-emerald-600' },
  ];

  // Distinct assignees list from existing tasks
  const assigneesList = useMemo(() => {
    const map = new Map();
    tasks.forEach(t => {
      if (t.assignedTo && !map.has(t.assignedTo.id)) {
        map.set(t.assignedTo.id, t.assignedTo);
      }
    });
    return Array.from(map.values());
  }, [tasks]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = (task.description || '').toLowerCase().includes(query);
        const matchesProj = (task.projectName || '').toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesProj) return false;
      }

      // Team filter
      if (selectedTeamId !== 'ALL' && task.teamId !== selectedTeamId) {
        return false;
      }

      // Priority filter
      if (selectedPriority !== 'ALL' && task.priority !== selectedPriority) {
        return false;
      }

      // Assignee filter
      if (selectedAssignee === 'ME') {
        if (task.assignedTo?.id !== currentUser.id) return false;
      } else if (selectedAssignee !== 'ALL' && task.assignedTo?.id !== selectedAssignee) {
        return false;
      }

      // Overdue filter
      if (onlyOverdue && !task.isOverdue) {
        return false;
      }

      return true;
    });
  }, [tasks, searchQuery, selectedTeamId, selectedPriority, selectedAssignee, onlyOverdue, currentUser.id]);

  // Overall statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const overdueTasks = tasks.filter(t => t.isOverdue).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Drag & drop handlers
  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (dragOverCol !== colId) {
      setDragOverCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    e.preventDefault();
    if (dragOverCol === colId) {
      setDragOverCol(null);
    }
  };

  const handleDrop = (e, colId) => {
    e.preventDefault();
    setDragOverCol(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTaskStatus(taskId, colId);
    }
  };

  const handleOpenCreateModal = (status = 'To Do') => {
    setEditingTask(null);
    setDefaultColumnStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <DashboardLayout 
      title="Task Management" 
      breadcrumb="Dashboard / Task Management"
    >
      <div className="space-y-6">
        
        {/* Top Header Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#803BE8] via-[#6f2cd4] to-[#4d169e] p-6 sm:p-8 text-white shadow-xl shadow-purple-500/15">
          <div className="absolute right-0 top-0 -mt-8 -mr-8 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 -mb-8 w-60 h-60 rounded-full bg-purple-300/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-purple-100 text-xs font-semibold mb-3 border border-white/15">
                <Kanban className="w-3.5 h-3.5 text-pink-300" />
                Step 6: Team Sprint Kanban
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Team Tasks & Deliverables
              </h1>
              <p className="mt-2 text-purple-100/80 text-sm leading-relaxed">
                Coordinate milestones, track sprint deliverables, and manage workload across your active project teams with real-time status transitions.
              </p>
            </div>

            <button
              onClick={() => handleOpenCreateModal('To Do')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white text-[#803BE8] font-bold text-sm shadow-lg hover:bg-purple-50 transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              Create Task
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15">
            <div>
              <div className="text-xs text-purple-200/80 font-medium">Total Tasks</div>
              <div className="text-2xl font-black mt-0.5">{totalTasks}</div>
            </div>
            <div>
              <div className="text-xs text-purple-200/80 font-medium">In Progress</div>
              <div className="text-2xl font-black mt-0.5 text-amber-300">{inProgressTasks}</div>
            </div>
            <div>
              <div className="text-xs text-purple-200/80 font-medium">Overdue Alerts</div>
              <div className="text-2xl font-black mt-0.5 text-rose-300 flex items-center gap-1.5">
                {overdueTasks}
                {overdueTasks > 0 && <AlertTriangle className="w-4 h-4 animate-bounce" />}
              </div>
            </div>
            <div>
              <div className="text-xs text-purple-200/80 font-medium flex items-center justify-between">
                <span>Completion</span>
                <span className="font-bold">{completionRate}%</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-emerald-400 rounded-full transition-all duration-500" 
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#18122B] rounded-2xl p-4 border border-slate-100 dark:border-white/5 shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title, description, or project..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Team Selector */}
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#1f1737] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
              >
                <option value="ALL">All Teams & Projects</option>
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>

              {/* Priority */}
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#1f1737] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
              >
                <option value="ALL">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              {/* Assignee */}
              <select
                value={selectedAssignee}
                onChange={(e) => setSelectedAssignee(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-[#1f1737] border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#803BE8]"
              >
                <option value="ALL">All Assignees</option>
                <option value="ME">Assigned to Me ({currentUser.name})</option>
                {assigneesList
                  .filter(a => a.id !== currentUser.id)
                  .map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
              </select>

              {/* Only Overdue Toggle */}
              <button
                onClick={() => setOnlyOverdue(!onlyOverdue)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                  onlyOverdue 
                    ? 'bg-rose-500 text-white border-rose-500 shadow-sm' 
                    : 'bg-slate-50 dark:bg-white/[0.04] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-rose-400'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Overdue Only
              </button>
            </div>

          </div>

          {/* Active Filters count summary */}
          {(searchQuery || selectedTeamId !== 'ALL' || selectedPriority !== 'ALL' || selectedAssignee !== 'ALL' || onlyOverdue) && (
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
              <span>Showing {filteredTasks.length} of {tasks.length} total tasks</span>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTeamId('ALL');
                  setSelectedPriority('ALL');
                  setSelectedAssignee('ALL');
                  setOnlyOverdue(false);
                }}
                className="text-purple-600 dark:text-purple-400 hover:underline font-semibold"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>

        {/* 4-Column Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
          {columns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);
            const isDropTarget = dragOverCol === col.id;

            return (
              <div
                key={col.id}
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => handleDragLeave(e, col.id)}
                onDrop={(e) => handleDrop(e, col.id)}
                className={`flex flex-col bg-slate-100/80 dark:bg-[#130f24] rounded-3xl p-4 border transition-all duration-200 min-h-[560px] ${
                  isDropTarget 
                    ? 'border-purple-500 ring-2 ring-purple-400/30 bg-purple-50/20 dark:bg-purple-950/20' 
                    : 'border-slate-200/80 dark:border-white/5'
                }`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {col.title}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-white/10 text-slate-600 dark:text-slate-300 shadow-xs">
                      {columnTasks.length}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenCreateModal(col.id)}
                    title={`Add task to ${col.title}`}
                    className="p-1 rounded-lg text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white dark:hover:bg-white/10 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
                  {columnTasks.length > 0 ? (
                    columnTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={handleOpenEditModal}
                        onDelete={(id) => setTaskToDelete(id)}
                        onMoveStatus={moveTaskStatus}
                        canManage={true}
                      />
                    ))
                  ) : (
                    <div className="h-44 flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-dashed border-slate-300 dark:border-white/10 text-slate-400 dark:text-slate-500">
                      <p className="text-xs font-medium">No tasks in {col.title}</p>
                      <button
                        onClick={() => handleOpenCreateModal(col.id)}
                        className="mt-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Task
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Add at Column Bottom */}
                <button
                  onClick={() => handleOpenCreateModal(col.id)}
                  className="mt-3 w-full py-2 px-3 rounded-xl border border-dashed border-slate-300 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:border-purple-300 dark:hover:border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors bg-white/40 dark:bg-white/[0.02]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to {col.title}
                </button>
              </div>
            );
          })}
        </div>

      </div>

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTask={editingTask}
        defaultStatus={defaultColumnStatus}
      />

      {/* Delete Confirmation Modal */}
      {taskToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-[#18122B] rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Task Confirmation
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setTaskToDelete(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-md shadow-rose-500/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
