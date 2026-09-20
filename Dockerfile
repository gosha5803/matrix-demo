# --- ЭТАП 1: Сборка ---
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем исходный код
COPY . .

# Передаем переменную окружения для Vite во время сборки
ARG VITE_MATRIX_URL
ENV VITE_MATRIX_URL=$VITE_MATRIX_URL

# Собираем проект
RUN npm run build

# --- ЭТАП 2: Раздача через Nginx ---
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию Nginx для SPA (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]