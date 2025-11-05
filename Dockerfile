# Dockerfile для Node.js v22 (Fastify + Статика)
FROM node:22-alpine

WORKDIR /app

# --- Сборка зависимостей ---
# Копируем ТОЛЬКО package.json, чтобы кешировать слой с node_modules
COPY backend/package.json ./backend/package.json
# Переходим в папку, чтобы npm нашел package.json
WORKDIR /app/backend

# Устанавливаем production-зависимости
# Флаг --omit=dev экономит место в финальном образе
RUN npm install --omit=dev
# Возвращаемся в корень /app
WORKDIR /app

# --- Копирование всего остального кода ---
# Копируем весь код бэкенда
COPY backend/ ./backend
# Копируем весь код фронтенда
COPY public/ ./public

# Устанавливаем рабочую директорию по умолчанию для запуска
WORKDIR /app/backend

EXPOSE 3000
CMD [ "npm", "start" ]