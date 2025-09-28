import { TypingLesson } from '@/types/typing';

export const TYPING_LESSONS: TypingLesson[] = [
  // Основы - домашний ряд
  {
    id: 'basics-home-row',
    title: 'Домашний ряд',
    description: 'Изучаем основную позицию пальцев: ФЫВА ОЛДЖ',
    level: 'beginner',
    category: 'basics',
    text: 'фыва олдж фыва олдж а о л д ж ф ы в а фыва олдж'
  },
  
  {
    id: 'basics-home-row-words',
    title: 'Слова домашнего ряда',
    description: 'Простые слова из букв домашнего ряда',
    level: 'beginner', 
    category: 'basics',
    text: 'вол дол лов два жало вода лодка вылов водка жаль влад'
  },

  // Верхний ряд
  {
    id: 'basics-top-row',
    title: 'Верхний ряд',
    description: 'Добавляем буквы верхнего ряда: ЙЦУКЕН ГШЩЗХ',
    level: 'beginner',
    category: 'basics',
    text: 'йцукен гшщзх йцукен гшщзх й ц у к е н г ш щ з х'
  },

  {
    id: 'basics-combined-rows',
    title: 'Два ряда',
    description: 'Сочетаем домашний и верхний ряды',
    level: 'beginner',
    category: 'basics',
    text: 'хожу гулял клён учёт льёт взял чётко шутка жуёт'
  },

  // Нижний ряд
  {
    id: 'basics-bottom-row',
    title: 'Нижний ряд',
    description: 'Изучаем нижний ряд: ЯЧСМИТЬБ',
    level: 'beginner',
    category: 'basics',
    text: 'ячсмитьб ячсмитьб я ч с м и т ь б ячсмитьб ячсмитьб'
  },

  {
    id: 'basics-all-rows',
    title: 'Все буквы',
    description: 'Сочетаем все три ряда клавиатуры',
    level: 'intermediate',
    category: 'basics',
    text: 'быстро набираю текст всеми пальцами очень хорошо получается'
  },

  // Слова и предложения
  {
    id: 'words-common',
    title: 'Частые слова',
    description: 'Самые употребляемые слова русского языка',
    level: 'intermediate',
    category: 'words',
    text: 'в и на не что он с как по это для при все может быть так же если его или до как'
  },

  {
    id: 'sentences-simple',
    title: 'Простые предложения',
    description: 'Короткие предложения для тренировки',
    level: 'intermediate',
    category: 'sentences',
    text: 'Сегодня хорошая погода. Завтра будет дождь. Я иду в магазин. Купил хлеб и молоко. Дома меня ждёт кот.'
  },

  {
    id: 'sentences-medium',
    title: 'Средние предложения',
    description: 'Предложения средней длины',
    level: 'intermediate',
    category: 'sentences',
    text: 'Быстрая печать является важным навыком в современном мире. Тренировка помогает увеличить скорость набора текста. Регулярные упражнения дают отличный результат.'
  },

  // Программирование
  {
    id: 'programming-basic',
    title: 'Основы кода',
    description: 'Базовые конструкции программирования',
    level: 'intermediate',
    category: 'programming',
    text: 'function getName() { return "Иван"; } const age = 25; if (age > 18) { console.log("Взрослый"); }'
  },

  {
    id: 'programming-advanced',
    title: 'Сложный код',
    description: 'Более сложные программные конструкции',
    level: 'advanced',
    category: 'programming',
    text: 'const users = await fetch("/api/users").then(res => res.json()); users.filter(u => u.active).map(u => ({ id: u.id, name: u.name }));'
  },

  // Цитаты и культура
  {
    id: 'quotes-classic',
    title: 'Классические цитаты',
    description: 'Известные цитаты из русской литературы',
    level: 'advanced',
    category: 'quotes',
    text: 'Что нужно для счастья? Тихая семейная жизнь с возможностью делать добро людям. - Лев Толстой'
  },

  {
    id: 'quotes-modern',
    title: 'Современные мемы',
    description: 'Популярные фразы из интернета',
    level: 'intermediate',
    category: 'quotes',
    text: 'Это работает у меня на машине. А что если попробовать выключить и включить? Stack Overflow спасёт мир!'
  },

  {
    id: 'quotes-pushkin',
    title: 'А.С. Пушкин',
    description: 'Отрывки из произведений великого поэта',
    level: 'advanced',
    category: 'quotes',
    text: 'Мороз и солнце день чудесный! Ещё ты дремлешь, друг прелестный. Пора, красавица, проснись: Открой сомкнуты негой взоры.'
  },

  // Специальные символы
  {
    id: 'symbols-punctuation',
    title: 'Знаки препинания',
    description: 'Тренировка знаков препинания',
    level: 'intermediate',
    category: 'basics',
    text: 'Привет! Как дела? Всё хорошо. Работаю, учусь... Жизнь "интересная"! А у тебя? (Надеюсь, тоже хорошо)'
  },

  {
    id: 'symbols-numbers',
    title: 'Цифры',
    description: 'Набор цифр и чисел',
    level: 'intermediate',
    category: 'basics',
    text: '1234567890 телефон +7 916 123-45-67 дата 16.09.2025 время 14:30 номер дома 123а'
  },

  // Длинные тексты
  {
    id: 'long-story',
    title: 'Длинная история',
    description: 'Тренировка выносливости на длинном тексте',
    level: 'advanced',
    category: 'sentences',
    text: 'В один прекрасный день я решил научиться быстро печатать. Это оказалось не так просто, как казалось. Нужна постоянная практика, правильная постановка пальцев и терпение. Сначала скорость была всего 10 слов в минуту. Но каждый день тренировок приносил заметный результат. Через месяц я уже печатал 40 слов в минуту, а через три месяца достиг 60 слов. Главное - не сдаваться и тренироваться регулярно.'
  },

  {
    id: 'tech-news',
    title: 'Технологические новости',
    description: 'Современный IT текст',
    level: 'advanced',
    category: 'sentences',
    text: 'Искусственный интеллект продолжает развиваться невероятными темпами. Нейронные сети теперь способны генерировать код, тексты и изображения. Разработчики создают всё более совершенные алгоритмы машинного обучения. Квантовые компьютеры обещают революцию в вычислениях.'
  }
];

