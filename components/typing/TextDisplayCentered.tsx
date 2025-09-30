'use client';

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TextDisplayCenteredProps {
  text: string;
  userInput: string;
  currentPosition: number;
  errors: Set<number>;
  corrections: Set<number>;
  className?: string;
}

const TextDisplayCentered: React.FC<TextDisplayCenteredProps> = ({
  text,
  userInput,
  currentPosition,
  errors,
  corrections,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  
  // Прокручиваем текст, чтобы текущий символ был в центре
  useEffect(() => {
    if (containerRef.current && textRef.current) {
      const container = containerRef.current;
      const textElement = textRef.current;
      
      // Находим текущий символ
      const currentCharElement = textElement.querySelector(`[data-index="${currentPosition}"]`) as HTMLElement;
      
      if (currentCharElement) {
        const containerWidth = container.offsetWidth;
        const charOffset = currentCharElement.offsetLeft;
        const charWidth = currentCharElement.offsetWidth;
        
        // Вычисляем позицию для центрирования
        const scrollPosition = charOffset - (containerWidth / 2) + (charWidth / 2);
        
        // Плавная прокрутка
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [currentPosition]);

  const renderCharacter = (char: string, index: number) => {
    const isTyped = index < userInput.length;
    const isCurrent = index === currentPosition;
    const isError = errors.has(index);
    const isCorrected = corrections.has(index);
    const isCorrect = isTyped && !isError && !isCorrected;

    let charClassName = 'inline-block px-0.5 py-2 text-2xl font-mono transition-all duration-200';

    if (isCurrent) {
      // Текущий символ - увеличен и выделен
      charClassName += ' scale-125 bg-primary text-primary-foreground rounded';
    } else if (isError) {
      // Ошибка - красный
      charClassName += ' bg-destructive/20 text-destructive';
    } else if (isCorrected) {
      // Исправление - жёлтый
      charClassName += ' bg-yellow-100 text-yellow-900';
    } else if (isCorrect) {
      // Правильный символ - зелёный
      charClassName += ' bg-green-100 text-green-900';
    } else if (index < currentPosition + 10) {
      // Ближайшие символы - видимые
      charClassName += ' text-foreground opacity-60';
    } else {
      // Далёкие символы - приглушенные
      charClassName += ' text-muted-foreground opacity-30';
    }

    // Обработка пробелов
    if (char === ' ') {
      return (
        <span
          key={index}
          data-index={index}
          className={cn(charClassName, 'w-4')}
        >
          {isCurrent ? '␣' : '\u00A0'}
        </span>
      );
    }

    // Обработка переносов строк (заменяем на специальный символ)
    if (char === '\n') {
      return (
        <span
          key={index}
          data-index={index}
          className={cn(charClassName, 'text-muted-foreground')}
        >
          ↵
        </span>
      );
    }

    return (
      <span
        key={index}
        data-index={index}
        className={cn(charClassName)}
      >
        {char}
      </span>
    );
  };

  return (
    <div
      className={cn(
        'bg-card border rounded-lg overflow-hidden',
        'h-24 relative', // Фиксированная высота
        className
      )}
    >
      {/* Индикаторы по краям */}
      <div className='absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none' />
      <div className='absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none' />
      
      {/* Центральная линия-индикатор */}
      <div className='absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2 z-20' />
      
      {/* Контейнер с текстом */}
      <div
        ref={containerRef}
        className='overflow-x-auto scrollbar-hide h-full flex items-center'
        style={{ scrollBehavior: 'smooth' }}
      >
        <div
          ref={textRef}
          className='whitespace-nowrap px-[50%]' // Отступы для центрирования
        >
          {text.split('').map((char, index) => renderCharacter(char, index))}
        </div>
      </div>
      
      {/* Прогресс */}
      <div className='absolute bottom-0 left-0 right-0 h-1 bg-muted'>
        <div 
          className='h-full bg-primary transition-all duration-300'
          style={{ width: `${(currentPosition / text.length) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default TextDisplayCentered;