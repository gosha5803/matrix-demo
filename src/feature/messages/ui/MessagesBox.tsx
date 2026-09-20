import type { MatrixClient, Room } from 'matrix-js-sdk'
import { MessageInput } from './MessageInput'
import { MessageList } from './MessageList'
import type { FC } from 'react'

type Props = {
    room: Room | null | undefined
    currentUserId: string | null
    client: MatrixClient | null
}

export const MessagesBox: FC<Props> = ({
    client,
    currentUserId,
    room
}) => {
    return (
        <div className='flex flex-col h-full max-w-4xl mx-auto pb-4 w-[80%]'>
            <MessageList room={room} currentUserId={currentUserId} />
            <MessageInput client={client} room={room} />
        </div>
    )
}
