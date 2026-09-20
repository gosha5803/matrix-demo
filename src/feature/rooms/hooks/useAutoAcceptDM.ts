import { useEffect } from 'react'
import { MatrixClient, Room, RoomEvent } from 'matrix-js-sdk'
import { getDirectChatsSafe } from './useCreateRoom'

export const useAutoAcceptDM = (client: MatrixClient | null) => {
    useEffect(() => {
        if (!client) return

        // Функция принятия приглашения
        const acceptInvite = async (room: Room) => {
            try {
                // Проверяем, что это приглашение
                if (room.getMyMembership() !== 'invite') return

                // Проверяем, что это DM (2 участника)
                const members = room.getMembers()
                const isTwoPersonRoom = members.length === 2

                // Или проверяем через m.direct (если доступен)
                const directChats = getDirectChatsSafe(client)
                const isDirectDM = directChats
                    ? Object.values(directChats).some((roomIds) =>
                          roomIds.includes(room.roomId)
                      )
                    : false

                if (isTwoPersonRoom || isDirectDM) {
                    console.log(
                        `🤝 Автоматически принимаем DM: ${room.roomId}`
                    )
                    await client.joinRoom(room.roomId)
                } else {
                    console.log(
                        `📩 Обычное приглашение (не DM): ${room.roomId}`
                    )
                    // Здесь можно показать уведомление пользователю
                }
            } catch (err) {
                console.error('Не удалось принять приглашение:', err)
            }
        }

        // 1. При старте обрабатываем все существующие приглашения
        const processExistingInvites = () => {
            const rooms = client.getRooms()
            rooms.forEach((room) => {
                if (room.getMyMembership() === 'invite') {
                    acceptInvite(room)
                }
            })
        }

        // 2. Слушаем новые приглашения в реальном времени
        const onMyMembership = (room: Room, membership: string) => {
            if (membership === 'invite') {
                acceptInvite(room)
            }
        }

        // Обрабатываем существующие приглашения
        processExistingInvites()

        // Подписываемся на новые события
        client.on(RoomEvent.MyMembership, onMyMembership)

        return () => {
            client.removeListener(
                RoomEvent.MyMembership,
                onMyMembership
            )
        }
    }, [client])
}
