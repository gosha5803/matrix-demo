import { useEffect, useRef } from 'react'
import { Room } from 'matrix-js-sdk'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCard } from './MessageCard'
import { useRoomMessages } from '../hooks/useRoomMessages'

type MessageListProps = {
    room: Room | null | undefined
    currentUserId: string | null
}

export const MessageList = ({
    room,
    currentUserId
}: MessageListProps) => {
    const messages = useRoomMessages(room)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Тут нужен какой-то порог, чтобы пользователь мог читать историю сообщений
        if (messages.length > 0) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages.length])

    if (!room) {
        return (
            <div className='flex-1 flex items-center justify-center text-muted-foreground'>
                <p>Выберите комнату для начала общения</p>
            </div>
        )
    }

    return (
        <ScrollArea className='flex-1'>
            <div className='p-4 space-y-4'>
                {messages.length === 0 ? (
                    <div className='text-center text-muted-foreground py-8'>
                        <p>Пока нет сообщений</p>
                        <p className='text-sm mt-1'>
                            Будьте первым, кто напишет!
                        </p>
                    </div>
                ) : (
                    messages.map((event) => (
                        <MessageCard
                            key={event.getId() || event.getTxnId()}
                            event={event}
                            currentUserId={currentUserId}
                        />
                    ))
                )}

                {/* Якорь для автоскролла */}
                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    )
}
