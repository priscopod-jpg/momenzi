import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  Coffee, 
  Clock, 
  CheckCircle,
  FileText,
  Bookmark,
  ChevronRight,
  Headphones,
  Music,
  UserCheck
} from 'lucide-react';
import { FocusRecord } from '../types';

interface FocusViewProps {
  onAddFocusRecord: (record: Omit<FocusRecord, 'id' | 'timestamp'>) => void;
  focusHistory: FocusRecord[];
}

export default function FocusView({
  onAddFocusRecord,
  focusHistory
}: FocusViewProps) {
  // Config
  const [sessionNotes, setSessionNotes] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number>(45); // defaulted 45 mins
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Timer values
  const [timeLeft, setTimeLeft] = useState(45 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  // Ambient Sound settings
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'lofi' | 'waves' | 'forest'>('none');
  const [soundVolume, setSoundVolume] = useState(50);
  const [audioSourcePlaying, setAudioSourcePlaying] = useState(false);

  // Break workflow
  const [showBreakPrompt, setShowBreakPrompt] = useState(false);
  const [selectedBreakActivity, setSelectedBreakActivity] = useState<any | null>(null);
  const [breakCompleted, setBreakCompleted] = useState(false);

  // Stats aggregate
  const completedSessionsCount = focusHistory.filter(f => f.completed).length;
  const totalFocusMinutes = focusHistory.reduce((acc, current) => acc + (current.completed ? current.duration : 0), 0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize timer duration to selected preset
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(selectedPreset * 60);
    }
  }, [selectedPreset, isActive]);

  // Main countdown ticking
  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, isPaused]);

  const handleStartTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(selectedPreset * 60);
  };

  const handleSessionComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsPaused(false);

    // Save record trigger
    onAddFocusRecord({
      duration: selectedPreset,
      type: selectedPreset === 45 ? '45m' : selectedPreset === 90 ? '90m' : selectedPreset === 120 ? '120m' : 'custom',
      completed: true,
      notes: sessionNotes || 'Focused Deep Work session completed'
    });

    // Pick random break activity
    const activities = [
      {
        id: 'mobility',
        title: 'Activity 1 – Mobility Reset',
        durationText: '2–3 minutes',
        steps: [
          'Stand up slowly from your chair',
          'Roll your shoulders backwards 10 times',
          'Stretch your neck gently side to side',
          'Reach down and stretch your hamstrings',
          'Walk around your room briefly'
        ]
      },
      {
        id: 'hydration',
        title: 'Activity 2 – Hydration Walk',
        durationText: '3–5 minutes',
        steps: [
          'Depart your screen completely',
          'Pour a full glass of cold water',
          'Walk to a window and look far away',
          'Take three slow diaphragmatic breaths',
          'Maintain screens-off state until complete'
        ]
      },
      {
        id: 'focus_reset',
        title: 'Activity 3 – Focus Intentions Reset',
        durationText: '2 minutes',
        steps: [
          'Close your eyes resting your eyelids',
          'Take 10 very slow, measured breaths',
          'Reflect on alignment of your top priority',
          'Set a highly single focus intention for next block'
        ]
      }
    ];

    const randomAct = activities[Math.floor(Math.random() * activities.length)];
    setSelectedBreakActivity(randomAct);
    setBreakCompleted(false);
    setShowBreakPrompt(true);
    setIsFullscreen(false);
  };

  const skipBreak = () => {
    setShowBreakPrompt(false);
    setSelectedBreakActivity(null);
  };

  const commitBreakCompletion = () => {
    setBreakCompleted(true);
    setTimeout(() => {
      setShowBreakPrompt(false);
      setSelectedBreakActivity(null);
    }, 1500);
  };

  // Convert seconds helper
  const getFormattedTime = () => {
    const minStr = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const secStr = (timeLeft % 60).toString().padStart(2, '0');
    return `${minStr}:${secStr}`;
  };

  // Circular Dash offset calculator
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = isActive 
    ? circumference - (timeLeft / (selectedPreset * 60)) * circumference 
    : 0;

  const getAmbientDisplayLabel = (type: string) => {
    switch (type) {
      case 'rain': return 'Soft Rainfall Stream';
      case 'lofi': return 'Chill Focus Lofi Loop';
      case 'waves': return 'Pacific Ocean Waves';
      case 'forest': return 'Whispering Forest Birds';
      default: return 'No Ambient Music';
    }
  };

  return (
    <div id="focus-center-root" className="space-y-6">
      
      {/* Header and statistics metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
            Deep Focus Operating Center
          </h2>
          <p className="text-sm text-slate-400">Deploy Pomodoro focus blocks and track mandatory break routines.</p>
        </div>

        {/* Focus totals stats */}
        <div className="flex items-center space-x-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-850">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Sessions</div>
            <div className="text-base font-bold text-white font-mono">{completedSessionsCount} active</div>
          </div>
          <div className="w-px bg-slate-800 self-stretch" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">Hours Focused</div>
            <div className="text-base font-bold text-indigo-400 font-mono">{(totalFocusMinutes / 60).toFixed(1)} hrs</div>
          </div>
        </div>
      </div>

      {/* Break suggestion Modal popup */}
      {showBreakPrompt && selectedBreakActivity && (
        <div id="break-overlay-container" className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-[#0b0f2a] border border-indigo-500/30 rounded-2xl p-6 md:p-8 max-w-lg w-full text-left space-y-6">
            
            <div className="flex items-center space-x-3 text-purple-400">
              <Coffee className="w-7 h-7 text-purple-400" />
              <div>
                <h3 className="font-display font-medium text-lg text-white">Focus Block Succeeded!</h3>
                <p className="text-xs text-purple-300 font-mono font-medium">Mandatory Break Reset Triggered</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-850">
              <h4 className="text-sm font-bold text-white uppercase tracking-tight">{selectedBreakActivity.title}</h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Target time: {selectedBreakActivity.durationText}</p>
              
              <ul className="space-y-3.5 mt-4 text-xs text-slate-300">
                {selectedBreakActivity.steps.map((stp: string, idx: number) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-indigo-400 font-bold font-mono">STEP {idx + 1}:</span>
                    <span>{stp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {breakCompleted ? (
              <div className="text-center py-2 text-emerald-400 font-mono text-sm font-bold animate-pulse">
                ✓ Break Completed! Logged on Stats. Returning...
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={skipBreak}
                  className="px-4 py-1.5 text-xs text-slate-500 hover:text-slate-350 transition"
                >
                  Skip break
                </button>
                <button
                  id="confirm-break-complete"
                  onClick={commitBreakCompletion}
                  className="px-5 py-2.5 bg-purple-500 hover:bg-purple-600 font-bold rounded-xl text-white text-xs shadow-lg shadow-purple-500/20 max-w-xs transition"
                >
                  ✓ Mark Break as Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Main Focus layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Widget: Active timer and options (Span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-blur-card rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center shadow-lg relative min-h-[420px]">
            
            {/* Fullscreen focus toggle action */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
              title="Toggle distraction-free view mode"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Immersive circular loader */}
            <div className="relative w-52 h-52 flex items-center justify-center mt-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="rgba(15, 23, 42, 0.4)"
                  strokeWidth="8"
                  className="fill-transparent"
                />
                <circle
                  cx="104"
                  cy="104"
                  r={radius}
                  stroke="url(#timerGrad)"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="fill-transparent transition-all duration-300"
                />
                
                {/* SVG gradient defines */}
                <defs>
                  <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F5DFF" />
                    <stop offset="100%" stopColor="#7B6CFF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Centered digits */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1 select-none">
                <span className="text-4xl md:text-5.5xl font-display font-extrabold text-white tracking-tight tabular-nums font-mono text-glow">
                  {getFormattedTime()}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                  {isActive ? (isPaused ? 'Paused block' : 'Focused Deep Work') : 'Preset selected'}
                </span>
              </div>
            </div>

            {/* Timer controls */}
            <div className="flex items-center space-x-4 mt-8">
              <button 
                id="timer-reset-button"
                onClick={handleResetTimer}
                className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition"
                title="Reset timer completely"
              >
                <RotateCcw className="w-4.5 h-4.5" />
              </button>

              {!isActive ? (
                <button
                  id="timer-play-button"
                  onClick={handleStartTimer}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-500/20 transition duration-300 flex items-center space-x-2"
                >
                  <Play className="w-4.5 h-4.5 fill-white" />
                  <span>Start Focus session</span>
                </button>
              ) : (
                <button
                  id="timer-pause-button"
                  onClick={handlePauseToggle}
                  className="px-8 py-3 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold text-sm rounded-xl transition flex items-center space-x-2"
                >
                  {isPaused ? <Play className="w-4.5 h-4.5 fill-indigo-300" /> : <Pause className="w-4.5 h-4.5 fill-indigo-300" />}
                  <span>{isPaused ? 'Resume Session' : 'Pause block'}</span>
                </button>
              )}

              {/* Simulate done instant finish trigger */}
              {isActive && (
                <button
                  onClick={handleSessionComplete}
                  className="p-2.5 bg-emerald-500/15 border border-emerald-500/20 text-emerald-300 text-[11px] rounded-lg font-bold font-mono hover:bg-emerald-500 hover:text-white transition"
                >
                  Done
                </button>
              )}
            </div>
          </div>

          {/* Session planning properties card */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-display font-bold text-base text-white mb-4">Focus Task Alignment</h3>
            <div>
              <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">What are you actively working on during this timer block?</label>
              <input
                type="text"
                placeholder="E.g. Refactoring PostgreSQL local storage adapters..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-805 rounded-xl px-4 py-2.5 text-xs text-slate-200 mt-1.5 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

        </div>

        {/* Right column: Presets settings and Background sounds */}
        <div className="space-y-6">
          
          {/* Preset sessions choice */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-display font-semibold text-xs text-slate-300 mb-3.5 uppercase font-mono tracking-wider">Sprint Presets</h3>
            
            <div className="space-y-2">
              {[
                { name: '45m Session', label: 'Deep Work Sprint', value: 45 },
                { name: '90m Session', label: 'Extreme Flow Block', value: 90 },
                { name: '120m Session', label: 'Heavy Pair Alignment', value: 120 }
              ].map((opt) => (
                <button
                  key={opt.value}
                  id={`preset-${opt.value}-mins`}
                  onClick={() => setSelectedPreset(opt.value)}
                  disabled={isActive}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition
                    ${selectedPreset === opt.value 
                      ? 'bg-indigo-500/15 border-indigo-500/30' 
                      : 'bg-slate-900 border-slate-850 hover:border-slate-800'
                    }
                    ${isActive ? 'opacity-40 cursor-not-allowed' : ''}
                  `}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200 font-mono">{opt.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{opt.label}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </button>
              ))}
            </div>

            {/* Custom Minutes Input */}
            <div className="mt-4 pt-3.5 border-t border-slate-850/60">
              <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Custom Session Block mins</label>
              <div className="flex space-x-2 mt-1">
                <input
                  type="number"
                  min={1}
                  max={480}
                  placeholder="60 mins..."
                  disabled={isActive}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 0) setSelectedPreset(val);
                  }}
                  className="w-full bg-slate-900 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 outline-none w-2/3 font-mono"
                />
                <span className="text-xs text-slate-500 self-center">mins</span>
              </div>
            </div>
          </div>

          {/* Ambient environment players */}
          <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
            <h3 className="font-display font-semibold text-xs text-slate-305 mb-3 uppercase font-mono tracking-wider">Audio Ambience Player</h3>
            
            <div className="space-y-2.5">
              {[
                { id: 'none', label: 'Mute / Quiet Focus' },
                { id: 'rain', label: 'Rainfall Stream' },
                { id: 'lofi', label: 'Slow Down Lofi Beat' },
                { id: 'waves', label: 'Deep Ocean tides' },
                { id: 'forest', label: 'Soft chirping forest' }
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    setAmbientSound(bg.id as any);
                    setAudioSourcePlaying(bg.id !== 'none');
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs text-left transition
                    ${ambientSound === bg.id 
                      ? 'bg-purple-500/10 border-purple-500/30 text-purple-300 font-bold' 
                      : 'bg-slate-900 border-slate-850 hover:border-slate-800 text-slate-400'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2.5">
                    <Music className="w-3.5 h-3.5" />
                    <span>{bg.label}</span>
                  </div>
                  {ambientSound === bg.id && audioSourcePlaying && (
                    <span className="flex space-x-0.5 items-end h-2 w-3">
                      <span className="w-0.5 bg-purple-400 h-full animate-bounce" />
                      <span className="w-0.5 bg-purple-400 h-1/2 animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="w-0.5 bg-purple-400 h-3/4 animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Volume sliders */}
            {ambientSound !== 'none' && (
              <div className="mt-4 pt-4 border-t border-slate-850/40 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Volume level</span>
                  <span>{soundVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soundVolume}
                  onChange={(e) => setSoundVolume(Number(e.target.value))}
                  className="w-full cursor-pointer accent-purple-500"
                />
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Immersive Fullscreen Mode Overlay */}
      {isFullscreen && (
        <div id="immersive-fullscreen-timer" className="fixed inset-0 bg-slate-950 z-100 flex flex-col items-center justify-center p-6 space-y-6 animate-fadeIn">
          
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Close Immersion</span>
          </button>

          {/* Glowing element */}
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl animate-pulse-glow" />

          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="144" cy="144" r="110" stroke="rgba(255,255,255,0.02)" strokeWidth="6" className="fill-transparent" />
              <circle
                cx="144"
                cy="144"
                r="110"
                stroke="url(#timerGradFull)"
                strokeWidth="8"
                strokeDasharray={2 * Math.PI * 110}
                strokeDashoffset={2 * Math.PI * 110 - (timeLeft / (selectedPreset * 60)) * (2 * Math.PI * 110)}
                strokeLinecap="round"
                className="fill-transparent transition-all duration-300"
              />
              <defs>
                <linearGradient id="timerGradFull" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F5DFF" />
                  <stop offset="100%" stopColor="#7B6CFF" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
              <span className="text-5xl md:text-7xl font-display font-extrabold text-white tracking-widest tabular-nums text-glow select-none">
                {getFormattedTime()}
              </span>
              <span className="text-xs font-mono tracking-widest uppercase text-slate-400 font-semibold">
                POMODORO FLOW IN SESSION
              </span>
            </div>
          </div>

          <div className="max-w-md text-center">
            <h4 className="text-slate-300 text-sm font-semibold italic">“{sessionNotes || 'Deep Work: Momentum is built daily.'}”</h4>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePauseToggle}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-mono font-bold rounded-lg transition"
            >
              {isPaused ? 'RESUME BLOCK' : 'PAUSE BLOCK'}
            </button>
            <button
              onClick={handleSessionComplete}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-lg transition"
            >
              FINISH BLOCK
            </button>
          </div>

          {/* Ambient active indicator */}
          {ambientSound !== 'none' && (
            <p className="text-xs font-mono text-slate-500 animate-pulse flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              Playing: {getAmbientDisplayLabel(ambientSound)}
            </p>
          )}

        </div>
      )}

    </div>
  );
}
