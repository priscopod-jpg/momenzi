import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Layers, 
  Compass, 
  CheckCircle2,
  CalendarDays
} from 'lucide-react';
import { Task, CalendarEvent } from '../types';

interface TodayPlannerViewProps {
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
}

export default function TodayPlannerView({
  tasks,
  onAddTask,
  onUpdateTask,
  events,
  onAddEvent
}: TodayPlannerViewProps) {
  const [plannerStep, setPlannerStep] = useState<number>(1);
  const [newPlannerTaskTitle, setNewPlannerTaskTitle] = useState('');
  const [newPlannerCategory, setNewPlannerCategory] = useState<'Work' | 'Personal' | 'Health' | 'Learning'>('Work');

  const todayStr = '2026-06-15';

  const unfilteredTodayTasks = tasks.filter(t => t.dueDate === todayStr);
  const backloggedTasks = tasks.filter(t => t.dueDate !== todayStr && t.status !== 'Complete');

  const handleStepPrev = () => {
    if (plannerStep > 1) setPlannerStep(plannerStep - 1);
  };

  const handleStepNext = () => {
    if (plannerStep < 3) setPlannerStep(plannerStep + 1);
  };

  const handleQuickAddPlanner = () => {
    if (!newPlannerTaskTitle.trim()) return;
    onAddTask({
      title: newPlannerTaskTitle.trim(),
      description: 'Quick-planned via Today Sunsama Wizard',
      dueDate: todayStr,
      duration: 30,
      priority: 'medium',
      status: 'Not Started',
      category: newPlannerCategory,
      isTopThree: false,
      isTopFive: false,
      tags: ['SunsamaFlow'],
      recurrence: 'none'
    });
    setNewPlannerTaskTitle('');
  };

  return (
    <div className="space-y-6" id="sunsama-planner-root">
      
      {/* Sunsama layout Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
            Focus Daily Planner
          </h2>
          <p className="text-sm text-slate-400">Step-by-step executive blueprint wizard inspired by Sunsama workflow rules.</p>
        </div>

        {/* Step dots */}
        <div className="flex items-center space-x-1.5 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`flex items-center justify-center w-6 h-6 rounded-lg text-xs font-mono font-bold transition
                ${plannerStep === step 
                  ? 'bg-indigo-500 text-white shadow' 
                  : plannerStep > step 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/10' 
                    : 'text-slate-500'
                }
              `}
            >
              0{step}
            </div>
          ))}
        </div>
      </div>

      {/* Step Components */}
      {plannerStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Main List Column */}
          <div className="lg:col-span-2 bg-blur-card rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-white">Step 1: Draft & Audit Today's Backlog</h3>
                <p className="text-xs text-slate-400 mt-0.5">List tasks you intend to accomplish during your available hours.</p>
              </div>
            </div>

            {/* Quick add planner text box */}
            <div className="flex space-x-2 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              <input
                type="text"
                placeholder="What must be scheduled today? Press Enter..."
                value={newPlannerTaskTitle}
                onChange={(e) => setNewPlannerTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAddPlanner()}
                className="flex-1 bg-transparent px-2.5 text-xs text-slate-200 outline-none"
              />
              <select
                value={newPlannerCategory}
                onChange={(e) => setNewPlannerCategory(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-400 rounded px-2"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
              </select>
              <button
                onClick={handleQuickAddPlanner}
                className="px-3 bg-indigo-500 hover:bg-indigo-600 rounded text-xs text-white font-bold transition"
              >
                Add
              </button>
            </div>

            {/* List draft items rendering */}
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">Drafted agenda for June 15 ({unfilteredTodayTasks.length})</p>
              {unfilteredTodayTasks.length === 0 ? (
                <div className="text-center py-6 text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs">
                  Your agenda is currently clean. Add items above.
                </div>
              ) : (
                unfilteredTodayTasks.map((t) => (
                  <div key={t.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-200">{t.title}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 p-1.5 rounded">{t.category}</span>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Right column backlog drag list */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-200">My Backlog Pool</h3>
            <p className="text-xs text-slate-400">Drag or click elements below to schedule them onto June 15.</p>

            <div className="space-y-2">
              {backloggedTasks.length === 0 ? (
                <div className="text-center py-6 text-slate-650 text-xs border border-dashed border-slate-800 rounded-xl">
                  Backlog pipeline is currently empty.
                </div>
              ) : (
                backloggedTasks.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => onUpdateTask(t.id, { dueDate: todayStr })} 
                    className="p-3 bg-slate-950 border border-slate-850 hover:border-indigo-500/25 cursor-pointer rounded-xl flex items-center justify-between text-xs transition"
                  >
                    <span className="text-slate-350 truncate">{t.title}</span>
                    <span className="text-[10px] text-indigo-400 font-mono">+ Import</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {plannerStep === 2 && (
        <div className="bg-blur-card rounded-2xl p-6 shadow-lg space-y-6 animate-fadeIn">
          <div>
            <h3 className="font-display font-bold text-base text-white">Step 2: Designate Priorities Weights</h3>
            <p className="text-xs text-slate-400 mt-0.5">Select exactly which 3 tasks are critical priorities, and which 5 are supporting actions.</p>
          </div>

          <div className="space-y-3">
            {unfilteredTodayTasks.map((task) => (
              <div key={task.id} className="p-4 bg-slate-900/65 rounded-xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-200 truncate">{task.title}</h4>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">{task.duration} mins block • {task.category} Space</p>
                </div>

                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => onUpdateTask(task.id, { isTopThree: !task.isTopThree, isTopFive: false })}
                    className={`px-3 py-1 bg-slate-955 rounded font-mono font-medium border text-[11px] transition
                      ${task.isTopThree 
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-bold' 
                        : 'bg-slate-950 border-slate-800 text-slate-450 hover:border-slate-800'
                      }
                    `}
                  >
                    Top 3 Priority
                  </button>

                  <button
                    onClick={() => onUpdateTask(task.id, { isTopFive: !task.isTopFive, isTopThree: false })}
                    className={`px-3 py-1 bg-slate-955 rounded font-mono font-medium border text-[11px] transition
                      ${task.isTopFive 
                        ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold' 
                        : 'bg-slate-950 border-slate-800 text-slate-450 hover:border-slate-800'
                      }
                    `}
                  >
                    Top 5 Supporting
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {plannerStep === 3 && (
        <div className="bg-blur-card rounded-2xl p-6 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex items-center space-x-3 text-emerald-400">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            <div>
              <h3 className="font-display font-bold text-base text-white">Step 3: Setup Time-Blockings</h3>
              <p className="text-xs text-slate-400">Commit allocations onto your daily timeline layout to lock down focus schedules.</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3.5">
            <div className="flex items-center space-x-2 text-xs font-mono font-semibold text-slate-300">
              <CalendarDays className="w-4 h-4 text-indigo-400" />
              <span>Simulate Calendar Blockings:</span>
            </div>

            <div className="space-y-2">
              {unfilteredTodayTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{t.title}</span>
                  <button
                    onClick={() => {
                      onAddEvent({
                        title: t.title,
                        description: 'Simulated block via planner wizard',
                        startTime: '2026-06-15T13:30:00Z',
                        endTime: '2026-06-15T14:30:00Z',
                        space: t.category
                      });
                    }}
                    className="text-xs text-indigo-450 hover:text-indigo-305 font-bold hover:underline"
                  >
                    + Calendar Block (1:30 PM)
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Wizard navigation bar footer */}
      <div className="flex justify-between items-center bg-blur-card p-4 rounded-2xl">
        <button
          onClick={handleStepPrev}
          disabled={plannerStep === 1}
          className="px-4 py-2 text-xs text-slate-400 hover:text-white transition disabled:opacity-30"
        >
          Previous Step
        </button>

        {plannerStep < 3 ? (
          <button
            onClick={handleStepNext}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition shadow"
          >
            <span>Proceed</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={() => setPlannerStep(1)}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-605 hover:to-purple-605 text-white font-bold text-xs rounded-xl transition shadow shadow-indigo-500/20"
          >
            ✓ Complete Planner Setup
          </button>
        )}
      </div>

    </div>
  );
}
