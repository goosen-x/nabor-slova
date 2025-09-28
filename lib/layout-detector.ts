export type KeyboardLayout = 'ru' | 'en' | 'unknown';

// Маппинг клавиш между раскладками для одинаковых физических клавиш
const keyboardMapping: Record<string, { ru: string; en: string }> = {
  // Буквы верхнего ряда
  'q': { en: 'q', ru: 'й' },
  'w': { en: 'w', ru: 'ц' },
  'e': { en: 'e', ru: 'у' },
  'r': { en: 'r', ru: 'к' },
  't': { en: 't', ru: 'е' },
  'y': { en: 'y', ru: 'н' },
  'u': { en: 'u', ru: 'г' },
  'i': { en: 'i', ru: 'ш' },
  'o': { en: 'o', ru: 'щ' },
  'p': { en: 'p', ru: 'з' },
  '[': { en: '[', ru: 'х' },
  ']': { en: ']', ru: 'ъ' },
  
  // Буквы среднего ряда
  'a': { en: 'a', ru: 'ф' },
  's': { en: 's', ru: 'ы' },
  'd': { en: 'd', ru: 'в' },
  'f': { en: 'f', ru: 'а' },
  'g': { en: 'g', ru: 'п' },
  'h': { en: 'h', ru: 'р' },
  'j': { en: 'j', ru: 'о' },
  'k': { en: 'k', ru: 'л' },
  'l': { en: 'l', ru: 'д' },
  ';': { en: ';', ru: 'ж' },
  "'": { en: "'", ru: 'э' },
  
  // Буквы нижнего ряда
  'z': { en: 'z', ru: 'я' },
  'x': { en: 'x', ru: 'ч' },
  'c': { en: 'c', ru: 'с' },
  'v': { en: 'v', ru: 'м' },
  'b': { en: 'b', ru: 'и' },
  'n': { en: 'n', ru: 'т' },
  'm': { en: 'm', ru: 'ь' },
  ',': { en: ',', ru: 'б' },
  '.': { en: '.', ru: 'ю' },
  '/': { en: '/', ru: '.' },
  
  // Цифры и символы
  '`': { en: '`', ru: 'ё' },
};

// Создаем обратный маппинг для русских букв
const reverseMapping: Record<string, string> = {};
Object.entries(keyboardMapping).forEach(([enKey, { ru }]) => {
  reverseMapping[ru] = enKey;
});

export function detectLayoutByChar(pressedKey: string, expectedChar: string): KeyboardLayout {
  const lowerKey = pressedKey.toLowerCase();
  const lowerExpected = expectedChar.toLowerCase();
  
  // Если символы совпадают - раскладка правильная
  if (lowerKey === lowerExpected) {
    // Определяем какая это раскладка по символу
    if (/[а-яё]/.test(lowerExpected)) return 'ru';
    if (/[a-z]/.test(lowerExpected)) return 'en';
    return 'unknown';
  }
  
  // Проверяем, не перепутана ли раскладка
  // Если ожидаем английскую букву, но получили русскую
  if (/[a-z]/.test(lowerExpected) && /[а-яё]/.test(lowerKey)) {
    // Проверяем, соответствует ли русская буква английской на той же клавише
    const expectedEnKey = reverseMapping[lowerKey];
    if (expectedEnKey === lowerExpected) {
      return 'ru'; // Включена русская раскладка вместо английской
    }
  }
  
  // Если ожидаем русскую букву, но получили английскую
  if (/[а-яё]/.test(lowerExpected) && /[a-z]/.test(lowerKey)) {
    // Проверяем, соответствует ли английская буква русской на той же клавише
    const mapping = keyboardMapping[lowerKey];
    if (mapping && mapping.ru === lowerExpected) {
      return 'en'; // Включена английская раскладка вместо русской
    }
  }
  
  return 'unknown';
}

export function getExpectedLayout(char: string): KeyboardLayout {
  if (/[а-яё]/i.test(char)) return 'ru';
  if (/[a-z]/i.test(char)) return 'en';
  return 'unknown';
}

export function getLayoutWarning(currentLayout: KeyboardLayout, expectedLayout: KeyboardLayout): string | null {
  if (currentLayout === 'unknown' || expectedLayout === 'unknown') return null;
  if (currentLayout === expectedLayout) return null;
  
  if (expectedLayout === 'ru' && currentLayout === 'en') {
    return 'Включена английская раскладка! Переключитесь на русскую (Alt+Shift или Cmd+Space)';
  }
  
  if (expectedLayout === 'en' && currentLayout === 'ru') {
    return 'Включена русская раскладка! Переключитесь на английскую (Alt+Shift или Cmd+Space)';
  }
  
  return null;
}