import { useState } from 'react'
import { Room } from 'matrix-js-sdk'
import { useMatrix } from '@/components/providers'
import type { CreateRoomFormValues } from '../schema'

type EditRoomData = CreateRoomFormValues

export const useEditRoom = () => {
    const { client } = useMatrix()
    const [isRoomEditing, setIsRoomEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const editRoom = async (room: Room, data: EditRoomData) => {
        if (!client) {
            throw new Error('Matrix client not initialized')
        }
        // TODO пресет не редактируем
        const { preset: _, roomName } = data

        setIsRoomEditing(true)
        setError(null)

        try {
            const promises: Promise<unknown>[] = []

            // Изменение названия (только если реально изменилось)
            console.log(
                roomName !== undefined && roomName !== room.name,
                roomName
            )
            if (roomName !== undefined && roomName !== room.name) {
                promises.push(
                    client.setRoomName(room.roomId, roomName)
                )
            }

            await Promise.all(promises)

            return true
        } catch (err) {
            // TODO error alert?
            console.error('Failed to edit room:', err)
            const message =
                err instanceof Error
                    ? err.message
                    : 'Не удалось сохранить изменения'
            setError(message)
            throw err
        } finally {
            setIsRoomEditing(false)
        }
    }

    const clearError = () => setError(null)

    return { editRoom, isRoomEditing, error, clearError }
}
