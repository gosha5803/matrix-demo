import { useState, useEffect } from 'react'
import { Room, MatrixEvent, RoomEvent } from 'matrix-js-sdk'

{
    /*
    RoomEvent.Receipt — срабатывает, когда кто-то прочитал сообщение (нужно для обновления счетчиков непрочитанных и галочек "прочитано").
RoomEvent.Typing — срабатывает, когда кто-то начинает или перестает печатать (для индикатора "печатает...").
RoomEvent.LocalEchoUpdated — срабатывает, когда статус отправки вашего сообщения меняется (например, с "отправка..." на "отправлено" или "ошибка").*/
}

export const useRoomMessages = (room: Room | null | undefined) => {
    const [messages, setMessages] = useState<MatrixEvent[]>([])

    useEffect(() => {
        // Если комнаты нет, очищаем сообщения
        if (!room) {
            return
        }

        const updateMessages = () => {
            const timeline = room.getLiveTimeline().getEvents()
            const filteredMessages = timeline.filter(
                (event) => event.getType() === 'm.room.message'
            )
            setMessages(filteredMessages)
        }

        updateMessages()

        // Подписка на все события комнаты
        // Помимо сообщений мы тут можем получать инфу, что кто-то ушёл или присоединился, системные сообщения может быть
        // TODO EXTRA
        // Редактирование чата, в том числе добавление пользователя
        // Нельзя ли тут на основе типа ивента, разные колбеки вызывать?
        // Создание комнаты с пользователями (поиск пользователя)
        // какие ещё события тут слушаются по таймлайну
        // История сообщений по пагинации?
        // Печатает...
        // Статус отправки
        // Обработка ошибок
        room.on(RoomEvent.Timeline, updateMessages)

        // 3. Очистка: отписываемся при размонтировании или смене комнаты
        return () => {
            room.removeListener(RoomEvent.Timeline, updateMessages)
        }
    }, [room]) // Зависимость от room гарантирует, что при смене чата мы переподпишемся

    return messages
}
