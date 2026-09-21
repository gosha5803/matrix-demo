#!/bin/bash

# --- Конфигурация ---
# ВАЖНО: узнайте точное имя через `docker ps`
CONTAINER_NAME="matrix-demo-dendrite-1"   # ← поправьте!
CONFIG_PATH="/etc/dendrite/dendrite.yaml"  # ← подтверждено вашим compose
INPUT_FILE="users.csv"

# --- Проверки ---
if [ ! -f "$INPUT_FILE" ]; then
    echo "Файл $INPUT_FILE не найден."
    exit 1
fi

# --- Цикл создания ---
while IFS=',' read -r username password is_admin; do
    [[ -z "$username" || "$username" == \#* ]] && continue

    echo "Создание пользователя: $username"

    ADMIN_FLAG=""
    [[ "$is_admin" == "1" ]] && ADMIN_FLAG="-admin"

    docker exec "$CONTAINER_NAME" //usr/bin/create-account \
        -config "$CONFIG_PATH" \
        -username "$username" \
        -password "$password" \
        $ADMIN_FLAG

    if [ $? -eq 0 ]; then
        echo "✅ Пользователь $username создан."
    else
        echo "❌ Ошибка при создании $username."
    fi
done < "$INPUT_FILE"