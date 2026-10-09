import React, { useState } from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ArrowRight,
  Folder,
  UserCheck
} from 'lucide-react';

export default function TaskCard({ 
  task, 
  onEdit, 
  onDelete, 
  onMoveStatus,
  canManage = true 
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Priority color config
  const priorityStyles = {
    High: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    Medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };

  const statusOptions = ['To Do', 'In Progress', 'Review', 'Completed'];

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable={canManage}
      onDragStart={handleDragStart}
      className={`group relative bg-white dark:bg-[#18122B]/90 rounded-2xl p-4 border transition-all duration-200 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing ${
        task.isOverdue 
          ? 'border-rose-400/50 dark:border-rose-500/40 hover:border-rose-500' 
          : 'border-slate-100 dark:border-white/5 hover:border-purple-300 dark:hover:border-purple-500/40'
      }`}
    >
      {/* Top row: Priority badge + Overdue alert + Action menu */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${priorityStyles[task.priority] || priorityStyles.Medium}`}>
            {task.priority} Priority
          </span>

          {task.isOverdue && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 px-2 py-0.5 rounded-full animate-pulse">
              <AlertTriangle className="w-3 h-3" />
              Overdue
            </span>
          )}
        </div>

        {/* Quick Menu */}
        {canManage && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              title="Task Actions"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 top-7 z-30 w-44 bg-white dark:bg-[#20183b] border border-slate-200 dark:border-white/10 rounded-xl shadow-xl py-1 text-xs text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-white/5">
                    Move to
                  </div>
                  {statusOptions
                    .filter(s => s !== task.status)
                    .map(status => (
                      <button
                        key={status}
                        onClick={() => {
                          onMoveStatus(task.id, status);
                          setMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex items-center justify-between"
                      >
                        <span>{status}</span>
                        <ArrowRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  
                  <div className="border-t border-slate-100 dark:border-white/5 my-1" />
                  
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(task);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Task</span>
                  </button>

                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(task.id);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Task Title */}
      <h4 className="font-semibold text-slate-900 dark:text-white text-sm leading-snug mb-1.5 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {/* Project & Team Tag */}
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-3 bg-slate-50 dark:bg-white/[0.03] px-2 py-1 rounded-lg border border-slate-100 dark:border-white/5 w-fit max-w-full truncate">
        <Folder className="w-3 h-3 text-purple-500 shrink-0" />
        <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{task.projectName || task.teamName}</span>
      </div>

      {/* Bottom row: Assignee + Due Date */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5 text-xs">
        {/* Assignee */}
        <div className="flex items-center gap-2">
          {task.assignedTo?.avatar ? (
            <img 
              src={task.assignedTo.avatar} 
              alt={task.assignedTo.name} 
              className="w-6 h-6 rounded-full object-cover ring-1 ring-purple-300 dark:ring-purple-700" 
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
              {task.assignedTo?.name ? task.assignedTo.name.charAt(0) : '?'}
            </div>
          )}
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-[100px]">
            {task.assignedTo?.name || 'Unassigned'}
          </span>
        </div>

        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center gap-1 text-[11px] font-medium ${
            task.isOverdue 
              ? 'text-rose-600 dark:text-rose-400 font-bold' 
              : 'text-slate-500 dark:text-slate-400'
          }`}>
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{task.dueDate}</span>
          </div>
        )}
      </div>
    </div>
  );
}
