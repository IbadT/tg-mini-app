# CI/CD Setup Guide

## 📋 Обзор

Этот проект включает полную настройку CI/CD с использованием GitHub Actions для автоматизации разработки, тестирования и деплоя.

## 🚀 Workflows

### 1. **main.yml** - Основной Pipeline
- **Линтинг** - проверка качества кода
- **Тестирование** - запуск тестов
- **Сборка** - создание артефактов
- **Деплой на staging** - автоматический деплой при push в main
- **Деплой на production** - деплой при создании тегов

### 2. **client.yml** - Клиентский Pipeline
- Специализированный для React приложения
- Деплой на Vercel/Netlify
- Оптимизация бандла

### 3. **server.yml** - Серверный Pipeline
- Специализированный для Node.js приложения
- Деплой на Railway/Render
- Тестирование с базой данных

### 4. **security.yml** - Безопасность
- Проверка уязвимостей в зависимостях
- Сканирование кода (CodeQL)
- Проверка секретов
- Аудит лицензий

### 5. **release.yml** - Автоматические релизы
- Создание GitHub релизов
- Загрузка артефактов
- Уведомления

### 6. **docker.yml** - Docker Pipeline
- Сборка Docker образов
- Деплой на Kubernetes/Docker Swarm
- Сканирование образов

### 7. **monitoring.yml** - Мониторинг
- Проверка здоровья сервисов
- Мониторинг производительности
- Автоматическое восстановление

## 🔧 Настройка Secrets

### GitHub Secrets (Settings → Secrets and variables → Actions)

```bash
# Docker Hub
DOCKER_USERNAME=your-docker-username
DOCKER_PASSWORD=your-docker-password

# Vercel
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id

# Netlify
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-netlify-site-id

# Railway
RAILWAY_TOKEN=your-railway-token
RAILWAY_SERVICE=your-railway-service

# Render
RENDER_API_KEY=your-render-api-key
RENDER_SERVICE_ID=your-render-service-id

# Kubernetes
KUBE_CONFIG=base64-encoded-kubeconfig

# Docker Swarm
SWARM_HOST=your-swarm-host
SWARM_USER=your-swarm-user
SWARM_HOST_KEY=your-swarm-ssh-key

# SSH Server
SERVER_HOST=your-server-host
SERVER_USERNAME=your-server-username
SERVER_SSH_KEY=your-server-ssh-key

# Notifications
SLACK_WEBHOOK=your-slack-webhook-url
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id

# Environment Variables
JWT_SECRET=your-jwt-secret
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
DB_PASSWORD=your-database-password
GRAFANA_PASSWORD=your-grafana-password
```

## 🐳 Docker Setup

### Локальная разработка

```bash
# Сборка и запуск всех сервисов
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down
```

### Production деплой

```bash
# Сборка образов
docker build -t tg-mini-app-client ./client
docker build -t tg-mini-app-server ./server

# Запуск в production
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Мониторинг

### Prometheus + Grafana

```bash
# Доступ к Prometheus
http://localhost:9090

# Доступ к Grafana
http://localhost:3001
# Логин: admin
# Пароль: admin (или GRAFANA_PASSWORD)
```

### Health Checks

```bash
# Клиент
curl http://localhost:80

# Сервер
curl http://localhost:3000/health

# База данных
docker exec tg-mini-app-db pg_isready -U postgres
```

## 🔄 Автоматизация

### Создание релиза

```bash
# Создание тега
git tag v1.0.0
git push origin v1.0.0

# Автоматически создастся релиз с артефактами
```

### Деплой на staging

```bash
# Просто push в main ветку
git push origin main
```

### Деплой на production

```bash
# Создание тега
git tag v1.0.0
git push origin v1.0.0
```

## 🛠️ Локальная разработка

### Prerequisites

```bash
# Node.js 18+
node --version

# Docker
docker --version

# Git
git --version
```

### Установка

```bash
# Клонирование
git clone https://github.com/IbadT/tg-mini-app.git
cd tg-mini-app

# Установка зависимостей
cd client && npm install
cd ../server && npm install

# Настройка переменных окружения
cp server/.env.example server/.env
# Отредактируйте server/.env

# Запуск в режиме разработки
cd server && npm run dev
cd ../client && npm run dev
```

## 📈 Метрики и алерты

### Метрики

- Время ответа API
- Использование памяти
- Количество запросов
- Ошибки и исключения
- Статус базы данных

### Алерты

- Недоступность сервисов
- Высокое использование ресурсов
- Ошибки в логах
- Проблемы безопасности

## 🔒 Безопасность

### Проверки

- Сканирование уязвимостей
- Аудит зависимостей
- Проверка секретов в коде
- Валидация лицензий

### Рекомендации

- Регулярно обновляйте зависимости
- Используйте секреты для чувствительных данных
- Включайте 2FA для всех аккаунтов
- Мониторьте логи на подозрительную активность

## 🚨 Troubleshooting

### Частые проблемы

1. **Ошибки сборки**
   ```bash
   # Проверьте логи
   docker-compose logs client
   docker-compose logs server
   ```

2. **Проблемы с базой данных**
   ```bash
   # Пересоздайте базу
   docker-compose down -v
   docker-compose up -d
   ```

3. **Проблемы с сетью**
   ```bash
   # Проверьте порты
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :80
   ```

### Логи

```bash
# Все логи
docker-compose logs

# Конкретный сервис
docker-compose logs server

# Следить за логами
docker-compose logs -f server
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи GitHub Actions
2. Убедитесь, что все secrets настроены
3. Проверьте статус внешних сервисов
4. Создайте issue в репозитории

---

**🎉 Поздравляем! Ваш CI/CD pipeline полностью настроен и готов к работе!** 