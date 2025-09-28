'use client';

import { UserProgress, TypingSession, TypingResult, Achievement } from '@/types/typing';

const STORAGE_KEY = 'nabor-slova-statistics';
const SESSIONS_KEY = 'nabor-slova-sessions';

export class StatisticsStorage {
  private static instance: StatisticsStorage;
  
  private constructor() {}
  
  static getInstance(): StatisticsStorage {
    if (!StatisticsStorage.instance) {
      StatisticsStorage.instance = new StatisticsStorage();
    }
    return StatisticsStorage.instance;
  }

  // Получить прогресс пользователя
  getUserProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const progress = JSON.parse(stored);
        // Восстанавливаем даты
        if (progress.recentSessions) {
          progress.recentSessions = progress.recentSessions.map((session: any) => ({
            ...session,
            date: new Date(session.date)
          }));
        }
        return progress;
      } catch (error) {
        console.error('Error parsing stored progress:', error);
        return this.getDefaultProgress();
      }
    }
    return this.getDefaultProgress();
  }

  // Сохранить новую сессию
  saveSession(lessonId: string, result: TypingResult): void {
    if (typeof window === 'undefined') return;

    const session: TypingSession = {
      id: `session-${Date.now()}`,
      lessonId,
      date: new Date(),
      result,
      mistakes: [] // TODO: добавить сбор ошибок
    };

    // Сохраняем сессию
    const sessions = this.getAllSessions();
    sessions.push(session);
    
    // Оставляем только последние 100 сессий
    const recentSessions = sessions.slice(-100);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(recentSessions));

    // Обновляем общий прогресс
    this.updateProgress(result);
  }

  // Получить все сессии
  getAllSessions(): TypingSession[] {
    if (typeof window === 'undefined') return [];

    const stored = localStorage.getItem(SESSIONS_KEY);
    if (stored) {
      try {
        const sessions = JSON.parse(stored);
        return sessions.map((session: any) => ({
          ...session,
          date: new Date(session.date)
        }));
      } catch (error) {
        console.error('Error parsing sessions:', error);
        return [];
      }
    }
    return [];
  }

  // Обновить общий прогресс
  private updateProgress(result: TypingResult): void {
    const progress = this.getUserProgress();
    const sessions = this.getAllSessions();
    
    // Обновляем счетчики
    progress.totalLessonsCompleted += 1;
    
    // Обновляем лучшие показатели
    if (result.wpm > progress.bestWpm) {
      progress.bestWpm = result.wpm;
    }
    if (result.accuracy > progress.bestAccuracy) {
      progress.bestAccuracy = result.accuracy;
    }
    
    // Обновляем средние показатели
    const allResults = sessions.map(s => s.result);
    if (allResults.length > 0) {
      progress.averageWpm = Math.round(
        allResults.reduce((sum, r) => sum + r.wpm, 0) / allResults.length
      );
      progress.averageAccuracy = Math.round(
        allResults.reduce((sum, r) => sum + r.accuracy, 0) / allResults.length
      );
    }
    
    // Обновляем общее время
    progress.totalTimeSpent += result.totalTime;
    
    // Обновляем последние сессии для отображения
    progress.recentSessions = sessions.slice(-10);
    
    // Проверяем достижения
    this.checkAchievements(progress);
    
    // Сохраняем
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  // Проверить и обновить достижения
  private checkAchievements(progress: UserProgress): void {
    const achievements: Achievement[] = [
      {
        id: 'first-lesson',
        title: 'Первый урок',
        description: 'Завершите свой первый урок',
        icon: '🎯',
        requirement: { type: 'lessons_completed', value: 1 },
        unlocked: false
      },
      {
        id: 'speed-demon-30',
        title: 'Скоростной набор',
        description: 'Достигните скорости 30 WPM',
        icon: '⚡',
        requirement: { type: 'wpm', value: 30 },
        unlocked: false
      },
      {
        id: 'speed-demon-60',
        title: 'Мастер скорости',
        description: 'Достигните скорости 60 WPM',
        icon: '🚀',
        requirement: { type: 'wpm', value: 60 },
        unlocked: false
      },
      {
        id: 'accuracy-90',
        title: 'Точность - вежливость королей',
        description: 'Достигните точности 90%',
        icon: '🎯',
        requirement: { type: 'accuracy', value: 90 },
        unlocked: false
      },
      {
        id: 'accuracy-95',
        title: 'Идеальная точность',
        description: 'Достигните точности 95%',
        icon: '💎',
        requirement: { type: 'accuracy', value: 95 },
        unlocked: false
      },
      {
        id: 'lessons-10',
        title: 'Прилежный ученик',
        description: 'Завершите 10 уроков',
        icon: '📚',
        requirement: { type: 'lessons_completed', value: 10 },
        unlocked: false
      },
      {
        id: 'lessons-50',
        title: 'Мастер печати',
        description: 'Завершите 50 уроков',
        icon: '🏆',
        requirement: { type: 'lessons_completed', value: 50 },
        unlocked: false
      }
    ];

    // Проверяем каждое достижение
    achievements.forEach(achievement => {
      const existingAchievement = progress.achievements.find(a => a.id === achievement.id);
      
      if (!existingAchievement || !existingAchievement.unlocked) {
        let unlocked = false;
        
        switch (achievement.requirement.type) {
          case 'wpm':
            unlocked = progress.bestWpm >= achievement.requirement.value;
            break;
          case 'accuracy':
            unlocked = progress.bestAccuracy >= achievement.requirement.value;
            break;
          case 'lessons_completed':
            unlocked = progress.totalLessonsCompleted >= achievement.requirement.value;
            break;
        }
        
        if (unlocked) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date();
          
          // Обновляем или добавляем достижение
          const index = progress.achievements.findIndex(a => a.id === achievement.id);
          if (index >= 0) {
            progress.achievements[index] = achievement;
          } else {
            progress.achievements.push(achievement);
          }
        }
      }
    });
  }

  // Получить статистику для главной страницы
  getHomePageStats(): {
    currentSpeed: number;
    accuracy: number;
    lessonsCompleted: number;
    lastSession?: TypingSession;
  } {
    const progress = this.getUserProgress();
    const sessions = this.getAllSessions();
    const lastSession = sessions[sessions.length - 1];
    
    // Если есть последняя сессия, показываем её результаты
    if (lastSession) {
      return {
        currentSpeed: lastSession.result.wpm,
        accuracy: lastSession.result.accuracy,
        lessonsCompleted: progress.totalLessonsCompleted,
        lastSession
      };
    }
    
    return {
      currentSpeed: 0,
      accuracy: 0,
      lessonsCompleted: 0
    };
  }

  // Сбросить всю статистику
  resetAllStats(): void {
    if (typeof window === 'undefined') return;
    
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SESSIONS_KEY);
  }

  // Получить прогресс по умолчанию
  private getDefaultProgress(): UserProgress {
    return {
      totalLessonsCompleted: 0,
      bestWpm: 0,
      averageWpm: 0,
      bestAccuracy: 0,
      averageAccuracy: 0,
      totalTimeSpent: 0,
      currentStreak: 0,
      longestStreak: 0,
      achievements: [],
      recentSessions: []
    };
  }
}

// Экспортируем синглтон
export const statisticsStorage = StatisticsStorage.getInstance();