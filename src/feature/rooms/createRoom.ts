import { getMatrixClient } from '@/shared/config'
import { Preset } from 'matrix-js-sdk'

export const createDemoRoom = async (
    roomName: string,
    preset: Preset
) => {
    const client = getMatrixClient()

    if (!client) {
        throw new Error('UNAUTHENTICATED')
    }

    const room = await client.createRoom({
        name: roomName,
        preset
    })

    return room
}
