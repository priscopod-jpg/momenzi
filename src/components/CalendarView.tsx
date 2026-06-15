import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Trash2, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Sparkles,
  Layers,
  MapPin
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export default function CalendarView({
  events,
  onAddEvent,
  onDeleteEvent
}: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [googleSynced, setGoogleSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Form states
  const [isCreating, setIsCreating] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDay, setEventDay] = useState('2026-06-15');
  const [startTimeStr, setStartTimeStr] = useState('09:00');
  const [endTimeStr, setEndTimeStr] = useState('10:30');
  const [eventSpace, setEventSpace] = useState<'Work' | 'Personal' | 'Health' | 'Learning'>('Work');

  const handleSyncGoogle = () => {
    if (googleSynced) {
      setGoogleSynced(false);
      return;
    }
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setGoogleSynced(true);
    }, 1500);
  };

  const handleCreateEvent = () => {
    if (!eventTitle.trim()) return;

    const startISO = `${eventDay}T${startTimeStr}:00Z`;
    const endISO = `${eventDay}T${endTimeStr}:00Z`;

    onAddEvent({
      title: eventTitle.trim(),
      description: eventDesc.trim(),
      startTime: startISO,
      endTime: endISO,
      space: eventSpace,
      isGoogleSynced: googleSynced
    });

    // Reset Form
    setEventTitle('');
    setEventDesc('');
    setIsCreating(false);
  };

  // Helper arrays
  const daysOfWeek = [
    { name: 'Monday', short: 'Mon', date: 15, dateStr: '2026-06-15' },
    { name: 'Tuesday', short: 'Tue', date: 16, dateStr: '2026-06-16' },
    { name: 'Wednesday', short: 'Wed', date: 17, dateStr: '2026-06-17' },
    { name: 'Thursday', short: 'Thu', date: 18, dateStr: '2026-06-18' },
    { name: 'Friday', short: 'Fri', date: 19, dateStr: '2026-06-19' },
    { name: 'Saturday', short: 'Sat', date: 20, dateStr: '2026-06-20' },
    { name: 'Sunday', short: 'Sun', date: 21, dateStr: '2026-06-21' },
  ];

  const hoursArray = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  const getEventsForDay = (dateStr: string) => {
    return events.filter(e => e.startTime.startsWith(dateStr));
  };

  const getSpaceColor = (spaceStr: string) => {
    switch (spaceStr) {
      case 'Work': return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300';
      case 'Personal': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
      case 'Health': return 'bg-rose-500/10 border-rose-500/30 text-rose-300';
      case 'Learning': return 'bg-purple-500/10 border-purple-500/30 text-purple-300';
      default: return 'bg-slate-500/10 border-slate-500/30 text-slate-300';
    }
  };

  return (
    <div className="space-y-6" id="calendar-engine-root">
      
      {/* Calendar Header and Sync tools */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
            Multi-Space Calendar Engine
          </h2>
          <p className="text-sm text-slate-400">Block focused slots, simulate calendar bookings and manage deep work intervals.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* GCal integration toggle */}
          <button 
            id="gcal-sync-btn"
            onClick={handleSyncGoogle}
            disabled={syncing}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium transition cursor-pointer border
              ${googleSynced 
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' 
                : 'bg-slate-900 border-slate-800 text-slate-350 hover:bg-slate-850'
              }
            `}
          >
            {syncing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Calendar className="w-3.5 h-3.5" />
            )}
            <span>{googleSynced ? 'GCal Two-Way Synced' : 'Sync Google Calendar'}</span>
          </button>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center space-x-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg transition duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Block Time Slot</span>
          </button>
        </div>
      </div>

      {/* Creation Modal/Card overlay */}
      {isCreating && (
        <div className="bg-blur-card rounded-2xl p-5 border border-indigo-500/20 shadow-xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white">Block Time / Schedule Event</h3>
            <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-200"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Event Title</label>
              <input
                type="text"
                placeholder="Marketing roadmap or Gym sprint..."
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs mt-1 text-slate-200 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Short Description</label>
              <input
                type="text"
                placeholder="Objectives and scope"
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs mt-1"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Work Space Category</label>
              <select
                value={eventSpace}
                onChange={(e) => setEventSpace(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs mt-1 text-slate-350"
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health</option>
                <option value="Learning">Learning</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Date</label>
              <input
                type="date"
                value={eventDay}
                onChange={(e) => setEventDay(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs mt-1 text-slate-350"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Start Hour</label>
              <input
                type="time"
                value={startTimeStr}
                onChange={(e) => setStartTimeStr(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs mt-1 text-slate-350"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">End Hour</label>
              <input
                type="time"
                value={endTimeStr}
                onChange={(e) => setEndTimeStr(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs mt-1 text-slate-350"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsCreating(false)}
              className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-slate-100"
            >
              Cancel
            </button>
            <button
              id="confirm-block-slot"
              onClick={handleCreateEvent}
              className="px-4 py-1.5 text-xs bg-indigo-500 hover:bg-indigo-600 font-bold rounded-lg text-white transition animate-pulse-glow"
            >
              Commit Slot
            </button>
          </div>
        </div>
      )}

      {/* View Selectors and Navigation row */}
      <div className="bg-blur-card rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Navigation Arrows */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button className="p-1 text-slate-400 hover:text-white transition"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1 text-slate-400 hover:text-white transition"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <span className="font-display font-bold text-sm text-slate-200">June 15 – June 21, 2026</span>
        </div>

        {/* View Mode Tabs */}
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-850">
          {(['day', 'week', 'month'] as const).map((view) => (
            <button
              key={view}
              id={`calendar-view-mode-${view}`}
              onClick={() => setViewMode(view)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition font-medium
                ${viewMode === view 
                  ? 'bg-indigo-500/15 text-indigo-300 border border-slate-800/80 font-bold' 
                  : 'text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Week View Grid representation */}
      {viewMode === 'week' ? (
        <div className="bg-blur-card rounded-2xl overflow-hidden border border-slate-800/60 shadow-xl">
          <div className="grid grid-cols-8 border-b border-slate-800 bg-[#070b21] py-3 text-center">
            {/* Header Column */}
            <div className="text-slate-500 text-xs font-mono font-bold uppercase self-center pt-2">Hours</div>
            
            {/* Week Days Headers */}
            {daysOfWeek.map((day) => (
              <div key={day.name} className={`flex flex-col items-center ${day.date === 15 ? 'relative' : ''}`}>
                <span className="text-[11px] text-slate-400 uppercase font-mono font-medium">{day.short}</span>
                <span className={`text-base font-bold font-display mt-0.5 w-7 h-7 flex items-center justify-center rounded-full
                  ${day.date === 15 ? 'bg-indigo-500 text-white shadow shadow-indigo-500/20' : 'text-slate-200'}
                `}>
                  {day.date}
                </span>
                {day.date === 15 && (
                  <span className="absolute bottom-[-12px] w-1 h-1 bg-indigo-500 rounded-full" />
                )}
              </div>
            ))}
          </div>

          {/* Core Grid */}
          <div className="divide-y divide-slate-850 max-h-[500px] overflow-y-auto">
            {hoursArray.map((hour) => (
              <div key={hour} className="grid grid-cols-8 min-h-[48px] hover:bg-slate-900/10 transition">
                
                {/* 1. Hour Column label */}
                <div className="text-[10px] font-mono font-semibold text-slate-500 text-center py-2 border-r border-slate-850/60 self-center">
                  {hour}
                </div>

                {/* 2. Days Column Slots */}
                {daysOfWeek.map((day) => {
                  const dayEvents = getEventsForDay(day.dateStr).filter((evt) => {
                    const evtHr = new Date(evt.startTime).getUTCHours();
                    const targetHr = parseInt(hour.split(':')[0]);
                    return evtHr === targetHr;
                  });

                  return (
                    <div key={`${day.dateStr}-${hour}`} className="p-1 border-r border-[#141b3a] min-h-[48px] flex flex-col gap-1">
                      {dayEvents.map((evt) => {
                        const startM = new Date(evt.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
                        return (
                          <div
                            key={evt.id}
                            id={`cal-event-${evt.id}`}
                            className={`p-1.5 rounded-lg border text-[11px] leading-tight font-medium relative group shadow-sm transition
                              ${getSpaceColor(evt.space)}
                            `}
                          >
                            <div className="font-bold truncate">{evt.title}</div>
                            <div className="text-[9px] opacity-80 font-mono mt-0.5">{startM}</div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteEvent(evt.id);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-0.5 bg-rose-950 border border-rose-500/30 text-rose-300 rounded hover:bg-rose-900 transition"
                              title="Cancel Scheduled event"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Unified List view for other modes */
        <div className="bg-blur-card rounded-2xl p-6 space-y-4">
          <p className="text-xs text-slate-400 font-mono italic">Displaying simplified agenda timeline for {viewMode} filter:</p>
          <div className="space-y-3">
            {events.map((evt) => {
              const startT = new Date(evt.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              const startH = new Date(evt.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              
              return (
                <div key={evt.id} className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 flex items-center justify-between hover:border-indigo-500/20 transition">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{evt.title}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{startT} • {startH} ({evt.space} Space)</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteEvent(evt.id)}
                    className="p-1 hover:text-rose-400 hover:bg-rose-505/10 rounded text-slate-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
