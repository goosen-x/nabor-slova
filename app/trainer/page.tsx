'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TypingTrainer from '@/components/typing/TypingTrainer';
import { TYPING_LESSONS, getRandomLesson, getLessonById } from '@/lib/texts-database';
import { TypingLesson } from '@/types/typing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const TrainerContent: React.FC = () => {
  const searchParams = useSearchParams();
  const lessonId = searchParams?.get('lesson');
  
  const [currentLesson, setCurrentLesson] = useState<TypingLesson | null>(null);

  useEffect(() => {
    // Устанавливаем урок только на клиенте
    if (lessonId) {
      setCurrentLesson(getLessonById(lessonId) || getRandomLesson());
    } else {
      setCurrentLesson(getRandomLesson());
    }
  }, [lessonId]);

  const handleLessonComplete = (result: any) => {
    console.log('Lesson completed with result:', result);
  };

  const handleNewLesson = () => {
    setCurrentLesson(getRandomLesson());
  };

  if (!currentLesson) {
    return (
      <div className='min-h-screen p-4 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg'>Загрузка урока...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-4'>
      <div className='max-w-6xl mx-auto'>
        <Card className='mb-4'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle>Тренажёр печати</CardTitle>
              <Button variant='ghost' size='sm' asChild>
                <Link href='/'>
                  Закрыть
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <div className='border-t px-6 py-3'>
            <div className='flex items-center gap-2'>
              <Button 
                size='sm' 
                onClick={handleNewLesson}
              >
                Новый урок
              </Button>
              
              <Button 
                size='sm' 
                variant='outline'
                disabled
              >
                Настройки
              </Button>
              
              <div className='mx-2 h-5 w-px bg-gray-200'></div>
              
              <Button size='sm' variant='outline' asChild>
                <Link href='/'>
                  На главную
                </Link>
              </Button>
            </div>
          </div>

          <CardContent className='pt-6'>
            <TypingTrainer
              lesson={currentLesson}
              onComplete={handleLessonComplete}
            />
          </CardContent>
          
          <div className='border-t px-6 py-2'>
            <div className='flex items-center justify-between text-sm text-muted-foreground'>
              <div className='flex items-center gap-4'>
                <span>Урок: {currentLesson.title}</span>
                <span>
                  Уровень: {currentLesson.level === 'beginner' ? 'Начинающий' : 
                           currentLesson.level === 'intermediate' ? 'Средний' : 'Продвинутый'}
                </span>
              </div>
              <span>Готов к печати</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Подсказки для эффективной тренировки</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div>
                <h4 className='font-semibold mb-2'>Правильная посадка:</h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li>• Спина прямая, ноги на полу</li>
                  <li>• Руки расслаблены, кисти не касаются стола</li>
                  <li>• Экран на расстоянии 50-70 см</li>
                </ul>
              </div>
              
              <div>
                <h4 className='font-semibold mb-2'>Постановка пальцев:</h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li>• ФЫВА - левая рука</li>
                  <li>• ОЛДЖ - правая рука</li>
                  <li>• Возвращайтесь в исходную позицию</li>
                </ul>
              </div>
              
              <div>
                <h4 className='font-semibold mb-2'>Советы:</h4>
                <ul className='space-y-1 text-sm text-muted-foreground'>
                  <li>• Не смотрите на клавиатуру</li>
                  <li>• Ритм важнее скорости</li>
                  <li>• 15-20 минут в день достаточно</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const TrainerPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen p-4 flex items-center justify-center">Loading...</div>}>
      <TrainerContent />
    </Suspense>
  );
};

export default TrainerPage;