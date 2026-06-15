import React from 'react';
import { 
  Trophy, 
  Sparkles, 
  Zap, 
  Flame, 
  Activity, 
  CheckCircle2, 
  Target, 
  Award,
  ChevronRight,
  ShieldAlert,
  Crown
} from 'lucide-react';
import { Achievement, UserStats } from '../types';

interface QuestViewProps {
  stats: UserStats;
  achievements: Achievement[];
  tasksCompletedCount: number;
  focusSessionsCount: number;
  focusHours: number;
}

export default function QuestView({
  stats,
  achievements,
  tasksCompletedCount,
  focusSessionsCount,
  focusHours
}: QuestViewProps) {
  
  const getLevelTitle = (level: number) => {
    switch (level) {
      case 1: return 'Focus Apprentice';
      case 2: return 'Consistency Builder';
      case 3: return 'Deep Work Specialist';
      case 4: return 'Momentum Maker';
      default: return 'Productivity Master';
    }
  };

  const currentLevelProgress = stats.xp % 500;
  const currentLevelPercent = Math.min(100, Math.round((currentLevelProgress / 500) * 100));

  // Determine achievement icons
  const getAchievementIcon = (iconName: string, isUnlocked: boolean) => {
    const cls = `w-6 h-6 ${isUnlocked ? 'text-indigo-400' : 'text-slate-650 opacity-40'}`;
    switch (iconName) {
      case 'Zap': return <Zap className={cls} />;
      case 'Flame': return <Flame className={cls} />;
      case 'Trophy': return <Trophy className={cls} />;
      case 'CheckCircle2': return <CheckCircle2 className={cls} />;
      case 'Activity': return <Activity className={cls} />;
      default: return <Award className={cls} />;
    }
  };

  // Evaluate if achievement meets thresholds
  const evaluateProgressValue = (achievement: Achievement) => {
    switch (achievement.metric) {
      case 'tasks': return tasksCompletedCount;
      case 'focusSessionCount': return focusSessionsCount;
      case 'focusHours': return focusHours;
      case 'daysStreak': return stats.focusStreak;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6" id="quest-module-root">
      
      {/* Quest header */}
      <div>
        <h2 className="font-display font-bold text-2xl text-white tracking-tight">
          Focus Quest Module
        </h2>
        <p className="text-sm text-slate-400 font-sans">Elegantly engineered gamification matrices designed to motivate elite focus consistency.</p>
      </div>

      {/* Level and XP bento card */}
      <div className="bg-gradient-to-r from-slate-905 via-[#0b1445]/50 to-[#121c60]/40 rounded-2xl p-6 md:p-8 border border-indigo-950/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10 animate-pulse-glow" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          
          {/* Progress values */}
          <div className="space-y-4">
            <span className="flex items-center space-x-1.5 text-purple-400 font-mono text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>XP Level Metrics</span>
            </span>

            <div className="space-y-1">
              <h3 className="text-5xl font-display font-black text-white leading-tight font-mono">
                Level {stats.level}
              </h3>
              <p className="text-lg font-display font-medium text-indigo-305 tracking-tight">
                {getLevelTitle(stats.level)}
              </p>
            </div>

            <p className="text-xs text-slate-350 leading-relaxed max-w-sm">
              Keep finishing Priority Top 3 tasks and committing Focus Sessions blocks to accumulate XP values.
            </p>
          </div>

          {/* Graphical slider panel */}
          <div className="space-y-3.5 bg-slate-950/60 p-5 rounded-2xl border border-slate-850">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-medium">Level Progress</span>
              <span className="text-indigo-400 font-bold">{currentLevelProgress} / 500 XP</span>
            </div>

            <div className="w-full h-3.5 bg-slate-900 border border-slate-850 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-inner"
                style={{ width: `${currentLevelPercent}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] font-mono text-slate-500 uppercase tracking-widest font-bold">
              <span>LVL {stats.level}</span>
              <span>{currentLevelPercent}% Complete</span>
              <span>LVL {stats.level + 1}</span>
            </div>
          </div>

        </div>
      </div>

      {/* Grid of achievements and criteria */}
      <h3 className="font-display font-bold text-base text-white tracking-tight flex items-center gap-2">
        <Crown className="w-5 h-5 text-indigo-400" />
        Elite Achievements Matrix
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const currentProgressVal = evaluateProgressValue(achievement);
          const isUnlocked = currentProgressVal >= achievement.thresholdValue;
          const currentPercent = Math.min(100, Math.round((currentProgressVal / achievement.thresholdValue) * 100));

          return (
            <div 
              key={achievement.id}
              className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between
                ${isUnlocked 
                  ? 'bg-blur-card border-indigo-505/20 shadow shadow-indigo-500/5' 
                  : 'bg-blur-card/40 border-slate-900/60 opacity-60'
                }
              `}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl border flex-shrink-0
                  ${isUnlocked 
                    ? 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300' 
                    : 'bg-slate-900 border-slate-850 text-slate-550'
                  }
                `}>
                  {getAchievementIcon(achievement.iconName, isUnlocked)}
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-200 text-sm">{achievement.title}</h4>
                    <span className="text-[9px] font-mono font-bold bg-indigo-950/20 text-indigo-300 border border-indigo-500/10 px-1.5 py-0.2 rounded uppercase">
                      +{achievement.xpReward} XP
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">{achievement.description}</p>
                </div>
              </div>

              {/* Progress Slider block */}
              <div className="mt-4 pt-3.5 border-t border-slate-850/60 space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-slate-500 uppercase tracking-widest font-bold">Progress Vector</span>
                  <span className={`font-semibold ${isUnlocked ? 'text-indigo-400' : 'text-slate-500'}`}>
                    {currentProgressVal} / {achievement.thresholdValue}
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${isUnlocked ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    style={{ width: `${currentPercent}%` }}
                  />
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
