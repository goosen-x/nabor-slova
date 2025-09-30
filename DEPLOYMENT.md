# Руководство по развёртыванию nabor-slova

## Требования к серверу

- Ubuntu 22.04 LTS (рекомендуется)
- Node.js 18+ (через nvm)
- PM2 для управления процессами
- Nginx для reverse proxy
- 2+ CPU ядра, 4GB+ RAM
- SSL сертификат (Let's Encrypt)

## Подготовка сервера

### 1. Установка необходимого ПО

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Node.js через nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Установка PM2
npm install -g pm2

# Установка Nginx
sudo apt install nginx -y

# Установка Git
sudo apt install git -y

# Установка Certbot для SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Создание директории для приложения

```bash
sudo mkdir -p /var/www/nabor-slova
sudo chown -R $USER:$USER /var/www/nabor-slova
```

### 3. Клонирование репозитория

```bash
cd /var/www
git clone https://github.com/your-username/nabor-slova.git
cd nabor-slova
```

## Настройка приложения

### 1. Создание файла окружения

```bash
cp .env.example .env
nano .env
# Заполните необходимые переменные
```

### 2. Установка зависимостей и сборка

```bash
npm ci --production=false
npm run build:production
```

### 3. Настройка PM2

```bash
# Запуск приложения
pm2 start ecosystem.config.js

# Сохранение конфигурации
pm2 save

# Автозапуск при перезагрузке системы
pm2 startup
```

## Настройка Nginx

### 1. Создание конфигурации

```bash
sudo cp nginx.conf.example /etc/nginx/sites-available/nabor-slova
sudo ln -s /etc/nginx/sites-available/nabor-slova /etc/nginx/sites-enabled/
```

### 2. Проверка и перезагрузка

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Получение SSL сертификата

```bash
sudo certbot --nginx -d nabor-slova.ru -d www.nabor-slova.ru
```

## Развёртывание обновлений

Используйте подготовленный скрипт:

```bash
cd /var/www/nabor-slova
./deploy.sh
```

## Мониторинг

### Просмотр логов PM2
```bash
pm2 logs nabor-slova
pm2 monit
```

### Просмотр логов Nginx
```bash
sudo tail -f /var/log/nginx/nabor-slova-access.log
sudo tail -f /var/log/nginx/nabor-slova-error.log
```

### Проверка состояния
```bash
pm2 status
systemctl status nginx
```

## Резервное копирование

```bash
# Резервная копия приложения
tar -czf nabor-slova-backup-$(date +%Y%m%d).tar.gz /var/www/nabor-slova

# Если используете базу данных
# pg_dump your_database > backup-$(date +%Y%m%d).sql
```

## Полезные команды

```bash
# Перезапуск приложения
pm2 restart nabor-slova

# Остановка приложения
pm2 stop nabor-slova

# Просмотр процессов
pm2 list

# Очистка логов
pm2 flush

# Обновление PM2
npm install pm2 -g && pm2 update
```

## Решение проблем

### Приложение не запускается
1. Проверьте логи: `pm2 logs nabor-slova --lines 100`
2. Проверьте переменные окружения: `pm2 env 0`
3. Убедитесь, что порт 3000 не занят: `sudo lsof -i :3000`

### Ошибки Nginx
1. Проверьте конфигурацию: `sudo nginx -t`
2. Проверьте логи: `sudo journalctl -u nginx`
3. Убедитесь, что приложение работает: `curl http://localhost:3000`

### Проблемы с SSL
1. Проверьте срок действия: `sudo certbot certificates`
2. Обновите сертификаты: `sudo certbot renew`
3. Проверьте автообновление: `sudo certbot renew --dry-run`