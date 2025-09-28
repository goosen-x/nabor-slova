'use client';

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Language, getLanguageDisplayName, getLayoutHint } from '@/lib/language-detector';
import { cn } from '@/lib/utils';

interface LanguageIndicatorProps {
  language: Language;
  isActive: boolean;
  className?: string;
}

const LanguageIndicator: React.FC<LanguageIndicatorProps> = ({
  language,
  isActive,
  className
}) => {
  const getLanguageIcon = (lang: Language) => {
    switch (lang) {
      case 'ru':
        return '🇷🇺';
      case 'en':
        return '🇬🇧';
      case 'mixed':
        return '🌐';
    }
  };

  const getLanguageColor = (lang: Language) => {
    switch (lang) {
      case 'ru':
        return 'bg-blue-100 text-blue-800';
      case 'en':
        return 'bg-green-100 text-green-800';
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isActive) return null; // Скрываем подсказку, когда печать началась

  return (
    <div className={cn('mb-4 space-y-2', className)}>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium'>Язык текста:</span>
        <Badge className={cn('gap-1', getLanguageColor(language))}>
          <span>{getLanguageIcon(language)}</span>
          <span>{getLanguageDisplayName(language)}</span>
        </Badge>
      </div>
      
      <Alert className='border-2'>
        <AlertDescription className='font-medium'>
          ⌨️ {getLayoutHint(language)}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default LanguageIndicator;