export const getLessonsByCategory = (category: TypingLesson['category']): TypingLesson[] => {
  return TYPING_LESSONS.filter(lesson => lesson.category === category);
};

export const getLessonsByLevel = (level: TypingLesson['level']): TypingLesson[] => {
  return TYPING_LESSONS.filter(lesson => lesson.level === level);
};

export const getLessonById = (id: string): TypingLesson | undefined => {
  return TYPING_LESSONS.find(lesson => lesson.id === id);
};

export const getRandomLesson = (): TypingLesson => {
  const randomIndex = Math.floor(Math.random() * TYPING_LESSONS.length);
  return TYPING_LESSONS[randomIndex];
};

export const LESSON_CATEGORIES = [
  { id: 'basics', name: 'Основы', description: 'Изучение раскладки клавиатуры' },
  { id: 'words', name: 'Слова', description: 'Часто используемые слова' },
  { id: 'sentences', name: 'Предложения', description: 'Связный текст' },
  { id: 'programming', name: 'Программирование', description: 'Код и символы' },
  { id: 'quotes', name: 'Цитаты', description: 'Известные выражения' }
] as const;

export const LESSON_LEVELS = [
  { id: 'beginner', name: 'Начинающий', description: 'Первые шаги' },
  { id: 'intermediate', name: 'Средний', description: 'Развитие навыка' },
  { id: 'advanced', name: 'Продвинутый', description: 'Мастерство' }
] as const;