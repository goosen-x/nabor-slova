'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TypingTrainer from '@/components/typing/TypingTrainer';
import { getLessonById, getRandomLesson } from '@/lib/texts-database';
import { TypingLesson } from '@/types/typing';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

const SpecificLessonPage: React.FC = () => {
  const params = useParams();
  const lessonId = params?.lessonId as string;
  const [lesson, setLesson] = useState<TypingLesson | null>(null);
  
  useEffect(() => {
    // Устанавливаем урок только на клиенте
    const loadedLesson = getLessonById(lessonId);
    if (loadedLesson) {
      setLesson(loadedLesson);
    } else {
      // Если урок не найден, показываем ошибку
      setLesson(null);
    }
  }, [lessonId]);

  const handleLessonComplete = (result: any) => {
    console.log('Lesson completed with result:', result);
  };

  // Показываем загрузчик пока урок не загружен
  if (lesson === null && lessonId) {
    return (
      <div className='min-h-screen p-4 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg'>Загрузка урока...</p>
        </div>
      </div>
    );
  }

  // Если урок не найден после загрузки
  if (lesson === null) {
    return (
      <div className='min-h-screen p-4 flex items-center justify-center'>
        <Card>
          <CardHeader>
            <CardTitle>Урок не найден</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground mb-3'>
              К сожалению, запрошенный урок не был найден.
            </p>
            <Button asChild>
              <Link href='/trainer'>
                Выбрать другой урок
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-4'>
      <div className='max-w-6xl mx-auto'>
        <Card className='mb-4'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle>Тренажёр печати - {lesson.title}</CardTitle>
              <Button variant='ghost' size='sm' asChild>
                <Link href='/'>
                  Закрыть
                </Link>
              </Button>
            </div>
          </CardHeader>
          
          <div className='border-t px-6 py-3'>
            <div className='flex items-center gap-2'>
              <Button size='sm' variant='secondary' asChild>
                <Link href='/trainer'>
                  Другой урок
                </Link>
              </Button>
              
              <Button size='sm' variant='outline' disabled>
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
              lesson={lesson}
              onComplete={handleLessonComplete}
            />
          </CardContent>
          
          <div className='border-t px-6 py-2'>
            <div className='flex items-center justify-between text-sm text-muted-foreground'>
              <div className='flex items-center gap-4'>
                <span>ID: {lesson.id}</span>
                <span>Категория: {lesson.category}</span>
              </div>
              <span>Специальный урок</span>
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

export default SpecificLessonPage;