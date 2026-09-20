import { useState, useEffect, useCallback } from 'react'
import { Room, MatrixClient, ClientEvent } from 'matrix-js-sdk'
import { debounce } from '@/shared/lib'

export const useMatrixRooms = (client: MatrixClient | null) => {
    const [rooms, setRooms] = useState<Room[]>([])

    // Выносим логику обновления в useCallback, чтобы она была стабильной ссылкой
    const updateRooms = useCallback(() => {
        if (!client) return

        const joinedRooms = client
            .getRooms()
            .filter(
                (room) =>
                    room.getMyMembership() === 'join' ||
                    room.getMyMembership() === 'invite'
            )

        joinedRooms.sort((a, b) => {
            const timeA = a.getLastActiveTimestamp() || 0
            const timeB = b.getLastActiveTimestamp() || 0
            return timeB - timeA
        })

        setRooms(joinedRooms)
    }, [client])

    useEffect(() => {
        if (!client) return

        // Первоначальная загрузка
        updateRooms()

        // Срабатывает, когда в клиент добавляется новая комната
        client.on(ClientEvent.Room, updateRooms)

        // Срабатывает при любом новом событии (сообщение, прочтение, реакция и т.д.)
        // В крупном продакшене сюда часто добавляют debounce (задержку),
        // чтобы не пересортировывать массив при каждом нажатии клавиши в быстром чате.

        // TODO дебаунс, пока отключил так как этого функционала нет, сообщений, реакций и т.п.
        // TODO
        client.on(ClientEvent.Event, debounce(updateRooms, 300))

        // Очистка слушателей при размонтировании или смене клиента
        return () => {
            client.removeListener(ClientEvent.Room, updateRooms)
            // client.removeListener(ClientEvent.Event, updateRooms)
        }
    }, [client, updateRooms])

    return rooms
}
