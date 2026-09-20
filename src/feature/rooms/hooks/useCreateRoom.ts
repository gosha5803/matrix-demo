import { useMatrix } from '@/components/providers'
import { MatrixClient, Preset } from 'matrix-js-sdk'
import { useState } from 'react'

// TODO
// ошибки логина и сообщений
// медленный запрос
export const useCreateRoom = () => {
    const { client } = useMatrix()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const domain = client?.getDomain() || 'localhost'

    const createChat = async (clientUserId: string) => {
        if (!client) {
            throw new Error('Matrix client not initialized')
        }

        const matrixId = `${clientUserId}:${domain}`

        setIsLoading(true)
        setError(null)

        try {
            try {
                await client.getProfileInfo(matrixId)
            } catch (profileError) {
                // Если профиль не найден — даём понятную ошибку
                console.error('Profile not found:', profileError)
                throw new Error(
                    `Пользователь ${matrixId} не найден. ` +
                        `Проверьте правильность Matrix ID.`
                )
            }

            // 👇 Шаг 2: Проверяем, не пытаемся ли мы создать чат с самим собой
            const currentUserId = client.getUserId()
            if (matrixId === currentUserId) {
                throw new Error('Нельзя создать чат с самим собой')
            }

            // 👇 Шаг 3: Проверяем, не существует ли уже DM с этим пользователем
            const existingRoom = findExistingDirectChat(
                client,
                matrixId
            )
            if (existingRoom) {
                // Вместо ошибки возвращаем ID существующей комнаты
                // Это удобнее — просто откроем существующий чат
                return existingRoom
            }

            // 👇 Шаг 4: Создаём новый чат
            const response = await client.createRoom({
                is_direct: true,
                invite: [matrixId],
                preset: Preset.TrustedPrivateChat
            })

            return response.room_id
        } catch (err) {
            // TODO handleError
            console.error('Failed to create direct chat:', err)
            const message =
                err instanceof Error
                    ? err.message
                    : 'Не удалось начать чат. Проверьте ID пользователя.'
            setError(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    return { isLoading, createRoom: createChat, error }
}

export const findExistingDirectChat = (
    client: MatrixClient,
    targetUserId: string
): string | null => {
    const currentUserId = client.getUserId()
    if (!currentUserId) return null

    // 👇 Способ 1: Проверяем m.direct account_data (самый надёжный)
    // В Matrix DM-комнаты помечаются в m.direct
    try {
        if (
            typeof (client as any).getDMRoomsForUserId === 'function'
        ) {
            const dmRooms = (client as any).getDMRoomsForUserId(
                targetUserId
            )
            if (dmRooms && dmRooms.length > 0) {
                // Возвращаем первую найденную комнату
                for (const roomId of dmRooms) {
                    const room = client.getRoom(roomId)
                    if (room) {
                        const membership = room.getMyMembership()
                        if (
                            membership === 'join' ||
                            membership === 'invite'
                        ) {
                            return roomId
                        }
                    }
                }
            }
        }
    } catch (err) {
        console.warn('getDMRoomsForUserId не сработал:', err)
    }

    // 👇 Способ 2: Получаем m.direct через type assertion
    try {
        const directChats = getDirectChatsSafe(client)

        if (directChats) {
            const roomIds = directChats[targetUserId] || []

            for (const roomId of roomIds) {
                const room = client.getRoom(roomId)
                if (room) {
                    const membership = room.getMyMembership()
                    if (
                        membership === 'join' ||
                        membership === 'invite'
                    ) {
                        return roomId
                    }
                }
            }
        }
    } catch (err) {
        console.warn('Не удалось получить m.direct:', err)
    }

    // 👇 Способ 3: Fallback — перебираем все комнаты
    const rooms = client.getRooms()

    for (const room of rooms) {
        const myMembership = room.getMyMembership()
        if (myMembership !== 'join' && myMembership !== 'invite') {
            continue
        }

        const members = room.getMembers()
        const memberIds = members.map((m) => m.userId)

        const hasOnlyTwoMembers =
            memberIds.length === 2 &&
            memberIds.includes(currentUserId) &&
            memberIds.includes(targetUserId)

        if (hasOnlyTwoMembers) {
            return room.roomId
        }
    }

    return null
}

/**
 * Безопасно получает m.direct без проблем с типами
 */
export function getDirectChatsSafe(
    client: MatrixClient
): Record<string, string[]> | null {
    try {
        // Используем type assertion для обхода строгой типизации
        const accountData = (client as any).getAccountData?.(
            'm.direct'
        )
        if (accountData?.getContent) {
            return accountData.getContent()
        }

        // Fallback: ищем через store
        const store = (client as any).store?.store
        if (store?.getAccountData) {
            const event = store.getAccountData('m.direct')
            if (event?.getContent) {
                return event.getContent()
            }
        }
    } catch {
        // Игнорируем ошибки
    }
    return null
}

// TODO
// Отображать ошибку и успех создания комнаты
// Далее настроить лейаут и сайдбар с комнатами пользователя
// При создании обновлять список комнот пессимистик или оптимистик
// Далее сообщения? ОТпарвка, история сообщений? Контейнер сообщений, инпут, виртуализация, скролл, пагинация.
// Расширить форму создания приглашением пользователей
// Добавить тестовых пользователей
