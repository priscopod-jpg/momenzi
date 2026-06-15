export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  isGoogleConnected: boolean;
  joinedAt: string;
}

export type PriorityLevel = 'low' | 'medium' | 'high';
export type TaskStatus = 'Not Started' | 'In Progress' | 'Complete';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  duration: number; // in minutes
  priority: PriorityLevel;
  status: TaskStatus;
  category: 'Work' | 'Personal' | 'Health' | 'Learning';
  isTopThree: boolean;
  isTopFive: boolean;
  tags: string[];
  notes?: string;
  recurrence: 'none' | 'daily' | 'weekly';
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  space: 'Work' | 'Personal' | 'Health' | 'Learning';
  isGoogleSynced?: boolean;
}

export interface MeetingType {
  id: string;
  title: string;
  duration: number; // in mins
  description: string;
  slug: string;
  isActive: boolean;
}

export interface Booking {
  id: string;
  meetingTypeId: string;
  guestName: string;
  guestEmail: string;
  guestNotes?: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: 'confirmed' | 'cancelled' | 'rescheduled';
  createdAt: string;
}

export interface FocusRecord {
  id: string;
  duration: number; // active focus duration in minutes
  type: '45m' | '90m' | '120m' | 'custom';
  timestamp: string; // ISO string
  completed: boolean;
  notes?: string;
  breakActivityCompleted?: boolean;
  breakActivityName?: string;
}

export interface ReflectionLog {
  id: string;
  date: string; // YYYY-MM-DD
  goal: string;
  wins: string;
  lessons: string;
  improvements: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  unlockedAt?: string;
  iconName: string;
  thresholdValue: number;
  metric: 'tasks' | 'focusSessionCount' | 'focusHours' | 'daysStreak';
}

export interface UserStats {
  xp: number;
  level: number;
  focusStreak: number; // days
  taskStreak: number; // days
  lastFocusDate?: string; // YYYY-MM-DD
  lastTaskDate?: string; // YYYY-MM-DD
}
