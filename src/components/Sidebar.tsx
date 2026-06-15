import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  ListTodo, 
  Calendar, 
  UserCheck, 
  Flame, 
  BarChart3, 
  BookOpen, 
  Trophy, 
  Settings, 
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { UserProfile, UserStats } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  profile: UserProfile;
  stats: UserStats;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  profile,
  stats,
  onLogout,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  
  const getLevelTitle = (level: number) => {
    switch (level) {
      case 1: return 'Focus Apprentice';
      case 2: return 'Consistency Builder';
      case 3: return 'Deep Work Specialist';
      case 4: return 'Momentum Maker';
      default: return 'Productivity Master';
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'today', label: 'Today Planner', icon: CalendarRange },
    { id: 'tasks', label: 'Tasks Desk', icon: ListTodo },
    { id: 'calendar', label: 'Calendar Engine', icon: Calendar },
    { id: 'bookings', label: 'Bookings Portal', icon: UserCheck, badge: 'Booking' },
    { id: 'focus', label: 'Focus Center', icon: Flame, pulse: true },
    { id: 'analytics', label: 'Deep Analytics', icon: BarChart3 },
    { id: 'reflection', label: 'Daily Reflection', icon: BookOpen },
    { id: 'quest', label: 'Focus Quest', icon: Trophy, accent: true },
    { id: 'settings', label: 'OS Settings', icon: Settings },
  ];

  const spaces = [
    { name: 'Work', color: 'bg-indigo-500' },
    { name: 'Personal', color: 'bg-emerald-500' },
    { name: 'Learning', color: 'bg-purple-500' },
    { name: 'Health', color: 'bg-rose-500' },
  ];

  return (
    <>
      {/* Mobile Header Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <img 
            src="https://www.image2url.com/r2/default/images/1781514813185-f218cda4-2cbf-4bea-ae94-8b0a4734273d.png" 
            alt="Momenzi Logo" 
            className="w-8 h-8 rounded-lg object-contain"
          />
          <span className="font-display font-bold tracking-tight text-xl bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Momenzi
          </span>
        </div>
        <button 
          id="sidebar-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 px-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay backdrop for mobile */}
      {isOpen && (
        <div 
          id="sidebar-backdrop"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-45 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Left Sidebar */}
      <aside 
        id="main-sidebar"
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0a0f2d] border-r border-slate-800/80 flex flex-col justify-between py-6 z-50 transition-all duration-300 ease-in-out select-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Logo & Platform Info */}
          <div className="px-6 mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-70 blur-xs group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <img 
                  src="https://www.image2url.com/r2/default/images/1781514813185-f218cda4-2cbf-4bea-ae94-8b0a4734273d.png" 
                  alt="Momenzi Logo" 
                  className="relative w-9 h-9 rounded-lg object-contain bg-slate-900 p-0.5"
                />
              </div>
              <div>
                <h1 className="font-display font-bold tracking-tight text-lg text-white leading-tight">
                  Momenzi OS
                </h1>
                <p className="text-[10px] text-indigo-300/70 font-mono font-semibold uppercase tracking-wider">
                  v1.2 Productivity
                </p>
              </div>
            </div>
          </div>

          {/* Gamification Progress Summary in Head */}
          <div className="mx-4 mb-5 px-4 py-3 rounded-xl bg-slate-900/60 border border-indigo-950/40 hover:border-indigo-500/10 transition">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-[11px] font-medium font-mono text-slate-300">Level {stats.level}</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 font-mono">{stats.xp} XP</span>
            </div>
            
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (stats.xp % 500) / 5)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {getLevelTitle(stats.level)}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-3 overflow-y-auto max-h-[50vh]">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 font-mono">
              Workspace Space
            </p>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsOpen(false); // Close mobile sidebar
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 outline-none group
                    ${isActive 
                      ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 font-medium' 
                      : 'text-slate-400 hover:bg-slate-850/50 hover:text-slate-200 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center space-x-2.5">
                    <IconComponent className={`w-4 h-4 transition-transform group-hover:scale-105
                      ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}
                      ${item.pulse ? 'animate-pulse text-rose-400' : ''}
                    `} />
                    <span className="text-slate-200 font-medium text-[13px]">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] bg-indigo-500/20 text-indigo-300 rounded font-bold font-mono tracking-wider uppercase">
                      {item.badge}
                    </span>
                  )}
                  {item.accent && (
                    <span className="w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-500/50" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Spaces divider */}
          <div className="mt-6 px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 mb-2 font-mono">
              My Active Spaces
            </p>
            <div className="space-y-1.5 px-3">
              {spaces.map((space) => (
                <div key={space.name} className="flex items-center space-x-2 text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer py-0.5">
                  <span className={`w-2 h-2 rounded-full ${space.color}`} />
                  <span className="text-[12px] font-medium">{space.name} Space</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Account / Signout Footer */}
        <div className="px-4 border-t border-slate-800/60 pt-4 mx-2">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/40 border border-slate-800/30 hover:bg-slate-900/80 transition duration-300">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <img 
                src={profile.avatarUrl} 
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-8 h-8 rounded-full border border-indigo-500/25 object-cover flex-shrink-0"
              />
              <div className="overflow-hidden">
                <h3 className="text-xs font-bold text-slate-200 truncate leading-snug">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-[10px] text-slate-400 truncate leading-none font-mono">
                  {profile.email}
                </p>
              </div>
            </div>
            
            <button 
              id="sidebar-logout-btn"
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition"
              title="Logout session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
