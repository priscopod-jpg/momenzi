import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Circle, 
  Clock, 
  Calendar, 
  Tag, 
  AlertCircle,
  X,
  FileText,
  RefreshCw,
  Clock3,
  Flame,
  Check
} from 'lucide-react';
import { Task, PriorityLevel, TaskStatus } from '../types';

interface TasksViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
}

export default function TasksView({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}: TasksViewProps) {
  // Filters
  const [filter, setFilter] = useState<'today' | 'week' | 'upcoming' | 'overdue' | 'completed' | 'all'>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // New task form fields
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-06-15');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('medium');
  const [newCategory, setNewCategory] = useState<'Work' | 'Personal' | 'Health' | 'Learning'>('Work');
  const [newDuration, setNewDuration] = useState(30);
  const [newRecurrence, setNewRecurrence] = useState<'none' | 'daily' | 'weekly'>('none');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newNotes, setNewNotes] = useState('');

  // Editing state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPriority, setEditPriority] = useState<PriorityLevel>('medium');
  const [editStatus, setEditStatus] = useState<TaskStatus>('Not Started');
  const [editDuration, setEditDuration] = useState(30);

  const todayStr = '2026-06-15'; // Anchor date of application

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      dueDate: newDueDate,
      duration: Number(newDuration),
      priority: newPriority,
      status: 'Not Started',
      category: newCategory,
      isTopThree: false, // User can assign from priorities panels later or it assigns by default
      isTopFive: false,
      tags: tags.length > 0 ? tags : [newCategory],
      recurrence: newRecurrence,
      notes: newNotes.trim()
    });

    // Reset fields
    setNewTitle('');
    setNewDesc('');
    setNewDueDate('2026-06-15');
    setNewPriority('medium');
    setNewCategory('Work');
    setNewDuration(30);
    setNewRecurrence('none');
    setTags([]);
    setNewNotes('');
    setIsCreating(false);
  };

  const handleStartEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditPriority(task.priority);
    setEditStatus(task.status);
    setEditDuration(task.duration);
  };

  const handleSaveEdit = () => {
    if (!editingTaskId) return;
    onUpdateTask(editingTaskId, {
      title: editTitle,
      description: editDesc,
      priority: editPriority,
      status: editStatus,
      duration: editDuration,
    });
    setEditingTaskId(null);
  };

  // Date utilities
  const getDaysDiff = (d1: string, d2: string) => {
    const timeDiff = new Date(d1).getTime() - new Date(d2).getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  // Filter tasks based on settings
  const filteredTasks = tasks.filter(task => {
    // Search match
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) ||
                          task.description.toLowerCase().includes(search.toLowerCase());
    
    // Category match
    const matchesCategory = categoryFilter === 'All' || task.category === categoryFilter;

    if (!matchesSearch || !matchesCategory) return false;

    const diffDays = getDaysDiff(task.dueDate, todayStr);

    switch (filter) {
      case 'today':
        return task.dueDate === todayStr;
      case 'week':
        return diffDays >= 0 && diffDays <= 7;
      case 'upcoming':
        return diffDays > 7;
      case 'overdue':
        return diffDays < 0 && task.status !== 'Complete';
      case 'completed':
        return task.status === 'Complete';
      default:
        return true;
    }
  });

  const getPriorityColor = (level: PriorityLevel) => {
    switch (level) {
      case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
    }
  };

  return (
    <div className="space-y-6" id="tasks-desk-root">
      
      {/* Top action block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight">
            Central Tasks Desk
          </h2>
          <p className="text-sm text-slate-400">Configure priorities, schedule recurrences, and sync lists.</p>
        </div>

        <button
          id="toggle-creator-btn"
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg transition duration-300 cursor-pointer"
        >
          {isCreating ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isCreating ? 'Dismiss Creator' : 'Plan New Task'}</span>
        </button>
      </div>

      {/* Task Creation Form Card */}
      {isCreating && (
        <div className="bg-blur-card rounded-2xl p-6 border border-indigo-500/20 shadow-xl space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title & Desc */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Task Title</label>
                <input
                  type="text"
                  placeholder="Review schema integration..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm mt-1 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Detailed Scope Description</label>
                <textarea
                  placeholder="Outline key files to create, validation scopes and testing routines..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-sm mt-1 text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Properties */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Target Date</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-300 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Space Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-300"
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Learning">Learning</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Priority Weight</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-300"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Estimated Block (Mins)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-300 focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Recurrence Sequence</label>
                <select
                  value={newRecurrence}
                  onChange={(e) => setNewRecurrence(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-300"
                >
                  <option value="none">One-time / Manual</option>
                  <option value="daily">Daily Loop</option>
                  <option value="weekly">Weekly Routine</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags & notes row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Label Tags</label>
              <div className="flex space-x-2 mt-1">
                <input
                  type="text"
                  placeholder="Press enter to save tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tg, idx) => (
                  <span key={tg} className="flex items-center space-x-1 px-2 py-0.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] rounded font-mono font-bold">
                    <span>{tg}</span>
                    <button type="button" onClick={() => handleRemoveTag(idx)} className="hover:text-rose-400 font-bold ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Execution Notes (Optional)</label>
              <input
                type="text"
                placeholder="Required documentation, attachments URLs etc..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 mt-1 text-xs text-slate-300 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-100 transition"
            >
              Cancel
            </button>
            <button
              id="commit-task-submit"
              onClick={handleCreateTask}
              className="px-4 py-2 text-xs bg-indigo-500 hover:bg-indigo-600 font-bold rounded-xl text-white shadow-lg shadow-indigo-500/10 transition"
            >
              Verify & Save Task
            </button>
          </div>
        </div>
      )}

      {/* Filter and Search rail bar */}
      <div className="bg-blur-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left Side: Segment tabs filters (Today, Week, Upcoming, Completed) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'today', 'week', 'upcoming', 'overdue', 'completed'] as const).map((ft) => (
            <button
              key={ft}
              id={`filter-btn-${ft}`}
              onClick={() => setFilter(ft)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium uppercase tracking-wider transition
                ${filter === ft 
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-bold' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                }
              `}
            >
              {ft}
            </button>
          ))}
        </div>

        {/* Right Side: Search & category selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-48">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search descriptor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8.5 pr-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-300"
          >
            <option value="All">All Spaces</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Health">Health</option>
            <option value="Learning">Learning</option>
          </select>
        </div>
      </div>

      {/* Main Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="bg-blur-card rounded-2xl p-12 text-center text-slate-500 text-sm border border-dashed border-slate-800">
            No active schedules matching these filter parameters. Create one to maintain focus.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            
            return (
              <div 
                key={task.id}
                id={`task-item-${task.id}`}
                className={`bg-blur-card rounded-2xl p-4 transition-all duration-300 border hover:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4
                  ${task.status === 'Complete' ? 'opacity-55 border-slate-900/60' : 'border-slate-800/40'}
                `}
              >
                {isEditing ? (
                  /* Editing Mode Form */
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-xs rounded px-2.5 py-1.5 text-slate-200"
                      />
                      <input
                        type="text"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        placeholder="Description"
                        className="bg-slate-900 border border-slate-800 text-xs rounded px-2.5 py-1.5 text-slate-200"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Complete">Complete</option>
                      </select>
                      <input
                        type="number"
                        value={editDuration}
                        onChange={(e) => setEditDuration(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1 w-16"
                        placeholder="Mins"
                      />
                      <button
                        onClick={handleSaveEdit}
                        className="px-2.5 py-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 rounded text-white font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingTaskId(null)}
                        className="px-2.5 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Standard Mode Layout */
                  <>
                    <div className="flex items-start space-x-4 w-full md:w-3/4">
                      {/* Check status box */}
                      <button
                        onClick={() => onUpdateTask(task.id, {
                          status: task.status === 'Complete' ? 'Not Started' : 'Complete'
                        })}
                        className="p-1 text-slate-400 hover:text-indigo-400 mt-0.5 flex-shrink-0"
                      >
                        {task.status === 'Complete' ? (
                          <CheckCircle className="w-5.5 h-5.5 text-emerald-500" />
                        ) : (
                          <Circle className="w-5.5 h-5.5 text-slate-600 hover:text-slate-400" />
                        )}
                      </button>

                      <div className="overflow-hidden">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className={`font-semibold text-[14.5px] text-slate-100 ${task.status === 'Complete' ? 'line-through text-slate-500' : ''}`}>
                            {task.title}
                          </h3>
                          <span className={`px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider rounded border uppercase ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.recurrence !== 'none' && (
                            <span className="flex items-center space-x-1 px-1.5 py-0.5 bg-purple-950/40 text-purple-300 border border-purple-500/20 text-[9px] rounded font-mono font-bold">
                              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                              <span>{task.recurrence}</span>
                            </span>
                          )}
                          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-450 px-2 py-0.5 rounded font-bold font-mono">
                            {task.category} Space
                          </span>
                        </div>

                        {task.description && (
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-[11px] text-slate-500 flex items-center font-mono">
                            <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-400/80" />
                            Target: {task.dueDate}
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center font-mono">
                            <Clock className="w-3.5 h-3.5 mr-1 text-purple-400/80" />
                            Time: {task.duration}m block
                          </span>
                          {task.tags && task.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Tag className="w-3 h-3 text-emerald-400" />
                              {task.tags.map(t => (
                                <span key={t} className="text-[9px] text-emerald-400 font-mono">#{t}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions and toggle panels */}
                    <div className="flex items-center justify-end space-x-3.5 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-800/40">
                      {/* Priority alignment toggles */}
                      <button
                        onClick={() => onUpdateTask(task.id, { isTopThree: !task.isTopThree, isTopFive: false })}
                        className={`text-xs px-2 py-1 rounded transition font-mono font-bold uppercase tracking-wider
                          ${task.isTopThree 
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                            : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800/60'
                          }
                        `}
                      >
                        Priority {task.isTopThree ? '✔' : '+'}
                      </button>

                      <button
                        onClick={() => onUpdateTask(task.id, { isTopFive: !task.isTopFive, isTopThree: false })}
                        className={`text-xs px-2 py-1 rounded transition font-mono font-bold uppercase tracking-wider
                          ${task.isTopFive 
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' 
                            : 'bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800/60'
                          }
                        `}
                      >
                        Supporting {task.isTopFive ? '✔' : '+'}
                      </button>

                      <button
                        onClick={() => handleStartEdit(task)}
                        className="p-1.5 hover:text-indigo-400 hover:bg-indigo-500/10 rounded text-slate-500 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 hover:text-rose-400 hover:bg-rose-500/10 rounded text-slate-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
