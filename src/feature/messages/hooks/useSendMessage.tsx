// src/features/messages/hooks/useSendMessage.ts
import { useState, useCallback } from 'react'
import { MatrixClient, Room } from 'matrix-js-sdk'

export const useSendMessage = (
    client: MatrixClient | null,
    room: Room | null | undefined
) => {
    const [isSending, setIsSending] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // TODO для чего колбек?
    const sendMessage = useCallback(
        async (content: string) => {
            if (!client || !room) {
                // Тут скорее надо дизейблить логику чем в ошибку это сетить
                console.log('Клиент или комната не инициализированы')
                return false
            }

            if (!content.trim()) {
                return false
            }

            setIsSending(true)
            setError(null)

            try {
                // Отправляем сообщение
                await client.sendTextMessage(
                    room.roomId,
                    content.trim()
                )
                return true
            } catch (err) {
                console.error('Failed to send message:', err)
                setError(
                    'Не удалось отправить сообщение. Попробуйте еще раз.'
                )
                return false
            } finally {
                setIsSending(false)
            }
        },
        [client, room]
    )

    const clearError = useCallback(() => setError(null), [])

    return { sendMessage, isSending, error, clearError }
}
