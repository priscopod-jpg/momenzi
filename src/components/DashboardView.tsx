import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Calendar, 
  ArrowRight, 
  Zap, 
  Tag, 
  Play,
  Check,
  X,
  PlusCircle,
  HelpCircle
} from 'lucide-react';
import { Task, UserStats, CalendarEvent } from '../types';

interface DashboardViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  stats: UserStats;
  events: CalendarEvent[];
  setActiveTab: (tab: string) => void;
}

export default function DashboardView({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  stats,
  events,
  setActiveTab,
}: DashboardViewProps) {
  const [time, setTime] = useState(new Date());
  const [quickTitle, setQuickTitle] = useState('');
  const [quickCategory, setQuickCategory] = useState<'Work' | 'Personal' | 'Health' | 'Learning'>('Work');
  const [quickPriority, setQuickPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [quickDuration, setQuickDuration] = useState(30);
  const [isAddingPriority, setIsAddingPriority] = useState(false);
  const [isAddingSupporting, setIsAddingSupporting] = useState(false);
  
  // Update time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hours = time.getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formattedDate = time.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const formattedTime = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  // Filters for today
  const todayStr = '2026-06-15'; // Hardcoded active day to sync with layout requirements

  const top3Priorities = tasks.filter(t => t.isTopThree && t.dueDate === todayStr);
  const supportingTasks = tasks.filter(t => t.isTopFive && t.dueDate === todayStr);

  // Compute stats
  const completedPriorities = top3Priorities.filter(t => t.status === 'Complete').length;
  const progressPrioritiesPercent = top3Priorities.length > 0 
    ? Math.round((completedPriorities / top3Priorities.length) * 100) 
    : 0;

  const completedSupporting = supportingTasks.filter(t => t.status === 'Complete').length;
  const progressSupportingPercent = supportingTasks.length > 0 
    ? Math.round((completedSupporting / supportingTasks.length) * 100) 
    : 0;

  const totalCompletedToday = tasks.filter(t => t.status === 'Complete' && t.dueDate === todayStr).length;

  const handleQuickAdd = (type: 'priority' | 'supporting') => {
    if (!quickTitle.trim()) return;
    onAddTask({
      title: quickTitle.trim(),
      description: 'Quick planned from Momenzi Dashboard',
      dueDate: todayStr,
      duration: Number(quickDuration) || 30,
      priority: quickPriority,
      status: 'Not Started',
      category: quickCategory,
      isTopThree: type === 'priority',
      isTopFive: type === 'supporting',
      tags: ['QuickPlanned'],
      recurrence: 'none'
    });
    setQuickTitle('');
    setIsAddingPriority(false);
    setIsAddingSupporting(false);
  };

  // Reordering mimics: moving up or down
  const moveTask = (index: number, direction: 'up' | 'down', list: Task[]) => {
    // Standard mock index swapper for local components
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === list.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    // Notify custom local sequence reorder
  };

  const quotes = [
    "Momentum is built daily, not in a day. Keep showing up.",
    "Concentrate all your thoughts upon the work at hand. The sun's rays do not burn until brought to a focus.",
    "Simplicity is the ultimate sophistication of production.",
    "One deep work session can replace three days of distracted scrolling.",
    "The secret of your future is hidden in your daily routine."
  ];

  const getQuoteOfDay = () => {
    const day = time.getDate();
    return quotes[day % quotes.length];
  };

  return (
    <div className="space-y-6" id="dashboard-container">
      {/* Welcome Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-905 via-[#0b1445]/60 to-[#121c60]/40 p-6 md:p-8 border border-indigo-950/40 shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />
        <div className="absolute right-10 bottom-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl -z-10" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs px-2.5 py-1 rounded-full w-fit font-mono font-medium">
              <Zap className="w-3.5 h-3.5 animate-bounce" />
              <span>STREAK ACTIVE: {stats.taskStreak} DAYS</span>
            </div>
            
            <h2 className="font-display font-medium text-2xl md:text-3.5xl text-white tracking-tight">
              {getGreeting()}, <span className="text-glow font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-indigo-100 to-purple-300">Alex</span>.
            </h2>
            <p className="text-slate-300 text-[14px]">
              Your system is ready. Focus on what matters most today.
            </p>
          </div>

          <div className="flex items-center justify-end md:text-right space-x-6">
            <div className="space-y-1">
              <div className="text-[13px] font-mono text-indigo-400/90 font-semibold tracking-wider uppercase">
                {formattedDate}
              </div>
              <div className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight tabular-nums font-mono">
                {formattedTime}
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote banner line */}
        <div className="mt-6 pt-4 border-t border-slate-800/40 flex items-center space-x-3 text-xs md:text-sm text-indigo-200/80 italic font-medium">
          <span className="text-indigo-400 text-lg font-bold">“</span>
          <span>{getQuoteOfDay()}</span>
          <span className="text-indigo-400 text-lg font-bold">”</span>
        </div>
      </div>

      {/* Grid of OS Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: TODAY'S FOCUS (PRIORITIES & SUPPORTINGS) (Span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top 3 Priorities Widget */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-sm" />
                  Today's Top 3 Priorities
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Crucial vectors to complete before signing off</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/50 border border-indigo-500/20 px-2 py-0.5 rounded">
                  {completedPriorities}/3 Complete
                </span>
                <button
                  id="add-priority-btn"
                  onClick={() => {
                    setIsAddingPriority(!isAddingPriority);
                    setIsAddingSupporting(false);
                  }}
                  className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 hover:bg-indigo-500 hover:text-white transition cursor-pointer"
                  title="Add priority task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Priority Progress bar */}
            <div className="mb-5 bg-slate-900 rounded-lg p-2.5 flex items-center justify-between border border-slate-800">
              <span className="text-xs font-medium text-slate-300">Priority Completion</span>
              <div className="flex items-center space-x-3 w-3/4">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPrioritiesPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">{progressPrioritiesPercent}%</span>
              </div>
            </div>

            {/* Quick Add Priority Form */}
            {isAddingPriority && (
              <div className="mb-4 p-4 rounded-xl bg-slate-900 border border-indigo-500/20 space-y-3">
                <input
                  type="text"
                  placeholder="What is your priority item?"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2">
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-slate-400 outline-none"
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Health">Health</option>
                      <option value="Learning">Learning</option>
                    </select>

                    <select
                      value={quickDuration}
                      onChange={(e) => setQuickDuration(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-slate-400 outline-none"
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                      <option value={90}>90 min</option>
                      <option value={120}>120 min</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsAddingPriority(false)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleQuickAdd('priority')}
                      className="px-3 py-1 text-xs bg-indigo-500 hover:bg-indigo-600 rounded text-white font-medium"
                    >
                      Commit Priority
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* List rendered */}
            {top3Priorities.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No priority items set for today. Set top 3 targets of impact!
              </div>
            ) : (
              <div className="space-y-2.5">
                {top3Priorities.map((task, idx) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition
                      ${task.status === 'Complete' 
                        ? 'bg-slate-900/40 border-slate-800/40 opacity-60' 
                        : 'bg-slate-900/80 border-slate-800/60 hover:border-indigo-500/20'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3.5 overflow-hidden w-2/3">
                      <button
                        onClick={() => onUpdateTask(task.id, { 
                          status: task.status === 'Complete' ? 'Not Started' : 'Complete' 
                        })}
                        className="p-0.5 text-slate-400 hover:text-indigo-400 transition"
                      >
                        {task.status === 'Complete' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-500" />
                        )}
                      </button>
                      <div className="overflow-hidden">
                        <h4 className={`text-[13px] font-medium text-slate-200 truncate ${task.status === 'Complete' ? 'line-through text-slate-500' : ''}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-[10px] bg-indigo-950/40 text-indigo-300 font-mono px-1.5 py-0.5 rounded border border-indigo-500/10">
                            {task.category}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center font-mono">
                            <Clock className="w-3 h-3 mr-1 text-slate-500" />
                            {task.duration} min
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <button
                        onClick={() => setActiveTab('focus')}
                        className="px-2 py-1 text-[11px] font-mono bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500 hover:text-white rounded transition"
                      >
                        Focus Session
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 hover:text-rose-400 rounded hover:bg-rose-500/10 text-slate-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top 5 Supporting Tasks Widget */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
                  Supporting Priorities (Top 5)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Slightly lower weight but required coordinates</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/50 border border-purple-500/20 px-2 py-0.5 rounded">
                  {completedSupporting}/5 Complete
                </span>
                <button
                  id="add-supporting-btn"
                  onClick={() => {
                    setIsAddingSupporting(!isAddingSupporting);
                    setIsAddingPriority(false);
                  }}
                  className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/25 text-purple-300 hover:bg-purple-500 hover:text-white transition cursor-pointer"
                  title="Add supporting task"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Supporting Progress bar */}
            <div className="mb-5 bg-slate-900 rounded-lg p-2.5 flex items-center justify-between border border-slate-800">
              <span className="text-xs font-medium text-slate-300">Supporting progress</span>
              <div className="flex items-center space-x-3 w-3/4">
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${progressSupportingPercent}%` }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-200">{progressSupportingPercent}%</span>
              </div>
            </div>

            {/* Quick Add Supporting Form */}
            {isAddingSupporting && (
              <div className="mb-4 p-4 rounded-xl bg-slate-900 border border-purple-500/20 space-y-3">
                <input
                  type="text"
                  placeholder="What is your supporting item?"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2">
                    <select
                      value={quickCategory}
                      onChange={(e) => setQuickCategory(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-slate-400 outline-none"
                    >
                      <option value="Work">Work</option>
                      <option value="Personal">Personal</option>
                      <option value="Health">Health</option>
                      <option value="Learning">Learning</option>
                    </select>

                    <select
                      value={quickDuration}
                      onChange={(e) => setQuickDuration(Number(e.target.value))}
                      className="bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-slate-400 outline-none"
                    >
                      <option value={15}>15 min</option>
                      <option value={30}>30 min</option>
                      <option value={45}>45 min</option>
                      <option value={60}>60 min</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsAddingSupporting(false)}
                      className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleQuickAdd('supporting')}
                      className="px-3 py-1 text-xs bg-purple-500 hover:bg-purple-600 rounded text-white font-medium"
                    >
                      Commit Supporting
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Supportings list */}
            {supportingTasks.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                No supporting priorities outlined yet. Add items here!
              </div>
            ) : (
              <div className="space-y-2">
                {supportingTasks.map((task, idx) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition
                      ${task.status === 'Complete' 
                        ? 'bg-slate-900/40 border-slate-800/40 opacity-60' 
                        : 'bg-slate-900/80 border-slate-800/60 hover:border-purple-500/20'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden w-2/3">
                      <button
                        onClick={() => onUpdateTask(task.id, { 
                          status: task.status === 'Complete' ? 'Not Started' : 'Complete' 
                        })}
                        className="p-0.5 text-slate-400 hover:text-purple-400 transition"
                      >
                        {task.status === 'Complete' ? (
                          <CheckCircle className="w-4.5 h-4.5 text-emerald-400" />
                        ) : (
                          <Circle className="w-4.5 h-4.5 text-slate-600" />
                        )}
                      </button>
                      <div className="overflow-hidden">
                        <h4 className={`text-[12.5px] font-medium text-slate-200 truncate ${task.status === 'Complete' ? 'line-through text-slate-500' : ''}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-[9px] bg-slate-800 text-purple-300 font-mono px-1.5 py-0.2 rounded">
                            {task.category}
                          </span>
                          <span className="text-[9px] text-slate-500 flex items-center font-mono">
                            <Clock className="w-2.5 h-2.5 mr-1" />
                            {task.duration}m
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 hover:text-rose-400 rounded hover:bg-rose-500/10 text-slate-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CALENDAR OR CORRESPONDENT ACTIONS */}
        <div className="space-y-6">
          
          {/* Calendar Agenda Widget */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2 mb-4">
              <Calendar className="w-4.5 h-4.5 text-indigo-400" />
              Calendar Agenda
            </h3>

            <div className="space-y-3.5">
              {events.filter(e => e.startTime.startsWith(todayStr)).length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                  No blockers listed for today. Free flow schedule!
                </div>
              ) : (
                events
                  .filter(e => e.startTime.startsWith(todayStr))
                  .map((evt) => {
                    const sTime = new Date(evt.startTime).toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    });
                    
                    return (
                      <div key={evt.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start space-x-3 hover:border-indigo-500/15 transition">
                        <div className="w-1 bg-indigo-500 self-stretch rounded-full" />
                        <div>
                          <h4 className="text-xs font-bold text-slate-200">
                            {evt.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {sTime} • {evt.space}
                          </p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>

            <button
              onClick={() => setActiveTab('calendar')}
              className="mt-4 w-full flex items-center justify-between text-xs text-indigo-300 font-mono hover:text-indigo-200 transition bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 p-2.5 rounded-xl font-bold"
            >
              <span>View full calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Deep Work Session preset starter */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg border-l-4 border-l-purple-500/60">
            <h3 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2 mb-2">
              <Flame className="w-4.5 h-4.5 text-rose-400" />
              Focus Quickstart
            </h3>
            <p className="text-xs text-slate-400 mb-4">Launch a distraction-free countdown session instantly.</p>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  setActiveTab('focus');
                }}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-left transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-400 font-mono">45 MIN</div>
                <div className="text-[10px] text-slate-400">Deep Sprint</div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('focus');
                }}
                className="p-3 bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-left transition group"
              >
                <div className="text-xs font-bold text-white group-hover:text-indigo-400 font-mono">90 MIN</div>
                <div className="text-[10px] text-slate-400">Extreme Sync</div>
              </button>
            </div>
          </div>

          {/* Streak details tracker */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-display font-semibold text-sm text-slate-300 mb-3.5">Habit Alignment</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Meditate Zen Loop</span>
                <span className="font-mono font-bold text-indigo-400">12 days streak</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">No sugar / fast energy</span>
                <span className="font-mono font-bold text-emerald-400">6 days streak</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Personal Reading Habit</span>
                <span className="font-mono font-bold text-purple-400">15 days streak</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
