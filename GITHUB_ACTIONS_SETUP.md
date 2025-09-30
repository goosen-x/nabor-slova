# Настройка GitHub Actions для CI/CD

## Настройка секретов в GitHub

1. Перейдите в репозиторий на GitHub
2. Settings → Secrets and variables → Actions
3. Нажмите "New repository secret"

Добавьте следующие секреты:

### HOST
- Name: `HOST`
- Value: `91.197.99.37`

### USERNAME
- Name: `USERNAME`
- Value: `admin`

### SSH_KEY
- Name: `SSH_KEY`
- Value: Ваш приватный SSH ключ для доступа к серверу

## Получение SSH ключа

Если у вас ещё нет SSH ключа для GitHub Actions:

1. На вашем локальном компьютере создайте новый ключ:
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions
```

2. Скопируйте публичный ключ на сервер:
```bash
ssh-copy-id -i ~/.ssh/github_actions.pub admin@91.197.99.37
```

3. Скопируйте приватный ключ для GitHub:
```bash
cat ~/.ssh/github_actions
```

4. Вставьте содержимое приватного ключа в секрет `SSH_KEY`

## Проверка работы

После настройки:
1. Сделайте любое изменение в коде
2. Закоммитьте и запушьте в main
3. Перейдите в Actions на GitHub
4. Проверьте статус выполнения

## Что делают workflows

### ci.yml
- Запускается при каждом push и pull request
- Проверяет типы TypeScript
- Запускает линтер
- Собирает проект
- Тестирует на Node.js 18 и 20

### deploy.yml
- Запускается только при push в main
- Подключается к серверу по SSH
- Обновляет код из git
- Устанавливает зависимости
- Собирает production версию
- Перезапускает PM2

## Статус бейджи

Добавьте в README.md:

```markdown
![CI](https://github.com/goosen-x/nabor-slova/workflows/CI/badge.svg)
![Deploy](https://github.com/goosen-x/nabor-slova/workflows/Deploy%20to%20Server/badge.svg)
```