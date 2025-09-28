export type Language = 'ru' | 'en' | 'mixed';

export function detectTextLanguage(text: string): Language {
  // Удаляем знаки препинания и цифры для чистой проверки
  const cleanText = text.replace(/[0-9\s\W]/g, '');
  
  if (!cleanText) return 'en'; // По умолчанию английский
  
  // Подсчитываем количество русских и английских букв
  const russianLetters = (cleanText.match(/[а-яА-ЯёЁ]/g) || []).length;
  const englishLetters = (cleanText.match(/[a-zA-Z]/g) || []).length;
  
  const totalLetters = russianLetters + englishLetters;
  
  if (totalLetters === 0) return 'en';
  
  const russianPercentage = (russianLetters / totalLetters) * 100;
  const englishPercentage = (englishLetters / totalLetters) * 100;
  
  // Если больше 90% букв одного языка, считаем текст моноязычным
  if (russianPercentage > 90) return 'ru';
  if (englishPercentage > 90) return 'en';
  
  // Иначе смешанный
  return 'mixed';
}

export function getLanguageDisplayName(language: Language): string {
  switch (language) {
    case 'ru':
      return 'Русский';
    case 'en':
      return 'English';
    case 'mixed':
      return 'Смешанный';
  }
}

export function getLayoutHint(language: Language): string {
  switch (language) {
    case 'ru':
      return 'Переключитесь на русскую раскладку перед началом';
    case 'en':
      return 'Switch to English layout before starting';
    case 'mixed':
      return 'Потребуется переключение между раскладками';
  }
}