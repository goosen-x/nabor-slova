// Типы для движка печати

export interface TypingResult {
  wpm: number;
  accuracy: number;
  totalTime: number;
  errorsCount: number;
  correctionsCount: number;
  charactersTyped: number;
  correctCharacters: number;
}

export interface TypingState {
  currentPosition: number;
  startTime: number | null;
  endTime: number | null;
  errors: Set<number>;
  corrections: Set<number>;
  isActive: boolean;
  isCompleted: boolean;
  text: string;
  userInput: string;
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  totalTime: number;
  errorsCount: number;
  correctionsCount: number;
  charactersPerSecond: number;
}

export interface TypingLesson {
  id: string;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  text: string;
  category: 'basics' | 'words' | 'sentences' | 'programming' | 'quotes';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    type: 'wpm' | 'accuracy' | 'lessons_completed' | 'streak';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface UserProgress {
  totalLessonsCompleted: number;
  bestWpm: number;
  averageWpm: number;
  bestAccuracy: number;
  averageAccuracy: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  recentSessions: TypingSession[];
}

export interface TypingSession {
  id: string;
  lessonId: string;
  date: Date;
  result: TypingResult;
  mistakes: { position: number; expected: string; typed: string }[];
}

export interface TypingConfig {
  soundEnabled: boolean;
  showVirtualKeyboard: boolean;
  showProgressBar: boolean;
  fontSize: 'small' | 'medium' | 'large';
  theme: 'windows95' | 'classic';
}