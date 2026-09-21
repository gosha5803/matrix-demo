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

# Railway даёт PORT. Если по какой-то причине его нет, используем 8008.
BIND_PORT=${PORT:-8008}

# Запускаем сервер, заставляя его слушать порт Railway
echo "🚀 Starting Dendrite Monolith on port $BIND_PORT..."
exec /usr/bin/dendrite-monolith-server \
    -config /etc/dendrite/dendrite.yaml \
    -http-bind-address ":$BIND_PORT"