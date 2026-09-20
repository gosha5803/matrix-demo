#!/bin/sh
set -e

KEY_PATH="/etc/dendrite/matrix_key.pem"

# Если ключа нет, генерируем его
if [ ! -f "$KEY_PATH" ]; then
    echo "⚠️ Generating new matrix key for the first time..."
    /usr/bin/generate-keys -private-key "$KEY_PATH"
else
    echo "✅ Matrix key found, skipping generation."
fi

# Запускаем сервер
echo "🚀 Starting Dendrite Monolith..."
exec dendrite-monolith-server -config /etc/dendrite/dendrite.yaml