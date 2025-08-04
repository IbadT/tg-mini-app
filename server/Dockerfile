# Multi-stage build для оптимизации размера образа
FROM node:20-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci

# Копируем исходный код
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем приложение
RUN npm run build

# Production stage
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Устанавливаем dumb-init для правильной обработки сигналов
RUN apk add --no-cache dumb-init

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем только production зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma

# Создаем директории для логов и данных
RUN mkdir -p /app/logs /app/data

# Меняем владельца файлов
RUN chown -R nodejs:nodejs /app

# Переключаемся на пользователя nodejs
USER nodejs

# Открываем порт
EXPOSE 3000

# Устанавливаем переменные окружения
ENV NODE_ENV=production
ENV PORT=3000

# Используем dumb-init для правильной обработки сигналов
ENTRYPOINT ["dumb-init", "--"]

# Запускаем приложение
CMD ["node", "dist/start.js"] 