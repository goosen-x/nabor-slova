'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TypingEngine } from '@/lib/typing-engine';
import { TypingState, TypingStats as TypingStatsType, TypingLesson } from '@/types/typing';
import TextDisplay from './TextDisplay';
import TextDisplayCentered from './TextDisplayCentered';
import TypingStats from './TypingStats';
import LanguageIndicator from './LanguageIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { detectTextLanguage } from '@/lib/language-detector';
import { detectLayoutByChar, getExpectedLayout, getLayoutWarning } from '@/lib/layout-detector';
import { toast } from 'sonner';
import { statisticsStorage } from '@/lib/statistics-storage';

interface TypingTrainerProps {
  lesson: TypingLesson;
  onComplete?: (result: any) => void;
  className?: string;
}

const TypingTrainer: React.FC<TypingTrainerProps> = ({
  lesson,
  onComplete,
  className
}) => {
  const router = useRouter();
  const [typingEngine, setTypingEngine] = useState<TypingEngine | null>(null);
  const [state, setState] = useState<TypingState | null>(null);
  const [stats, setStats] = useState<TypingStatsType>({
    wpm: 0,
    accuracy: 0,
    cleanTypingPercentage: 100,
    totalTime: 0,
    errorsCount: 0,
    correctionsCount: 0,
    charactersPerSecond: 0,
    totalKeyPresses: 0
  });
  const [showResults, setShowResults] = useState(false);
  const [hasCheckedLayout, setHasCheckedLayout] = useState(false);
  const [useCenteredView, setUseCenteredView] = useState(true);

  // Инициализация движка
  useEffect(() => {
    const engine = new TypingEngine(
      lesson.text,
      (newState: TypingState) => setState(newState),
      (newStats: TypingStatsType) => setStats(newStats)
    );
    
    setTypingEngine(engine);
    setState({
      currentPosition: 0,
      startTime: null,
      endTime: null,
      errors: new Set<number>(),
      corrections: new Set<number>(),
      isActive: false,
      isCompleted: false,
      text: lesson.text,
      userInput: ''
    });

    return () => {
      setTypingEngine(null);
    };
  }, [lesson.text]);

  // Обработка завершения
  useEffect(() => {
    if (state?.isCompleted && typingEngine) {
      const result = typingEngine.getResult();
      if (result) {
        // Сохраняем статистику
        statisticsStorage.saveSession(lesson.id, result);
        
        // Проверяем новые достижения
        const progress = statisticsStorage.getUserProgress();
        const newAchievements = progress.achievements.filter(
          a => a.unlocked && a.unlockedAt && 
          new Date(a.unlockedAt).getTime() > Date.now() - 5000
        );
        
        // Показываем уведомления о достижениях
        newAchievements.forEach(achievement => {
          setTimeout(() => {
            toast.success(`${achievement.icon} Новое достижение!`, {
              description: `${achievement.title}: ${achievement.description}`,
              duration: 6000,
            });
          }, 1000);
        });
        
        setTimeout(() => {
          setShowResults(true);
          onComplete?.(result);
        }, 500);
      }
    }
  }, [state?.isCompleted, typingEngine, onComplete, lesson.id]);

  // Обработка клавиш
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!typingEngine || showResults) return;

    // Предотвращаем стандартное поведение для всех клавиш
    event.preventDefault();

    const { key } = event;
    
    // Игнорируем системные клавиши
    if (['Tab', 'Escape', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].includes(key)) {
      return;
    }

    // Определяем раскладку при первом символе
    if (!hasCheckedLayout && state && state.currentPosition === 0 && key.length === 1) {
      const expectedChar = lesson.text[0];
      const expectedLayout = getExpectedLayout(expectedChar);
      const detectedLayout = detectLayoutByChar(key, expectedChar);
      const warning = getLayoutWarning(detectedLayout, expectedLayout);
      
      if (warning) {
        toast.error('Неправильная раскладка!', {
          description: warning,
          duration: 5000,
          action: {
            label: 'Игнорировать',
            onClick: () => setHasCheckedLayout(true),
          },
        });
        // Не обрабатываем символ, если раскладка неправильная
        return;
      }
      
      setHasCheckedLayout(true);
    }

    typingEngine.handleKeyPress(key);
  }, [typingEngine, showResults, hasCheckedLayout, state, lesson.text]);

  // Подключение обработчика клавиш
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleRestart = () => {
    if (typingEngine) {
      typingEngine.reset();
      setShowResults(false);
      setHasCheckedLayout(false);
      toast.dismiss(); // Закрываем все уведомления
    }
  };

  const handleNewLesson = () => {
    // Сбрасываем движок чтобы избежать повторного открытия диалога
    if (typingEngine) {
      typingEngine.reset();
    }
    setShowResults(false);
    setHasCheckedLayout(false);
    // Перенаправляем на страницу выбора уроков
    router.push('/trainer');
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      setShowResults(false);
      // Если диалог закрывается через крестик, возвращаемся на главную
      router.push('/');
    }
  };

  const getStatusMessage = () => {
    if (!state) return 'Загрузка...';
    if (state.isCompleted) return 'Урок завершён!';
    if (state.isActive) return 'Печатайте текст...';
    return 'Начните печатать для старта';
  };

  const result = typingEngine?.getResult();
  const lessonLanguage = detectTextLanguage(lesson.text);

  return (
    <div className={cn('w-full max-w-4xl mx-auto', className)}>
      {/* Заголовок урока */}
      <Card className='mb-4'>
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
          {lesson.description && (
            <p className='text-sm text-muted-foreground'>{lesson.description}</p>
          )}
        </CardHeader>
      </Card>

      {/* Индикатор языка */}
      <LanguageIndicator 
        language={lessonLanguage}
        isActive={state?.isActive || false}
      />

      {/* Статистика */}
      <div className='mb-4'>
        <TypingStats 
          stats={stats} 
          isActive={state?.isActive || false}
        />
      </div>

      {/* Основная область печати */}
      <Card className='mb-4'>
        <CardContent className='p-0'>
          {state && (
            useCenteredView ? (
              <TextDisplayCentered
                text={state.text}
                userInput={state.userInput}
                currentPosition={state.currentPosition}
                errors={state.errors}
                corrections={state.corrections}
              />
            ) : (
              <TextDisplay
                text={state.text}
                userInput={state.userInput}
                currentPosition={state.currentPosition}
                errors={state.errors}
                corrections={state.corrections}
              />
            )
          )}
        </CardContent>
      </Card>

      {/* Статусная строка */}
      <div className='flex justify-between items-center mb-4'>
        <div className='text-sm text-muted-foreground'>
          {getStatusMessage()}
        </div>

        <div className='flex gap-1'>
          <Button
            variant='secondary'
            size='sm'
            onClick={handleRestart}
            disabled={!state?.isActive && !state?.isCompleted}
          >
            Заново
          </Button>
        </div>
      </div>

      {/* Диалог результатов */}
      <Dialog open={showResults} onOpenChange={handleDialogClose}>
        <DialogContent 
          className='max-w-md'
          aria-label='Результаты урока'
        >
          <DialogHeader>
            <DialogTitle>Результаты урока</DialogTitle>
            <DialogDescription>
              Урок «{lesson.title}» завершён!
            </DialogDescription>
          </DialogHeader>

          {result && (
            <>
              <div className='grid grid-cols-2 gap-2 my-4'>
                <div className='text-center p-3 border rounded-md'>
                  <div className='text-sm text-muted-foreground'>Скорость</div>
                  <div className='text-lg font-bold'>{result.wpm} WPM</div>
                </div>
                <div className='text-center p-3 border rounded-md'>
                  <div className='text-sm text-muted-foreground'>Точность</div>
                  <div className='text-lg font-bold'>{result.accuracy}%</div>
                  <div className='text-xs text-muted-foreground mt-1'>{result.totalKeyPresses} нажатий</div>
                </div>
                <div className='text-center p-3 border rounded-md'>
                  <div className='text-sm text-muted-foreground'>Время</div>
                  <div className='text-lg font-bold'>{Math.round(result.totalTime)}с</div>
                </div>
                <div className='text-center p-3 border rounded-md'>
                  <div className='text-sm text-muted-foreground'>Ошибки</div>
                  <div className='text-lg font-bold'>{result.errorsCount}</div>
                </div>
                {result.correctionsCount > 0 && (
                  <div className='text-center p-3 border rounded-md border-yellow-200 bg-yellow-50 col-span-2'>
                    <div className='text-sm text-muted-foreground'>Исправления</div>
                    <div className='text-lg font-bold text-yellow-700'>{result.correctionsCount}</div>
                  </div>
                )}
                <div className='text-center p-3 border rounded-md border-blue-200 bg-blue-50 col-span-2'>
                  <div className='text-sm text-muted-foreground'>Чистота набора</div>
                  <div className='text-lg font-bold text-blue-700'>{result.cleanTypingPercentage}%</div>
                  <div className='text-xs text-muted-foreground mt-1'>Без исправлений</div>
                </div>
              </div>
            </>
          )}

          <DialogFooter>
            <Button onClick={handleRestart} size='sm'>
              Повторить
            </Button>
            <Button onClick={handleNewLesson} size='sm' variant='secondary'>
              Новый урок
            </Button>
            <Button onClick={() => router.push('/')} size='sm' variant='outline'>
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TypingTrainer;