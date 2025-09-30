# Набор Слова - Тренажёр быстрой печати

![CI](https://github.com/goosen-x/nabor-slova/workflows/CI/badge.svg)
![Deploy](https://github.com/goosen-x/nabor-slova/workflows/Deploy%20to%20Server/badge.svg)

Современный тренажёр для обучения быстрой печати с минималистичным дизайном.

## Возможности

- Уроки для всех уровней подготовки
- Отслеживание прогресса в реальном времени
- Статистика скорости и точности печати
- Адаптивный дизайн для всех устройств

## Технологии

- Next.js 15 с App Router
- TypeScript
- Tailwind CSS v4
- Biome для линтинга и форматирования

## Разработка

```bash
# Установка зависимостей
npm ci

# Запуск в режиме разработки
npm run dev

# Сборка для production
npm run build:production

# Проверка типов
npm run typecheck

# Линтинг
npm run lint
```

## Деплой

Сайт автоматически деплоится на https://naborslova.ru при каждом push в main ветку.

## Лицензия

MIT