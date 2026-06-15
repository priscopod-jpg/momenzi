import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  PieChart, 
  Sparkles,
  Award,
  Layers
} from 'lucide-react';
import { Task, FocusRecord, UserStats, Booking } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  focusHistory: FocusRecord[];
  bookings: Booking[];
  stats: UserStats;
}

export default function AnalyticsView({
  tasks,
  focusHistory,
  bookings,
  stats
}: AnalyticsViewProps) {
  // Aggregate stats
  const todayStr = '2026-06-15';

  const tasksCompletedToday = tasks.filter(t => t.status === 'Complete' && t.dueDate === todayStr).length;
  const tasksInvoicedToday = tasks.filter(t => t.dueDate === todayStr).length;

  const totalTasksCompleted = tasks.filter(t => t.status === 'Complete').length;
  const totalTasksPlanned = tasks.length;
  const completionRate = totalTasksPlanned > 0 ? Math.round((totalTasksCompleted / totalTasksPlanned) * 100) : 0;

  // Weekly focus history sum
  const focusThisWeekMins = focusHistory.reduce((acc, f) => acc + (f.completed ? f.duration : 0), 0);
  const focusThisWeekHrs = (focusThisWeekMins / 60).toFixed(1);

  // Booking stats
  const totalBookingHours = (bookings.length * 0.5).toFixed(1); // Assuming 30 mins average each

  // Data for Custom SVG charts
  const weeklyFocusData = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 4.0 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 5.2 },
    { day: 'Fri', hours: 3.0 },
    { day: 'Sat', hours: 0.5 },
    { day: 'Sun', hours: 4.5 },
  ];

  const focusTrendsByCategory = [
    { name: 'Work', percentage: 65, color: 'bg-indigo-500' },
    { name: 'Learning', percentage: 15, color: 'bg-purple-500' },
    { name: 'Health', percentage: 12, color: 'bg-rose-500' },
    { name: 'Personal', percentage: 8, color: 'bg-emerald-500' },
  ];

  // Max value finder for chart heights scaling
  const maxHours = Math.max(...weeklyFocusData.map(d => d.hours));

  return (
    <div className="space-y-6" id="analytics-operating-root">
      
      {/* Analytics introductory line */}
      <div>
        <h2 className="font-display font-bold text-2xl text-white tracking-tight">
          Productivity Analytics Console
        </h2>
        <p className="text-sm text-slate-400">Review focus vectors, schedule efficiencies, and maintain your momentum levels.</p>
      </div>

      {/* Grid of Key Numerical Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric Card 1 */}
        <div className="bg-blur-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Today's Tasks</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">{tasksCompletedToday}/{tasksInvoicedToday}</div>
            <p className="text-[10px] text-slate-400 mt-1">Completions recorded</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/10">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-blur-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Weekly focus hours</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">{focusThisWeekHrs} hrs</div>
            <p className="text-[10px] text-slate-400 mt-1">Active time block</p>
          </div>
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/10">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-blur-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Booking Hours</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">{totalBookingHours} hrs</div>
            <p className="text-[10px] text-slate-400 mt-1">{bookings.length} reservations logged</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/10">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-blur-card rounded-2xl p-5 border border-slate-800 flex items-center justify-between shadow">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 font-mono tracking-wider">Streak Maintenance</span>
            <div className="text-2xl font-bold text-white font-mono mt-1">{stats.taskStreak} days</div>
            <p className="text-[10px] text-emerald-400 font-mono mt-1">▲ Consistent streak</p>
          </div>
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl border border-purple-500/10">
            <Flame className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Weekly Focus Hours (Custom high fidelity SVG) (Span 2) */}
        <div className="lg:col-span-2 bg-blur-card rounded-2xl p-6 shadow-lg space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-white">Weekly focus Hours distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Focus time aggregated by weekday slots</p>
            </div>
            
            <span className="text-xs font-mono font-medium text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded">
              June 15 – June 21
            </span>
          </div>

          {/* Interactive SVG / CSS Chart Area */}
          <div className="relative pt-4 pb-2">
            
            {/* Guide Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-20 text-[10px] font-mono text-slate-450">
              <div className="border-b border-slate-300 w-full pl-6 flex justify-between h-0"><span>6 hrs</span></div>
              <div className="border-b border-slate-300 w-full pl-6 flex justify-between h-0"><span>4 hrs</span></div>
              <div className="border-b border-slate-300 w-full pl-6 flex justify-between h-0"><span>2 hrs</span></div>
              <div className="border-b border-slate-300 w-full pl-6 flex justify-between h-0"><span>0 hrs</span></div>
            </div>

            {/* Custom styled CSS Flex bars */}
            <div className="flex justify-between items-end h-56 px-4 pt-4 relative z-10">
              {weeklyFocusData.map((data) => {
                const heightPercent = maxHours > 0 ? (data.hours / maxHours) * 85 : 0;
                
                return (
                  <div key={data.day} className="flex flex-col items-center flex-1 group">
                    <span className="opacity-0 group-hover:opacity-100 bg-indigo-500/90 border border-indigo-400/30 text-white font-bold font-mono text-[9px] px-1.5 py-0.5 rounded mb-2 transition-opacity duration-300">
                      {data.hours}h
                    </span>
                    
                    <div 
                      className="w-8 bg-gradient-to-t from-[#4f5dff] to-[#7b6cff]/80 rounded-t-lg group-hover:from-indigo-400 group-hover:to-purple-500 transition-all duration-300 shadow shadow-indigo-500/25 relative"
                      style={{ height: `${Math.max(4, heightPercent)}%` }}
                    >
                      {/* Interactive hover glow */}
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-400 mt-2">{data.day}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Chart 2: Category Alignment representation */}
        <div className="bg-blur-card rounded-2xl p-6 shadow-lg space-y-6">
          <div>
            <h3 className="font-display font-semibold text-[14px] text-slate-200">Category alignment</h3>
            <p className="text-xs text-slate-400 mt-0.5">Focus distributions by Space vectors</p>
          </div>

          <div className="space-y-4 pt-2">
            {focusTrendsByCategory.map((cat) => (
              <div key={cat.name} className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold">{cat.name} Space</span>
                  <span className="text-slate-400">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-700`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-500/10 border border-emerald-500/15 rounded-xl flex items-center space-x-2 text-[11px] text-emerald-300">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Work category continues to be your highest priority focus vector.</span>
          </div>
        </div>

      </div>

      {/* Completion summaries */}
      <div className="bg-blur-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow">
        <div className="space-y-1">
          <h4 className="font-display font-medium text-white text-sm">Central Analytics insights</h4>
          <p className="text-xs text-slate-400">Your total completed tasks percentage rate is outstanding:</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-slate-950 border-4 border-indigo-500/20 flex items-center justify-center font-mono text-base font-extrabold text-indigo-300 relative">
            <span>{completionRate}%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-white uppercase tracking-wider font-mono">Efficiency Rate</p>
            <p className="text-[11px] text-slate-400 mt-0.5">{totalTasksCompleted} of {totalTasksPlanned} logged items resolved</p>
          </div>
        </div>
      </div>

    </div>
  );
}
