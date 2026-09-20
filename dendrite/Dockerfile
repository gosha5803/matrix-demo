FROM ghcr.io/element-hq/dendrite-monolith:latest

# Создаем директорию, которую мы подключим как Volume в Railway
RUN mkdir -p /etc/dendrite && chown -R dendrite:dendrite /etc/dendrite

# Копируем наш адаптированный конфиг
COPY dendrite.yaml /etc/dendrite/dendrite.yaml

# Скрипт, который генерирует ключ, если его еще нет
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]