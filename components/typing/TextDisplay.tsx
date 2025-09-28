'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TextDisplayProps {
  text: string;
  userInput: string;
  currentPosition: number;
  errors: Set<number>;
  corrections: Set<number>;
  className?: string;
}

const TextDisplay: React.FC<TextDisplayProps> = ({
  text,
  userInput,
  currentPosition,
  errors,
  corrections,
  className
}) => {
  const renderCharacter = (char: string, index: number) => {
    const isTyped = index < userInput.length;
    const isCurrent = index === currentPosition;
    const isError = errors.has(index);
    const isCorrected = corrections.has(index);
    const isCorrect = isTyped && !isError && !isCorrected;

    let charClassName = 'relative';

    if (isCurrent) {
      // Текущий символ - мигающий курсор
      charClassName += ' bg-primary text-primary-foreground animate-pulse';
    } else if (isError) {
      // Ошибка - красный фон
      charClassName += ' bg-destructive text-destructive-foreground';
    } else if (isCorrected) {
      // Исправление - жёлтый фон
      charClassName += ' bg-yellow-100 text-yellow-900';
    } else if (isCorrect) {
      // Правильный символ - зеленоватый фон
      charClassName += ' bg-green-100 text-green-900';
    } else {
      // Еще не набранный символ - обычный
      charClassName += ' text-foreground';
    }

    // Обработка пробелов
    if (char === ' ') {
      return (
        <span
          key={index}
          className={cn(charClassName, 'inline-block w-2')}
        >
          {isCurrent ? '_' : '\u00A0'}
        </span>
      );
    }

    // Обработка переносов строк
    if (char === '\\n') {
      return <br key={index} />;
    }

    return (
      <span
        key={index}
        className={cn(charClassName, 'inline-block')}
      >
        {char}
      </span>
    );
  };

  return (
    <div
      className={cn(
        'p-6 font-mono text-lg leading-relaxed',
        'bg-card',
        'border rounded-md',
        'min-h-[200px] select-none cursor-default',
        className
      )}
    >
      <div className='whitespace-pre-wrap break-words'>
        {text.split('').map((char, index) => renderCharacter(char, index))}
        {/* Курсор в конце, если текст закончился */}
        {currentPosition >= text.length && (
          <span className='bg-primary text-primary-foreground animate-pulse inline-block w-2'>
            _
          </span>
        )}
      </div>
    </div>
  );
};

export default TextDisplay;