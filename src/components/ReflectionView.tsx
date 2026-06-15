import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Bookmark, 
  Trash2, 
  Plus, 
  Briefcase, 
  Clock, 
  Award,
  ChevronRight,
  FileText
} from 'lucide-react';
import { ReflectionLog } from '../types';

interface ReflectionViewProps {
  logs: ReflectionLog[];
  onAddLog: (log: Omit<ReflectionLog, 'id' | 'createdAt'>) => void;
}

export default function ReflectionView({
  logs,
  onAddLog
}: ReflectionViewProps) {
  const [activeLogTab, setActiveLogTab] = useState<'create' | 'history'>('create');
  
  // Reflection fields
  const [goal, setGoal] = useState('');
  const [wins, setWins] = useState('');
  const [lessons, setLessons] = useState('');
  const [improvements, setImprovements] = useState('');
  const [todayStr, setTodayStr] = useState('2026-06-15');

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleCommitReflection = () => {
    if (!goal.trim() && !wins.trim()) return;

    onAddLog({
      date: todayStr,
      goal: goal.trim() || 'Focus on daily planning vectors',
      wins: wins.trim() || 'Productivity milestones achieved',
      lessons: lessons.trim() || 'None logged',
      improvements: improvements.trim() || 'Maintain focus structure'
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      // Reset inputs & switch to history
      setGoal('');
      setWins('');
      setLessons('');
      setImprovements('');
      setActiveLogTab('history');
    }, 1500);
  };

  return (
    <div className="space-y-6" id="reflection-module-root">
      
      {/* Reflection Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
            Daily Reflective Journals
          </h2>
          <p className="text-sm text-slate-400">Audit your outcomes, document lessons learned, and prepare tomorrow’s intentions.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveLogTab('create')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeLogTab === 'create' ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            New Journal
          </button>
          <button
            onClick={() => setActiveLogTab('history')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeLogTab === 'history' ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            History Review ({logs.length})
          </button>
        </div>
      </div>

      {/* Main reflection area */}
      {activeLogTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Left: Input box (Span-2) */}
          <div className="lg:col-span-2 bg-blur-card rounded-2xl p-6 shadow-lg space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-tight font-mono">Today's journal entry</h3>
              <input
                type="date"
                value={todayStr}
                onChange={(e) => setTodayStr(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1 mt-1 text-slate-300"
              />
            </div>

            {/* Input fields */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Today's Main Goal / Intentions</label>
                <textarea
                  placeholder="What was the main outcome you desired to accomplish today?"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 mt-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Wins Today (Big or Small)</label>
                <textarea
                  placeholder="Document anything you got done, milestones achieved, or progress vectors launched..."
                  value={wins}
                  onChange={(e) => setWins(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 mt-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Lessons Learned</label>
                  <textarea
                    placeholder="Reflect on blockages, distraction triggers or adjustments..."
                    value={lessons}
                    onChange={(e) => setLessons(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 mt-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-mono">Improvements for Tomorrow</label>
                  <textarea
                    placeholder="How will you adjust focus timings or blockages tomorrow?"
                    value={improvements}
                    onChange={(e) => setImprovements(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 mt-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {saveSuccess ? (
              <div className="text-center py-2 text-emerald-400 font-mono text-sm font-bold animate-pulse">
                ✓ Journal Saved Successfully! Syncing history...
              </div>
            ) : (
              <div className="flex justify-end pt-3">
                <button
                  id="commit-reflection-btn"
                  onClick={handleCommitReflection}
                  disabled={!goal.trim() && !wins.trim()}
                  className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-bold text-white transition disabled:opacity-50 cursor-pointer animate-pulse-glow"
                >
                  Commit Entry
                </button>
              </div>
            )}

          </div>

          {/* Right side: reflective coaches guidelines */}
          <div className="space-y-6">
            <div className="bg-blur-card rounded-2xl p-6 shadow-lg border-l-4 border-l-purple-500">
              <h3 className="font-display font-bold text-sm text-slate-200 mb-2">Reflective Routine</h3>
              <p className="text-xs text-slate-400 mb-4">The difference between average execution and top performance comes from daily self-auditing schedules.</p>

              <ol className="space-y-3 font-mono text-xs text-slate-400 leading-relaxed">
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">01.</span>
                  <span>Document wins truthfully to lock down dopamine tracks of completions.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">02.</span>
                  <span>Treat gaps as structural indicators rather than personal mistakes.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-purple-400 font-bold">03.</span>
                  <span>Optimize scheduling parameters after reviewing real timings.</span>
                </li>
              </ol>
            </div>
          </div>

        </div>
      ) : (
        /* History Review Table/Timeline */
        <div className="space-y-4 animate-fadeIn">
          {logs.length === 0 ? (
            <div className="bg-blur-card rounded-2xl p-12 hover:border-slate-850/60 transition text-center text-slate-550 text-sm border border-dashed border-slate-800">
              No reflective logs registered yet. Commit an entry above to trigger logs history.
            </div>
          ) : (
            logs.map((lg) => (
              <div key={lg.id} className="bg-blur-card rounded-2xl p-6 border border-slate-800/60 shadow-md space-y-4">
                
                <div className="flex items-center justify-between border-b border-slate-850 pb-2.5">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider">{lg.date} Journal Entry</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-850/60">
                    <span className="text-[10px] text-slate-550 uppercase font-mono font-bold font-semibold tracking-wider">Desire Intention</span>
                    <p className="text-slate-200 mt-1 leading-relaxed">{lg.goal}</p>
                  </div>

                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-850/60">
                    <span className="text-[10px] text-slate-550 uppercase font-mono font-bold font-semibold tracking-wider">Wins Recorded</span>
                    <p className="text-slate-200 mt-1 leading-relaxed">{lg.wins}</p>
                  </div>

                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-850/60">
                    <span className="text-[10px] text-slate-550 uppercase font-mono font-bold font-semibold tracking-wider">Lessons Acquired</span>
                    <p className="text-slate-300 mt-1 leading-relaxed">{lg.lessons}</p>
                  </div>

                  <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-850/60">
                    <span className="text-[10px] text-slate-550 uppercase font-mono font-bold font-semibold tracking-wider">Adjustments tomorrow</span>
                    <p className="text-slate-300 mt-1 leading-relaxed">{lg.improvements}</p>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
