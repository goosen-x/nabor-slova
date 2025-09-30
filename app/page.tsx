'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { TYPING_LESSONS, LESSON_CATEGORIES } from '@/lib/texts-database';
import { statisticsStorage } from '@/lib/statistics-storage';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState({
    currentSpeed: 0,
    accuracy: 0,
    lessonsCompleted: 0
  });

  useEffect(() => {
    setMounted(true);
    // Загружаем статистику
    const homeStats = statisticsStorage.getHomePageStats();
    setStats(homeStats);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Набор Слова</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Современный тренажёр для обучения быстрой печати
          </p>
          
          <div className="flex gap-4 justify-center mb-8">
            <Link href="/trainer">
              <Button size="lg">
                Начать тренировку
              </Button>
            </Link>
            <Button size="lg" variant="outline" disabled>
              Моя статистика
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ваша скорость</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.currentSpeed} WPM</p>
              <p className="text-sm text-muted-foreground">
                {stats.currentSpeed === 0 ? 'Начните тренировку' : 'Последняя скорость'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Точность</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.accuracy}%</p>
              <p className="text-sm text-muted-foreground">
                {stats.accuracy === 0 ? 'Пройдите первый урок' : 'Последняя точность'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Завершено уроков</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.lessonsCompleted}</p>
              <p className="text-sm text-muted-foreground">
                Доступно {TYPING_LESSONS.length} уроков
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Выберите способ обучения</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {LESSON_CATEGORIES.map((category) => {
              const lessonsCount = TYPING_LESSONS.filter(l => l.category === category.id).length;
              return (
                <Card key={category.id} className="h-full opacity-60 cursor-not-allowed">
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <CardDescription>
                      {category.description} • {lessonsCount} уроков • Скоро
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/trainer">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>Быстрый старт</CardTitle>
                <CardDescription>
                  Случайный урок для мгновенного начала
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Card className="opacity-60 cursor-not-allowed">
            <CardHeader>
              <CardTitle>Достижения</CardTitle>
              <CardDescription>
                Отслеживайте свой прогресс и награды • Скоро
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p className="mb-2">
            <strong>Цель:</strong> Достигните скорости 60+ WPM с точностью 95%
          </p>
          <p>
            <strong>Совет дня:</strong> Тренируйтесь регулярно по 15-20 минут в день для лучших результатов
          </p>
        </footer>
      </div>
    </div>
  );
}