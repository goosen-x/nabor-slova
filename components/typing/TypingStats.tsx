'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TypingStats as TypingStatsType } from '@/types/typing';
import { cn } from '@/lib/utils';

interface TypingStatsProps {
  stats: TypingStatsType;
  isActive: boolean;
  className?: string;
}

const TypingStats: React.FC<TypingStatsProps> = ({
  stats,
  isActive,
  className
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const StatBox: React.FC<{
    label: string;
    value: string | number;
    unit?: string;
    highlight?: boolean;
  }> = ({ label, value, unit = '', highlight = false }) => (
    <div
      className={cn(
        'px-3 py-2 text-center border rounded-md',
        highlight && 'bg-primary text-primary-foreground'
      )}
    >
      <div className='text-xs font-medium mb-1'>{label}</div>
      <div className='text-lg font-bold'>
        {value}{unit}
      </div>
    </div>
  );

  return (
    <div className={cn('flex gap-2', className)}>
      <StatBox
        label='WPM'
        value={stats.wpm}
        highlight={isActive}
      />
      
      <StatBox
        label='Точность'
        value={stats.accuracy}
        unit='%'
      />
      
      <StatBox
        label='Ошибки'
        value={stats.errorsCount}
      />
      
      <StatBox
        label='Исправления'
        value={stats.correctionsCount}
      />
      
      <StatBox
        label='Время'
        value={formatTime(stats.totalTime)}
      />
      
      <StatBox
        label='СЗМ'
        value={stats.charactersPerSecond}
      />
    </div>
  );
};

export default TypingStats;