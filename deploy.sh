#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Начало деплоя приложения nabor-slova...${NC}"

# Переменные (измените на ваши значения)
APP_DIR="/var/www/nabor-slova"
REPO_URL="git@github.com:your-username/nabor-slova.git" # Замените на ваш репозиторий

# Создание резервной копии текущей версии
if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}Создание резервной копии...${NC}"
    sudo cp -r $APP_DIR $APP_DIR-backup-$(date +%Y%m%d-%H%M%S)
fi

# Переход в директорию приложения
cd $APP_DIR

# Получение последних изменений
echo -e "${YELLOW}Получение последних изменений из репозитория...${NC}"
git pull origin main

# Установка зависимостей
echo -e "${YELLOW}Установка зависимостей...${NC}"
npm ci --production=false

# Проверка типов
echo -e "${YELLOW}Проверка типов TypeScript...${NC}"
npm run typecheck
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка проверки типов!${NC}"
    exit 1
fi

# Проверка кода с помощью Biome
echo -e "${YELLOW}Проверка кода с помощью Biome...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибки линтинга!${NC}"
    exit 1
fi

# Сборка приложения
echo -e "${YELLOW}Сборка приложения для production...${NC}"
npm run build:production
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка сборки!${NC}"
    exit 1
fi

# Копирование статических файлов
echo -e "${YELLOW}Копирование статических файлов...${NC}"
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static

# Перезапуск PM2
echo -e "${YELLOW}Перезапуск приложения через PM2...${NC}"
pm2 restart ecosystem.config.js --update-env
if [ $? -ne 0 ]; then
    echo -e "${RED}Ошибка перезапуска PM2!${NC}"
    exit 1
fi

# Сохранение конфигурации PM2
pm2 save

# Перезагрузка Nginx (если используется)
if [ -f /etc/nginx/nginx.conf ]; then
    echo -e "${YELLOW}Перезагрузка Nginx...${NC}"
    sudo nginx -t && sudo systemctl reload nginx
fi

echo -e "${GREEN}Деплой завершён успешно!${NC}"

# Проверка здоровья приложения
sleep 5
echo -e "${YELLOW}Проверка работоспособности приложения...${NC}"
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}Приложение работает корректно!${NC}"
    pm2 status
else
    echo -e "${RED}Приложение не отвечает!${NC}"
    pm2 logs --lines 50
    exit 1
fi