import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Map, 
  Volume2, 
  CloudLightning, 
  Database, 
  Sparkles,
  Link,
  ChevronRight,
  Upload,
  CheckCircle,
  Clock
} from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsViewProps {
  profile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
}

export default function SettingsView({
  profile,
  onUpdateProfile
}: SettingsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'system' | 'supabase'>('profile');
  
  // Profile settings State handles
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');

  // PostgreSQL / Supabase simulated state
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState('https://momenzi-sandbox.supabase.co');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSJ9...');

  // Timers presets
  const [timerPomodoro, setTimerPomodoro] = useState(45);
  const [timerShortBreak, setTimerShortBreak] = useState(10);
  const [timerLongBreak, setTimerLongBreak] = useState(15);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundProfile, setSoundProfile] = useState('organic_gong');

  const [changesSaved, setChangesSaved] = useState(false);

  const handleApplyProfileUpdates = () => {
    onUpdateProfile({
      firstName,
      lastName,
      email,
      avatarUrl
    });
    setChangesSaved(true);
    setTimeout(() => setChangesSaved(false), 2000);
  };

  const handleConnectSupabaseSimulate = () => {
    setSupabaseConnected(!supabaseConnected);
  };

  return (
    <div className="space-y-6" id="settings-desk-root">
      
      {/* Settings layout header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white tracking-tight flex items-center gap-2">
            Momenzi Operating System Settings
          </h2>
          <p className="text-sm text-slate-400">Configure core preferences, workspace profiles and secure Supabase integrations.</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeSubTab === 'profile' ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Profile & Account
          </button>
          <button
            onClick={() => setActiveSubTab('system')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeSubTab === 'system' ? 'bg-indigo-505/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Timer & Sounds
          </button>
          <button
            onClick={() => setActiveSubTab('supabase')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition ${activeSubTab === 'supabase' ? 'bg-indigo-500/15 text-indigo-300 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Supabase Db SDK
          </button>
        </div>
      </div>

      {activeSubTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
          
          {/* Main Account details (Span-2) */}
          <div className="lg:col-span-2 bg-blur-card rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="font-display font-bold text-base text-white border-b border-slate-850 pb-2">Profile Configurations</h3>

            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 pb-2">
              <img 
                src={avatarUrl} 
                alt="Avatar" 
                className="w-20 h-20 rounded-full border-2 border-indigo-500/30 object-cover"
              />
              <div className="space-y-1.5 text-center md:text-left">
                <label className="text-[10px] text-slate-500 uppercase font-mono font-bold">Avatar URL Source</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="bg-slate-900 border border-slate-800 text-xs rounded-lg px-2.5 py-1.5 text-slate-350 focus:outline-none focus:border-indigo-505 w-60"
                  />
                  <button className="p-1 px-3 bg-slate-800 hover:bg-slate-705 text-white rounded text-xs">Verify</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-805 rounded-xl px-3.5 py-2 mt-1 text-xs text-slate-200"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-805 rounded-xl px-3.5 py-2 mt-1 text-xs text-slate-200"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs text-slate-400">Email Address (Secure Login ID)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-805 rounded-xl px-3.5 py-2 mt-1 text-xs text-slate-200"
                />
              </div>
            </div>

            {changesSaved && (
              <div className="text-xs text-emerald-400 font-mono font-bold animate-pulse">✓ Profile adjustments committed successfully.</div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleApplyProfileUpdates}
                className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-xl text-xs font-bold text-white shadow-lg transition"
              >
                Save Account Updates
              </button>
            </div>
          </div>

          {/* Right column secure settings info */}
          <div className="space-y-6">
            <div className="bg-blur-card rounded-2xl p-6 shadow-lg">
              <h3 className="font-display font-semibold text-xs text-slate-300 mb-3.5">Security Parameters</h3>
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-400 font-mono text-[10px]">Change Password</label>
                  <input
                    type="password"
                    placeholder="Current credential password"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-205 mt-1"
                  />
                  <input
                    type="password"
                    placeholder="New password (Min 6 chars)"
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-205 mt-1.5"
                  />
                </div>
                <button className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded font-bold text-xs transition">
                  Alter Password
                </button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Timer & sounds view */}
      {activeSubTab === 'system' && (
        <div className="bg-blur-card rounded-2xl p-6 shadow-lg space-y-6 animate-fadeIn">
          <div className="border-b border-slate-850 pb-3">
            <h3 className="font-display font-bold text-base text-white">Pomodoro Timer Configurations</h3>
            <p className="text-xs text-slate-400">Configure Pomodoro core session intervals</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-400 uppercase font-mono text-[10px]">Work focus duration (mins)</label>
              <input
                type="number"
                value={timerPomodoro}
                onChange={(e) => setTimerPomodoro(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 mt-1 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 uppercase font-mono text-[10px]">Short Break duration (mins)</label>
              <input
                type="number"
                value={timerShortBreak}
                onChange={(e) => setTimerShortBreak(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 mt-1 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-400 uppercase font-mono text-[10px]">Long Break duration (mins)</label>
              <input
                type="number"
                value={timerLongBreak}
                onChange={(e) => setTimerLongBreak(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 mt-1 text-slate-200"
              />
            </div>
          </div>

          <div className="border-b border-slate-850 pb-3 pt-3">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              Notifications & Organic Sounds
            </h3>
          </div>

          <div className="flex items-center justify-between text-xs font-mono">
            <span>Play alarms on completion</span>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(e) => setSoundEnabled(e.target.checked)}
              className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-650 rounded-xl text-white text-xs font-bold transition">
              Commit Interval Updates
            </button>
          </div>
        </div>
      )}

      {/* Supabase connection panel */}
      {activeSubTab === 'supabase' && (
        <div className="bg-blur-card rounded-2xl p-6 shadow-lg space-y-6 animate-fadeIn">
          
          <div className="flex items-center space-x-3 text-indigo-400">
            <Database className="w-6 h-6" />
            <div>
              <h3 className="font-display font-bold text-base text-white">Supabase / PostgreSQL Server settings</h3>
              <p className="text-xs text-slate-400">Architected for database scaling. Connect your Postgres databases with secure RLS rules.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="text-slate-405 font-bold uppercase font-mono">SUPABASE_PROJECT_URL</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 mt-1 text-slate-200"
              />
            </div>

            <div>
              <label className="text-slate-405 font-bold uppercase font-mono">SUPABASE_ANON_PUBLIC_KEY</label>
              <input
                type="password"
                value={supabaseAnonKey}
                onChange={(e) => setSupabaseAnonKey(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3.5 py-2 mt-1 text-slate-200"
              />
            </div>
          </div>

          <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-xs text-indigo-305 space-y-3 font-sans">
            <div className="flex items-center gap-1.5 font-bold text-white uppercase font-mono">
              <CloudLightning className="w-4.5 h-4.5 text-indigo-400 animate-bounce" />
              <span>Row Level Security (RLS) Schema</span>
            </div>
            
            <p className="leading-relaxed text-slate-300">
              Your tables structure outlines (tasks, bookings, reflections, focus_records) automatically enforce secure user compartmentalization logic. Users only possess reading/writing authentication channels to elements matching their unique target profile UID:
            </p>

            <pre className="p-3 bg-slate-950 text-[10.5px] rounded border border-slate-850 font-mono text-purple-300 leading-normal block overflow-x-auto select-all">
{`-- Enforce Secure Compartmentalization Rules
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read write their own tasks"
ON tasks
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);`}
            </pre>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-850/60">
            <span className="text-xs text-slate-450 font-mono italic">
              Status: {supabaseConnected ? '● COMPARTMENTALIZED SYSTEM ACTIVE' : '○ SIMULATED LOCAL OFFLINE PERSISTENCE'}
            </span>
            
            <button
              id="connect-supabase-btn"
              onClick={handleConnectSupabaseSimulate}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer
                ${supabaseConnected 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-605 text-white shadow-lg'
                }
              `}
            >
              {supabaseConnected ? 'Disconnect SDK' : 'Connect Supabase Server'}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
