import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, AlertCircle, Calendar, ArrowRight, Circle } from 'lucide-react';

export default function TaskList({ initialTasks = [], tasks: propTasks, onToggleStatus }) {
  const [localTasks, setLocalTasks] = useState(initialTasks);
  const tasks = propTasks || localTasks;

  const toggleTaskStatus = (id) => {
    if (onToggleStatus) {
      onToggleStatus(id);
      return;
    }
    setLocalTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextStatus =
            task.status === 'Completed'
              ? 'To Do'
              : task.status === 'In Progress'
              ? 'Completed'
              : 'In Progress';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const priorityStyles = {
    High: 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200/60 dark:border-rose-900/40',
    Medium: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200/60 dark:border-amber-900/40',
    Low: 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200/60 dark:border-blue-900/40',
  };

  const statusStyles = {
    'Completed': 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80',
    'In Progress': 'text-purple-600 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border-purple-200/80',
    'To Do': 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#1f193d] border-slate-200',
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#151226] border border-slate-200/80 dark:border-purple-950/60 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Upcoming Tasks
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Assigned across your active projects
          </p>
        </div>

        <Link
          to="/tasks"
          className="text-xs font-bold text-[#803BE8] dark:text-purple-300 hover:text-pink-600 dark:hover:text-pink-300 flex items-center gap-1 transition-colors"
        >
          <span>View All Tasks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = task.status === 'Completed';
          return (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 flex items-start justify-between gap-3 ${
                isCompleted
                  ? 'bg-slate-50/50 dark:bg-[#141026]/40 border-slate-200/50 dark:border-purple-950/30 opacity-75'
                  : task.isOverdue
                  ? 'bg-rose-50/30 dark:bg-rose-950/15 border-rose-200/70 dark:border-rose-900/30'
                  : 'bg-white dark:bg-[#181330] border-slate-200/70 dark:border-purple-900/40 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-[#803BE8] transition-colors focus:outline-none"
                  title="Click to toggle status"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Circle className="w-4 h-4 text-purple-400 hover:text-purple-600" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4
                      className={`text-xs sm:text-sm font-semibold truncate ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h4>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-md border ${
                        priorityStyles[task.priority] || priorityStyles.Low
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    {task.projectName}
                  </p>
                </div>
              </div>

              {/* Right: Due Date & Status Badge */}
              <div className="flex flex-col items-end shrink-0 gap-1">
                <div
                  className={`flex items-center gap-1 text-[11px] font-medium ${
                    task.isOverdue && !isCompleted
                      ? 'text-rose-600 dark:text-rose-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {task.isOverdue && !isCompleted ? (
                    <AlertCircle className="w-3 h-3 text-rose-500" />
                  ) : (
                    <Calendar className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{task.dueDate}</span>
                </div>

                <button
                  type="button"
                  onClick={() => toggleTaskStatus(task.id)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                    statusStyles[task.status] || statusStyles['To Do']
                  }`}
                >
                  {task.status}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
