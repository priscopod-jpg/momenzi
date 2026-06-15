import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Task, 
  CalendarEvent, 
  MeetingType, 
  Booking, 
  FocusRecord, 
  ReflectionLog, 
  Achievement, 
  UserStats 
} from './types';
import { 
  INITIAL_PROFILE, 
  INITIAL_STATS, 
  INITIAL_TASKS, 
  INITIAL_CALENDAR_EVENTS, 
  INITIAL_MEETING_TYPES, 
  INITIAL_BOOKINGS, 
  INITIAL_FOCUS_RECORDS, 
  INITIAL_ACHIEVEMENTS, 
  INITIAL_REFLECTIONS 
} from './initialData';

import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import TasksView from './components/TasksView';
import CalendarView from './components/CalendarView';
import BookingsView from './components/BookingsView';
import FocusView from './components/FocusView';
import AnalyticsView from './components/AnalyticsView';
import ReflectionView from './components/ReflectionView';
import QuestView from './components/QuestView';
import SettingsView from './components/SettingsView';
import AuthScreen from './components/AuthScreen';
import TodayPlannerView from './components/TodayPlannerView';

export default function App() {
  // Authentication status
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('momenzi_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  // Main UI coordinates
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // States
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('momenzi_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('momenzi_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('momenzi_events');
    return saved ? JSON.parse(saved) : INITIAL_CALENDAR_EVENTS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('momenzi_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>(() => {
    const saved = localStorage.getItem('momenzi_meeting_types');
    return saved ? JSON.parse(saved) : INITIAL_MEETING_TYPES;
  });

  const [focusHistory, setFocusHistory] = useState<FocusRecord[]>(() => {
    const saved = localStorage.getItem('momenzi_focus_history');
    return saved ? JSON.parse(saved) : INITIAL_FOCUS_RECORDS;
  });

  const [reflectionLogs, setReflectionLogs] = useState<ReflectionLog[]>(() => {
    const saved = localStorage.getItem('momenzi_reflections');
    return saved ? JSON.parse(saved) : INITIAL_REFLECTIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  // Persistence hooks
  useEffect(() => {
    if (profile) {
      localStorage.setItem('momenzi_profile', JSON.stringify(profile));
    } else {
      localStorage.removeItem('momenzi_profile');
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('momenzi_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('momenzi_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('momenzi_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('momenzi_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('momenzi_meeting_types', JSON.stringify(meetingTypes));
  }, [meetingTypes]);

  useEffect(() => {
    localStorage.setItem('momenzi_focus_history', JSON.stringify(focusHistory));
  }, [focusHistory]);

  useEffect(() => {
    localStorage.setItem('momenzi_reflections', JSON.stringify(reflectionLogs));
  }, [reflectionLogs]);

  // Actions
  const handleLoginSuccess = (userProfile: UserProfile) => {
    setProfile(userProfile);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setProfile(null);
  };

  const handleAddTask = (taskInfo: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskInfo,
      id: `task_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setTasks((prev) => [newTask, ...prev]);

    // Give partial XP on planning
    rewardXP(15);
  };

  const handleUpdateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) => 
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          
          // If task is completed, reward XP values
          if (updates.status === 'Complete' && t.status !== 'Complete') {
            const rewardAmt = t.isTopThree ? 100 : t.isTopFive ? 60 : 40;
            rewardXP(rewardAmt);
            incrementTaskStreak();
          }
          
          return updated;
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddEvent = (eventInfo: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventInfo,
      id: `event_${Math.random().toString(36).substring(2, 9)}`
    };
    setEvents((prev) => [...prev, newEvent]);
    rewardXP(20);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddMeetingType = (mtInfo: Omit<MeetingType, 'id'>) => {
    const newMt: MeetingType = {
      ...mtInfo,
      id: `meet_${Math.random().toString(36).substring(2, 9)}`
    };
    setMeetingTypes((prev) => [...prev, newMt]);
    rewardXP(30);
  };

  const handleAddBooking = (bkInfo: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBk: Booking = {
      ...bkInfo,
      id: `book_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setBookings((prev) => [newBk, ...prev]);

    // Also auto block the time slot on calendar
    handleAddEvent({
      title: `Client Booking: ${bkInfo.guestName}`,
      description: bkInfo.guestNotes,
      startTime: bkInfo.startTime,
      endTime: bkInfo.endTime,
      space: 'Work'
    });

    rewardXP(50);
  };

  const handleUpdateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings((prev) => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const handleAddFocusRecord = (recInfo: Omit<FocusRecord, 'id' | 'timestamp'>) => {
    const newRec: FocusRecord = {
      ...recInfo,
      id: `focus_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setFocusHistory((prev) => [newRec, ...prev]);

    if (recInfo.completed) {
      rewardXP(150);
      incrementFocusStreak();
    }
  };

  const handleAddReflection = (refInfo: Omit<ReflectionLog, 'id' | 'createdAt'>) => {
    const newRef: ReflectionLog = {
      ...refInfo,
      id: `ref_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    setReflectionLogs((prev) => [newRef, ...prev]);
    rewardXP(80);
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => prev ? { ...prev, ...updates } : null);
  };

  // Gamification reward utilities
  const rewardXP = (amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const newLvl = Math.floor(newXp / 500) + 1; // 500 XP per level
      
      return {
        ...prev,
        xp: newXp,
        level: newLvl
      };
    });
  };

  const incrementFocusStreak = () => {
    const todayStr = '2026-06-15';
    setStats((prev) => {
      if (prev.lastFocusDate === todayStr) return prev;
      return {
        ...prev,
        focusStreak: prev.focusStreak + 1,
        lastFocusDate: todayStr
      };
    });
  };

  const incrementTaskStreak = () => {
    const todayStr = '2026-06-15';
    setStats((prev) => {
      if (prev.lastTaskDate === todayStr) return prev;
      return {
        ...prev,
        taskStreak: prev.taskStreak + 1,
        lastTaskDate: todayStr
      };
    });
  };

  // Evaluate dynamic unlocks
  const tasksCompletedCount = tasks.filter(t => t.status === 'Complete').length;
  const focusSessionsCount = focusHistory.filter(f => f.completed).length;
  const focusHours = focusHistory.reduce((acc, f) => acc + (f.completed ? f.duration : 0), 0) / 60;

  // Render correct View block
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            stats={stats}
            events={events}
            setActiveTab={setActiveTab}
          />
        );
      case 'today':
        return (
          <TodayPlannerView
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            events={events}
            onAddEvent={handleAddEvent}
          />
        );
      case 'tasks':
        return (
          <TasksView 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            events={events}
            onAddEvent={handleAddEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case 'bookings':
        return (
          <BookingsView 
            meetingTypes={meetingTypes}
            onAddMeetingType={handleAddMeetingType}
            bookings={bookings}
            onAddBooking={handleAddBooking}
            onUpdateBooking={handleUpdateBooking}
          />
        );
      case 'focus':
        return (
          <FocusView 
            onAddFocusRecord={handleAddFocusRecord}
            focusHistory={focusHistory}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            tasks={tasks}
            focusHistory={focusHistory}
            bookings={bookings}
            stats={stats}
          />
        );
      case 'reflection':
        return (
          <ReflectionView 
            logs={reflectionLogs}
            onAddLog={handleAddReflection}
          />
        );
      case 'quest':
        return (
          <QuestView 
            stats={stats}
            achievements={achievements}
            tasksCompletedCount={tasksCompletedCount}
            focusSessionsCount={focusSessionsCount}
            focusHours={focusHours}
          />
        );
      case 'settings':
        return (
          <SettingsView 
            profile={profile!}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      default:
        return null;
    }
  };

  // If profile is logged out or null, show AuthScreen
  if (!profile) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 font-sans text-slate-100" id="momenzi-app-layout">
      
      {/* Sticky sidebar */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        profile={profile}
        stats={stats}
        onLogout={handleLogout}
        isOpen={mobileSidebarOpen}
        setIsOpen={setMobileSidebarOpen}
      />

      {/* Main workspace container view */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-screen w-full">
        {renderActiveView()}
      </main>

    </div>
  );
}
